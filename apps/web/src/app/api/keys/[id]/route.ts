import { NextResponse } from "next/server";
import { ApiKeyService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const DELETE = apiHandler(async (_request, { params }) => {
  const user = await requireTenantAdmin();
  const { id } = await params;
  await ApiKeyService.delete(user.tenantId, id);
  return NextResponse.json({ success: true });
});
