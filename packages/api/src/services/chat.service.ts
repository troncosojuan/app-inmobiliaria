import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";

interface ParsedIntent {
  type?: string;
  operation?: string;
  city?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  search?: string;
}

interface ChatProperty {
  id: string;
  title: string;
  slug: string;
  type: string;
  operation: string;
  price: number;
  currency: string;
  city: string;
  neighborhood: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  totalArea: number | null;
  image?: string;
}

interface ChatResponse {
  message: string;
  properties: ChatProperty[];
  filters: ParsedIntent;
}

const TYPE_SYNONYMS: Record<string, string> = {
  casa: "HOUSE", casas: "HOUSE", vivienda: "HOUSE", chalet: "HOUSE",
  departamento: "APARTMENT", depto: "APARTMENT", deptos: "APARTMENT", departamentos: "APARTMENT", dpto: "APARTMENT",
  terreno: "LAND", terrenos: "LAND", lote: "LAND", lotes: "LAND",
  oficina: "OFFICE", oficinas: "OFFICE",
  local: "COMMERCIAL", locales: "COMMERCIAL", comercial: "COMMERCIAL",
  galpon: "WAREHOUSE", galpón: "WAREHOUSE", galpones: "WAREHOUSE", deposito: "WAREHOUSE",
  ph: "PH",
  country: "COUNTRY_HOUSE", "casa en country": "COUNTRY_HOUSE",
  campo: "FARM", campos: "FARM", estancia: "FARM",
};

const OP_SYNONYMS: Record<string, string> = {
  comprar: "SALE", compra: "SALE", venta: "SALE", compro: "SALE", adquirir: "SALE",
  alquilar: "RENT", alquiler: "RENT", alquilo: "RENT", renta: "RENT", rentar: "RENT",
  temporal: "TEMPORARY", temporario: "TEMPORARY", "alquiler temporal": "TEMPORARY",
};

const NUMBER_WORDS: Record<string, number> = {
  un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
  seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
};

const GREETING_PATTERNS = /^(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|que tal|qué tal)/i;
const THANKS_PATTERNS = /^(gracias|muchas gracias|genial|perfecto|excelente|dale|ok|buenísimo|buenisimo)/i;

function parseNumber(text: string): number | undefined {
  const cleaned = text.replace(/\./g, "").replace(/,/g, ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

function extractPrice(text: string): { min?: number; max?: number } {
  const result: { min?: number; max?: number } = {};

  const rangeMatch = text.match(/entre\s+(\d[\d.,]*)\s*(?:y|a)\s*(\d[\d.,]*)/i);
  if (rangeMatch) {
    result.min = parseNumber(rangeMatch[1]);
    result.max = parseNumber(rangeMatch[2]);
    return result;
  }

  const maxPatterns = [
    /(?:menos de|hasta|max(?:imo)?|no más de|no mas de|por debajo de)\s+(?:u[s$]d?\s*)?(\d[\d.,]*)/i,
    /(?:menos de|hasta|max(?:imo)?)\s+(\d[\d.,]*)\s*(?:dolares|usd|pesos|ars)/i,
  ];
  for (const pattern of maxPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.max = parseNumber(match[1]);
      return result;
    }
  }

  const minPatterns = [
    /(?:más de|mas de|desde|min(?:imo)?|por encima de)\s+(?:u[s$]d?\s*)?(\d[\d.,]*)/i,
  ];
  for (const pattern of minPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.min = parseNumber(match[1]);
      return result;
    }
  }

  return result;
}

function extractRoomCount(text: string, keywords: string[]): number | undefined {
  for (const kw of keywords) {
    const patterns = [
      new RegExp(`(\\d+)\\s*${kw}`, "i"),
      new RegExp(`${kw}\\s*:?\\s*(\\d+)`, "i"),
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) return parseInt(m[1]);
    }

    for (const [word, num] of Object.entries(NUMBER_WORDS)) {
      if (text.includes(`${word} ${kw}`) || text.includes(`${word} ${kw}s`)) {
        return num;
      }
    }
  }
  return undefined;

}

function parseIntent(text: string): ParsedIntent {
  const lower = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const intent: ParsedIntent = {};

  for (const [synonym, type] of Object.entries(TYPE_SYNONYMS)) {
    if (lower.includes(synonym)) {
      intent.type = type;
      break;
    }
  }

  for (const [synonym, op] of Object.entries(OP_SYNONYMS)) {
    if (lower.includes(synonym)) {
      intent.operation = op;
      break;
    }
  }

  const ambMatch = lower.match(/(\d+)\s*amb(?:ientes)?/);
  if (ambMatch) {
    const amb = parseInt(ambMatch[1]);
    intent.bedrooms = Math.max(1, amb - 1);
  }

  if (!intent.bedrooms) {
    intent.bedrooms = extractRoomCount(lower, ["dormitorio", "dormitorios", "habitacion", "habitaciones", "cuarto", "cuartos"]);
  }

  intent.bathrooms = extractRoomCount(lower, ["bano", "banos", "baño", "baños"]);
  intent.garages = extractRoomCount(lower, ["cochera", "cocheras", "garage", "garages"]);

  const prices = extractPrice(lower);
  if (prices.min) intent.minPrice = prices.min;
  if (prices.max) intent.maxPrice = prices.max;

  return intent;
}

