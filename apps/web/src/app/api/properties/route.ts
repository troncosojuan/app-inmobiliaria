import { NextResponse } from "next/server";
import { PropertyService, createPropertySchema, geocodeAddress } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantUser, validateBody } from "@/lib/api-helpers";

export const POST = apiHandler(async (request) => {
  const user = await requireTenantUser();
  const body = await request.json();
  const data = validateBody(createPropertySchema, body);
  const property = await PropertyService.create(user.tenantId, user.id, data);

  // Auto-geocode address in the background — no await, don't block the response
  geocodeAddress(data.address, data.city, data.state)
    .then((coords) => {
      if (coords) PropertyService.update(user.tenantId, property.id, coords).catch(() => {});
    })
    .catch(() => {});

  return NextResponse.json(property, { status: 201 });
});
