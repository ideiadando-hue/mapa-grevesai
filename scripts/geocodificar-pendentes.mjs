import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cache = new Map();

function chave(city, state) {
  return `${(city ?? '').toLowerCase()}|${(state ?? '').toLowerCase()}`;
}

async function geocode(city, state) {
  if (!city && !state) return null;
  const k = chave(city, state);
  if (cache.has(k)) return cache.get(k);

  const query = [city, state, 'Brasil'].filter(Boolean).join(', ');
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'mapa-grevesai/1.0 (contato@exemplo.com)' },
    });
    if (!res.ok) { cache.set(k, null); return null; }
    const data = await res.json();
    if (!data.length) { cache.set(k, null); return null; }
    const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    cache.set(k, coords);
    return coords;
  } catch {
    cache.set(k, null);
    return null;
  }
}

async function main() {
  const pendentes = await prisma.strike.findMany({
    where: { OR: [{ lat: null }, { lng: null }] },
    select: { id: true, title: true, city: true, state: true, scope: true },
  });

  console.log(`Registros sem coordenada: ${pendentes.length}\n`);

  let ok = 0;
  let falhou = 0;

  for (const s of pendentes) {
    const coords = await geocode(s.city, s.state);

    if (coords) {
      await prisma.strike.update({
        where: { id: s.id },
        data: { lat: coords.lat, lng: coords.lng },
      });
      console.log(`OK    ${s.title} -> ${coords.lat}, ${coords.lng}`);
      ok++;
    } else {
      console.log(`FALHA ${s.title} | city=${s.city} state=${s.state} scope=${s.scope}`);
      falhou++;
    }

    await new Promise((r) => setTimeout(r, 1100));
  }

  console.log(`\nGeocodificados: ${ok}`);
  console.log(`Sem resultado: ${falhou}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());