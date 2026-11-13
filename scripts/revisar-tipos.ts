import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const candidatos = await prisma.strike.findMany({
    where: { endedAt: { not: null } },
    select: { id: true, title: true, startedAt: true, endedAt: true },
    orderBy: { startedAt: 'desc' },
  });

  console.log(`${candidatos.length} registros com data de término:\n`);

  for (const c of candidatos) {
    const dias = Math.ceil(
      (c.endedAt!.getTime() - c.startedAt.getTime()) / 86400000
    );
    console.log(`[${dias}d] ${c.title}`);
    console.log(`   ${c.startedAt.toLocaleDateString('pt-BR')} → ${c.endedAt!.toLocaleDateString('pt-BR')}`);
    console.log(`   id: ${c.id}\n`);
  }
}

main().finally(() => prisma.$disconnect());