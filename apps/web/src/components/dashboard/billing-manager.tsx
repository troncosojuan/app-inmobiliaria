"use client";

import { useState } from "react";
import {
  CreditCard, Check, ArrowUpRight, AlertTriangle,
  Clock, Loader2, Shield, X,
} from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  maxProperties: number;
  maxUsers: number;
  analytics: boolean;
  aiFeatures: boolean;
  crm: boolean;
  customPages: boolean;
  customDomain: boolean;
  bulkUpload: boolean;
  seoAdvanced: boolean;
  prioritySupport: boolean;
}

interface BillingManagerProps {
  currentPlan: { id: string; name: string; slug: string; price: number; currency: string } | null;
  plans: Plan[];
  subscriptionStatus: string;
  trialEndsAt: string | null;
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    amount: number | null;
    currency: string;
  } | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  ACTIVE: { label: "Activa", color: "text-green-600 bg-green-50 dark:bg-green-950/30", icon: Check },
  TRIAL: { label: "Período de prueba", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30", icon: Clock },
  PAST_DUE: { label: "Pago pendiente", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30", icon: AlertTriangle },
  CANCELLED: { label: "Cancelada", color: "text-red-600 bg-red-50 dark:bg-red-950/30", icon: X },
  PENDING: { label: "Pendiente de activación", color: "text-slate-600 bg-slate-50 dark:bg-slate-800", icon: Clock },
  NONE: { label: "Sin suscripción", color: "text-slate-500 bg-slate-50 dark:bg-slate-800", icon: CreditCard },
};

export function BillingManager({
  currentPlan,
  plans,
  subscriptionStatus,
  trialEndsAt,
  subscription,
}: BillingManagerProps) {
  const [changingPlan, setChangingPlan] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const statusInfo = STATUS_CONFIG[subscriptionStatus] || STATUS_CONFIG.NONE;
  const StatusIcon = statusInfo.icon;

  const handleChangePlan = async (planId: string) => {
    if (planId === currentPlan?.id) return;
    setChangingPlan(planId);
    try {
      const res = await fetch("/api/billing/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      if (!res.ok) throw new Error("Error al cambiar plan");
      toast.success("Plan actualizado correctamente");
      window.location.reload();
    } catch {
      toast.error("No se pudo cambiar el plan");
    } finally {
      setChangingPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("¿Estás seguro de que querés cancelar tu suscripción?")) return;
    setCancelling(true);
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST" });
      if (!res.ok) throw new Error("Error al cancelar");
      toast.success("Suscripción cancelada. Se mantendrá activa hasta el fin del período.");
      window.location.reload();
    } catch {
      toast.error("No se pudo cancelar la suscripción");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Current subscription info */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Tu plan actual</h3>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-bold">{currentPlan?.name || "Sin plan"}</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusInfo.color}`}>
                <StatusIcon className="h-3 w-3" />
                {statusInfo.label}
              </span>
            </div>

            {currentPlan && currentPlan.price > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                ${currentPlan.price.toLocaleString("es-AR")} {currentPlan.currency}/mes
              </p>
            )}

            {trialEndsAt && subscriptionStatus === "TRIAL" && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-blue-600">
                <Clock className="h-4 w-4" />
                Trial termina el {formatDate(trialEndsAt)}
              </p>
            )}

            {subscription?.cancelAtPeriodEnd && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                Se cancelará el {formatDate(subscription.currentPeriodEnd)}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {subscription && !subscription.cancelAtPeriodEnd && subscriptionStatus !== "CANCELLED" && subscriptionStatus !== "NONE" && currentPlan && currentPlan.price > 0 && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:hover:bg-red-950/30"
              >
                {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                Cancelar suscripción
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stripe integration notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div>
          <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Pagos seguros con Stripe</p>
          <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
            Los pagos se procesan de forma segura a través de Stripe. Tu información financiera nunca se almacena en nuestros servidores.
          </p>
        </div>
      </div>

      {/* Plan comparison */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Cambiar de plan</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan?.id;
            const isUpgrade = currentPlan ? plan.price > currentPlan.price : false;

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-5 transition ${
                  isCurrent
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    Plan actual
                  </span>
                )}

                <h4 className="font-semibold text-foreground">{plan.name}</h4>
                <div className="mt-2">
                  {plan.price === 0 ? (
                    <span className="text-2xl font-bold text-foreground">Gratis</span>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-foreground">${plan.price.toLocaleString("es-AR")}</span>
                      <span className="text-sm text-muted-foreground">/{plan.currency}/mes</span>
                    </>
                  )}
                </div>

                <ul className="mt-4 space-y-1.5">
                  <PlanFeature>{plan.maxProperties} propiedades</PlanFeature>
                  <PlanFeature>{plan.maxUsers} usuarios</PlanFeature>
                  {plan.analytics && <PlanFeature>Analytics</PlanFeature>}
                  {plan.crm && <PlanFeature>CRM completo</PlanFeature>}
                  {plan.customPages && <PlanFeature>Páginas custom</PlanFeature>}
                  {plan.aiFeatures && <PlanFeature>IA / Chatbot</PlanFeature>}
                  {plan.customDomain && <PlanFeature>Dominio propio</PlanFeature>}
                  {plan.prioritySupport && <PlanFeature>Soporte prioritario</PlanFeature>}
                </ul>

                <button
                  onClick={() => handleChangePlan(plan.id)}
                  disabled={isCurrent || changingPlan === plan.id}
                  className={`mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition ${
                    isCurrent
                      ? "cursor-default border border-primary/20 text-primary"
                      : isUpgrade
                        ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                        : "border border-border text-foreground hover:bg-muted"
                  } disabled:opacity-50`}
                >
                  {changingPlan === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrent ? (
                    <>
                      <Check className="h-4 w-4" /> Plan actual
                    </>
                  ) : isUpgrade ? (
                    <>
                      <ArrowUpRight className="h-4 w-4" /> Mejorar plan
                    </>
                  ) : (
                    "Cambiar a este plan"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlanFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Check className="h-3 w-3 shrink-0 text-primary" />
      {children}
    </li>
  );
}
