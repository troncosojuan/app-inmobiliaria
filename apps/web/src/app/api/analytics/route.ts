import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const GET = apiHandler(async (request: NextRequest) => {
  const user = await requireTenantAdmin();
  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get("days") || "30", 10);

  const data = await AnalyticsService.getOverview(user.tenantId, days);
  return NextResponse.json(data);
});
