import { NextRequest, NextResponse } from "next/server";
import { PropertyService } from "@app-inmobiliaria/api";
import { withApiKey } from "@/lib/api-key-auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  return withApiKey(request, async (tenantId) => {
    const { slug } = await params;
    const property = await PropertyService.getBySlug(tenantId, slug);

    if (!property) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ data: property });
  });
}
