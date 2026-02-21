import { requireAuth } from "@/lib/auth";
import { BillingService, PlanService, serializePlans } from "@app-inmobiliaria/api";
import { PageHeader } from "@app-inmobiliaria/ui";
import { BillingManager } from "@/components/dashboard/billing-manager";

export default async function BillingPage() {
  const user = await requireAuth();

  const [summary, rawPlans] = await Promise.all([
    BillingService.getTenantBillingSummary(user.tenantId),
    PlanService.getAll(),
  ]);

  const plans = serializePlans(rawPlans as Record<string, unknown>[]);

  const currentPlan = summary.plan ? {
    id: summary.plan.id,
    name: summary.plan.name,
    slug: summary.plan.slug,
    price: Number(summary.plan.price),
    currency: summary.plan.currency,
  } : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Facturación" description="Gestioná tu plan y suscripción" />
      <BillingManager
        currentPlan={currentPlan}
        plans={plans}
        subscriptionStatus={summary.subscriptionStatus}
        trialEndsAt={summary.trialEndsAt ? String(summary.trialEndsAt) : null}
        subscription={summary.subscription ? {
          status: summary.subscription.status,
          currentPeriodEnd: summary.subscription.currentPeriodEnd ? String(summary.subscription.currentPeriodEnd) : null,
          cancelAtPeriodEnd: summary.subscription.cancelAtPeriodEnd,
          amount: summary.subscription.amount ? Number(summary.subscription.amount) : null,
          currency: summary.subscription.currency,
        } : null}
      />
    </div>
  );
}
