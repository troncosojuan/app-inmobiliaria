import { NextResponse } from "next/server";
import { TenantService, updateTenantSchema } from "@app-inmobiliaria/api";
import { apiHandler, requirePlatformAdmin, validateBody } from "@/lib/api-helpers";

export const GET = apiHandler(async (_request, { params }) => {
  await requirePlatformAdmin();
  const { id } = await params;
  const tenant = await TenantService.getById(id);
  if (!tenant) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(tenant);
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requirePlatformAdmin();
  const { id } = await params;
  const body = await request.json();
  const data = validateBody(updateTenantSchema, body);
  const tenant = await TenantService.update(id, data as Record<string, unknown>);
  return NextResponse.json(tenant);
});

export const DELETE = apiHandler(async (_request, { params }) => {
  await requirePlatformAdmin();
  const { id } = await params;
  await TenantService.toggleActive(id);
  return NextResponse.json({ success: true });
});
