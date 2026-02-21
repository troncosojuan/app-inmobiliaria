export interface SerializedPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  maxProperties: number;
  maxUsers: number;
  analytics: boolean;
  aiFeatures: boolean;
  crm: boolean;
  customPages: boolean;
  customDomain: boolean;
  bulkUpload: boolean;
  seoAdvanced: boolean;
  prioritySupport: boolean;
}

export function serializePlan(plan: Record<string, unknown>): SerializedPlan {
  return {
    id: plan.id as string,
    name: plan.name as string,
    slug: plan.slug as string,
    price: Number(plan.price),
    currency: plan.currency as string,
    maxProperties: plan.maxProperties as number,
    maxUsers: plan.maxUsers as number,
    analytics: plan.analytics as boolean,
    aiFeatures: plan.aiFeatures as boolean,
    crm: plan.crm as boolean,
    customPages: plan.customPages as boolean,
    customDomain: plan.customDomain as boolean,
    bulkUpload: plan.bulkUpload as boolean,
    seoAdvanced: plan.seoAdvanced as boolean,
    prioritySupport: plan.prioritySupport as boolean,
  };
}

export function serializePlans(plans: Record<string, unknown>[]): SerializedPlan[] {
  return plans.map(serializePlan);
}
