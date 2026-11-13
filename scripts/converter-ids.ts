import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ids = [
    'c8f3861e-8bc4-4873-b6f1-c76b5dd2af8d',
    'b00283dd-48a3-4658-a3c4-12e72f75eda0',
    '698d89b0-9f3c-48e9-94eb-666bb2cb9da3',
    '3aba993d-463c-4327-ae7e-f170ea525e91',
    '07b14c44-7a9b-48c0-8afd-66ed64ae4a22',
    'f1ee042a-6f5b-4e60-a266-950e2f573ac3',
    'f29df31d-f18a-470f-8265-f4db5b4243cf',
    '6cae7686-9808-4b52-bbaf-a8c60ffd91ff',
  // adicione os demais aqui
];

async function main() {
  const resultado = await prisma.strike.updateMany({
    where: { id: { in: ids } },
    data: { eventType: 'paralisacao' },
  });

  console.log(`${resultado.count} de ${ids.length} registros convertidos`);
}

main()
  .catch((e) => {
    console.error('Erro:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());