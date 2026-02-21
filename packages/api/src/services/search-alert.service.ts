import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";
import { EmailService } from "./email.service";

interface AlertFilters {
  type?: string;
  operation?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}

export class SearchAlertService {
  static async create(tenantId: string, email: string, filters: AlertFilters) {
    const existing = await prisma.searchAlert.findFirst({
      where: { tenantId, email, isActive: true },
    });

    if (existing) {
      const updated = await prisma.searchAlert.update({
        where: { id: existing.id },
        data: { filters: JSON.stringify(filters) },
      });
      return serialize(updated);
    }

    const alert = await prisma.searchAlert.create({
      data: {
        tenantId,
        email,
        filters: JSON.stringify(filters),
      },
    });
    return serialize(alert);
  }

  static async getByTenant(tenantId: string) {
    const alerts = await prisma.searchAlert.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
    return alerts.map((a) => serialize(a));
  }

  static async unsubscribe(id: string) {
    await prisma.searchAlert.update({
      where: { id },
      data: { isActive: false },
    });
  }

  static async matchAndNotify(property: {
    id: string;
    tenantId: string;
    title: string;
    slug: string;
    type: string;
    operation: string;
    city: string | null;
    price: number;
    bedrooms: number | null;
  }) {
    const alerts = await prisma.searchAlert.findMany({
      where: { tenantId: property.tenantId, isActive: true },
    });

    const tenant = await prisma.tenant.findUnique({
      where: { id: property.tenantId },
      select: { name: true, slug: true, customDomain: true },
    });
    if (!tenant) return;

    const baseUrl = tenant.customDomain
      ? `https://${tenant.customDomain}`
      : `http://localhost:3000`;

    const matched = alerts.filter((alert) => {
      const filters: AlertFilters = JSON.parse(alert.filters);

      if (filters.type && filters.type !== property.type) return false;
      if (filters.operation && filters.operation !== property.operation) return false;
      if (filters.city && property.city && !property.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      if (filters.bedrooms && property.bedrooms && property.bedrooms < filters.bedrooms) return false;

      return true;
    });

    await Promise.allSettled(
      matched.map(async (alert) => {
        try {
          await EmailService.sendSearchAlert({
            email: alert.email,
            tenantName: tenant.name,
            propertyTitle: property.title,
            propertyUrl: `${baseUrl}/propiedades/${property.slug}`,
            unsubscribeUrl: `${baseUrl}/api/alerts/${alert.id}/unsubscribe`,
          });

          await prisma.searchAlert.update({
            where: { id: alert.id },
            data: { lastNotifiedAt: new Date() },
          });
        } catch {
          // Silently fail individual notifications
        }
      })
    );

    return matched.length;
  }
}
