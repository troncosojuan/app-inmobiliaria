import { NextResponse } from "next/server";
import { WebhookService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const POST = apiHandler(async (_request, ctx) => {
  const user = await requireTenantAdmin();
  const { id } = await ctx.params;
  const result = await WebhookService.testPing(user.tenantId, id);
  return NextResponse.json(result);
});
