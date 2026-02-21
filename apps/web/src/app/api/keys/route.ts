import { NextResponse } from "next/server";
import { ApiKeyService, createApiKeySchema } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin, validateBody } from "@/lib/api-helpers";

export const GET = apiHandler(async () => {
  const user = await requireTenantAdmin();
  const keys = await ApiKeyService.getByTenant(user.tenantId);
  return NextResponse.json(keys);
});

export const POST = apiHandler(async (request) => {
  const user = await requireTenantAdmin();
  const body = await request.json();
  const { name } = validateBody(createApiKeySchema, body);
  const key = await ApiKeyService.create(user.tenantId, name);
  return NextResponse.json(key, { status: 201 });
});
