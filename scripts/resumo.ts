import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const greves = await prisma.strike.count({ where: { eventType: 'greve' } });
  const paralisacoes = await prisma.strike.count({ where: { eventType: 'paralisacao' } });
  const semFim = await prisma.strike.count({
    where: { eventType: 'paralisacao', endedAt: null },
  });

  console.log(`Greves:        ${greves}`);
  console.log(`Paralisações:  ${paralisacoes}`);
  console.log(`Paralisações sem endedAt: ${semFim}  ${semFim > 0 ? '⚠ corrigir' : '✓'}`);
}

main().finally(() => prisma.$disconnect());