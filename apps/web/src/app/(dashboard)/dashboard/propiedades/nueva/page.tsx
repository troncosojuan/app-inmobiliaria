import { requireAuth } from "@/lib/auth";
import { PropertyForm } from "@/components/dashboard/property-form";
import { PageHeader } from "@app-inmobiliaria/ui";

export default async function NuevaPropertyPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nueva propiedad"
        description="Cargá los datos de la propiedad paso a paso"
      />
      <PropertyForm />
    </div>
  );
}
