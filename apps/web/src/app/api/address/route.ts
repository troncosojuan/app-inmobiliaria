import { NextResponse } from "next/server";

type Suggestion = {
  label: string;
  address: string;
  city: string;
  state: string;
  neighborhood?: string;
};

const PROVINCE_MAP: Record<string, string> = {
  "Ciudad Autónoma de Buenos Aires": "Buenos Aires (CABA)",
  "Buenos Aires": "Buenos Aires",
  "Córdoba": "Córdoba",
  "Santa Fe": "Santa Fe",
  "Mendoza": "Mendoza",
  "Tucumán": "Tucumán",
  "Entre Ríos": "Entre Ríos",
  "Salta": "Salta",
  "Misiones": "Misiones",
  "Chaco": "Chaco",
  "Corrientes": "Corrientes",
  "Santiago del Estero": "Santiago del Estero",
  "San Juan": "San Juan",
  "Jujuy": "Jujuy",
  "Río Negro": "Río Negro",
  "Neuquén": "Neuquén",
  "Formosa": "Formosa",
  "Chubut": "Chubut",
  "San Luis": "San Luis",
  "Catamarca": "Catamarca",
  "La Rioja": "La Rioja",
  "La Pampa": "La Pampa",
  "Santa Cruz": "Santa Cruz",
  "Tierra del Fuego": "Tierra del Fuego",
};

const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { ts: number; data: Suggestion[] }>();

function getCached(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key: string, data: Suggestion[]) {
  cache.set(key, { ts: Date.now(), data });
}

function normalizeNominatim(item: any): Suggestion | null {
  if (!item) return null;
  const address = item.address ?? {};
  const road = address.road || address.pedestrian || address.footway || address.path || "";
  const houseNumber = address.house_number ? ` ${address.house_number}` : "";
  const addr = road ? `${road}${houseNumber}` : item.name || item.display_name || "";
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    "";
  const state = address.state || address.region || address.state_district || "";
  const neighborhood = address.suburb || address.neighbourhood || address.quarter || "";

  if (!addr) return null;

  return {
    label: item.display_name || addr,
    address: addr,
    city,
    state,
    neighborhood: neighborhood || undefined,
  };
}

async function fetchNominatim(query: string): Promise<Suggestion[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "app-inmobiliaria/1.0 (contacto@app-inmobiliaria.local)",
      "Accept-Language": "es",
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  if (!Array.isArray(json)) return [];
  return json.map(normalizeNominatim).filter(Boolean) as Suggestion[];
}

type GeorefDireccion = {
  nomenclatura: string;
  calle: { nombre: string };
  altura: { valor: number } | null;
  localidad_censal: { nombre: string } | null;
  municipio: { nombre: string } | null;
  provincia: { nombre: string };
};

async function fetchGeoref(query: string): Promise<Suggestion[]> {
  const url = `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(query)}&max=5&campos=nomenclatura,calle.nombre,altura.valor,localidad_censal.nombre,municipio.nombre,provincia.nombre`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  const json = await res.json();
  const direcciones: GeorefDireccion[] = json.direcciones || [];
  return direcciones.map((d) => {
    const city = d.localidad_censal?.nombre || d.municipio?.nombre || "";
    const rawProvince = d.provincia?.nombre || "";
    const state = PROVINCE_MAP[rawProvince] || rawProvince;
    const streetNum = d.altura?.valor ? ` ${d.altura.valor}` : "";
    const address = `${d.calle.nombre}${streetNum}`;
    return {
      label: d.nomenclatura,
      address,
      city,
      state,
    };
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("query") || "").trim();

  if (query.length < 3) {
    return NextResponse.json([]);
  }

  const cached = getCached(query);
  if (cached) return NextResponse.json(cached);

  let results = await fetchNominatim(query);
  if (results.length === 0) {
    results = await fetchGeoref(query);
  }

  setCached(query, results);
  return NextResponse.json(results);
}
