import { prisma } from "@app-inmobiliaria/db";
import type { PlanFeatures } from "@app-inmobiliaria/types";

export type FeatureKey = keyof Omit<PlanFeatures, "maxProperties" | "maxUsers">;

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  customDomain: "Dominio personalizado",
  analytics: "Analytics avanzados",
  aiFeatures: "Funciones con IA",
  ipcAdjustment: "Ajuste por IPC",
  chatAutomation: "Automatización de chat",
  crm: "CRM completo",
  bulkUpload: "Carga masiva",
  seoAdvanced: "SEO avanzado",
  customPages: "Páginas personalizadas",
  prioritySupport: "Soporte prioritario",
  hidePlatformBranding: "Sin branding de plataforma",
};

export class FeatureGateService {
  static async getPlanFeatures(tenantId: string): Promise<PlanFeatures | null> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { plan: true },
    });
    if (!tenant?.plan) return null;

    return {
      maxProperties: tenant.plan.maxProperties,
      maxUsers: tenant.plan.maxUsers,
      customDomain: tenant.plan.customDomain,
      analytics: tenant.plan.analytics,
      aiFeatures: tenant.plan.aiFeatures,
      ipcAdjustment: tenant.plan.ipcAdjustment,
      chatAutomation: tenant.plan.chatAutomation,
      crm: tenant.plan.crm,
      bulkUpload: tenant.plan.bulkUpload,
      seoAdvanced: tenant.plan.seoAdvanced,
      customPages: tenant.plan.customPages,
      prioritySupport: tenant.plan.prioritySupport,
      hidePlatformBranding: tenant.plan.hidePlatformBranding,
    };
  }

  static async checkFeature(tenantId: string, feature: FeatureKey): Promise<boolean> {
    const features = await this.getPlanFeatures(tenantId);
    if (!features) return false;
    return features[feature] === true;
  }

  static async checkPropertyLimit(tenantId: string): Promise<{ allowed: boolean; current: number; max: number }> {
    const features = await this.getPlanFeatures(tenantId);
    if (!features) return { allowed: false, current: 0, max: 0 };
    if (features.maxProperties === -1) return { allowed: true, current: 0, max: -1 };

    const count = await prisma.property.count({ where: { tenantId } });
    return {
      allowed: count < features.maxProperties,
      current: count,
      max: features.maxProperties,
    };
  }

  static async checkUserLimit(tenantId: string): Promise<{ allowed: boolean; current: number; max: number }> {
    const features = await this.getPlanFeatures(tenantId);
    if (!features) return { allowed: false, current: 0, max: 0 };
    if (features.maxUsers === -1) return { allowed: true, current: 0, max: -1 };

    const count = await prisma.user.count({ where: { tenantId } });
    return {
      allowed: count < features.maxUsers,
      current: count,
      max: features.maxUsers,
    };
  }

  static checkFeatureFromPlan(plan: PlanFeatures, feature: FeatureKey): boolean {
    return plan[feature] === true;
  }
}
