import { BulkImporter } from "@/components/dashboard/bulk-importer";
import { FeatureGateService } from "@app-inmobiliaria/api";
import { requireAuth } from "@/lib/auth";
import { FeatureGate } from "@app-inmobiliaria/ui";

export const metadata = { title: "Importar propiedades" };

export default async function ImportPropertiesPage() {
  const user = await requireAuth();
  const canBulkUpload = await FeatureGateService.checkFeature(user.tenantId, "bulkUpload");

  return (
    <FeatureGate enabled={canBulkUpload} featureName="Carga masiva">
      <BulkImporter />
    </FeatureGate>
  );
}
