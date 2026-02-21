import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";
import { ensureExists } from "../utils/service-helpers";
import { LEAD_STATUSES, type LeadStatus } from "../constants";
import type { CreateLeadInput } from "../validators/lead.validators";
import { WebhookService } from "./webhook.service";

export class LeadService {
  static async create(input: CreateLeadInput) {
    await ensureExists("tenant", { id: input.tenantId, isActive: true }, "Tenant no encontrado o inactivo");

    const lead = await prisma.lead.create({
      data: {
        tenantId: input.tenantId,
        propertyId: input.propertyId || null,
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        message: input.message || null,
        source: input.source || "website",
      },
    });

    WebhookService.dispatch(input.tenantId, "lead.created", {
      leadId: lead.id,
      name: input.name,
      email: input.email,
      propertyId: input.propertyId || null,
    }).catch(() => {});

    return serialize(lead);
  }

  static async getAll(limit = 100) {
    const leads = await prisma.lead.findMany({
      include: {
        tenant: { select: { name: true } },
        property: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return serialize(leads);
  }

  static async getRecent(limit = 5) {
    const leads = await prisma.lead.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        tenant: { select: { name: true } },
        property: { select: { title: true } },
      },
    });
    return serialize(leads);
  }

  static async getByTenant(tenantId: string, limit = 200) {
    const leads = await prisma.lead.findMany({
      where: { tenantId },
      include: {
        property: { select: { title: true, slug: true } },
        assignedTo: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return serialize(leads);
  }

  static async getById(tenantId: string, id: string) {
    const lead = await prisma.lead.findFirst({
      where: { id, tenantId },
      include: {
        property: { select: { title: true, slug: true } },
        assignedTo: { select: { name: true, email: true } },
      },
    });
    return lead ? serialize(lead) : null;
  }

  static async updateStatus(tenantId: string, id: string, status: string) {
    if (!LEAD_STATUSES.includes(status as LeadStatus)) {
      throw new Error(`Estado inválido: ${status}. Válidos: ${LEAD_STATUSES.join(", ")}`);
    }

    await ensureExists("lead", { id, tenantId }, "Lead no encontrado");
    const updated = await prisma.lead.update({
      where: { id },
      data: { status: status as LeadStatus },
    });
    return serialize(updated);
  }

  static async addNote(tenantId: string, id: string, notes: string) {
    await ensureExists("lead", { id, tenantId }, "Lead no encontrado");
    const updated = await prisma.lead.update({
      where: { id },
      data: { notes },
    });
    return serialize(updated);
  }

  static async assignAgent(tenantId: string, id: string, agentId: string | null) {
    await ensureExists("lead", { id, tenantId }, "Lead no encontrado");
    const updated = await prisma.lead.update({
      where: { id },
      data: { assignedToId: agentId },
    });
    return serialize(updated);
  }

  static async getStatsByTenant(tenantId: string) {
    const counts = await Promise.all(
      LEAD_STATUSES.map(async (status) => ({
        status,
        count: await prisma.lead.count({
          where: { tenantId, status },
        }),
      }))
    );
    return counts;
  }
}
