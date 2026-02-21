import { NextResponse } from "next/server";
import { CrmService, updateTaskStatusSchema } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantUser, validateBody } from "@/lib/api-helpers";

export const PATCH = apiHandler(async (request, { params }) => {
  const user = await requireTenantUser();
  const { id } = await params;
  const body = await request.json();
  const { status } = validateBody(updateTaskStatusSchema, body);
  const task = await CrmService.updateTaskStatus(user.tenantId, user.id, id, status);
  return NextResponse.json(task);
});

export const DELETE = apiHandler(async (_request, { params }) => {
  const user = await requireTenantUser();
  const { id } = await params;
  await CrmService.deleteTask(user.tenantId, id);
  return NextResponse.json({ success: true });
});
