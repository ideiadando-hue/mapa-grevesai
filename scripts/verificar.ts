import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const id = 'b00283dd-48a3-4658-a3c4-12e72f75eda0';

  const s = await prisma.strike.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      eventType: true,
      startedAt: true,
      endedAt: true,
      status: true,
    },
  });

  if (!s) {
    console.log('Registro não encontrado com esse ID.');
    return;
  }

  console.log('Título:    ', s.title);
  console.log('eventType: ', s.eventType);
  console.log('Início:    ', s.startedAt.toLocaleDateString('pt-BR'));
  console.log('Término:   ', s.endedAt ? s.endedAt.toLocaleDateString('pt-BR') : '(sem data)');
  console.log('Status:    ', s.status);
}

main()
  .catch((e) => {
    console.error('Erro:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());