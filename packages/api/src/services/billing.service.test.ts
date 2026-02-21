import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrisma } from "../__tests__/setup";
import { BillingService } from "./billing.service";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("BillingService", () => {
  describe("createSubscription", () => {
    it("creates a trial subscription", async () => {
      const fakePlan = { id: "plan1", trialDays: 14, price: { toNumber: () => 5000 } };
      mockPrisma.plan.findUnique.mockResolvedValue(fakePlan);

      const fakeSubscription = {
        id: "sub1",
        tenantId: "t1",
        planId: "plan1",
        status: "TRIAL",
        createdAt: new Date(),
      };
      mockPrisma.subscription.create.mockResolvedValue(fakeSubscription);
      mockPrisma.tenant.update.mockResolvedValue({});

      const result = await BillingService.createSubscription("t1", "plan1");
      expect(result.status).toBe("TRIAL");
      expect(mockPrisma.subscription.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("cancelSubscription", () => {
    it("marks subscription for cancellation", async () => {
      const fakeSub = { id: "sub1", tenantId: "t1", status: "ACTIVE" };
      mockPrisma.subscription.findFirst.mockResolvedValue(fakeSub);
      mockPrisma.subscription.update.mockResolvedValue({ ...fakeSub, cancelAtPeriodEnd: true });
      mockPrisma.tenant.update.mockResolvedValue({});

      const result = await BillingService.cancelSubscription("t1");
      expect(result.cancelAtPeriodEnd).toBe(true);
    });

    it("throws when no active subscription", async () => {
      mockPrisma.subscription.findFirst.mockResolvedValue(null);

      await expect(
        BillingService.cancelSubscription("t1")
      ).rejects.toThrow();
    });
  });
});
