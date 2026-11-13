import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// critério: eventos com término definido e duração de até 7 dias
const MAX_DIAS = 7;

async function main() {
  const candidatos = await prisma.strike.findMany({
    where: {
      eventType: 'greve',
      endedAt: { not: null },
    },
    select: { id: true, title: true, startedAt: true, endedAt: true },
  });

  const alvos = candidatos.filter((c) => {
    const dias = (c.endedAt!.getTime() - c.startedAt.getTime()) / 86400000;
    return dias <= MAX_DIAS;
  });

  console.log(`${alvos.length} de ${candidatos.length} candidatos serão convertidos\n`);

  for (const a of alvos) {
    console.log(`→ ${a.title}`);
  }

  const resultado = await prisma.strike.updateMany({
    where: { id: { in: alvos.map((a) => a.id) } },
    data: { eventType: 'paralisacao' },
  });

  console.log(`\n${resultado.count} registros convertidos para paralisacao`);
}

main()
  .catch((e) => {
    console.error('Erro:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());