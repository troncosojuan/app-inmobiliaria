import { NextRequest, NextResponse } from "next/server";
import { PropertyService, propertyFiltersSchema } from "@app-inmobiliaria/api";
import { withApiKey } from "@/lib/api-key-auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(request, { limit: 60, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  return withApiKey(request, async (tenantId) => {
    const { searchParams } = request.nextUrl;
    const rawFilters: Record<string, string> = {};
    searchParams.forEach((value, key) => { rawFilters[key] = value; });

    const parsed = propertyFiltersSchema.safeParse(rawFilters);
    const filters = parsed.success ? parsed.data : { page: 1 };

    const result = await PropertyService.search(tenantId, filters);
    const response = NextResponse.json({
      data: result.properties,
      pagination: { page: result.page, pages: result.pages, total: result.total },
    });
    response.headers.set("X-RateLimit-Remaining", String(rl.remaining));
    return response;
  });
}
