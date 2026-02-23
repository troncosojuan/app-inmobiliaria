import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";
import { ensureExists, pickFields } from "../utils/service-helpers";
import type { PropertyFilters, CreatePropertyInput, ChangePropertyStatusInput } from "../validators/property.validators";
import { WebhookService } from "./webhook.service";
import { SearchAlertService } from "./search-alert.service";

export class PropertyService {
  static async search(tenantId: string, filters: PropertyFilters, pageSize = 12) {
    const where: Record<string, unknown> = {
      tenantId,
      status: "ACTIVE",
    };

    if (filters.types) {
      const typeList = filters.types.split(",").filter(Boolean);
      if (typeList.length === 1) {
        where.type = typeList[0];
      } else if (typeList.length > 1) {
        where.type = { in: typeList };
      }
    } else if (filters.type) {
      where.type = filters.type;
    }
    if (filters.operation) where.operation = filters.operation;
    if (filters.city) where.city = { contains: filters.city };
    if (filters.state) where.state = filters.state;
    if (filters.bedrooms) where.bedrooms = { gte: filters.bedrooms };
    if (filters.garages) where.garages = { gte: filters.garages };

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) (where.price as Record<string, number>).gte = filters.minPrice;
      if (filters.maxPrice) (where.price as Record<string, number>).lte = filters.maxPrice;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { address: { contains: filters.search } },
        { neighborhood: { contains: filters.search } },
      ];
    }

    const page = filters.page || 1;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          agent: { select: { name: true, avatar: true } },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.property.count({ where }),
    ]);

    return {
      properties: serialize(properties),
      total,
      pages: Math.ceil(total / pageSize),
      page,
    };
  }

  static async getAllByTenant(tenantId: string, limit = 200) {
    const properties = await prisma.property.findMany({
      where: { tenantId },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        _count: { select: { leads: true } },
      },
      orderBy: [{ createdAt: "desc" }],
      take: limit,
    });
    return { properties: serialize(properties), total: properties.length };
  }

  static async getFeatured(tenantId: string, limit = 6) {
    const properties = await prisma.property.findMany({
      where: { tenantId, status: "ACTIVE", isFeatured: true },
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return serialize(properties);
  }

  static async getBySlug(tenantId: string, slug: string) {
    const property = await prisma.property.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
      include: {
        images: { orderBy: { order: "asc" } },
        agent: { select: { name: true, avatar: true, email: true } },
      },
    });
    return property ? serialize(property) : null;
  }

  static async getCities(tenantId: string) {
    const results = await prisma.property.groupBy({
      by: ["city"],
      where: { tenantId, status: "ACTIVE" },
      _count: { city: true },
      orderBy: { _count: { city: "desc" } },
    });
    return results.map((r) => ({ city: r.city, count: r._count.city }));
  }

  static async getMapMarkers(tenantId: string, filters?: { type?: string; operation?: string }) {
    const where: Record<string, unknown> = {
      tenantId,
      status: "ACTIVE",
      latitude: { not: null },
      longitude: { not: null },
    };
    if (filters?.type) where.type = filters.type;
    if (filters?.operation) where.operation = filters.operation;

    const properties = await prisma.property.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        operation: true,
        price: true,
        currency: true,
        address: true,
        city: true,
        bedrooms: true,
        bathrooms: true,
        totalArea: true,
        latitude: true,
        longitude: true,
        isFeatured: true,
        images: { orderBy: { order: "asc" }, take: 1, select: { url: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return serialize(properties);
  }

  static async create(tenantId: string, agentId: string, data: CreatePropertyInput & { status?: string }) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { plan: true },
    });
    if (!tenant) throw new Error("Tenant no encontrado");

    if (tenant.plan.maxProperties !== -1) {
      const count = await prisma.property.count({ where: { tenantId } });
      if (count >= tenant.plan.maxProperties) {
        throw new Error(`Tu plan permite hasta ${tenant.plan.maxProperties} propiedades. Actualizá tu plan para cargar más.`);
      }
    }

    const slug = this.generateSlug(data.title);
    const existing = await prisma.property.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });
    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    const property = await prisma.property.create({
      data: {
        tenantId,
        agentId,
        title: data.title,
        slug: finalSlug,
        description: data.description,
        type: data.type,
        operation: data.operation,
        price: data.price,
        currency: data.currency,
        expenses: data.expenses ?? null,
        address: data.address,
        city: data.city,
        state: data.state,
        neighborhood: data.neighborhood ?? null,
        totalArea: data.totalArea ?? 0,
        coveredArea: data.coveredArea ?? 0,
        rooms: data.rooms ?? 0,
        bedrooms: data.bedrooms ?? 0,
        bathrooms: data.bathrooms ?? 0,
        garages: data.garages ?? 0,
        floor: data.floor ?? null,
        yearBuilt: data.yearBuilt ?? null,
        amenities: data.amenities ?? [],
        status: (data.status as "ACTIVE" | "PAUSED" | "SOLD" | "RENTED" | "DRAFT") || "DRAFT",
        isFeatured: data.isFeatured,
      },
    });

    WebhookService.dispatch(tenantId, "property.created", {
      propertyId: property.id,
      title: data.title,
      type: data.type,
      operation: data.operation,
    }).catch(() => {});

    SearchAlertService.matchAndNotify({
      id: property.id,
      tenantId,
      title: data.title,
      slug: finalSlug,
      type: data.type,
      operation: data.operation,
      city: data.city || null,
      price: data.price,
      bedrooms: data.bedrooms ?? null,
    }).catch(() => {});

    return serialize(property);
  }

  static readonly UPDATABLE_FIELDS = [
    "title", "description", "type", "operation", "price", "currency",
    "expenses", "address", "city", "state", "neighborhood",
    "totalArea", "coveredArea", "rooms", "bedrooms", "bathrooms",
    "garages", "floor", "yearBuilt", "amenities", "status", "isFeatured",
    "metaTitle", "metaDescription", "virtualTourUrl",
  ];

  static async update(tenantId: string, id: string, data: Partial<CreatePropertyInput> & { status?: string; metaTitle?: string; metaDescription?: string }) {
    const property = await ensureExists<{ id: string; title: string }>("property", { id, tenantId }, "Propiedad no encontrada");
    const updateData = pickFields(data as Record<string, unknown>, PropertyService.UPDATABLE_FIELDS);

    if (data.title && data.title !== property.title) {
      updateData.slug = this.generateSlug(data.title);
    }

    const updated = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        images: { orderBy: { order: "asc" } },
      },
    });

    return serialize(updated);
  }

  static async delete(tenantId: string, id: string) {
    await ensureExists("property", { id, tenantId }, "Propiedad no encontrada");

    await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
    await prisma.lead.deleteMany({ where: { propertyId: id } });
    await prisma.property.delete({ where: { id } });

    return { success: true };
  }

  static async toggleFeatured(tenantId: string, id: string) {
    const property = await ensureExists<{ id: string; isFeatured: boolean }>("property", { id, tenantId }, "Propiedad no encontrada");

    const updated = await prisma.property.update({
      where: { id },
      data: { isFeatured: !property.isFeatured },
    });
    return serialize(updated);
  }

  static readonly VALID_STATUSES = ["ACTIVE", "PAUSED", "SOLD", "RENTED", "DRAFT"] as const;

  static async changeStatus(tenantId: string, id: string, status: string) {
    if (!PropertyService.VALID_STATUSES.includes(status as typeof PropertyService.VALID_STATUSES[number])) {
      throw new Error(`Estado inválido: ${status}. Válidos: ${PropertyService.VALID_STATUSES.join(", ")}`);
    }

    await ensureExists("property", { id, tenantId }, "Propiedad no encontrada");

    const updated = await prisma.property.update({
      where: { id },
      data: { status: status as typeof PropertyService.VALID_STATUSES[number] },
    });

    const event = status === "ACTIVE" ? "property.published" as const : "property.status_changed" as const;
    WebhookService.dispatch(tenantId, event, {
      propertyId: id,
      status,
    }).catch(() => {});

    return serialize(updated);
  }

  static async addImages(propertyId: string, images: { url: string; order: number }[]) {
    await prisma.propertyImage.createMany({
      data: images.map((img) => ({
        propertyId,
        url: img.url,
        order: img.order,
      })),
    });
  }

  static async deleteImage(imageId: string) {
    const image = await prisma.propertyImage.findUnique({ where: { id: imageId } });
    if (!image) throw new Error("Imagen no encontrada");
    await prisma.propertyImage.delete({ where: { id: imageId } });
    return image;
  }

  static async reorderImages(propertyId: string, imageIds: string[]) {
    const updates = imageIds.map((id, index) =>
      prisma.propertyImage.update({ where: { id }, data: { order: index } })
    );
    await prisma.$transaction(updates);
  }

  static async getById(tenantId: string, id: string) {
    const property = await prisma.property.findFirst({
      where: { id, tenantId },
      include: {
        images: { orderBy: { order: "asc" } },
        agent: { select: { name: true, avatar: true, email: true } },
        _count: { select: { leads: true } },
      },
    });
    return property ? serialize(property) : null;
  }

  static async getSimilar(tenantId: string, propertyId: string, limit = 4) {
    // First fetch the current property to get its attributes
    const currentProperty = await prisma.property.findFirst({
      where: { id: propertyId, tenantId },
      select: { type: true, operation: true, city: true, price: true },
    });

    if (!currentProperty) {
      return [];
    }

    // Query for similar properties that match AT LEAST one of: same type, same operation, same city
    const similarProperties = await prisma.property.findMany({
      where: {
        tenantId,
        id: { not: propertyId },
        status: "ACTIVE",
        OR: [
          { type: currentProperty.type },
          { operation: currentProperty.operation },
          { city: currentProperty.city },
        ],
      },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    // Sort by: same city first, then same type, then by createdAt desc
    const sorted = similarProperties.sort((a, b) => {
      const aSameCity = a.city === currentProperty.city ? 1 : 0;
      const bSameCity = b.city === currentProperty.city ? 1 : 0;
      if (aSameCity !== bSameCity) return bSameCity - aSameCity;

      const aSameType = a.type === currentProperty.type ? 1 : 0;
      const bSameType = b.type === currentProperty.type ? 1 : 0;
      if (aSameType !== bSameType) return bSameType - aSameType;

      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    // Take the limit
    const limited = sorted.slice(0, limit);

    return serialize(limited);
  }

  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  static async getSlugsForSitemap(tenantId: string) {
    return prisma.property.findMany({
      where: { tenantId, status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
  }

  static async getAllForAdmin(limit = 50) {
    const properties = await prisma.property.findMany({
      include: {
        tenant: { select: { name: true, primaryColor: true } },
        agent: { select: { name: true } },
        images: { take: 1, orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return serialize(properties);
  }
}
