import { promises as fs } from 'fs';
import path from 'path';

export type RuleResult = 'pass' | 'fail' | 'warn';

export type RejectionReason =
  | 'announced_unconfirmed'
  | 'extraction_failed'
  | 'duplicate'
  | 'out_of_scope'
  | 'low_confidence';

export type LogItem = {
  id: string;
  sourceUrl: string;
  publisher: string | null;
  sourceType: string;
  publishedAt: string | null;
  excerpt: string;
  summary: string;
  extracted: object;
  rules: Record<string, RuleResult>;
  verdict: 'approved' | 'rejected';
  reason: RejectionReason | null;
  strikeId: string | null;
};

export type SearchLog = {
  runId: string;
  startedAt: string;
  finishedAt: string;
  stats: {
    sourcesFetched: number;
    itemsExtracted: number;
    approved: number;
    rejected: number;
  };
  items: LogItem[];
};

const LOG_DIR = path.join(process.cwd(), 'logs');

export function createLog(startedAt: Date): SearchLog {
  return {
    runId: startedAt.toISOString(),
    startedAt: startedAt.toISOString(),
    finishedAt: '',
    stats: { sourcesFetched: 0, itemsExtracted: 0, approved: 0, rejected: 0 },
    items: [],
  };
}

export function addItem(log: SearchLog, item: LogItem): void {
  log.items.push(item);
  log.stats.itemsExtracted += 1;
  if (item.verdict === 'approved') log.stats.approved += 1;
  else log.stats.rejected += 1;
}

export async function saveLog(log: SearchLog): Promise<string> {
  await fs.mkdir(LOG_DIR, { recursive: true });
  log.finishedAt = new Date().toISOString();
  const filename = log.runId.replace(/[:.]/g, '-') + '.json';
  const filepath = path.join(LOG_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(log, null, 2), 'utf8');
  return filepath;
}