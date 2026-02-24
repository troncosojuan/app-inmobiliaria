import { getTenant } from "@/lib/tenant";
import { PropertyService } from "@/lib/properties";
import { propertyFiltersSchema } from "@app-inmobiliaria/api";
import { PropertyGrid } from "@/components/properties/property-grid";
import { PropertyFilters } from "@/components/properties/property-filters";
import { Pagination } from "@/components/properties/pagination";
import { SearchAlertButton } from "@/components/properties/search-alert-button";
import { notFound } from "next/navigation";
import Link from "next/link";
import { X, Map } from "lucide-react";
import type { Metadata } from "next";

const OPERATION_LABELS: Record<string, string> = {
  SALE: "Venta", RENT: "Alquiler", TEMPORARY: "Temporal",
};
const TYPE_LABELS: Record<string, string> = {
  APARTMENT: "Depto", HOUSE: "Casa", PH: "PH", OFFICE: "Oficina",
  COMMERCIAL: "Local", LAND: "Terreno", WAREHOUSE: "Galpón",
  COUNTRY_HOUSE: "Country", FARM: "Campo",
};

function ActiveFiltersBar({ params }: { params: Record<string, string | undefined> }) {
  const chips: { label: string; removeKey: string[] }[] = [];

  if (params.operation) chips.push({ label: OPERATION_LABELS[params.operation] || params.operation, removeKey: ["operation"] });
  if (params.types) {
    const names = params.types.split(",").map((t) => TYPE_LABELS[t] || t).join(", ");
    chips.push({ label: names, removeKey: ["types", "type"] });
  } else if (params.type) {
    chips.push({ label: TYPE_LABELS[params.type] || params.type, removeKey: ["type"] });
  }
  if (params.city) chips.push({ label: params.city, removeKey: ["city"] });
  if (params.bedrooms) chips.push({ label: `${params.bedrooms}+ dorm.`, removeKey: ["bedrooms"] });
  if (params.minPrice || params.maxPrice) {
    const from = params.minPrice ? `USD ${Number(params.minPrice).toLocaleString("es-AR")}` : "";
    const to = params.maxPrice ? `USD ${Number(params.maxPrice).toLocaleString("es-AR")}` : "";
    const label = [from && `desde ${from}`, to && `hasta ${to}`].filter(Boolean).join(" · ");
    chips.push({ label, removeKey: ["minPrice", "maxPrice"] });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const next = new URLSearchParams();
        for (const [k, v] of Object.entries(params)) {
          if (v && !chip.removeKey.includes(k) && k !== "page") next.set(k, v);
        }
        const href = `/propiedades${next.toString() ? `?${next.toString()}` : ""}`;
        return (
          <Link
            key={chip.removeKey[0]}
            href={href}
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
          >
            {chip.label}
            <X className="h-3 w-3 opacity-70" />
          </Link>
        );
      })}
    </div>
  );
}

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const tenant = await getTenant();
  const params = await searchParams;
  const operation = params.operation === "RENT" ? "Alquiler" : params.operation === "TEMPORARY" ? "Alquiler temporal" : "Venta";

  return {
    title: `Propiedades en ${operation} | ${tenant?.name}`,
    description: `Explorá todas las propiedades en ${operation.toLowerCase()} de ${tenant?.name}`,
    alternates: { canonical: "/propiedades" },
  };
}

export default async function PropiedadesPage({ searchParams }: Props) {
  const tenant = await getTenant();
  if (!tenant) return notFound();

  const params = await searchParams;

  const filters = propertyFiltersSchema.parse({
    type: params.type,
    types: params.types,
    operation: params.operation,
    city: params.city,
    search: params.search,
    bedrooms: params.bedrooms,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    page: params.page,
  });

  const [result, cities] = await Promise.all([
    PropertyService.search(tenant.id, filters),
    PropertyService.getCities(tenant.id),
  ]);

  const mapaParams = new URLSearchParams();
  if (params.operation) mapaParams.set("operation", params.operation);
  if (params.type) mapaParams.set("type", params.type);
  if (params.city) mapaParams.set("city", params.city);
  const mapaHref = `/mapa${mapaParams.toString() ? `?${mapaParams.toString()}` : ""}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Propiedades</h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{result.total}</span>{" "}
            {result.total === 1 ? "propiedad encontrada" : "propiedades encontradas"}
          </p>
          <ActiveFiltersBar params={params} />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={mapaHref}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Map className="h-4 w-4" />
            Ver en mapa
          </Link>
          <SearchAlertButton tenantId={tenant.id} filters={params} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="self-start lg:sticky lg:top-6">
          <PropertyFilters
            tenant={tenant}
            cities={cities}
            currentFilters={params}
          />
        </aside>

        <div>
          <PropertyGrid properties={result.properties} tenant={tenant} />

          {result.pages > 1 && (
            <Pagination
              currentPage={result.page}
              totalPages={result.pages}
              tenant={tenant}
              searchParams={params}
            />
          )}
        </div>
      </div>
    </div>
  );
}
