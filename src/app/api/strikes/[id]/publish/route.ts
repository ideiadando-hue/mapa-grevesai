import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;

  let body: { confidence?: string; confidenceScore?: number; published?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const allowed = ['confirmed', 'likely', 'unverified'];
  if (body.confidence && !allowed.includes(body.confidence)) {
    return NextResponse.json(
      { error: `confidence deve ser um de: ${allowed.join(', ')}` },
      { status: 400 }
    );
  }

  if (body.confidenceScore != null && (body.confidenceScore < 0 || body.confidenceScore > 1)) {
    return NextResponse.json(
      { error: 'confidenceScore deve estar entre 0 e 1' },
      { status: 400 }
    );
  }

  const existing = await prisma.strike.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Greve não encontrada' }, { status: 404 });
  }

  const updated = await prisma.strike.update({
    where: { id },
    data: {
      ...(body.confidence && { confidence: body.confidence }),
      ...(body.confidenceScore != null && { confidenceScore: body.confidenceScore }),
      ...(body.published != null && { published: body.published }),
      ...(body.published === true && {
        approvedAt: new Date(),
        approvedBy: 'curador',
      }),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}