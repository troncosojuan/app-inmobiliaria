import { NextResponse } from "next/server";
import { TenantService } from "@app-inmobiliaria/api";
import { apiHandler, requirePlatformAdmin } from "@/lib/api-helpers";

export const POST = apiHandler(async (_request, { params }) => {
  await requirePlatformAdmin();
  const { id } = await params;
  const tenant = await TenantService.toggleActive(id);
  return NextResponse.json(tenant);
});
