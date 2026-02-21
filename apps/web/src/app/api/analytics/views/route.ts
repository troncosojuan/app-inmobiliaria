import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@app-inmobiliaria/api";
import { getTenant } from "@/lib/tenant";

export async function POST(request: NextRequest) {
  try {
    const tenant = await getTenant();
    if (!tenant) {
      return NextResponse.json({ error: "Tenant no encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const { propertyId, sessionId } = body;

    if (!propertyId || typeof propertyId !== "string") {
      return NextResponse.json({ error: "propertyId requerido" }, { status: 400 });
    }

    await AnalyticsService.trackView({
      propertyId,
      tenantId: tenant.id,
      sessionId: typeof sessionId === "string" ? sessionId : undefined,
      referrer: request.headers.get("referer") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error registrando vista" }, { status: 500 });
  }
}
