import { NextRequest, NextResponse } from "next/server";
import { TenantService } from "@app-inmobiliaria/api";

const RESERVED_SLUGS = ["admin", "api", "www", "app", "platform", "dashboard", "login", "register", "static"];

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug || slug.length < 3) {
    return NextResponse.json({ available: false, reason: "Slug muy corto" });
  }

  if (RESERVED_SLUGS.includes(slug)) {
    return NextResponse.json({ available: false, reason: "Este nombre está reservado" });
  }

  const existing = await TenantService.getBySlug(slug);
  return NextResponse.json({
    available: !existing,
    reason: existing ? "Este nombre ya está en uso" : null,
  });
}
