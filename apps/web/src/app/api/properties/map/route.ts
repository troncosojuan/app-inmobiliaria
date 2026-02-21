import { NextRequest, NextResponse } from "next/server";
import { PropertyService } from "@app-inmobiliaria/api";
import { getTenant } from "@/lib/tenant";

export async function GET(request: NextRequest) {
  try {
    const tenant = await getTenant();
    if (!tenant) {
      return NextResponse.json({ error: "Tenant no encontrado" }, { status: 404 });
    }

    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type") || undefined;
    const operation = searchParams.get("operation") || undefined;

    const markers = await PropertyService.getMapMarkers(tenant.id, { type, operation });
    return NextResponse.json(markers);
  } catch {
    return NextResponse.json({ error: "Error al obtener marcadores" }, { status: 500 });
  }
}
