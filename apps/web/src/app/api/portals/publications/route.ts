import { NextResponse } from "next/server";
import { PortalService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin } from "@/lib/api-helpers";

export const GET = apiHandler(async () => {
  const user = await requireTenantAdmin();
  const publications = await PortalService.getPublications(user.tenantId);
  return NextResponse.json(publications);
});

export const POST = apiHandler(async (request) => {
  const user = await requireTenantAdmin();
  const { propertyId, portal, action } = await request.json();

  if (action === "unpublish") {
    const pub = await PortalService.unpublish(user.tenantId, propertyId, portal);
    return NextResponse.json(pub);
  }

  const pub = await PortalService.publish(user.tenantId, propertyId, portal);
  return NextResponse.json(pub, { status: 201 });
});
