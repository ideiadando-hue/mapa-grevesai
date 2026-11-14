import { readFileSync } from 'node:fs';

const [arquivoAntes, arquivoDepois] = process.argv.slice(2);

if (!arquivoAntes || !arquivoDepois) {
  console.error('Uso: npx tsx scripts\\comparar.ts <antes.txt> <depois.txt>');
  process.exit(1);
}

type Snapshot = {
  strikes: number;
  published: number;
  pending: number;
  sources: number;
  categorias: Record<string, number>;
  status: Record<string, number>;
  ufs: Record<string, number>;
};

function parse(caminho: string): Snapshot {
  const texto = readFileSync(caminho, 'utf8');
  const snap: Snapshot = {
    strikes: 0,
    published: 0,
    pending: 0,
    sources: 0,
    categorias: {},
    status: {},
    ufs: {},
  };

  const linhas = texto.split('\n');
  let secao = '';

  for (const linha of linhas) {
    const t = linha.trim();

    if (t.startsWith('===')) {
      secao = t.replace(/=/g, '').trim();
      continue;
    }

    if (secao === 'TOTAIS') {
      const mStrikes = t.match(/^Strikes:\s*(\d+)/);
      if (mStrikes) snap.strikes = Number(mStrikes[1]);

      const mPub = t.match(/published:\s*true\s*=\s*(\d+)/);
      if (mPub) snap.published = Number(mPub[1]);

      const mPend = t.match(/published:\s*false\s*=\s*(\d+)/);
      if (mPend) snap.pending = Number(mPend[1]);

      const mSrc = t.match(/^StrikeSources:\s*(\d+)/);
      if (mSrc) snap.sources = Number(mSrc[1]);
    }

    if (secao === 'POR CATEGORIA' || secao === 'POR STATUS' || secao === 'POR UF') {
      const m = t.match(/^(.+?)\s*\|\s*(\d+)$/);
      if (!m) continue;
      const chave = m[1].trim();
      const valor = Number(m[2]);
      if (chave === 'categoria' || chave === 'status' || chave === 'uf') continue;

      if (secao === 'POR CATEGORIA') snap.categorias[chave] = valor;
      if (secao === 'POR STATUS') snap.status[chave] = valor;
      if (secao === 'POR UF') snap.ufs[chave] = valor;
    }
  }

  return snap;
}

function diff(nome: string, antes: Record<string, number>, depois: Record<string, number>) {
  const chaves = new Set([...Object.keys(antes), ...Object.keys(depois)]);
  const linhas: string[] = [];

  for (const k of [...chaves].sort()) {
    const a = antes[k] ?? 0;
    const d = depois[k] ?? 0;
    if (a !== d) {
      const sinal = d > a ? '+' : '';
      linhas.push(`  ${k}: ${a} -> ${d} (${sinal}${d - a})`);
    }
  }

  if (linhas.length === 0) {
    console.log(`${nome}: sem mudanca`);
  } else {
    console.log(`${nome}:`);
    console.log(linhas.join('\n'));
  }
}

const antes = parse(arquivoAntes);
const depois = parse(arquivoDepois);

console.log('=== COMPARACAO ===');
console.log(`Antes:  ${arquivoAntes}`);
console.log(`Depois: ${arquivoDepois}`);
console.log('');

console.log('=== TOTAIS ===');
const dStrikes = depois.strikes - antes.strikes;
const dSources = depois.sources - antes.sources;
const dPub = depois.published - antes.published;
const dPend = depois.pending - antes.pending;

console.log(`Strikes:         ${antes.strikes} -> ${depois.strikes} (${dStrikes >= 0 ? '+' : ''}${dStrikes})`);
console.log(`  published:true ${antes.published} -> ${depois.published} (${dPub >= 0 ? '+' : ''}${dPub})`);
console.log(`  published:fal. ${antes.pending} -> ${depois.pending} (${dPend >= 0 ? '+' : ''}${dPend})`);
console.log(`StrikeSources:   ${antes.sources} -> ${depois.sources} (${dSources >= 0 ? '+' : ''}${dSources})`);
console.log('');

diff('Categorias', antes.categorias, depois.categorias);
console.log('');
diff('Status', antes.status, depois.status);
console.log('');
diff('UFs', antes.ufs, depois.ufs);
console.log('');

if (dStrikes === 0 && dSources === 0) {
  console.log('RESULTADO: nenhum registro novo. A ingestao nao inseriu nada.');
} else {
  console.log(`RESULTADO: ${dStrikes} strike(s) e ${dSources} source(s) inseridos.`);
}