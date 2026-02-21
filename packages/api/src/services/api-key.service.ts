import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";
import { ensureExists } from "../utils/service-helpers";
import crypto from "crypto";

export class ApiKeyService {
  static generateKey(): string {
    return `immo_${crypto.randomBytes(24).toString("hex")}`;
  }

  static async create(tenantId: string, name: string) {
    const key = this.generateKey();
    const apiKey = await prisma.apiKey.create({
      data: { tenantId, name, key },
    });
    return serialize(apiKey);
  }

  static async getByTenant(tenantId: string) {
    const keys = await prisma.apiKey.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        key: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });
    return keys.map((k) => ({
      ...k,
      maskedKey: `${k.key.slice(0, 8)}...${k.key.slice(-4)}`,
    }));
  }

  static async validateKey(key: string) {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key },
      include: { tenant: { select: { id: true, slug: true, isActive: true } } },
    });

    if (!apiKey || !apiKey.isActive || !apiKey.tenant.isActive) return null;

    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return { tenantId: apiKey.tenant.id, tenantSlug: apiKey.tenant.slug };
  }

  static async revoke(tenantId: string, id: string) {
    await ensureExists("apiKey", { id, tenantId }, "API Key no encontrada");
    await prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
    });
  }

  static async delete(tenantId: string, id: string) {
    await ensureExists("apiKey", { id, tenantId }, "API Key no encontrada");
    await prisma.apiKey.delete({ where: { id } });
  }
}
