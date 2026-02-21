import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";

export class BillingService {
  static async getSubscription(tenantId: string) {
    const sub = await prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      include: {
        plan: { select: { id: true, name: true, slug: true, price: true, currency: true } },
      },
    });
    return sub ? serialize(sub) : null;
  }

  static async createSubscription(tenantId: string, planId: string) {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new Error("Plan no encontrado");

    const now = new Date();
    const trialEnd = plan.trialDays > 0
      ? new Date(now.getTime() + plan.trialDays * 24 * 60 * 60 * 1000)
      : null;

    const sub = await prisma.subscription.create({
      data: {
        tenantId,
        planId,
        status: trialEnd ? "TRIAL" : Number(plan.price) === 0 ? "ACTIVE" : "PENDING",
        amount: plan.price,
        currency: plan.currency,
        currentPeriodStart: now,
        currentPeriodEnd: trialEnd || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
      include: { plan: true },
    });

    if (trialEnd) {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { trialEndsAt: trialEnd, subscriptionStatus: "TRIAL" },
      });
    }

    return serialize(sub);
  }

  static async changePlan(tenantId: string, newPlanId: string) {
    const plan = await prisma.plan.findUnique({ where: { id: newPlanId } });
    if (!plan) throw new Error("Plan no encontrado");

    const existing = await prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      const updated = await prisma.subscription.update({
        where: { id: existing.id },
        data: { planId: newPlanId, amount: plan.price, currency: plan.currency },
        include: { plan: true },
      });

      await prisma.tenant.update({
        where: { id: tenantId },
        data: { planId: newPlanId },
      });

      return serialize(updated);
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: { planId: newPlanId },
    });

    return this.createSubscription(tenantId, newPlanId);
  }

  static async cancelSubscription(tenantId: string) {
    const sub = await prisma.subscription.findFirst({
      where: { tenantId, status: { not: "CANCELLED" } },
      orderBy: { createdAt: "desc" },
    });

    if (!sub) throw new Error("No hay suscripción activa");

    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data: { cancelAtPeriodEnd: true },
    });

    return serialize(updated);
  }

  static async syncStripeWebhook(data: {
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  }) {
    const sub = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: data.stripeSubscriptionId },
    });

    if (!sub) return null;

    const statusMap: Record<string, string> = {
      active: "ACTIVE",
      past_due: "PAST_DUE",
      canceled: "CANCELLED",
      unpaid: "UNPAID",
      trialing: "TRIAL",
    };

    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: statusMap[data.status] || data.status.toUpperCase(),
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      },
    });

    await prisma.tenant.update({
      where: { id: sub.tenantId },
      data: {
        stripeCustomerId: data.stripeCustomerId,
        subscriptionStatus: statusMap[data.status] || data.status.toUpperCase(),
        subscriptionStartDate: data.currentPeriodStart,
        subscriptionEndDate: data.currentPeriodEnd,
      },
    });

    return serialize(updated);
  }

  static async getBillingHistory(tenantId: string) {
    const subs = await prisma.subscription.findMany({
      where: { tenantId },
      include: { plan: { select: { name: true, price: true, currency: true } } },
      orderBy: { createdAt: "desc" },
    });
    return serialize(subs);
  }

  static async getTenantBillingSummary(tenantId: string) {
    const [subscription, tenant] = await Promise.all([
      prisma.subscription.findFirst({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        include: { plan: true },
      }),
      prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { plan: true },
      }),
    ]);

    return serialize({
      subscription,
      plan: tenant?.plan,
      stripeCustomerId: tenant?.stripeCustomerId,
      subscriptionStatus: tenant?.subscriptionStatus || (subscription?.status ?? "NONE"),
      trialEndsAt: tenant?.trialEndsAt,
    });
  }
}
