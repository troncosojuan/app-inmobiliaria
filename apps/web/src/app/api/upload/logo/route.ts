import { NextResponse } from "next/server";
import { TenantService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin, ApiError } from "@/lib/api-helpers";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const LOGO_DIR = path.join(process.cwd(), "public", "uploads", "logos");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const POST = apiHandler(async (request) => {
  const user = await requireTenantAdmin();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || !file.type.startsWith("image/")) {
    throw new ApiError("Archivo de imagen requerido", 400);
  }
  if (file.size > MAX_SIZE) {
    throw new ApiError("El archivo no puede superar 5MB", 400);
  }

  await fs.mkdir(LOGO_DIR, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `logo-${user.tenantId}-${Date.now()}.webp`;

  await sharp(buffer)
    .resize(600, 300, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(LOGO_DIR, filename));

  const logoUrl = `/uploads/logos/${filename}`;

  await TenantService.update(user.tenantId, { logo: logoUrl });

  revalidatePath("/");

  return NextResponse.json({ logoUrl });
});
