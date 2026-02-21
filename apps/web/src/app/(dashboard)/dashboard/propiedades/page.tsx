import { requireAuth } from "@/lib/auth";
import { PropertyService } from "@app-inmobiliaria/api";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, Building2, FileSpreadsheet } from "lucide-react";
import { PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS, PROPERTY_STATUS_CONFIG, formatPrice } from "@app-inmobiliaria/types";
import {
  PageHeader, StatusBadge, EmptyState,
  DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableHead, DataTableCell,
} from "@app-inmobiliaria/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPropertiesPage() {
  const user = await requireAuth();

  const result = await PropertyService.getAllByTenant(user.tenantId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Propiedades"
        description={`${result.total} ${result.total === 1 ? "propiedad" : "propiedades"}`}
      >
        <div className="flex gap-2">
          <Link
            href="/dashboard/propiedades/importar"
            className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Importar CSV
          </Link>
          <Link
            href="/dashboard/propiedades/nueva"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva propiedad
          </Link>
        </div>
      </PageHeader>

      {result.properties.length > 0 ? (
        <DataTable>
          <DataTableHeader>
            <DataTableHead>Propiedad</DataTableHead>
            <DataTableHead className="hidden md:table-cell">Tipo</DataTableHead>
            <DataTableHead className="hidden sm:table-cell">Precio</DataTableHead>
            <DataTableHead>Estado</DataTableHead>
            <DataTableHead className="text-right">Acciones</DataTableHead>
          </DataTableHeader>
          <DataTableBody>
            {(result.properties as { id: string; title: string; city: string | null; type: string; operation: string; price: unknown; currency: string; status: string; slug: string; images: { url: string }[] }[]).map((property) => (
              <DataTableRow key={property.id}>
                <DataTableCell>
                  <div className="flex items-center gap-3">
                    {property.images[0] ? (
                      <Image
                        src={property.images[0].url}
                        alt={property.title}
                        width={56}
                        height={40}
                        className="h-10 w-14 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                        Sin img
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate max-w-[250px]">{property.title}</div>
                      <div className="text-xs text-muted-foreground">{property.city}</div>
                    </div>
                  </div>
                </DataTableCell>
                <DataTableCell className="hidden md:table-cell">
                  <div className="text-sm text-foreground">{PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS]}</div>
                  <div className="text-xs text-muted-foreground">{OPERATION_TYPE_LABELS[property.operation as keyof typeof OPERATION_TYPE_LABELS]}</div>
                </DataTableCell>
                <DataTableCell className="hidden sm:table-cell">
                  <div className="text-sm font-medium text-foreground">
                    {formatPrice(Number(property.price), property.currency)}
                  </div>
                </DataTableCell>
                <DataTableCell>
                  <StatusBadge status={property.status} config={PROPERTY_STATUS_CONFIG} />
                </DataTableCell>
                <DataTableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/propiedades/${property.slug}`} target="_blank" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Ver en sitio">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link href={`/dashboard/propiedades/${property.id}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Editar">
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </div>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm">
          <EmptyState
            icon={<Building2 className="h-12 w-12" />}
            title="Sin propiedades"
            description="Cargá tu primera propiedad para que aparezca en tu web"
            action={
              <Link
                href="/dashboard/propiedades/nueva"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" /> Cargar propiedad
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
