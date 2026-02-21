import { NextResponse } from "next/server";
import { UserService, createUserSchema } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin, validateBody } from "@/lib/api-helpers";

export const GET = apiHandler(async () => {
  const user = await requireTenantAdmin();
  const users = await UserService.getByTenant(user.tenantId);
  return NextResponse.json(users);
});

export const POST = apiHandler(async (request) => {
  const user = await requireTenantAdmin();
  const body = await request.json();
  const data = validateBody(createUserSchema, body);
  const newUser = await UserService.create(user.tenantId, data);
  return NextResponse.json(newUser, { status: 201 });
});
