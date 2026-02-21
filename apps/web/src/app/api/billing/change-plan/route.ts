import { NextResponse } from "next/server";
import { BillingService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const POST = apiHandler(async (request) => {
  const user = await requireTenantAdmin();
  const { planId } = await request.json();

  if (!planId) {
    return NextResponse.json({ error: "Plan requerido" }, { status: 400 });
  }

  const subscription = await BillingService.changePlan(user.tenantId, planId);
  return NextResponse.json(subscription);
});
