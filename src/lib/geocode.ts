type Coords = { lat: number; lng: number } | null;

const cache = new Map<string, Coords>();

function chave(city: string | null, state: string | null): string {
  return `${(city ?? '').toLowerCase()}|${(state ?? '').toLowerCase()}`;
}

export async function geocode(
  city: string | null,
  state: string | null
): Promise<Coords> {
  if (!city && !state) return null;

  const k = chave(city, state);
  if (cache.has(k)) return cache.get(k)!;

  const query = [city, state, 'Brasil'].filter(Boolean).join(', ');
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'mapa-grevesai/1.0 (contato@exemplo.com)' },
    });
    if (!res.ok) {
      cache.set(k, null);
      return null;
    }
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!data.length) {
      cache.set(k, null);
      return null;
    }
    const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    cache.set(k, coords);
    return coords;
  } catch {
    cache.set(k, null);
    return null;
  }
}