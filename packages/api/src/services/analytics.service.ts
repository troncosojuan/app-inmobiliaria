import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";

export class AnalyticsService {
  static async trackView(data: {
    propertyId: string;
    tenantId: string;
    sessionId?: string;
    referrer?: string;
    userAgent?: string;
  }) {
    const view = await prisma.propertyView.create({ data });
    return serialize(view);
  }

  static async getOverview(tenantId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [
      totalViews,
      totalLeads,
      previousViews,
      previousLeads,
      viewsByDay,
      leadsByDay,
      topProperties,
      leadsByStatus,
    ] = await Promise.all([
      prisma.propertyView.count({
        where: { tenantId, viewedAt: { gte: since } },
      }),
      prisma.lead.count({
        where: { tenantId, createdAt: { gte: since } },
      }),
      prisma.propertyView.count({
        where: {
          tenantId,
          viewedAt: {
            gte: new Date(since.getTime() - days * 24 * 60 * 60 * 1000),
            lt: since,
          },
        },
      }),
      prisma.lead.count({
        where: {
          tenantId,
          createdAt: {
            gte: new Date(since.getTime() - days * 24 * 60 * 60 * 1000),
            lt: since,
          },
        },
      }),
      this.getViewsByDay(tenantId, since),
      this.getLeadsByDay(tenantId, since),
      this.getTopViewedProperties(tenantId, since, 5),
      this.getLeadsByStatus(tenantId),
    ]);

    const conversionRate = totalViews > 0
      ? Math.round((totalLeads / totalViews) * 10000) / 100
      : 0;

    const viewsChange = previousViews > 0
      ? Math.round(((totalViews - previousViews) / previousViews) * 100)
      : totalViews > 0 ? 100 : 0;

    const leadsChange = previousLeads > 0
      ? Math.round(((totalLeads - previousLeads) / previousLeads) * 100)
      : totalLeads > 0 ? 100 : 0;

    return {
      totalViews,
      totalLeads,
      conversionRate,
      viewsChange,
      leadsChange,
      viewsByDay,
      leadsByDay,
      topProperties,
      leadsByStatus,
    };
  }

  private static async getViewsByDay(tenantId: string, since: Date) {
    const views = await prisma.propertyView.findMany({
      where: { tenantId, viewedAt: { gte: since } },
      select: { viewedAt: true },
      orderBy: { viewedAt: "asc" },
    });

    const byDay: Record<string, number> = {};
    for (const v of views) {
      const day = v.viewedAt.toISOString().split("T")[0];
      byDay[day] = (byDay[day] || 0) + 1;
    }

    return Object.entries(byDay).map(([date, count]) => ({ date, count }));
  }

  private static async getLeadsByDay(tenantId: string, since: Date) {
    const leads = await prisma.lead.findMany({
      where: { tenantId, createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const byDay: Record<string, number> = {};
    for (const l of leads) {
      const day = l.createdAt.toISOString().split("T")[0];
      byDay[day] = (byDay[day] || 0) + 1;
    }

    return Object.entries(byDay).map(([date, count]) => ({ date, count }));
  }

  private static async getTopViewedProperties(tenantId: string, since: Date, limit: number) {
    const views = await prisma.propertyView.groupBy({
      by: ["propertyId"],
      where: { tenantId, viewedAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: limit,
    });

    if (views.length === 0) return [];

    const properties = await prisma.property.findMany({
      where: { id: { in: views.map((v) => v.propertyId) } },
      select: { id: true, title: true, slug: true, city: true, _count: { select: { leads: true } } },
    });

    const propMap = new Map(properties.map((p) => [p.id, p]));

    return serialize(views.map((v) => ({
      propertyId: v.propertyId,
      views: v._count.id,
      ...propMap.get(v.propertyId),
    })));
  }

  static async getExportData(tenantId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [properties, leads] = await Promise.all([
      prisma.property.findMany({
        where: { tenantId },
        select: {
          title: true, type: true, operation: true, status: true, price: true,
          currency: true, city: true, state: true, address: true, bedrooms: true,
          bathrooms: true, totalArea: true, isFeatured: true, createdAt: true,
          _count: { select: { leads: true, views: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.findMany({
        where: { tenantId, createdAt: { gte: since } },
        select: {
          name: true, email: true, phone: true, status: true, source: true,
          createdAt: true, property: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      properties: serialize(properties),
      leads: serialize(leads),
    };
  }

  private static async getLeadsByStatus(tenantId: string) {
    const statuses = ["NEW", "CONTACTED", "IN_VISIT", "OFFER", "CONVERTED", "LOST"] as const;
    const counts = await Promise.all(
      statuses.map(async (status) => ({
        status,
        count: await prisma.lead.count({ where: { tenantId, status } }),
      }))
    );
    return counts.filter((c) => c.count > 0);
  }
}
