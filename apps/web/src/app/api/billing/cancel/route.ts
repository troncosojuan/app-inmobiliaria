import { NextResponse } from "next/server";
import { BillingService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const POST = apiHandler(async () => {
  const user = await requireTenantAdmin();
  const result = await BillingService.cancelSubscription(user.tenantId);
  return NextResponse.json(result);
});
