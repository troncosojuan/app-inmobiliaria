import { NextResponse } from "next/server";

type Suggestion = {
  label: string;
  address: string;
  city: string;
  state: string;
  neighborhood?: string;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { ts: number; data: Suggestion[] }>();

function getCached(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) { cache.delete(key); return null; }
  return entry.data;
}
function setCached(key: string, data: Suggestion[]) {
  cache.set(key, { ts: Date.now(), data });
}

// ---------------------------------------------------------------------------
// Georef — localidades (ciudades, partidos, barrios)
// "beraza" → Berazategui | "bernal" → Bernal, Quilmes
// ---------------------------------------------------------------------------
type GeorefLocalidad = {
  nombre: string;
  municipio?: { nombre: string };
  provincia: { nombre: string };
};

async function fetchLocalidades(query: string): Promise<Suggestion[]> {
  try {
    const url = `https://apis.datos.gob.ar/georef/api/localidades?nombre=${encodeURIComponent(query)}&max=5&campos=nombre,municipio.nombre,provincia.nombre`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.localidades as GeorefLocalidad[] ?? []).map((l) => {
      const partido = l.municipio?.nombre && l.municipio.nombre !== l.nombre
        ? `, ${l.municipio.nombre}` : "";
      return {
        label: `${l.nombre}${partido}, ${l.provincia.nombre}`,
        address: "",
        city: l.nombre,
        state: l.provincia.nombre,
      };
    });
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Georef — municipios (partidos del GBA: Quilmes, La Matanza, etc.)
// ---------------------------------------------------------------------------
type GeorefMunicipio = {
  nombre: string;
  provincia: { nombre: string };
};

async function fetchMunicipios(query: string): Promise<Suggestion[]> {
  try {
    const url = `https://apis.datos.gob.ar/georef/api/municipios?nombre=${encodeURIComponent(query)}&max=3&campos=nombre,provincia.nombre`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.municipios as GeorefMunicipio[] ?? []).map((m) => ({
      label: `${m.nombre}, ${m.provincia.nombre}`,
      address: "",
      city: m.nombre,
      state: m.provincia.nombre,
    }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Georef — direcciones (calle + número)
// "av rivadavia 1234" → calle con número en una localidad
// ---------------------------------------------------------------------------
type GeorefDireccion = {
  nomenclatura: string;
  calle: { nombre: string };
  altura: { valor: number } | null;
  localidad_censal: { nombre: string } | null;
  municipio: { nombre: string } | null;
  provincia: { nombre: string };
};

async function fetchDirecciones(query: string): Promise<Suggestion[]> {
  try {
    const url = `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(query)}&max=5&campos=nomenclatura,calle.nombre,altura.valor,localidad_censal.nombre,municipio.nombre,provincia.nombre`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const json = await res.json();
    const direcciones: GeorefDireccion[] = json.direcciones || [];
    return direcciones.map((d) => {
      const city = d.localidad_censal?.nombre || d.municipio?.nombre || "";
      const streetNum = d.altura?.valor ? ` ${d.altura.valor}` : "";
      return {
        label: d.nomenclatura,
        address: `${d.calle.nombre}${streetNum}`,
        city,
        state: d.provincia?.nombre || "",
      };
    });
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Deduplicate by city+address key
// ---------------------------------------------------------------------------
function dedup(items: Suggestion[]): Suggestion[] {
  const seen = new Set<string>();
  return items.filter((s) => {
    const key = `${s.city}:${s.address}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ---------------------------------------------------------------------------
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("query") || "").trim();

  if (query.length < 3) return NextResponse.json([]);

  const cacheKey = `georef:v2:${query}`;
  const cached = getCached(cacheKey);
  if (cached) return NextResponse.json(cached);

  // Run all three in parallel
  const [localidades, municipios, direcciones] = await Promise.all([
    fetchLocalidades(query),
    fetchMunicipios(query),
    fetchDirecciones(query),
  ]);

  // Localidades and municipios first (most useful for property location),
  // then street-level results
  const results = dedup([...localidades, ...municipios, ...direcciones]).slice(0, 6);

  setCached(cacheKey, results);
  return NextResponse.json(results);
}
