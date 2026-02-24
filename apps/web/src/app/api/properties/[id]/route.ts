import { NextResponse } from "next/server";
import { PropertyService, updatePropertySchema, geocodeAddress } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantUser, validateBody } from "@/lib/api-helpers";

export const PATCH = apiHandler(async (request, { params }) => {
  const user = await requireTenantUser();
  const { id } = await params;
  const body = await request.json();
  const data = validateBody(updatePropertySchema, body);
  const property = await PropertyService.update(user.tenantId, id, data);

  // Re-geocode if address fields changed
  if (data.address && data.city && data.state) {
    geocodeAddress(data.address, data.city, data.state)
      .then((coords) => {
        if (coords) PropertyService.update(user.tenantId, id, coords).catch(() => {});
      })
      .catch(() => {});
  }

  return NextResponse.json(property);
});

export const DELETE = apiHandler(async (_request, { params }) => {
  const user = await requireTenantUser();
  const { id } = await params;
  await PropertyService.delete(user.tenantId, id);
  return NextResponse.json({ success: true });
});
