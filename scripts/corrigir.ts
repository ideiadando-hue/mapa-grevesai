import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const id = 'b00283dd-48a3-4658-a3c4-12e72f75eda0';

  const s = await prisma.strike.update({
    where: { id },
    data: { eventType: 'paralisacao' },
    select: { id: true, title: true, eventType: true, endedAt: true },
  });

  console.log('Atualizado com sucesso:');
  console.log('  Título:    ', s.title);
  console.log('  eventType: ', s.eventType);
  console.log('  Término:   ', s.endedAt ? s.endedAt.toLocaleDateString('pt-BR') : '(sem data)');
}

main()