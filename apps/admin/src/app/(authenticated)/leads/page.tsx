import { LeadService } from "@app-inmobiliaria/api";
import { BADGE_COLORS, DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableHead, DataTableCell } from "@app-inmobiliaria/ui";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW: { label: "Nueva", color: BADGE_COLORS.blue },
  CONTACTED: { label: "Contactada", color: BADGE_COLORS.amber },
  QUALIFIED: { label: "Calificada", color: BADGE_COLORS.violet },
  CONVERTED: { label: "Convertida", color: BADGE_COLORS.emerald },
  LOST: { label: "Perdida", color: BADGE_COLORS.red },
};

export default async function LeadsPage() {
  const leads = await LeadService.getAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Consultas</h1>
        <p className="mt-1 text-sm text-muted-foreground">{leads.length} consultas recibidas</p>
      </div>

      <DataTable>
        <DataTableHeader>
          <DataTableHead>Contacto</DataTableHead>
          <DataTableHead>Inmobiliaria</DataTableHead>
          <DataTableHead>Propiedad</DataTableHead>
          <DataTableHead>Estado</DataTableHead>
          <DataTableHead>Fecha</DataTableHead>
        </DataTableHeader>
        <DataTableBody>
          {leads.map((lead) => {
            const statusInfo = STATUS_LABELS[lead.status] || STATUS_LABELS.NEW;
            return (
              <DataTableRow key={lead.id}>
                <DataTableCell>
                  <div className="text-sm font-medium text-foreground">{lead.name}</div>
                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                  {lead.phone && <div className="text-xs text-muted-foreground">{lead.phone}</div>}
                </DataTableCell>
                <DataTableCell className="text-sm text-muted-foreground">{lead.tenant.name}</DataTableCell>
                <DataTableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {lead.property?.title || "General"}
                </DataTableCell>
                <DataTableCell>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </DataTableCell>
                <DataTableCell className="text-sm text-muted-foreground">
                  {new Date(lead.createdAt).toLocaleDateString("es-AR", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </DataTableCell>
              </DataTableRow>
            );
          })}
        </DataTableBody>
      </DataTable>
      {leads.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">No hay consultas aún</div>
      )}
    </div>
  );
}
