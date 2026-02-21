import { NextResponse } from "next/server";
import { CrmService, createActivitySchema } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantUser, validateBody } from "@/lib/api-helpers";

export const GET = apiHandler(async (_request, { params }) => {
  const user = await requireTenantUser();
  const { id } = await params;
  const activities = await CrmService.getActivitiesByLead(user.tenantId, id);
  return NextResponse.json(activities);
});

export const POST = apiHandler(async (request, { params }) => {
  const user = await requireTenantUser();
  const { id } = await params;
  const body = await request.json();
  const data = validateBody(createActivitySchema, body);
  const activity = await CrmService.createActivity(user.tenantId, user.id, {
    leadId: id,
    ...data,
  });
  return NextResponse.json(activity, { status: 201 });
});
