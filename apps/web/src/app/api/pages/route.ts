import { NextResponse } from "next/server";
import { CustomPageService, createCustomPageSchema } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin, validateBody } from "@/lib/api-helpers";

export const GET = apiHandler(async () => {
  const user = await requireTenantAdmin();
  const pages = await CustomPageService.getByTenant(user.tenantId);
  return NextResponse.json(pages);
});

export const POST = apiHandler(async (request) => {
  const user = await requireTenantAdmin();
  const body = await request.json();
  const data = validateBody(createCustomPageSchema, body);
  const page = await CustomPageService.create(user.tenantId, data);
  return NextResponse.json(page, { status: 201 });
});
