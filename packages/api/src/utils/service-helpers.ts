import { prisma } from "@app-inmobiliaria/db";

type PrismaModel = "property" | "lead" | "tenant" | "user" | "plan" | "propertyView" | "customPage" | "task" | "activity" | "apiKey" | "subscription" | "webhook" | "searchAlert";

type PrismaDelegate = {
  findFirst: (args: { where: Record<string, unknown> }) => Promise<unknown>;
};

const modelMap: Record<PrismaModel, PrismaDelegate> = {
  property: prisma.property,
  lead: prisma.lead,
  tenant: prisma.tenant,
  user: prisma.user,
  plan: prisma.plan,
  propertyView: prisma.propertyView,
  customPage: prisma.customPage,
  task: prisma.task,
  activity: prisma.activity,
  apiKey: prisma.apiKey,
  subscription: prisma.subscription,
  webhook: prisma.webhook,
  searchAlert: prisma.searchAlert,
};

export async function ensureExists<T = Record<string, unknown>>(
  model: PrismaModel,
  where: Record<string, unknown>,
  errorMsg: string
): Promise<T> {
  const delegate = modelMap[model];
  const record = await delegate.findFirst({ where });
  if (!record) throw new Error(errorMsg);
  return record as T;
}

export function pickFields(data: Record<string, unknown>, allowedFields: readonly string[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) result[field] = data[field];
  }
  return result;
}
