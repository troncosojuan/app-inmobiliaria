import { NextResponse } from "next/server";
import { PropertyService, createPropertySchema } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantUser, validateBody } from "@/lib/api-helpers";

export const POST = apiHandler(async (request) => {
  const user = await requireTenantUser();
  const body = await request.json();
  const data = validateBody(createPropertySchema, body);
  const property = await PropertyService.create(user.tenantId, user.id, data);
  return NextResponse.json(property, { status: 201 });
});
