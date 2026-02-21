import { NextRequest, NextResponse } from "next/server";
import { TenantService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin, ApiError } from "@/lib/api-helpers";
import { prisma } from "@app-inmobiliaria/db";

function normalizeDomain(raw: string): string {
  let domain = raw.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/^www\./, "");
  domain = domain.replace(/\/+$/, "");
  return domain;
}

async function checkDns(domain: string): Promise<boolean> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${domain}&type=CNAME`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    return false;
  }
}

export const PUT = apiHandler(async (request: NextRequest) => {
  const user = await requireTenantAdmin();

  const tenant = await prisma.tenant.findUnique({
    where: { id: user.tenantId },
    include: { plan: true },
  });
  if (!tenant) throw new ApiError("Tenant no encontrado", 404);
  if (!tenant.plan.customDomain) {
    throw new ApiError("Tu plan no incluye dominio personalizado. Mejorá tu plan para habilitar esta función.", 403);
  }

  const body = await request.json();
  const { domain } = body as { domain?: string };

  if (!domain || domain.trim() === "") {
    const updated = await TenantService.update(user.tenantId, { customDomain: null });
    return NextResponse.json({ tenant: updated, dnsVerified: true });
  }

  const normalized = normalizeDomain(domain);

  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(normalized)) {
    throw new ApiError("Dominio inválido. Ejemplo: inmobiliaria.com.ar", 400);
  }

  const existing = await prisma.tenant.findFirst({
    where: { customDomain: normalized, NOT: { id: user.tenantId } },
  });
  if (existing) throw new ApiError("Ese dominio ya está en uso por otra inmobiliaria", 409);

  const dnsVerified = await checkDns(normalized);

  const updated = await TenantService.update(user.tenantId, { customDomain: normalized });
  return NextResponse.json({ tenant: updated, dnsVerified });
});

export const GET = apiHandler(async () => {
  const user = await requireTenantAdmin();
  const tenant = await prisma.tenant.findUnique({
    where: { id: user.tenantId },
    select: { customDomain: true, plan: { select: { customDomain: true } } },
  });
  if (!tenant) throw new ApiError("Tenant no encontrado", 404);

  let dnsVerified = false;
  if (tenant.customDomain) {
    dnsVerified = await checkDns(tenant.customDomain);
  }

  return NextResponse.json({
    domain: tenant.customDomain,
    enabled: tenant.plan.customDomain,
    dnsVerified,
  });
});
