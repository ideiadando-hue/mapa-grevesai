import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const candidatos = await prisma.strike.findMany({
    where: {
      eventType: 'greve',
      endedAt: { not: null },
    },
    select: {
      id: true,
      title: true,
      startedAt: true,
      endedAt: true,
      confidence: true,
    },
    orderBy: { startedAt: 'desc' },
  });

  console.log(`${candidatos.length} candidatos a paralisação:\n`);

  for (const c of candidatos) {
    const dias = Math.round(
      (c.endedAt!.getTime() - c.startedAt.getTime()) / 86400000
    );
    console.log(`[${dias}d] ${c.title}`);
    console.log(`   ${c.startedAt.toLocaleDateString('pt-BR')} → ${c.endedAt!.toLocaleDateString('pt-BR')}`);
    console.log(`   ${c.id}\n`);
  }
}

main()
  .catch((e) => {
    console.error('Erro:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());