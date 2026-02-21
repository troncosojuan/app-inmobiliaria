import { NextResponse } from "next/server";
import { TenantService } from "@app-inmobiliaria/api";
import { apiHandler, requirePlatformAdmin } from "@/lib/api-helpers";

export const GET = apiHandler(async () => {
  await requirePlatformAdmin();
  const stats = await TenantService.getStats();
  return NextResponse.json(stats);
});
