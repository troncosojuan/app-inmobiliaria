import { NextResponse } from "next/server";
import { prisma } from "@app-inmobiliaria/db";
import { apiHandler, requireTenantAdmin, ApiError } from "@/lib/api-helpers";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const VALID_TYPES = ["HOUSE", "APARTMENT", "LAND", "COMMERCIAL", "OFFICE", "PH", "WAREHOUSE", "GARAGE", "OTHER"];
const VALID_OPS = ["SALE", "RENT", "TEMPORARY_RENT"];
const VALID_STATUS = ["DRAFT", "ACTIVE", "PAUSED", "SOLD", "RENTED"];

export const POST = apiHandler(async (request) => {
  const user = await requireTenantAdmin();
  const body = await request.json();
  const { rows } = body;

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new ApiError("No se proporcionaron datos", 400);
  }

  if (rows.length > 500) {
    throw new ApiError("Máximo 500 propiedades por importación", 400);
  }

  const results: { row: number; success: boolean; title?: string; error?: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      const title = String(row.titulo || row.title || "").trim();
      if (!title) throw new Error("Título requerido");

      const type = String(row.tipo || row.type || "HOUSE").toUpperCase();
      if (!VALID_TYPES.includes(type)) throw new Error(`Tipo inválido: ${type}`);

      const operation = String(row.operacion || row.operation || "SALE").toUpperCase();
      if (!VALID_OPS.includes(operation)) throw new Error(`Operación inválida: ${operation}`);

      const price = parseFloat(row.precio || row.price || "0");
      if (isNaN(price) || price <= 0) throw new Error("Precio inválido");

      const address = String(row.direccion || row.address || "").trim();
      if (!address) throw new Error("Dirección requerida");

      const city = String(row.ciudad || row.city || "").trim();
      if (!city) throw new Error("Ciudad requerida");

      const state = String(row.provincia || row.state || "").trim();
      if (!state) throw new Error("Provincia requerida");

      const baseSlug = slugify(title);
      const existing = await prisma.property.count({
        where: { tenantId: user.tenantId, slug: { startsWith: baseSlug } },
      });
      const slug = existing > 0 ? `${baseSlug}-${existing + 1}` : baseSlug;

      const status = String(row.estado || row.status || "DRAFT").toUpperCase();

      await prisma.property.create({
        data: {
          tenantId: user.tenantId,
          title,
          slug,
          description: String(row.descripcion || row.description || title),
          type: type as "HOUSE",
          operation: operation as "SALE",
          status: VALID_STATUS.includes(status) ? (status as "DRAFT") : "DRAFT",
          price,
          currency: String(row.moneda || row.currency || "USD").toUpperCase(),
          expenses: row.expensas || row.expenses ? parseFloat(row.expensas || row.expenses) : null,
          address,
          city,
          state,
          neighborhood: row.barrio || row.neighborhood || null,
          totalArea: row.superficie_total || row.totalArea ? parseFloat(row.superficie_total || row.totalArea) : null,
          coveredArea: row.superficie_cubierta || row.coveredArea ? parseFloat(row.superficie_cubierta || row.coveredArea) : null,
          rooms: row.ambientes || row.rooms ? parseInt(row.ambientes || row.rooms) : null,
          bedrooms: row.dormitorios || row.bedrooms ? parseInt(row.dormitorios || row.bedrooms) : null,
          bathrooms: row.banos || row.bathrooms ? parseInt(row.banos || row.bathrooms) : null,
          garages: row.cocheras || row.garages ? parseInt(row.cocheras || row.garages) : null,
        },
      });

      results.push({ row: i + 1, success: true, title });
    } catch (error) {
      results.push({
        row: i + 1,
        success: false,
        title: row.titulo || row.title || `Fila ${i + 1}`,
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  const success = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return NextResponse.json({ success: success, failed, total: rows.length, results });
});
