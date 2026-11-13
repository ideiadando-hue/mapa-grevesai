import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractStrike } from '@/lib/extractor';
import { createLog, addItem, saveLog } from '@/lib/searchLog';
import type { LogItem, RuleResult } from '@/lib/searchLog';

type SourceInput = {
  url: string;
  publisher: string | null;
  sourceType: string;
  publishedAt: string | null;
  text: string;
};

export async function POST(request: Request) {
  const body = await request.json();
  const sources: SourceInput[] = body.sources ?? [];

  const log = createLog(new Date());

  for (const source of sources) {
    log.stats.sourcesFetched += 1;

    let result;
    try {
      result = await extractStrike(source.text);
    } catch {
      addItem(log, {
        id: crypto.randomUUID(),
        sourceUrl: source.url,
        publisher: source.publisher,
        sourceType: source.sourceType,
        publishedAt: source.publishedAt,
        excerpt: source.text.slice(0, 300),
        summary: 'Falha na extração.',
        extracted: {},
        rules: { R1: 'fail' },
        verdict: 'rejected',
        reason: 'extraction_failed',
        strikeId: null,
      });
      continue;
    }

    if (result.isAnnounced) {
      const first = result.strikes[0];
      addItem(log, {
        id: crypto.randomUUID(),
        sourceUrl: source.url,
        publisher: source.publisher,
        sourceType: source.sourceType,
        publishedAt: source.publishedAt,
        excerpt: first?.excerpt ?? source.text.slice(0, 300),
        summary: 'Greve anunciada, sem confirmação de início.',
        extracted: first ?? {},
        rules: { R7: 'fail' },
        verdict: 'rejected',
        reason: 'announced_unconfirmed',
        strikeId: null,
      });
      continue;
    }

    for (const strike of result.strikes) {
      if (!strike.startedAt) {
        addItem(log, {
          id: crypto.randomUUID(),
          sourceUrl: source.url,
          publisher: source.publisher,
          sourceType: source.sourceType,
          publishedAt: source.publishedAt,
          excerpt: strike.excerpt,
          summary: 'Sem data de início identificada.',
          extracted: strike,
          rules: { R1: 'fail' },
          verdict: 'rejected',
          reason: 'extraction_failed',
          strikeId: null,
        });
        continue;
      }

      const duplicate = await prisma.strike.findFirst({
        where: {
          category: strike.category,
          scope: strike.scope,
          city: strike.city,
          state: strike.state,
          startedAt: {
            gte: new Date(new Date(strike.startedAt).getTime() - 30 * 86400000),
            lte: new Date(new Date(strike.startedAt).getTime() + 30 * 86400000),
          },
        },
      });

      if (duplicate) {
        await prisma.strikeSource.create({
          data: {
            strikeId: duplicate.id,
            url: source.url,
            publisher: source.publisher,
            excerpt: strike.excerpt,
            sourceType: source.sourceType,
          },
        });

        addItem(log, {
          id: crypto.randomUUID(),
          sourceUrl: source.url,
          publisher: source.publisher,
          sourceType: source.sourceType,
          publishedAt: source.publishedAt,
          excerpt: strike.excerpt,
          summary: `Fonte anexada a registro existente: ${duplicate.title}`,
          extracted: strike,
          rules: { R3: 'pass' },
          verdict: 'rejected',
          reason: 'duplicate',
          strikeId: duplicate.id,
        });
        continue;
      }

      const created = await prisma.strike.create({
        data: {
          title: strike.title,
          category: strike.category,
          entityName: strike.entityName,
          city: strike.city,
          state: strike.state,
          scope: strike.scope,
          lat: strike.lat,
          lng: strike.lng,
          startedAt: new Date(strike.startedAt),
          endedAt: strike.endedAt ? new Date(strike.endedAt) : null,
          status: strike.status,
          demands: strike.demands,
          confidence: strike.confidence,
          confidenceScore: strike.confidenceScore,
          published: false,
          eventType: extracted.eventType ?? 'greve',
          sources: {
            create: {
              url: source.url,
              publisher: source.publisher,
              excerpt: strike.excerpt,
              sourceType: source.sourceType,
            },
          },
        },
      });

      const rules: Record<string, RuleResult> = {
        R1: 'pass',
        R2: 'pass',
        R3: 'pass',
        R4: 'pass',
        R5: 'pass',
        R6: 'pass',
        R7: 'pass',
        R8: 'pass',
      };

      addItem(log, {
        id: crypto.randomUUID(),
        sourceUrl: source.url,
        publisher: source.publisher,
        sourceType: source.sourceType,
        publishedAt: source.publishedAt,
        excerpt: strike.excerpt,
        summary: `${strike.title} — ${strike.city ?? 'Nacional'}`,
        extracted: strike,
        rules,
        verdict: 'approved',
        reason: null,
        strikeId: created.id,
      });
    }
  }

  const logPath = await saveLog(log);

  return NextResponse.json({
    ok: true,
    logPath,
    stats: log.stats,
  });
}