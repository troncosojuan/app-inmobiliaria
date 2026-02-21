import { NextRequest, NextResponse } from "next/server";
import { ChatService, FeatureGateService } from "@app-inmobiliaria/api";
import { getTenant } from "@/lib/tenant";

export async function POST(request: NextRequest) {
  try {
    const tenant = await getTenant();
    if (!tenant) {
      return NextResponse.json({ error: "Tenant no encontrado" }, { status: 404 });
    }

    const canChat = await FeatureGateService.checkFeature(tenant.id, "aiFeatures");
    if (!canChat) {
      return NextResponse.json({ error: "Feature no disponible en tu plan" }, { status: 403 });
    }

    const { message } = await request.json();
    if (!message || typeof message !== "string" || message.length > 500) {
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }

    const result = await ChatService.processMessage(tenant.id, message.trim(), tenant.name);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Error procesando mensaje" }, { status: 500 });
  }
}
