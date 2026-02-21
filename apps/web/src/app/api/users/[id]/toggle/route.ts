import { NextResponse } from "next/server";
import { UserService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const POST = apiHandler(async (_request, { params }) => {
  const user = await requireTenantAdmin();
  const { id } = await params;
  const updated = await UserService.toggleActive(user.tenantId, id);
  return NextResponse.json(updated);
});
