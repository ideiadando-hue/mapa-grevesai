'use client';

import { useMemo } from 'react';
import type { StrikePoint } from '@/types/strike';
import { buildMonthOptions } from '@/lib/filterStrikes';

export type Filters = {
  month: string;
  state: string;
  category: string;
  status: string;
  confidence: string;
};

export const emptyFilters: Filters = {
  month: '',
  state: '',
  category: '',
  status: '',
  confidence: '',
};

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

type Props = {
  strikes: StrikePoint[];
  filters: Filters;
  onChange: (f: Filters) => void;
};

export default function StrikeFilters({ strikes, filters, onChange }: Props) {
  const months = useMemo(() => buildMonthOptions(strikes), [strikes]);

  const categories = useMemo(
    () => Array.from(new Set(strikes.map((s) => s.category))).sort(),
    [strikes]
  );

  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  const active =
    filters.month || filters.state || filters.category || filters.status ||
    filters.confidence;

  return (
    <div className="filters">
      <select
        value={filters.month}
        onChange={(e) => set({ month: e.target.value })}
        aria-label="Filtrar por mês"
      >
        <option value="">Todos os meses</option>
        {months.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      <select value={filters.state} onChange={(e) => set({ state: e.target.value })}>
        <option value="">Todos os estados</option>
        {UFS.map((uf) => (
          <option key={uf} value={uf}>{uf}</option>
        ))}
      </select>

      <select value={filters.category} onChange={(e) => set({ category: e.target.value })}>
        <option value="">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c} value={c}>{capitalize(c)}</option>
        ))}
      </select>

      <select value={filters.status} onChange={(e) => set({ status: e.target.value })}>
        <option value="">Todos os status</option>
        <option value="active">Ativa</option>
        <option value="ended">Encerrada</option>
        <option value="suspended">Suspensa</option>
        <option value="unconfirmed_end">Sem término confirmado</option>
      </select>

      <select value={filters.confidence} onChange={(e) => set({ confidence: e.target.value })}>
        <option value="">Toda confiança</option>
        <option value="confirmed">Confirmada</option>
        <option value="likely">Provável</option>
        <option value="unverified">Não verificada</option>
      </select>

      {active && (
        <button type="button" onClick={() => onChange(emptyFilters)}>
          Limpar filtros
        </button>
      )}
    </div>
  );
}