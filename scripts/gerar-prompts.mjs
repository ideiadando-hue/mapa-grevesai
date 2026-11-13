import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const MONTHS = [
  { label: 'junho-2026', start: '2026-06-01', end: '2026-06-30' },
  { label: 'julho-2026', start: '2026-07-01', end: '2026-07-31' },
  { label: 'agosto-2026', start: '2026-08-01', end: '2026-08-31' },
  { label: 'setembro-2026', start: '2026-09-01', end: '2026-09-30' },
  { label: 'outubro-2026', start: '2026-10-01', end: '2026-10-31' },
  { label: 'novembro-2026', start: '2026-11-01', end: '2026-11-13' },
];

const OUT_DIR = join(process.cwd(), 'prompts');
mkdirSync(OUT_DIR, { recursive: true });

for (const m of MONTHS) {
  const content = `Busque noticias publicadas entre ${m.start} e ${m.end}.

[cole aqui o SEARCH_PROMPT de src/lib/searchPrompt.ts, substituindo as variaveis por ${m.start} e ${m.end}]

Janela desta execucao: ${m.start} a ${m.end}`;

  const file = join(OUT_DIR, `prompt-${m.label}.txt`);
  writeFileSync(file, content, 'utf8');
  console.log('Gerado:', file);
}

console.log('\nPronto. Abra cada arquivo em prompts/ e substitua o marcador pelo prompt completo.');