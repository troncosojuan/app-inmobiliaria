import { PropertyService } from "@app-inmobiliaria/api";
import { PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS, formatPrice } from "@app-inmobiliaria/types";
import { BADGE_COLORS, DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableHead, DataTableCell } from "@app-inmobiliaria/ui";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const properties = await PropertyService.getAllForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Propiedades</h1>
          <p className="mt-1 text-sm text-muted-foreground">Todas las propiedades de la plataforma</p>
        </div>
        <Link
          href="/properties/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva propiedad
        </Link>
      </div>

      <DataTable>
        <DataTableHeader>
          <DataTableHead>Propiedad</DataTableHead>
          <DataTableHead>Inmobiliaria</DataTableHead>
          <DataTableHead>Tipo</DataTableHead>
          <DataTableHead>Operación</DataTableHead>
          <DataTableHead>Precio</DataTableHead>
          <DataTableHead>Estado</DataTableHead>
        </DataTableHeader>
        <DataTableBody>
          {properties.map((property) => {
            const typeLabel = PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS];
            const opLabel = OPERATION_TYPE_LABELS[property.operation as keyof typeof OPERATION_TYPE_LABELS];
            const statusColor =
              property.status === "ACTIVE" ? BADGE_COLORS.emerald :
              property.status === "DRAFT" ? BADGE_COLORS.slate :
              property.status === "PAUSED" ? BADGE_COLORS.amber :
              BADGE_COLORS.blue;

            return (
              <DataTableRow key={property.id}>
                <DataTableCell>
                  <div className="flex items-center gap-3">
                    {property.images[0] ? (
                      <Image src={property.images[0].url} alt={property.title} width={56} height={40} className="h-10 w-14 rounded-md object-cover" />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">Sin img</div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-foreground line-clamp-1">{property.title}</div>
                      <div className="text-xs text-muted-foreground">{property.city}, {property.state}</div>
                    </div>
                  </div>
                </DataTableCell>
                <DataTableCell className="text-sm text-muted-foreground">{property.tenant.name}</DataTableCell>
                <DataTableCell className="text-sm text-muted-foreground">{typeLabel}</DataTableCell>
                <DataTableCell className="text-sm text-muted-foreground">{opLabel}</DataTableCell>
                <DataTableCell className="text-sm font-medium text-foreground">
                  {formatPrice(Number(property.price), property.currency)}
                </DataTableCell>
                <DataTableCell>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}>
                    {property.status}
                  </span>
                </DataTableCell>
              </DataTableRow>
            );
          })}
        </DataTableBody>
      </DataTable>
      {properties.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">No hay propiedades registradas</div>
      )}
    </div>
  );
}
