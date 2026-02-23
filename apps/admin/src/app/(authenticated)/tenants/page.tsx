import { TenantService } from "@app-inmobiliaria/api";
import { BADGE_COLORS, DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableHead, DataTableCell } from "@app-inmobiliaria/ui";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TenantsPage() {
  const tenants = await TenantService.getAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inmobiliarias</h1>
          <p className="mt-1 text-sm text-muted-foreground">{tenants.length} registradas</p>
        </div>
        <Link
          href="/tenants/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva inmobiliaria
        </Link>
      </div>

      <DataTable>
        <DataTableHeader>
          <DataTableHead>Inmobiliaria</DataTableHead>
          <DataTableHead>Plan</DataTableHead>
          <DataTableHead>Propiedades</DataTableHead>
          <DataTableHead>Usuarios</DataTableHead>
          <DataTableHead>Consultas</DataTableHead>
          <DataTableHead>Estado</DataTableHead>
          <DataTableHead />
        </DataTableHeader>
        <DataTableBody>
          {tenants.map((tenant) => (
            <DataTableRow key={tenant.id}>
              <DataTableCell>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: tenant.primaryColor }}
                  >
                    {tenant.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{tenant.name}</div>
                    <div className="text-xs text-muted-foreground">{tenant.slug}</div>
                  </div>
                </div>
              </DataTableCell>
              <DataTableCell>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  tenant.plan.slug === "premium" ? BADGE_COLORS.violet :
                  tenant.plan.slug === "profesional" ? BADGE_COLORS.blue :
                  BADGE_COLORS.slate
                }`}>
                  {tenant.plan.name}
                </span>
              </DataTableCell>
              <DataTableCell className="text-sm text-muted-foreground">{tenant._count.properties}</DataTableCell>
              <DataTableCell className="text-sm text-muted-foreground">{tenant._count.users}</DataTableCell>
              <DataTableCell className="text-sm text-muted-foreground">{tenant._count.leads}</DataTableCell>
              <DataTableCell>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  tenant.isActive ? BADGE_COLORS.emerald : BADGE_COLORS.red
                }`}>
                  {tenant.isActive ? "Activa" : "Inactiva"}
                </span>
              </DataTableCell>
              <DataTableCell>
                <div className="flex items-center gap-2">
                  <Link href={`/tenants/${tenant.id}`} className="rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                    Editar
                  </Link>
                  <a
                    href={process.env.PLATFORM_DOMAIN
                      ? `https://${tenant.slug}.${process.env.PLATFORM_DOMAIN}`
                      : `http://localhost:3000?tenant=${tenant.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
      {tenants.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">No hay inmobiliarias registradas</div>
      )}
    </div>
  );
}