function buildResponse(properties: ChatProperty[], filters: ParsedIntent, tenantName: string): string {
  if (GREETING_PATTERNS.test(filters.search || "")) {
    return `¡Hola! Soy el asistente de **${tenantName}**. Puedo ayudarte a encontrar propiedades. Decime qué estás buscando, por ejemplo:\n\n• "Busco un departamento de 2 ambientes en Palermo"\n• "Casas en venta hasta 200.000 USD"\n• "Alquiler de oficinas en el centro"`;
  }

  if (properties.length === 0) {
    let msg = "No encontré propiedades que coincidan exactamente con tu búsqueda.";
    msg += "\n\nPodés intentar con criterios más amplios, por ejemplo:";
    msg += "\n• Cambiar la zona o el rango de precio";
    msg += "\n• Buscar otro tipo de propiedad";
    msg += `\n\nO podés [ver todas las propiedades disponibles](/propiedades).`;
    return msg;
  }

  const count = properties.length;
  let msg = `Encontré **${count} propiedad${count > 1 ? "es" : ""}**`;

  const parts: string[] = [];
  if (filters.type) {
    const typeLabels: Record<string, string> = {
      HOUSE: "casas", APARTMENT: "departamentos", LAND: "terrenos",
      OFFICE: "oficinas", COMMERCIAL: "locales", PH: "PHs",
    };
    parts.push(typeLabels[filters.type] || filters.type.toLowerCase());
  }
  if (filters.operation) {
    const opLabels: Record<string, string> = { SALE: "en venta", RENT: "en alquiler", TEMPORARY: "en alquiler temporal" };
    parts.push(opLabels[filters.operation] || "");
  }
  if (filters.city) parts.push(`en ${filters.city}`);

  if (parts.length > 0) msg += ` (${parts.join(" ")})`;
  msg += " que podrían interesarte:";

  return msg;
}

export class ChatService {
  static async processMessage(
    tenantId: string,
    message: string,
    tenantName: string
  ): Promise<ChatResponse> {
    if (GREETING_PATTERNS.test(message.trim())) {
      return {
        message: buildResponse([], {}, tenantName),
        properties: [],
        filters: {},
      };
    }

    if (THANKS_PATTERNS.test(message.trim())) {
      return {
        message: `¡De nada! Si necesitás algo más, no dudes en preguntarme. También podés [contactarnos directamente](/contacto) para una atención personalizada.`,
        properties: [],
        filters: {},
      };
    }

    const filters = parseIntent(message);

    const cities = await prisma.property.findMany({
      where: { tenantId, status: "ACTIVE" },
      select: { city: true, neighborhood: true },
      distinct: ["city"],
    });

    const cityNames = cities.map((c) => c.city.toLowerCase());
    const words = message.toLowerCase().split(/\s+/);

    for (let len = 3; len >= 1; len--) {
      for (let i = 0; i <= words.length - len; i++) {
        const phrase = words.slice(i, i + len).join(" ");
        const match = cityNames.find((c) => c.includes(phrase) || phrase.includes(c));
        if (match) {
          filters.city = cities.find((c) => c.city.toLowerCase() === match)?.city;
          break;
        }
      }
      if (filters.city) break;
    }

    const where: Record<string, unknown> = {
      tenantId,
      status: "ACTIVE",
    };

    if (filters.type) where.type = filters.type;
    if (filters.operation) where.operation = filters.operation;
    if (filters.city) where.city = { contains: filters.city };
    if (filters.bedrooms) where.bedrooms = { gte: filters.bedrooms };
    if (filters.bathrooms) where.bathrooms = { gte: filters.bathrooms };
    if (filters.garages) where.garages = { gte: filters.garages };

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) (where.price as Record<string, number>).gte = filters.minPrice;
      if (filters.maxPrice) (where.price as Record<string, number>).lte = filters.maxPrice;
    }

    const hasFilters = Object.keys(filters).filter((k) => k !== "search").length > 0;
    if (!hasFilters) {
      filters.search = message;
      where.OR = [
        { title: { contains: message } },
        { description: { contains: message } },
        { address: { contains: message } },
        { neighborhood: { contains: message } },
        { city: { contains: message } },
      ];
    }

    const rawProperties = await prisma.property.findMany({
      where,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 5,
    });

    const properties: ChatProperty[] = serialize(rawProperties).map((p: Record<string, unknown>) => ({
      id: p.id as string,
      title: p.title as string,
      slug: p.slug as string,
      type: p.type as string,
      operation: p.operation as string,
      price: Number(p.price),
      currency: p.currency as string,
      city: p.city as string,
      neighborhood: p.neighborhood as string | null,
      bedrooms: p.bedrooms as number | null,
      bathrooms: p.bathrooms as number | null,
      totalArea: p.totalArea as number | null,
      image: (p.images as { url: string }[])?.[0]?.url,
    }));

    const responseMsg = buildResponse(properties, filters, tenantName);

    return { message: responseMsg, properties, filters };
  }
}
