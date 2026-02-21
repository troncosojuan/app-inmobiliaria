import { requireAuth } from "@/lib/auth";
import { CustomPageService, FeatureGateService } from "@app-inmobiliaria/api";
import { PageHeader, FeatureGate } from "@app-inmobiliaria/ui";
import { PagesManager } from "@/components/dashboard/pages-manager";

export const dynamic = "force-dynamic";

export default async function PagesPage() {
  const user = await requireAuth();

  const [pages, hasCustomPages] = await Promise.all([
    CustomPageService.getByTenant(user.tenantId),
    FeatureGateService.checkFeature(user.tenantId, "customPages"),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Páginas"
        description="Creá y editá páginas estáticas para tu sitio (Nosotros, Servicios, etc.)"
      />
      <FeatureGate enabled={hasCustomPages} featureName="Páginas personalizadas">
        <PagesManager pages={pages as any[]} />
      </FeatureGate>
    </div>
  );
}
