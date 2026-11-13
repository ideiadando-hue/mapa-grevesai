import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.strikeSource.deleteMany();
  await prisma.strike.deleteMany();

  await prisma.strike.create({
    data: {
      title: 'Motoristas de ônibus de São Paulo em greve por reajuste salarial',
      category: 'transporte',
      entityName: 'Sindicato dos Motoristas de SP',
      city: 'São Paulo',
      state: 'SP',
      lat: -23.5505,
      lng: -46.6333,
      startedAt: new Date('2026-11-09T06:00:00Z'),
      status: 'active',
      demands: 'Reajuste de 12% e fim do parcelamento do 13º salário',
      confidence: 'confirmed',
      confidenceScore: 0.92,
      published: true,
      approvedBy: 'seed',
      approvedAt: new Date(),
      sources: {
        create: [
          {
            url: 'https://g1.globo.com/sp/sao-paulo/exemplo-greve-onibus',
            publisher: 'G1',
            sourceType: 'news',
          },
        ],
      },
    },
  });

  console.log('Seed concluído:', await prisma.strike.count(), 'greves.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());