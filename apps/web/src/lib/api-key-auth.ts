import { NextRequest, NextResponse } from "next/server";
import { ApiKeyService } from "@app-inmobiliaria/api";

export async function withApiKey(
  request: NextRequest,
  handler: (tenantId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  const apiKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key requerida. Enviá el header: Authorization: Bearer <tu_api_key>" },
      { status: 401 }
    );
  }

  const result = await ApiKeyService.validateKey(apiKey);
  if (!result) {
    return NextResponse.json({ error: "API key inválida o revocada" }, { status: 403 });
  }

  return handler(result.tenantId);
}
