import { NextResponse } from "next/server";
import { prisma } from "@app-inmobiliaria/db";
import { apiHandler, requireTenantUser } from "@/lib/api-helpers";

export const PATCH = apiHandler(async (request, { params }) => {
  const user = await requireTenantUser();
  const { id } = await params;
  const { imageIds } = await request.json();

  if (!Array.isArray(imageIds)) {
    return NextResponse.json({ error: "imageIds requerido" }, { status: 400 });
  }

  const property = await prisma.property.findFirst({
    where: { id, tenantId: user.tenantId },
    select: { id: true },
  });

  if (!property) {
    return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
  }

  await Promise.all(
    imageIds.map((imgId: string, index: number) =>
      prisma.propertyImage.updateMany({
        where: { id: imgId, propertyId: id },
        data: { order: index, isPrimary: index === 0 },
      })
    )
  );

  return NextResponse.json({ ok: true });
});
