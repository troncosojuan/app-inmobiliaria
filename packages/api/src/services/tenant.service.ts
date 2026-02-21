import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";
import { pickFields } from "../utils/service-helpers";
import { DEFAULTS } from "../constants";

export class TenantService {
  static async getBySlug(slug: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      include: { plan: true },
    });
    return tenant ? serialize(tenant) : null;
  }

  static async getByCustomDomain(domain: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { customDomain: domain },
      include: { plan: true },
    });
    return tenant ? serialize(tenant) : null;
  }

  static async getAll() {
    const tenants = await prisma.tenant.findMany({
      include: {
        plan: { select: { name: true, slug: true } },
        _count: { select: { properties: true, users: true, leads: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return serialize(tenants);
  }

  static async getById(id: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { plan: true },
    });
    return tenant ? serialize(tenant) : null;
  }

  static async getStats() {
    const [tenants, properties, users, leads] = await Promise.all([
      prisma.tenant.count({ where: { isActive: true } }),
      prisma.property.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.lead.count(),
    ]);
    return { tenants, properties, users, leads };
  }

  static readonly UPDATABLE_FIELDS = [
    "name", "logo", "favicon", "primaryColor", "secondaryColor", "accentColor",
    "email", "phone", "address", "city", "state", "whatsapp", "instagram", "facebook",
    "customDomain", "templateSlug",
  ];

  static async update(id: string, data: Record<string, unknown>) {
    const updateData = pickFields(data, TenantService.UPDATABLE_FIELDS);
    const updated = await prisma.tenant.update({
      where: { id },
      data: updateData,
      include: { plan: true },
    });
    return serialize(updated);
  }

  static async create(data: {
    name: string;
    slug: string;
    email: string;
    planId: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    whatsapp?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    adminName?: string;
    adminEmail: string;
    adminPassword: string;
  }) {
    const existing = await prisma.tenant.findUnique({ where: { slug: data.slug } });
    if (existing) throw new Error("Ya existe una inmobiliaria con ese slug");

    const plan = await prisma.plan.findUnique({ where: { id: data.planId } });
    if (!plan) throw new Error("Plan no encontrado");

    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(data.adminPassword, 10);

    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        primaryColor: data.primaryColor || DEFAULTS.TENANT.PRIMARY_COLOR,
        secondaryColor: data.secondaryColor || DEFAULTS.TENANT.SECONDARY_COLOR,
        accentColor: data.accentColor || DEFAULTS.TENANT.ACCENT_COLOR,
        planId: data.planId,
        isActive: true,
        users: {
          create: {
            name: data.adminName || data.name,
            email: data.adminEmail,
            passwordHash: hashedPassword,
            role: "TENANT_ADMIN",
            isActive: true,
          },
        },
      },
      include: { plan: true, users: { select: { id: true, email: true, name: true } } },
    });

    return serialize(tenant);
  }

  static async toggleActive(id: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new Error("Tenant no encontrado");

    const updated = await prisma.tenant.update({
      where: { id },
      data: { isActive: !tenant.isActive },
    });
    return serialize(updated);
  }

  static async getRecentTenants(limit = 5) {
    const tenants = await prisma.tenant.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        plan: { select: { name: true } },
        _count: { select: { properties: true } },
      },
    });
    return serialize(tenants);
  }
}
