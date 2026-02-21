import { NextResponse } from "next/server";
import { SearchAlertService } from "@app-inmobiliaria/api";
import { apiHandler } from "@/lib/api-helpers";
import { withRateLimit } from "@/lib/rate-limit";

const createAlert = apiHandler(async (request) => {
  const body = await request.json();
  const { tenantId, email, filters } = body as {
    tenantId: string;
    email: string;
    filters: Record<string, unknown>;
  };

  if (!tenantId || !email) {
    return NextResponse.json({ error: "Tenant y email requeridos" }, { status: 400 });
  }

  const alert = await SearchAlertService.create(tenantId, email, filters);
  return NextResponse.json(alert, { status: 201 });
});

export const POST = withRateLimit(createAlert, { limit: 5, windowMs: 60_000 });
