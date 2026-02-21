import { getTenant } from "@/lib/tenant";
import { PropertyService } from "@/lib/properties";
import { propertyFiltersSchema } from "@app-inmobiliaria/api";
import { PropertyGrid } from "@/components/properties/property-grid";
import { PropertyFilters } from "@/components/properties/property-filters";
import { Pagination } from "@/components/properties/pagination";
import { SearchAlertButton } from "@/components/properties/search-alert-button";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propiedades</h1>
          <p className="mt-2 text-muted-foreground">
            {result.total} {result.total === 1 ? "propiedad encontrada" : "propiedades encontradas"}
          </p>
        </div>
        <SearchAlertButton tenantId={tenant.id} filters={params} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside>
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
