import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { PropertyService } from "@app-inmobiliaria/api";
import { PropertyEditForm } from "@/components/dashboard/property-edit-form";
import { PageHeader } from "@app-inmobiliaria/ui";
import type { PropertyBase } from "@app-inmobiliaria/types";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [user, { id }] = await Promise.all([requireAuth(), params]);
  const property = await PropertyService.getById(user.tenantId, id);
  if (!property) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Editar propiedad" description={property.title} />
      <PropertyEditForm property={property as unknown as PropertyBase & { _count?: { leads: number } }} />
    </div>
  );
}
