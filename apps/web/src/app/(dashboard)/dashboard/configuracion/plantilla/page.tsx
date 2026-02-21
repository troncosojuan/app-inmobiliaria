import { getTenant } from "@/lib/tenant";
import { notFound } from "next/navigation";
import { PageHeader } from "@app-inmobiliaria/ui";
import { TemplateSelector } from "@/components/dashboard/template-selector";

export const metadata = { title: "Plantilla del sitio" };

export default async function TemplatePage() {
  const tenant = await getTenant();
  if (!tenant) return notFound();

  const currentTemplate = (tenant as { templateSlug?: string }).templateSlug || "modern";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plantilla del sitio"
        description="Elegí el estilo visual de la página principal de tu inmobiliaria"
      />
      <TemplateSelector
        currentTemplate={currentTemplate}
        primaryColor={tenant.primaryColor}
        secondaryColor={tenant.secondaryColor}
      />
    </div>
  );
}
