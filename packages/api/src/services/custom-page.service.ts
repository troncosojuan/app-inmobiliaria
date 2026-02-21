import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";
import { ensureExists } from "../utils/service-helpers";
import type { CreateCustomPageInput, UpdateCustomPageInput } from "../validators/custom-page.validators";

const RESERVED_SLUGS = [
  "propiedades", "venta", "alquiler", "contacto", "favoritos",
  "login", "dashboard", "api", "sitemap", "robots",
];

export class CustomPageService {
  static async getByTenant(tenantId: string) {
    const pages = await prisma.customPage.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
    });
    return serialize(pages);
  }

  static async getPublishedByTenant(tenantId: string) {
    const pages = await prisma.customPage.findMany({
      where: { tenantId, isPublished: true },
      orderBy: { title: "asc" },
      select: { id: true, title: true, slug: true },
    });
    return pages;
  }

  static async getBySlug(tenantId: string, slug: string) {
    const page = await prisma.customPage.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });
    return page ? serialize(page) : null;
  }

  static async getById(tenantId: string, id: string) {
    const page = await prisma.customPage.findFirst({
      where: { id, tenantId },
    });
    return page ? serialize(page) : null;
  }

  static async create(tenantId: string, data: CreateCustomPageInput) {
    if (RESERVED_SLUGS.includes(data.slug)) {
      throw new Error(`El slug "${data.slug}" está reservado. Elegí otro.`);
    }

    const existing = await prisma.customPage.findUnique({
      where: { tenantId_slug: { tenantId, slug: data.slug } },
    });
    if (existing) {
      throw new Error(`Ya existe una página con el slug "${data.slug}"`);
    }

    const page = await prisma.customPage.create({
      data: {
        tenantId,
        title: data.title,
        slug: data.slug,
        content: data.content,
        isPublished: data.isPublished,
      },
    });
    return serialize(page);
  }

  static async update(tenantId: string, id: string, data: UpdateCustomPageInput) {
    await ensureExists("customPage", { id, tenantId }, "Página no encontrada");

    if (data.slug) {
      if (RESERVED_SLUGS.includes(data.slug)) {
        throw new Error(`El slug "${data.slug}" está reservado. Elegí otro.`);
      }

      const existing = await prisma.customPage.findFirst({
        where: { tenantId, slug: data.slug, id: { not: id } },
      });
      if (existing) {
        throw new Error(`Ya existe otra página con el slug "${data.slug}"`);
      }
    }

    const page = await prisma.customPage.update({
      where: { id },
      data,
    });
    return serialize(page);
  }

  static async delete(tenantId: string, id: string) {
    await ensureExists("customPage", { id, tenantId }, "Página no encontrada");
    await prisma.customPage.delete({ where: { id } });
  }

  static async togglePublish(tenantId: string, id: string) {
    const page = await ensureExists<{ id: string; isPublished: boolean }>(
      "customPage",
      { id, tenantId },
      "Página no encontrada"
    );
    const updated = await prisma.customPage.update({
      where: { id },
      data: { isPublished: !page.isPublished },
    });
    return serialize(updated);
  }
}
