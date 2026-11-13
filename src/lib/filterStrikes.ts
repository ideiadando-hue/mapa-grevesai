import type { StrikePoint, MonthOption } from '@/types/strike';
import type { Filters } from '@/components/StrikeFilters';

export function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function filterStrikes(strikes: StrikePoint[], f: Filters): StrikePoint[] {
  return strikes.filter((s) => {
    if (f.month && monthKey(s.startedAt) !== f.month) return false;
    if (f.state && s.state !== f.state) return false;
    if (f.category && s.category !== f.category) return false;
    if (f.status && s.status !== f.status) return false;
    if (f.confidence && s.confidence !== f.confidence) return false;
    return true;
  });
}

export function buildMonthOptions(strikes: StrikePoint[]): MonthOption[] {
  const counts = new Map<string, number>();

  for (const s of strikes) {
    const key = monthKey(s.startedAt);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([value, count]) => {
      const [year, month] = value.split('-');
      const shortYear = year.slice(2);
      return {
        value,
        label: `${month}/${shortYear} (${count})`,
        count,
      };
    });
}