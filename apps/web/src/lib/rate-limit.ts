import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}, 60_000);

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export function checkRateLimit(
  req: NextRequest,
  { limit, windowMs }: RateLimitOptions
): { allowed: boolean; remaining: number; resetAt: number } {
  const ip = getClientIp(req);
  const key = `${ip}:${req.nextUrl.pathname}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  entry.count++;
  const allowed = entry.count <= limit;
  return { allowed, remaining: Math.max(0, limit - entry.count), resetAt: entry.resetAt };
}

export function rateLimitResponse(resetAt: number): NextResponse {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
  return NextResponse.json(
    { error: "Demasiadas solicitudes. Intentá de nuevo más tarde." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}

type RouteContext = { params: Promise<Record<string, string>> };
type RouteHandler = (req: NextRequest, ctx: RouteContext) => Promise<NextResponse>;

export function withRateLimit(
  handler: RouteHandler,
  opts: RateLimitOptions
): RouteHandler {
  return async (req, ctx) => {
    const { allowed, remaining, resetAt } = checkRateLimit(req, opts);
    if (!allowed) return rateLimitResponse(resetAt);

    const response = await handler(req, ctx);
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  };
}
