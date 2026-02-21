import { NextResponse } from "next/server";
import { WebhookService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const DELETE = apiHandler(async (_request, ctx) => {
  const user = await requireTenantAdmin();
  const { id } = await ctx.params;
  await WebhookService.delete(user.tenantId, id);
  return NextResponse.json({ success: true });
});

export const PATCH = apiHandler(async (_request, ctx) => {
  const user = await requireTenantAdmin();
  const { id } = await ctx.params;
  const webhook = await WebhookService.toggle(user.tenantId, id);
  return NextResponse.json(webhook);
});
