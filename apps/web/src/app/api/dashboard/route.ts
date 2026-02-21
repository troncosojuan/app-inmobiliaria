import { NextResponse } from "next/server";
import { DashboardService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantUser } from "@/lib/api-helpers";

export const GET = apiHandler(async () => {
  const user = await requireTenantUser();
  const stats = await DashboardService.getTenantStats(user.tenantId);
  return NextResponse.json(stats);
});
