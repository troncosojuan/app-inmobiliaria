// ============================================
// PROPERTY TYPES
// ============================================

export const PROPERTY_TYPE_LABELS = {
  HOUSE: "Casa",
  APARTMENT: "Departamento",
  LAND: "Terreno",
  OFFICE: "Oficina",
  COMMERCIAL: "Local comercial",
  WAREHOUSE: "Galpón",
  PH: "PH",
  COUNTRY_HOUSE: "Casa en country",
  FARM: "Campo",
} as const;

export type PropertyType = keyof typeof PROPERTY_TYPE_LABELS;

export const OPERATION_TYPE_LABELS = {
  SALE: "Venta",
  RENT: "Alquiler",
  TEMPORARY: "Alquiler temporal",
} as const;

export type OperationType = keyof typeof OPERATION_TYPE_LABELS;

// ============================================
// STATUS LABELS (Property + Lead)
// ============================================

export const PROPERTY_STATUS_LABELS = {
  ACTIVE: "Activa",
  PAUSED: "Pausada",
  SOLD: "Vendida",
  RENTED: "Alquilada",
  DRAFT: "Borrador",
} as const;

export type PropertyStatus = keyof typeof PROPERTY_STATUS_LABELS;

export const PROPERTY_STATUS_CONFIG: Record<PropertyStatus, { label: string; color: string; bgClass: string }> = {
  ACTIVE: { label: "Activa", color: "status-active", bgClass: "bg-emerald-100 text-emerald-700" },
  DRAFT: { label: "Borrador", color: "status-draft", bgClass: "bg-slate-100 text-slate-600" },
  PAUSED: { label: "Pausada", color: "status-paused", bgClass: "bg-amber-100 text-amber-700" },
  SOLD: { label: "Vendida", color: "status-sold", bgClass: "bg-blue-100 text-blue-700" },
  RENTED: { label: "Alquilada", color: "status-rented", bgClass: "bg-violet-100 text-violet-700" },
};

export const LEAD_STATUS_LABELS = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  IN_VISIT: "En visita",
  OFFER: "Oferta",
  CONVERTED: "Cerrado",
  LOST: "Perdido",
} as const;

export type LeadStatus = keyof typeof LEAD_STATUS_LABELS;

export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bgClass: string }> = {
  NEW: { label: "Nuevo", color: "status-new", bgClass: "bg-blue-100 text-blue-700" },
  CONTACTED: { label: "Contactado", color: "status-contacted", bgClass: "bg-amber-100 text-amber-700" },
  IN_VISIT: { label: "En visita", color: "status-in-visit", bgClass: "bg-purple-100 text-purple-700" },
  OFFER: { label: "Oferta", color: "status-offer", bgClass: "bg-indigo-100 text-indigo-700" },
  CONVERTED: { label: "Cerrado", color: "status-converted", bgClass: "bg-emerald-100 text-emerald-700" },
  LOST: { label: "Perdido", color: "status-lost", bgClass: "bg-red-100 text-red-700" },
};

export const LEAD_PIPELINE_COLUMNS = [
  { key: "NEW" as const, label: "Nuevo", dotColor: "bg-blue-500" },
  { key: "CONTACTED" as const, label: "Contactado", dotColor: "bg-amber-500" },
  { key: "IN_VISIT" as const, label: "En visita", dotColor: "bg-purple-500" },
  { key: "OFFER" as const, label: "Oferta", dotColor: "bg-indigo-500" },
  { key: "CONVERTED" as const, label: "Cerrado", dotColor: "bg-emerald-500" },
  { key: "LOST" as const, label: "Perdido", dotColor: "bg-red-500" },
];

// ============================================
// GEOGRAPHY
// ============================================

export const ARGENTINA_PROVINCES = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán",
] as const;

// ============================================
// CURRENCY
// ============================================

export const CURRENCIES = {
  USD: { symbol: "US$", label: "Dólares" },
  ARS: { symbol: "$", label: "Pesos" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export function formatPrice(price: number, currency: string): string {
  const curr = CURRENCIES[currency as CurrencyCode];
  if (!curr) return `${currency} ${price.toLocaleString("es-AR")}`;
  return `${curr.symbol} ${price.toLocaleString("es-AR")}`;
}

export function formatArea(area: number): string {
  return `${area.toLocaleString("es-AR")} m²`;
}

// ============================================
// COMMON TYPES
// ============================================

export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo?: string | null;
  favicon?: string | null;
}

export interface PlanFeatures {
  maxProperties: number;
  maxUsers: number;
  customDomain: boolean;
  analytics: boolean;
  aiFeatures: boolean;
  ipcAdjustment: boolean;
  chatAutomation: boolean;
  crm: boolean;
  bulkUpload: boolean;
  seoAdvanced: boolean;
  customPages: boolean;
  prioritySupport: boolean;
  hidePlatformBranding: boolean;
}

export interface TenantBase {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  logo: string | null;
  favicon: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  customDomain: string | null;
  isActive: boolean;
  plan: PlanFeatures & { id: string; name: string; slug: string; price: number };
}

export interface UserSession {
  id: string;
  email: string;
  name: string | null;
  role: "PLATFORM_ADMIN" | "TENANT_ADMIN" | "AGENT";
  tenantId: string | null;
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan: PlanFeatures & { id: string; name: string; slug: string };
  } | null;
}

export interface PropertyBase {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: PropertyType;
  operation: OperationType;
  status: PropertyStatus;
  price: number;
  currency: CurrencyCode;
  expenses: number | null;
  address: string;
  city: string;
  state: string;
  neighborhood: string | null;
  totalArea: number | null;
  coveredArea: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  garages: number | null;
  floor: number | null;
  yearBuilt: number | null;
  amenities: string[] | null;
  metaTitle: string | null;
  metaDescription: string | null;
  virtualTourUrl: string | null;
  isFeatured: boolean;
  createdAt: string | Date;
  images: { id: string; url: string; order: number }[];
}

export interface LeadBase {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  notes: string | null;
  status: LeadStatus;
  source: string | null;
  createdAt: string | Date;
  property: { title: string; slug: string } | null;
  assignedTo: { name: string | null; email: string } | null;
}
