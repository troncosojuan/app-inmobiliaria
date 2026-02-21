import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";

export class PlanService {
  static async getAll() {
    const plans = await prisma.plan.findMany({
      include: { _count: { select: { tenants: true } } },
      orderBy: { price: "asc" },
    });
    return serialize(plans);
  }

  static async getById(id: string) {
    const plan = await prisma.plan.findUnique({
      where: { id },
      include: { _count: { select: { tenants: true } } },
    });
    return plan ? serialize(plan) : null;
  }

  static async changeTenantPlan(tenantId: string, planId: string) {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new Error("Plan no encontrado");

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new Error("Tenant no encontrado");

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { planId },
      include: { plan: true },
    });
    return serialize(updated);
  }
}
