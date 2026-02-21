import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";

export const PORTALS = [
  { slug: "ZONAPROP", name: "ZonaProp", icon: "🏠" },
  { slug: "MERCADOLIBRE", name: "MercadoLibre", icon: "📦" },
  { slug: "ARGENPROP", name: "ArgenProp", icon: "🏢" },
] as const;

export type PortalSlug = (typeof PORTALS)[number]["slug"];

export class PortalService {
  static async getChannels(tenantId: string) {
    const channels = await prisma.portalChannel.findMany({
      where: { tenantId },
      include: { _count: { select: { publications: true } } },
      orderBy: { createdAt: "asc" },
    });
    return channels.map((c) => serialize(c));
  }

  static async createChannel(tenantId: string, portal: string) {
    const channel = await prisma.portalChannel.create({
      data: { tenantId, portal },
    });
    return serialize(channel);
  }

  static async toggleChannel(tenantId: string, portal: string) {
    const channel = await prisma.portalChannel.findUnique({
      where: { tenantId_portal: { tenantId, portal } },
    });
    if (!channel) throw new Error("Canal no encontrado");

    const updated = await prisma.portalChannel.update({
      where: { id: channel.id },
      data: { isActive: !channel.isActive },
    });
    return serialize(updated);
  }

  static async deleteChannel(tenantId: string, portal: string) {
    const channel = await prisma.portalChannel.findUnique({
      where: { tenantId_portal: { tenantId, portal } },
    });
    if (!channel) throw new Error("Canal no encontrado");

    await prisma.portalPublication.deleteMany({ where: { channelId: channel.id } });
    await prisma.portalChannel.delete({ where: { id: channel.id } });
  }

  static async getPublications(tenantId: string) {
    const channels = await prisma.portalChannel.findMany({
      where: { tenantId },
      select: { id: true },
    });
    const channelIds = channels.map((c) => c.id);

    const publications = await prisma.portalPublication.findMany({
      where: { channelId: { in: channelIds } },
      include: {
        property: { select: { id: true, title: true, slug: true, status: true } },
        channel: { select: { portal: true, isActive: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
    return publications.map((p) => serialize(p));
  }

  static async publish(tenantId: string, propertyId: string, portal: string) {
    const channel = await prisma.portalChannel.findUnique({
      where: { tenantId_portal: { tenantId, portal } },
    });
    if (!channel) throw new Error("Canal no configurado");
    if (!channel.isActive) throw new Error("Canal desactivado");

    const publication = await prisma.portalPublication.upsert({
      where: { propertyId_channelId: { propertyId, channelId: channel.id } },
      update: {
        status: "PUBLISHED",
        lastSyncAt: new Date(),
        errorMessage: null,
        externalId: `mock_${Date.now().toString(36)}`,
      },
      create: {
        propertyId,
        channelId: channel.id,
        status: "PUBLISHED",
        lastSyncAt: new Date(),
        externalId: `mock_${Date.now().toString(36)}`,
      },
    });
    return serialize(publication);
  }

  static async unpublish(tenantId: string, propertyId: string, portal: string) {
    const channel = await prisma.portalChannel.findUnique({
      where: { tenantId_portal: { tenantId, portal } },
    });
    if (!channel) throw new Error("Canal no configurado");

    const pub = await prisma.portalPublication.findUnique({
      where: { propertyId_channelId: { propertyId, channelId: channel.id } },
    });
    if (!pub) throw new Error("Publicación no encontrada");

    const updated = await prisma.portalPublication.update({
      where: { id: pub.id },
      data: { status: "PAUSED", lastSyncAt: new Date() },
    });
    return serialize(updated);
  }

  static async getPropertyPublications(propertyId: string) {
    const publications = await prisma.portalPublication.findMany({
      where: { propertyId },
      include: { channel: { select: { portal: true, isActive: true } } },
    });
    return publications.map((p) => serialize(p));
  }
}
