import { NextRequest, NextResponse } from "next/server";

const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN || "localhost:3000";
const DEFAULT_TENANT = process.env.DEFAULT_TENANT;

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const { pathname } = url;

  // Protect dashboard routes - check for session token
  if (pathname.startsWith("/dashboard")) {
    const token =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const isMainDomain =
    hostname === PLATFORM_DOMAIN || hostname === `www.${PLATFORM_DOMAIN}`;

  if (isMainDomain && DEFAULT_TENANT) {
    const response = NextResponse.next();
    response.headers.set("x-tenant-slug", DEFAULT_TENANT);
    return response;
  }

  if (isMainDomain) {
    if (pathname.startsWith("/platform") || pathname.startsWith("/api") || pathname.startsWith("/login")) {
      return NextResponse.next();
    }
    url.pathname = `/platform${pathname}`;
    return NextResponse.rewrite(url);
  }

  let tenantSlug: string | null = null;
  const platformBase = PLATFORM_DOMAIN.split(":")[0];
  if (hostname.endsWith(`.${platformBase}`) || hostname.endsWith(`.${PLATFORM_DOMAIN}`)) {
    tenantSlug = hostname.split(".")[0];
  }

  if (!tenantSlug && process.env.NODE_ENV === "development") {
    tenantSlug = url.searchParams.get("tenant");
  }

  if (tenantSlug) {
    const response = NextResponse.next();
    response.headers.set("x-tenant-slug", tenantSlug);
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("x-custom-domain", hostname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads).*)"],
};
