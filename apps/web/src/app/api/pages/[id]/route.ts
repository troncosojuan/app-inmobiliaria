import { NextResponse } from "next/server";
import { CustomPageService, updateCustomPageSchema } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin, validateBody } from "@/lib/api-helpers";

export const GET = apiHandler(async (_request, { params }) => {
  const user = await requireTenantAdmin();
  const { id } = await params;
  const page = await CustomPageService.getById(user.tenantId, id);
  if (!page) return NextResponse.json({ error: "Página no encontrada" }, { status: 404 });
  return NextResponse.json(page);
});

export const PATCH = apiHandler(async (request, { params }) => {
  const user = await requireTenantAdmin();
  const { id } = await params;
  const body = await request.json();
  const data = validateBody(updateCustomPageSchema, body);
  const page = await CustomPageService.update(user.tenantId, id, data);
  return NextResponse.json(page);
});

export const DELETE = apiHandler(async (_request, { params }) => {
  const user = await requireTenantAdmin();
  const { id } = await params;
  await CustomPageService.delete(user.tenantId, id);
  return NextResponse.json({ success: true });
});
