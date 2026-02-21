import { requireAuth } from "@/lib/auth";
import { LeadService } from "@app-inmobiliaria/api";
import { PageHeader } from "@app-inmobiliaria/ui";
import { LeadsPipeline } from "@/components/dashboard/leads-pipeline";
import type { LeadBase } from "@app-inmobiliaria/types";

export const dynamic = "force-dynamic";

export default async function DashboardLeadsPage() {
  const user = await requireAuth();

  const leads = await LeadService.getByTenant(user.tenantId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline de leads"
        description="Gestioná tus consultas y seguí el proceso de cada lead"
      />
      <LeadsPipeline initialLeads={leads as unknown as LeadBase[]} />
    </div>
  );
}
