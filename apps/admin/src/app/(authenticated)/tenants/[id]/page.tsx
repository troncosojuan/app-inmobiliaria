import { notFound } from "next/navigation";
import { TenantService } from "@app-inmobiliaria/api";
import { prisma } from "@app-inmobiliaria/db";
import { EditTenantForm } from "@/components/tenants/edit-tenant-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTenantPage({ params }: Props) {
  const { id } = await params;

  const [tenant, plans] = await Promise.all([
    TenantService.getById(id),
    prisma.plan.findMany({
      select: { id: true, name: true, slug: true, price: true, maxProperties: true },
      orderBy: { price: "asc" },
    }),
  ]);

  if (!tenant) return notFound();

  const serializedPlans = plans.map((p) => ({ ...p, price: Number(p.price) }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/tenants"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a inmobiliarias
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{tenant.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Editá los datos, colores y plan de esta inmobiliaria
        </p>
      </div>
      <EditTenantForm tenant={tenant} plans={serializedPlans} />
    </div>
  );
}
