import { NextResponse } from "next/server";
import { CustomPageService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const PATCH = apiHandler(async (_request, { params }) => {
  const user = await requireTenantAdmin();
  const { id } = await params;
  const page = await CustomPageService.togglePublish(user.tenantId, id);
  return NextResponse.json(page);
});
