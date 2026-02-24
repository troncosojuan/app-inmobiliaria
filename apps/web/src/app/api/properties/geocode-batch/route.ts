import { NextResponse } from "next/server";
import { PropertyService, geocodeAddress } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantUser } from "@/lib/api-helpers";
import { prisma } from "@app-inmobiliaria/db";

export const POST = apiHandler(async () => {
  const user = await requireTenantUser();

  // Fetch all active properties that are missing coordinates
  const properties = await prisma.property.findMany({
    where: {
      tenantId: user.tenantId,
      status: "ACTIVE",
      OR: [{ latitude: null }, { longitude: null }],
      address: { not: "" },
      city: { not: "" },
    },
    select: { id: true, address: true, city: true, state: true },
  });

  if (properties.length === 0) {
    return NextResponse.json({ geocoded: 0, total: 0 });
  }

  let geocoded = 0;

  for (const property of properties) {
    const coords = await geocodeAddress(
      property.address,
      property.city,
      property.state ?? "",
    );
    if (coords) {
      await PropertyService.update(user.tenantId, property.id, coords).catch(() => {});
      geocoded++;
    }
    // Nominatim allows 1 request/second — respect the rate limit
    await new Promise((r) => setTimeout(r, 1100));
  }

  return NextResponse.json({ geocoded, total: properties.length });
});
