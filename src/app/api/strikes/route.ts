import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { strikeFiltersSchema } from '@/lib/validators';
import type { Prisma } from '@prisma/client';

function monthRange(month: string): { gte: Date; lt: Date } {
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;

  return {
    gte: new Date(Date.UTC(year, monthIndex, 1)),
    lt: new Date(Date.UTC(year, monthIndex + 1, 1)),
  };
}

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = strikeFiltersSchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { state, city, category, status, confidence, month, from, to, q, page, pageSize } =
      parsed.data;

    const where: Prisma.StrikeWhereInput = {
      published: true,
      ...(state && { state }),
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(category && { category }),
      ...(status && { status }),
      ...(confidence && { confidence }),
      ...(month
        ? (() => {
            const range = monthRange(month);
            return { startedAt: { gte: range.gte, lt: range.lt } };
          })()
        : from || to
          ? {
              startedAt: {
                ...(from && { gte: new Date(from) }),
                ...(to && { lte: new Date(to) }),
              },
            }
          : {}),
      ...(q && {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { entityName: { contains: q, mode: 'insensitive' } },
          { demands: { contains: q, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, strikes] = await Promise.all([
      prisma.strike.count({ where }),
      prisma.strike.findMany({
        where,
        include: { sources: true },
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      data: strikes,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('[GET /api/strikes]', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}