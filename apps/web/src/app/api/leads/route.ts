import { LeadService, createLeadSchema, EmailService, TenantService } from "@app-inmobiliaria/api";
import { prisma } from "@app-inmobiliaria/db";
import { NextResponse } from "next/server";
import { apiHandler, validateBody } from "@/lib/api-helpers";
import { withRateLimit } from "@/lib/rate-limit";

const leadsHandler = apiHandler(async (request) => {
  const body = await request.json();
  const data = validateBody(createLeadSchema, body);
  const lead = await LeadService.create(data);

  sendLeadNotifications(data, lead.id).catch(() => {});

  return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
});

export const POST = withRateLimit(leadsHandler, { limit: 10, windowMs: 60_000 });

async function sendLeadNotifications(
  data: { tenantId: string; name: string; email: string; phone?: string | null; message?: string | null; propertyId?: string | null },
  _leadId: string,
) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: data.tenantId },
    select: { name: true, email: true, phone: true },
  });
  if (!tenant) return;

  let propertyTitle = "Consulta general";
  if (data.propertyId) {
    const prop = await prisma.property.findUnique({
      where: { id: data.propertyId },
      select: { title: true },
    });
    if (prop) propertyTitle = prop.title;
  }

  await EmailService.notifyNewLead({
    agentEmail: tenant.email,
    agentName: tenant.name,
    tenantName: tenant.name,
    leadName: data.name,
    leadEmail: data.email,
    leadPhone: data.phone ?? undefined,
    leadMessage: data.message ?? undefined,
    propertyTitle,
  });

  await EmailService.confirmLeadToVisitor({
    visitorEmail: data.email,
    visitorName: data.name,
    tenantName: tenant.name,
    tenantPhone: tenant.phone ?? undefined,
    propertyTitle,
  });
}
