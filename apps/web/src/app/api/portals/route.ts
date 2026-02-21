import { NextResponse } from "next/server";
import { PortalService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const GET = apiHandler(async () => {
  const user = await requireTenantAdmin();
  const channels = await PortalService.getChannels(user.tenantId);
  return NextResponse.json(channels);
});

export const POST = apiHandler(async (request) => {
  const user = await requireTenantAdmin();
  const { portal } = await request.json();
  const channel = await PortalService.createChannel(user.tenantId, portal);
  return NextResponse.json(channel, { status: 201 });
});
