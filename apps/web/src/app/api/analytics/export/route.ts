import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantUser } from "@/lib/api-helpers";

export const GET = apiHandler(async (request: NextRequest) => {
  const user = await requireTenantUser();

  const { searchParams } = request.nextUrl;
  const days = parseInt(searchParams.get("days") || "30", 10);

  const data = await AnalyticsService.getExportData(user.tenantId, days);
  return NextResponse.json(data);
});
