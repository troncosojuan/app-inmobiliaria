import { NextResponse } from "next/server";
import { UserService, updateUserSchema } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin, validateBody } from "@/lib/api-helpers";

export const GET = apiHandler(async (_request, { params }) => {
  const user = await requireTenantAdmin();
  const { id } = await params;
  const found = await UserService.getById(user.tenantId, id);
  if (!found) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(found);
});

export const PATCH = apiHandler(async (request, { params }) => {
  const user = await requireTenantAdmin();
  const { id } = await params;
  const body = await request.json();
  const data = validateBody(updateUserSchema, body);
  const updated = await UserService.update(user.tenantId, id, data);
  return NextResponse.json(updated);
});

export const DELETE = apiHandler(async (_request, { params }) => {
  const user = await requireTenantAdmin();
  const { id } = await params;
  await UserService.delete(user.tenantId, id);
  return NextResponse.json({ success: true });
});
