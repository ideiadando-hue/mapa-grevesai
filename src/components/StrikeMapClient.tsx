'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { StrikePoint } from '@/types/strike';
import StrikeFilters, { emptyFilters, type Filters } from './StrikeFilters';
import { filterStrikes } from '@/lib/filterStrikes';

const StrikeMap = dynamic(() => import('./StrikeMap'), {
  ssr: false,
  loading: () => <div style={{ height: 500 }}>Carregando mapa...</div>,
});

export default function StrikeMapClient() {
  const [strikes, setStrikes] = useState<StrikePoint[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    fetch('/api/strikes?pageSize=5000')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => setStrikes(json.data ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (!mounted) return <p>Carregando greves...</p>;
  if (loading) return <p>Carregando greves...</p>;
  if (error) return <p>Erro ao carregar: {error}</p>;

  const visible = filterStrikes(strikes, filters);
  const withCoords = visible.filter((s) => s.lat != null && s.lng != null);

  return (
    <div>
      <StrikeFilters strikes={strikes} filters={filters} onChange={setFilters} />

      <p style={{ margin: '12px 0', fontSize: 14, color: '#555' }}>
        Exibindo {visible.length} de {strikes.length} greves
        {' · '}
        {withCoords.length} com localização no mapa
      </p>

      <StrikeMap strikes={withCoords} />
    </div>
  );
}