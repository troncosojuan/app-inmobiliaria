import { PlanService, serializePlans } from "@app-inmobiliaria/api";
import { RegisterWizard } from "@/components/platform/register-wizard";

export const metadata = {
  title: "Registrate - InmoPlatform",
  description: "Creá tu sitio web inmobiliario en minutos. Registro gratuito.",
};

export default async function RegisterPage() {
  const rawPlans = await PlanService.getAll();
  const plans = serializePlans(rawPlans as Record<string, unknown>[]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <RegisterWizard plans={plans} />
    </div>
  );
}
