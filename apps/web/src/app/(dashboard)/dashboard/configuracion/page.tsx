import { requireAuth } from "@/lib/auth";
import { getTenant } from "@/lib/tenant";
import { TenantConfigForm } from "@/components/dashboard/tenant-config-form";
import { PageHeader } from "@app-inmobiliaria/ui";
import type { TenantBase } from "@app-inmobiliaria/types";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const [, tenant] = await Promise.all([
    requireAuth(),
    getTenant(),
  ]);

  if (!tenant) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración"
        description="Personalizá tu inmobiliaria y tu sitio web"
      />
      <TenantConfigForm tenant={tenant as unknown as TenantBase} />
    </div>
  );
}
