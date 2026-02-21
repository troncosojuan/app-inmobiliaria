import { NextResponse } from "next/server";
import { BillingService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const GET = apiHandler(async () => {
  const user = await requireTenantAdmin();
  const summary = await BillingService.getTenantBillingSummary(user.tenantId);
  return NextResponse.json(summary);
});
