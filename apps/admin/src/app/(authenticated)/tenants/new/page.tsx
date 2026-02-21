import { prisma } from "@app-inmobiliaria/db";
import { NewTenantForm } from "@/components/tenants/new-tenant-form";

export const dynamic = "force-dynamic";

export default async function NewTenantPage() {
  const plans = await prisma.plan.findMany({
    select: { id: true, name: true, slug: true, price: true, maxProperties: true },
    orderBy: { price: "asc" },
  });

  const serializedPlans = plans.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nueva inmobiliaria</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Creá una nueva inmobiliaria con su usuario administrador
        </p>
      </div>
      <NewTenantForm plans={serializedPlans} />
    </div>
  );
}
