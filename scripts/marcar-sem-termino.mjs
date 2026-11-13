import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DIAS_LIMITE = 30;

async function main() {
  const limite = new Date();
  limite.setDate(limite.getDate() - DIAS_LIMITE);

  const candidatos = await prisma.strike.findMany({
    where: {
      endedAt: null,
      status: 'active',
      startedAt: { lt: limite },
    },
    select: { id: true, title: true, city: true, state: true, startedAt: true },
    orderBy: { startedAt: 'asc' },
  });

  console.log(`Registros "active" com mais de ${DIAS_LIMITE} dias e sem fim: ${candidatos.length}\n`);

  if (candidatos.length === 0) {
    console.log('Nada a marcar.');
    return;
  }

  for (const c of candidatos) {
    const data = c.startedAt.toISOString().slice(0, 10);
    console.log(`  ${data} | ${c.title} | ${c.city ?? '-'}/${c.state ?? '-'}`);
  }

  const resultado = await prisma.strike.updateMany({
    where: {
      endedAt: null,
      status: 'active',
      startedAt: { lt: limite },
    },
    data: { status: 'unconfirmed_end' },
  });

  console.log(`\nMarcados como unconfirmed_end: ${resultado.count}`);
}

main()
  .catch((e) => {
    console.error('Erro:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());