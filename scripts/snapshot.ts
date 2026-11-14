import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

try {
  const env = readFileSync('.env.production', 'utf8');
  for (const linha of env.split('\n')) {
    const m = linha.match(/^([A-Z_][A-Z0-9_]*)="?([^"\r\n]*)"?$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
} catch {
  console.error('Arquivo .env.production nao encontrado.');
  process.exit(1);
}

const url = process.env.DATABASE_URL ?? '';

if (!url) {
  console.error('DATABASE_URL ausente no .env.production.');
  process.exit(1);
}

if (url.includes('[SENSITIVE]')) {
  console.error('DATABASE_URL ainda contem o placeholder [SENSITIVE].');
  console.error('Substitua pela connection string real do Neon (botao Connect).');
  process.exit(1);
}

if (url.includes('localhost') || url.includes('127.0.0.1')) {
  console.error('DATABASE_URL aponta para localhost, nao para producao.');
  console.error('Use a connection string do Neon (host com -pooler).');
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const host = url.replace(/:\/\/[^@]*@/, '://***@').split('?')[0];
  console.log('=== AMBIENTE ===');
  console.log(`Banco: ${host}`);
  console.log(`Data: ${new Date().toISOString()}`);
  console.log('');

  const total = await prisma.strike.count();
  const sources = await prisma.strikeSource.count();
  const published = await prisma.strike.count({ where: { published: true } });
  const pending = await prisma.strike.count({ where: { published: false } });

  console.log('=== TOTAIS ===');
  console.log(`Strikes: ${total}`);
  console.log(`  published: true  = ${published}`);
  console.log(`  published: false = ${pending}`);
  console.log(`StrikeSources: ${sources}`);
  console.log('');

  const ultimos = await prisma.strike.findMany({
    orderBy: { createdAt: 'desc' },
    take: 15,
    select: {
      id: true,
      title: true,
      city: true,
      state: true,
      category: true,
      startedAt: true,
      status: true,
      published: true,
      createdAt: true,
    },
  });

  console.log('=== ULTIMOS 15 REGISTROS ===');
  console.table(ultimos);

  const porCategoria = await prisma.strike.groupBy({
    by: ['category'],
    _count: { _all: true },
    orderBy: { _count: { category: 'desc' } },
  });

  console.log('=== POR CATEGORIA ===');
  console.table(porCategoria.map((c) => ({ categoria: c.category, total: c._count._all })));

  const porStatus = await prisma.strike.groupBy({
    by: ['status'],
    _count: { _all: true },
  });

  console.log('=== POR STATUS ===');
  console.table(porStatus.map((s) => ({ status: s.status, total: s._count._all })));

  const porUF = await prisma.strike.groupBy({
    by: ['state'],
    _count: { _all: true },
    orderBy: { _count: { state: 'desc' } },
  });

  console.log('=== POR UF ===');
  console.table(porUF.map((s) => ({ uf: s.state ?? '(sem UF)', total: s._count._all })));
}

main()
  .catch((e) => {
    console.error('Falha ao consultar o banco:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
