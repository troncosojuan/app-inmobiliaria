import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrisma } from "../__tests__/setup";
import { LeadService } from "./lead.service";

beforeEach(() => {
  vi.clearAllMocks();
  mockPrisma.webhook.findMany.mockResolvedValue([]);
});

describe("LeadService", () => {
  describe("create", () => {
    it("creates a lead with valid data", async () => {
      const fakeTenant = { id: "t1", isActive: true };
      mockPrisma.tenant.findFirst.mockResolvedValue(fakeTenant);

      const fakeLead = {
        id: "lead1",
        tenantId: "t1",
        name: "Juan Pérez",
        email: "juan@test.com",
        phone: null,
        message: null,
        source: "website",
        status: "NEW",
        createdAt: new Date(),
      };
      mockPrisma.lead.create.mockResolvedValue(fakeLead);

      const result = await LeadService.create({
        tenantId: "t1",
        name: "Juan Pérez",
        email: "juan@test.com",
      });

      expect(result.id).toBe("lead1");
      expect(result.name).toBe("Juan Pérez");
      expect(mockPrisma.lead.create).toHaveBeenCalledTimes(1);
    });

    it("throws when tenant not found", async () => {
      mockPrisma.tenant.findFirst.mockResolvedValue(null);

      await expect(
        LeadService.create({
          tenantId: "nonexistent",
          name: "Test",
          email: "test@test.com",
        })
      ).rejects.toThrow();
    });
  });

  describe("updateStatus", () => {
    it("rejects invalid status", async () => {
      await expect(
        LeadService.updateStatus("t1", "lead1", "INVALID_STATUS")
      ).rejects.toThrow("Estado inválido");
    });

    it("updates status for valid values", async () => {
      const fakeLead = { id: "lead1", tenantId: "t1" };
      mockPrisma.lead.findFirst.mockResolvedValue(fakeLead);
      mockPrisma.lead.update.mockResolvedValue({ ...fakeLead, status: "CONTACTED" });

      const result = await LeadService.updateStatus("t1", "lead1", "CONTACTED");
      expect(result.status).toBe("CONTACTED");
    });
  });
});
