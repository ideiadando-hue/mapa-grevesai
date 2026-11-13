import { PrismaClient } from '@prisma/client';
import { createInterface } from 'readline';

const prisma = new PrismaClient();

async function confirmar(pergunta) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(pergunta, (resposta) => {
      rl.close();
      resolve(resposta.trim().toLowerCase());
    });
  });
}

async function main() {
  console.log('=== LIMPEZA DA BASE ===\n');

  const totalStrikes = await prisma.strike.count();
  const totalSources = await prisma.strikeSource.count();

  console.log(`Strikes: ${totalStrikes}`);
  console.log(`StrikeSources: ${totalSources}\n`);

  if (totalStrikes === 0 && totalSources === 0) {
    console.log('Base ja esta vazia. Nada a fazer.');
    return;
  }

  const amostra = await prisma.strike.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, city: true, state: true, published: true },
  });

  console.log('Ultimos 5 registros:');
  for (const s of amostra) {
    console.log(`  - ${s.title} | ${s.city ?? '-'}/${s.state ?? '-'} | published=${s.published}`);
  }

  console.log('\nATENCAO: esta acao apaga TODOS os strikes e sources. Nao tem volta.');
  const resposta = await confirmar('Digite APAGAR para confirmar: ');

  if (resposta !== 'apagar') {
    console.log('Cancelado. Nada foi apagado.');
    return;
  }

  const delSources = await prisma.strikeSource.deleteMany({});
  console.log(`\nStrikeSources apagados: ${delSources.count}`);

  const delStrikes = await prisma.strike.deleteMany({});
  console.log(`Strikes apagados: ${delStrikes.count}`);

  console.log('\nBase limpa.');
}

main()
  .catch((e) => {
    console.error('Erro:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());