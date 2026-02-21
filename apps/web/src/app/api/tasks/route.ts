import { NextRequest, NextResponse } from "next/server";
import { CrmService, createTaskSchema } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantUser, validateBody } from "@/lib/api-helpers";

export const GET = apiHandler(async (request: NextRequest) => {
  const user = await requireTenantUser();
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") || undefined;
  const assignedToId = searchParams.get("assignedToId") || undefined;

  const tasks = await CrmService.getTasksByTenant(user.tenantId, { status, assignedToId });
  return NextResponse.json(tasks);
});

export const POST = apiHandler(async (request) => {
  const user = await requireTenantUser();
  const body = await request.json();
  const data = validateBody(createTaskSchema, body);
  const task = await CrmService.createTask(user.tenantId, user.id, data);
  return NextResponse.json(task, { status: 201 });
});
