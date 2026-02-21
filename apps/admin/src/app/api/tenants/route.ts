import { NextResponse } from "next/server";
import { TenantService, createTenantWithAdminSchema } from "@app-inmobiliaria/api";
import { apiHandler, requirePlatformAdmin, validateBody } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export const POST = apiHandler(async (request) => {
  await requirePlatformAdmin();
  const body = await request.json();
  const data = validateBody(createTenantWithAdminSchema, body);
  const tenant = await TenantService.create(data);
  return NextResponse.json(tenant, { status: 201 });
});

export const GET = apiHandler(async () => {
  await requirePlatformAdmin();
  const tenants = await TenantService.getAll();
  return NextResponse.json(tenants);
});
