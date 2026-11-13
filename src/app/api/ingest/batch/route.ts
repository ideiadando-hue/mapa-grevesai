import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createLog, addItem, saveLog } from '@/lib/searchLog';
import type { RuleResult } from '@/lib/searchLog';
import type { ExtractionResult } from '@/lib/extractor';
import { geocode } from '@/lib/geocode';

type BatchItem = {
  sourceUrl: string;
  publisher: string | null;
  sourceType: string;
  publishedAt: string | null;
  rawText: string;
  extraction: ExtractionResult;
};

type BatchPayload = {
  runAt: string;
  items: BatchItem[];
};

export async function POST(request: Request) {
  const body: BatchPayload = await request.json();
  const items = body.items ?? [];
  const log = createLog(new Date());

  for (const input of items) {
    log.stats.sourcesFetched += 1;
    const { extraction, sourceUrl, publisher, sourceType, publishedAt, rawText } = input;

    if (!extraction || !Array.isArray(extraction.strikes)) {
      addItem(log, {
        id: crypto.randomUUID(),
        sourceUrl: sourceUrl ?? '',
        publisher: publisher ?? null,
        sourceType: sourceType ?? 'news',
        publishedAt: publishedAt ?? null,
        excerpt: (rawText ?? '').slice(0, 300),
        summary: 'Payload invalido: extraction ausente ou sem strikes.',
        extracted: {},
        rules: { R1: 'fail' },
        verdict: 'rejected',
        reason: 'extraction_failed',
        strikeId: null,
      });
      continue;
    }

    if (extraction.isAnnounced) {
      const first = extraction.strikes[0];
      addItem(log, {
        id: crypto.randomUUID(),
        sourceUrl,
        publisher,
        sourceType,
        publishedAt,
        excerpt: first?.excerpt ?? rawText.slice(0, 300),
        summary: 'Greve anunciada, sem confirmacao de inicio.',
        extracted: first ?? {},
        rules: { R7: 'fail' },
        verdict: 'rejected',
        reason: 'announced_unconfirmed',
        strikeId: null,
      });
      continue;
    }

    for (const strike of extraction.strikes) {
      if (!strike.startedAt) {
        addItem(log, {
          id: crypto.randomUUID(),
          sourceUrl,
          publisher,
          sourceType,
          publishedAt,
          excerpt: strike.excerpt,
          summary: 'Sem data de inicio identificada.',
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
            gte: new Date(new Date(strike.startedAt).getTime() - 90 * 86400000),
            lte: new Date(new Date(strike.startedAt).getTime() + 90 * 86400000),
          },
        },
      });

      if (duplicate) {
        await prisma.strikeSource.create({
          data: {
            strikeId: duplicate.id,
            url: sourceUrl,
            publisher,
            excerpt: strike.excerpt,
            sourceType,
          },
        });
        addItem(log, {
          id: crypto.randomUUID(),
          sourceUrl,
          publisher,
          sourceType,
          publishedAt,
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

      const coords = await geocode(strike.city, strike.state);

      const created = await prisma.strike.create({
        data: {
          title: strike.title,
          category: strike.category,
          entityName: strike.entityName,
          city: strike.city,
          state: strike.state,
          scope: strike.scope,
          lat: coords?.lat ?? null,
          lng: coords?.lng ?? null,
          startedAt: new Date(strike.startedAt),
          endedAt: strike.endedAt ? new Date(strike.endedAt) : null,
          status: strike.status,
          demands: strike.demands,
          confidence: strike.confidence,
          confidenceScore: strike.confidenceScore,
          published: false,
          eventType: (strike as { eventType?: string }).eventType ?? 'greve',
          sources: {
            create: {
              url: sourceUrl,
              publisher,
              excerpt: strike.excerpt,
              sourceType,
            },
          },
        },
      });

      const rules: Record<string, RuleResult> = {
        R1: 'pass', R2: 'pass', R3: 'pass', R4: 'pass',
        R5: 'pass', R6: 'pass', R7: 'pass', R8: 'pass',
      };

      addItem(log, {
        id: crypto.randomUUID(),
        sourceUrl,
        publisher,
        sourceType,
        publishedAt,
        excerpt: strike.excerpt,
        summary: `${strike.title} - ${strike.city ?? 'Nacional'}`,
        extracted: strike,
        rules,
        verdict: 'approved',
        reason: null,
        strikeId: created.id,
      });
    }
  }

  const logPath = await saveLog(log);
  return NextResponse.json({ ok: true, logPath, stats: log.stats });
}