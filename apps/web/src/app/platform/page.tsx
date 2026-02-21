import { PlanService, serializePlans } from "@app-inmobiliaria/api";
import { LandingClient } from "@/components/platform/landing-client";

export default async function PlatformLandingPage() {
  const rawPlans = await PlanService.getAll();
  const plans = serializePlans(rawPlans as Record<string, unknown>[]);

  return <LandingClient plans={plans} />;
}
