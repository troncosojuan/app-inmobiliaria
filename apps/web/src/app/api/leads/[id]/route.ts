import { NextResponse } from "next/server";
import { LeadService, updateLeadSchema } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantUser, validateBody } from "@/lib/api-helpers";

export const PATCH = apiHandler(async (request, { params }) => {
  const user = await requireTenantUser();
  const { id } = await params;
  const body = await request.json();
  const data = validateBody(updateLeadSchema, body);

  if (data.status) await LeadService.updateStatus(user.tenantId, id, data.status);
  if (data.notes !== undefined) await LeadService.addNote(user.tenantId, id, data.notes);
  if (data.assignedToId !== undefined) await LeadService.assignAgent(user.tenantId, id, data.assignedToId);

  const updated = await LeadService.getById(user.tenantId, id);
  return NextResponse.json(updated);
});
