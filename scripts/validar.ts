import { readFileSync } from 'node:fs';
import { parseJsonTolerante } from '../src/lib/parseJson';

type Strike = {
  title?: unknown;
  scope?: unknown;
  city?: unknown;
  state?: unknown;
  category?: unknown;
  entityName?: unknown;
  lat?: unknown;
  lng?: unknown;
  startedAt?: unknown;
  endedAt?: unknown;
  status?: unknown;
  demands?: unknown;
  confidence?: unknown;
  confidenceScore?: unknown;
  dedupeKey?: unknown;
  excerpt?: unknown;
};

type Extraction = {
  isAnnounced?: unknown;
  strikes?: Strike[];
};

type Item = {
  sourceUrl?: unknown;
  publisher?: unknown;
  sourceType?: unknown;
  publishedAt?: unknown;
  rawText?: unknown;
  extraction?: Extraction;
};

type Payload = {
  runAt?: unknown;
  window?: { from?: unknown; to?: unknown };
  items?: Item[];
};

const SCOPES = ['national', 'state', 'municipal'];
const STATUSES = ['active', 'ended', 'suspended'];
const CONFIDENCES = ['confirmed', 'likely', 'unverified'];

const erros: string[] = [];
const avisos: string[] = [];

function ehDataValida(v: unknown): boolean {
  if (typeof v !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v + 'T00:00:00');
  return !Number.isNaN(d.getTime());
}

function ehDataHoraValida(v: unknown): boolean {
  if (typeof v !== 'string') return false;
  const d = new Date(v);
  return !Number.isNaN(d.getTime());
}

function validarStrike(s: Strike, caminho: string) {
  const obrigatorios: (keyof Strike)[] = [
    'title', 'scope', 'category', 'status', 'confidence', 'confidenceScore', 'dedupeKey', 'excerpt',
  ];

  for (const campo of obrigatorios) {
    const valor = s[campo];
    if (valor === undefined || valor === null || valor === '') {
      erros.push(`${caminho}.${campo}: ausente ou vazio`);
    }
  }

  if (s.scope !== undefined && !SCOPES.includes(String(s.scope))) {
    erros.push(`${caminho}.scope: "${s.scope}" invalido (use ${SCOPES.join(' | ')})`);
  }

  if (s.status !== undefined && !STATUSES.includes(String(s.status))) {
    erros.push(`${caminho}.status: "${s.status}" invalido (use ${STATUSES.join(' | ')})`);
  }

  if (s.confidence !== undefined && !CONFIDENCES.includes(String(s.confidence))) {
    erros.push(`${caminho}.confidence: "${s.confidence}" invalido (use ${CONFIDENCES.join(' | ')})`);
  }

  if (s.confidenceScore !== undefined) {
    const n = Number(s.confidenceScore);
    if (Number.isNaN(n)) {
      erros.push(`${caminho}.confidenceScore: nao e numero`);
    } else if (n < 0 || n > 1) {
      erros.push(`${caminho}.confidenceScore: ${n} fora do intervalo 0 a 1`);
    }
  }

  if (s.startedAt !== undefined && s.startedAt !== null && !ehDataValida(s.startedAt)) {
    erros.push(`${caminho}.startedAt: "${s.startedAt}" nao esta em YYYY-MM-DD`);
  }

  if (s.endedAt !== undefined && s.endedAt !== null && !ehDataValida(s.endedAt)) {
    erros.push(`${caminho}.endedAt: "${s.endedAt}" nao esta em YYYY-MM-DD`);
  }

  if (s.lat !== undefined && s.lat !== null) {
    avisos.push(`${caminho}.lat: deveria ser null nesta etapa (geocode roda no pipeline)`);
  }

  if (s.lng !== undefined && s.lng !== null) {
    avisos.push(`${caminho}.lng: deveria ser null nesta etapa (geocode roda no pipeline)`);
  }

  if (s.excerpt !== undefined && typeof s.excerpt === 'string') {
    if (s.excerpt.length < 100 || s.excerpt.length > 300) {
      avisos.push(`${caminho}.excerpt: ${s.excerpt.length} caracteres (esperado 100 a 300)`);
    }
  }

  if (s.scope === 'national') {
    if (s.city !== null && s.city !== undefined) {
      avisos.push(`${caminho}.city: scope "national" normalmente tem city null`);
    }
    if (s.state !== null && s.state !== undefined) {
      avisos.push(`${caminho}.state: scope "national" normalmente tem state null`);
    }
  }

  if (s.scope === 'state' && (s.state === null || s.state === undefined)) {
    avisos.push(`${caminho}.state: scope "state" exige UF preenchida`);
  }

  if (s.scope === 'municipal' && (s.city === null || s.city === undefined)) {
    avisos.push(`${caminho}.city: scope "municipal" exige cidade preenchida`);
  }

  if (typeof s.state === 'string' && s.state.length !== 2) {
    erros.push(`${caminho}.state: "${s.state}" deve ter 2 letras (UF)`);
  }

  if (typeof s.dedupeKey === 'string') {
    const partes = s.dedupeKey.split('|');
    if (partes.length !== 4) {
      erros.push(`${caminho}.dedupeKey: deve ter 4 partes separadas por "|" (recebido ${partes.length})`);
    }
  }
}

