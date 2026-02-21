import { NextResponse } from "next/server";
import { WebhookService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const GET = apiHandler(async () => {
  const user = await requireTenantAdmin();
  const webhooks = await WebhookService.list(user.tenantId);
  return NextResponse.json(webhooks);
});

export const POST = apiHandler(async (request) => {
  const user = await requireTenantAdmin();
  const body = await request.json();
  const { url, events } = body as { url: string; events: string[] };

  if (!url || !events?.length) {
    return NextResponse.json({ error: "URL y eventos son requeridos" }, { status: 400 });
  }

  const webhook = await WebhookService.create(user.tenantId, { url, events: events as import("@app-inmobiliaria/api").WebhookEvent[] });
  return NextResponse.json(webhook, { status: 201 });
});
