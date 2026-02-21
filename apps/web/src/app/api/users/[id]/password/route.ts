import { NextResponse } from "next/server";
import { UserService, changePasswordSchema } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantUser, validateBody } from "@/lib/api-helpers";

export const PATCH = apiHandler(async (request, { params }) => {
  const user = await requireTenantUser();
  const { id } = await params;

  if (user.id !== id && user.role !== "TENANT_ADMIN" && user.role !== "PLATFORM_ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const data = validateBody(changePasswordSchema, body);
  const result = await UserService.changePassword(id, data);
  return NextResponse.json(result);
});
