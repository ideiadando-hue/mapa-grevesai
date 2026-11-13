import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const strike = await prisma.strike.findUnique({
      where: { id },
      include: { sources: true },
    });

    if (!strike) {
      return NextResponse.json({ error: 'Greve não encontrada' }, { status: 404 });
    }

    return NextResponse.json(strike);
  } catch (error) {
    console.error('[GET /api/strikes/:id]', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}