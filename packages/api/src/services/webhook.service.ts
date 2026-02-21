import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";
import { ensureExists } from "../utils/service-helpers";
import crypto from "crypto";

export type WebhookEvent =
  | "lead.created"
  | "property.created"
  | "property.published"
  | "property.status_changed";

export const WEBHOOK_EVENTS: { value: WebhookEvent; label: string }[] = [
  { value: "lead.created", label: "Nuevo lead" },
  { value: "property.created", label: "Propiedad creada" },
  { value: "property.published", label: "Propiedad publicada" },
  { value: "property.status_changed", label: "Estado de propiedad cambiado" },
];

function generateSecret(): string {
  return `whsec_${crypto.randomBytes(24).toString("hex")}`;
}

function signPayload(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export class WebhookService {
  static async list(tenantId: string) {
    const webhooks = await prisma.webhook.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
    return webhooks.map((w) => serialize(w));
  }

  static async create(tenantId: string, data: { url: string; events: WebhookEvent[] }) {
    const webhook = await prisma.webhook.create({
      data: {
        tenantId,
        url: data.url,
        events: JSON.stringify(data.events),
        secret: generateSecret(),
      },
    });
    return serialize(webhook);
  }

  static async delete(tenantId: string, id: string) {
    await ensureExists("webhook", { id, tenantId }, "Webhook no encontrado");
    await prisma.webhook.delete({ where: { id } });
  }

  static async toggle(tenantId: string, id: string) {
    const webhook = await ensureExists<{ id: string; isActive: boolean }>(
      "webhook", { id, tenantId }, "Webhook no encontrado"
    );
    const updated = await prisma.webhook.update({
      where: { id },
      data: { isActive: !webhook.isActive },
    });
    return serialize(updated);
  }

  static async testPing(tenantId: string, id: string) {
    const webhook = await ensureExists<{ id: string; url: string; secret: string }>(
      "webhook", { id, tenantId }, "Webhook no encontrado"
    );

    const payload = JSON.stringify({
      event: "ping",
      timestamp: new Date().toISOString(),
      data: { message: "Test ping from InmoPlatform" },
    });

    const signature = signPayload(payload, webhook.secret);

    try {
      const res = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Event": "ping",
        },
        body: payload,
        signal: AbortSignal.timeout(10000),
      });

      await prisma.webhook.update({
        where: { id },
        data: { lastTriggeredAt: new Date(), lastStatusCode: res.status },
      });

      return { success: res.ok, statusCode: res.status };
    } catch {
      await prisma.webhook.update({
        where: { id },
        data: { lastTriggeredAt: new Date(), lastStatusCode: 0 },
      });
      return { success: false, statusCode: 0 };
    }
  }

  static async dispatch(tenantId: string, event: WebhookEvent, data: Record<string, unknown>) {
    const webhooks = await prisma.webhook.findMany({
      where: { tenantId, isActive: true },
    });

    const matching = webhooks.filter((w) => {
      const events: string[] = JSON.parse(w.events);
      return events.includes(event);
    });

    const payload = JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      data,
    });

    const results = await Promise.allSettled(
      matching.map(async (webhook) => {
        const signature = signPayload(payload, webhook.secret);
        try {
          const res = await fetch(webhook.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Webhook-Signature": signature,
              "X-Webhook-Event": event,
            },
            body: payload,
            signal: AbortSignal.timeout(10000),
          });

          await prisma.webhook.update({
            where: { id: webhook.id },
            data: { lastTriggeredAt: new Date(), lastStatusCode: res.status },
          });

          return { webhookId: webhook.id, success: res.ok, statusCode: res.status };
        } catch {
          await prisma.webhook.update({
            where: { id: webhook.id },
            data: { lastTriggeredAt: new Date(), lastStatusCode: 0 },
          });
          return { webhookId: webhook.id, success: false, statusCode: 0 };
        }
      })
    );

    return results;
  }
}
