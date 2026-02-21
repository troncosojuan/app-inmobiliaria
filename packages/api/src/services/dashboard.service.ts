import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";

export class DashboardService {
  static async getTenantStats(tenantId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      activeProperties,
      totalProperties,
      featuredCount,
      leadsThisMonth,
      totalLeads,
      convertedLeads,
    ] = await Promise.all([
      prisma.property.count({ where: { tenantId, status: "ACTIVE" } }),
      prisma.property.count({ where: { tenantId } }),
      prisma.property.count({ where: { tenantId, isFeatured: true, status: "ACTIVE" } }),
      prisma.lead.count({ where: { tenantId, createdAt: { gte: startOfMonth } } }),
      prisma.lead.count({ where: { tenantId } }),
      prisma.lead.count({ where: { tenantId, status: "CONVERTED" } }),
    ]);

    const conversionRate = totalLeads > 0
      ? Math.round((convertedLeads / totalLeads) * 100)
      : 0;

    return {
      activeProperties,
      totalProperties,
      featuredCount,
      leadsThisMonth,
      totalLeads,
      convertedLeads,
      conversionRate,
    };
  }

  static async getRecentLeads(tenantId: string, limit = 5) {
    const leads = await prisma.lead.findMany({
      where: { tenantId },
      include: {
        property: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return serialize(leads);
  }

  static async getTopProperties(tenantId: string, limit = 5) {
    const properties = await prisma.property.findMany({
      where: { tenantId, status: "ACTIVE" },
      include: {
        _count: { select: { leads: true } },
        images: { take: 1, orderBy: { order: "asc" } },
      },
      orderBy: { leads: { _count: "desc" } },
      take: limit,
    });
    return serialize(properties);
  }
}
