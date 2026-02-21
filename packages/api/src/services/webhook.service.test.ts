import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrisma } from "../__tests__/setup";
import { WebhookService } from "./webhook.service";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("WebhookService", () => {
  describe("list", () => {
    it("returns webhooks for a tenant", async () => {
      const fakeWebhooks = [
        { id: "wh1", tenantId: "t1", url: "https://example.com/hook", events: '["lead.created"]', isActive: true, createdAt: new Date() },
      ];
      mockPrisma.webhook.findMany.mockResolvedValue(fakeWebhooks);

      const result = await WebhookService.list("t1");
      expect(result).toHaveLength(1);
      expect(result[0].url).toBe("https://example.com/hook");
      expect(mockPrisma.webhook.findMany).toHaveBeenCalledWith({
        where: { tenantId: "t1" },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("create", () => {
    it("creates a webhook with generated secret", async () => {
      const fakeWebhook = {
        id: "wh1",
        tenantId: "t1",
        url: "https://example.com/hook",
        events: '["lead.created"]',
        secret: "whsec_abc123",
        isActive: true,
      };
      mockPrisma.webhook.create.mockResolvedValue(fakeWebhook);

      const result = await WebhookService.create("t1", {
        url: "https://example.com/hook",
        events: ["lead.created"],
      });

      expect(result.url).toBe("https://example.com/hook");
      expect(mockPrisma.webhook.create).toHaveBeenCalledTimes(1);
      const createCall = mockPrisma.webhook.create.mock.calls[0][0];
      expect(createCall.data.tenantId).toBe("t1");
      expect(createCall.data.secret).toMatch(/^whsec_/);
    });
  });

  describe("dispatch", () => {
    it("dispatches to matching webhooks", async () => {
      const fakeWebhooks = [
        { id: "wh1", url: "https://example.com/hook", events: '["lead.created"]', secret: "test_secret", isActive: true },
        { id: "wh2", url: "https://example.com/other", events: '["property.created"]', secret: "test_secret2", isActive: true },
      ];
      mockPrisma.webhook.findMany.mockResolvedValue(fakeWebhooks);

      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response("OK", { status: 200 })
      );
      mockPrisma.webhook.update.mockResolvedValue({});

      const results = await WebhookService.dispatch("t1", "lead.created", { leadId: "l1" });

      expect(results).toHaveLength(1);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy.mock.calls[0][0]).toBe("https://example.com/hook");

      fetchSpy.mockRestore();
    });

    it("returns empty for no matching webhooks", async () => {
      mockPrisma.webhook.findMany.mockResolvedValue([]);

      const results = await WebhookService.dispatch("t1", "lead.created", { leadId: "l1" });
      expect(results).toHaveLength(0);
    });
  });
});
