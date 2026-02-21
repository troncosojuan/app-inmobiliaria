import { NextResponse } from "next/server";
import { PortalService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const PATCH = apiHandler(async (_request, ctx) => {
  const user = await requireTenantAdmin();
  const { portal } = await ctx.params;
  const channel = await PortalService.toggleChannel(user.tenantId, portal);
  return NextResponse.json(channel);
});

export const DELETE = apiHandler(async (_request, ctx) => {
  const user = await requireTenantAdmin();
  const { portal } = await ctx.params;
  await PortalService.deleteChannel(user.tenantId, portal);
  return NextResponse.json({ success: true });
});
