import { PageHeader, FeatureGate } from "@app-inmobiliaria/ui";
import { FeatureGateService } from "@app-inmobiliaria/api";
import { requireAuth } from "@/lib/auth";
import { WebhookManager } from "@/components/dashboard/webhook-manager";

export const metadata = { title: "Webhooks" };

export default async function WebhooksPage() {
  const user = await requireAuth();
  const hasCrm = await FeatureGateService.checkFeature(user.tenantId, "crm");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Webhooks"
        description="Configurá notificaciones HTTP automáticas cuando ocurren eventos en tu inmobiliaria"
      />
      <FeatureGate enabled={hasCrm} featureName="CRM completo">
        <WebhookManager />
      </FeatureGate>
    </div>
  );
}