function validarItem(item: Item, indice: number) {
  const base = `items[${indice}]`;

  if (!item.sourceUrl || typeof item.sourceUrl !== 'string') {
    erros.push(`${base}.sourceUrl: ausente`);
  } else if (!/^https?:\/\//.test(item.sourceUrl)) {
    erros.push(`${base}.sourceUrl: "${item.sourceUrl}" nao comeca com http`);
  }

  if (!item.rawText || typeof item.rawText !== 'string') {
    erros.push(`${base}.rawText: ausente`);
  } else if (item.rawText.length > 1500) {
    avisos.push(`${base}.rawText: ${item.rawText.length} caracteres (maximo 1500)`);
  }

  if (item.publishedAt !== undefined && item.publishedAt !== null && !ehDataValida(item.publishedAt)) {
    erros.push(`${base}.publishedAt: "${item.publishedAt}" nao esta em YYYY-MM-DD`);
  }

  if (!item.extraction) {
    erros.push(`${base}.extraction: ausente`);
    return;
  }

  if (!Array.isArray(item.extraction.strikes)) {
    erros.push(`${base}.extraction.strikes: nao e array`);
    return;
  }

  if (item.extraction.strikes.length === 0) {
    avisos.push(`${base}.extraction.strikes: array vazio`);
  }

  item.extraction.strikes.forEach((s, i) => validarStrike(s, `${base}.extraction.strikes[${i}]`));
}

function main() {
  const caminho = process.argv[2];

  if (!caminho) {
    console.error('Uso: npx tsx scripts/validar.ts caminho\\do\\arquivo.json');
    process.exit(1);
  }

  let payload: Payload;
  try {
    const texto = readFileSync(caminho, 'utf8');
    payload = parseJsonTolerante<Payload>(texto);
  } catch (e) {
    console.error('JSON invalido ou arquivo nao encontrado:');
    console.error((e as Error).message);
    process.exit(1);
  }

  if (!payload.runAt) {
    erros.push('runAt: ausente');
  } else if (!ehDataHoraValida(payload.runAt)) {
    erros.push(`runAt: "${payload.runAt}" nao e data/hora valida`);
  }

  if (payload.window) {
    if (!ehDataHoraValida(payload.window.from)) {
      erros.push('window.from: ausente ou invalido');
    }
    if (!ehDataHoraValida(payload.window.to)) {
      erros.push('window.to: ausente ou invalido');
    }
    if (ehDataHoraValida(payload.window.from) && ehDataHoraValida(payload.window.to)) {
      const from = new Date(String(payload.window.from)).getTime();
      const to = new Date(String(payload.window.to)).getTime();
      const horas = (to - from) / 3600000;
      if (Math.abs(horas - 12) > 0.5) {
        avisos.push(`window: intervalo de ${horas.toFixed(1)}h (esperado 12h)`);
      }
    }
  } else {
    avisos.push('window: ausente (recomendado para auditoria da janela de 12h)');
  }

  if (!Array.isArray(payload.items)) {
    erros.push('items: ausente ou nao e array');
  } else {
    payload.items.forEach((item, i) => validarItem(item, i));
  }

  const totalStrikes = (payload.items ?? []).reduce(
    (acc, it) => acc + (Array.isArray(it.extraction?.strikes) ? it.extraction!.strikes!.length : 0),
    0,
  );

  console.log('');
  console.log(`Arquivo: ${caminho}`);
  console.log(`Noticias: ${(payload.items ?? []).length}`);
  console.log(`Greves: ${totalStrikes}`);
  console.log('');

  if (avisos.length > 0) {
    console.log(`AVISOS (${avisos.length}):`);
    avisos.forEach((a) => console.log(`  - ${a}`));
    console.log('');
  }

  if (erros.length > 0) {
    console.log(`ERROS (${erros.length}):`);
    erros.forEach((e) => console.log(`  - ${e}`));
    console.log('');
    console.log('JSON REPROVADO. Corrija os erros antes de colar no /ingestao.');
    process.exit(1);
  }

  console.log('JSON APROVADO. Pode colar no /ingestao.');
}

main();