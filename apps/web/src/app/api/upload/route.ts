import { NextResponse } from "next/server";
import { PropertyService } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantUser, ApiError } from "@/lib/api-helpers";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024;

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export const POST = apiHandler(async (request) => {
  const user = await requireTenantUser();

  const formData = await request.formData();
  const propertyId = formData.get("propertyId") as string;
  const files = formData.getAll("files") as File[];

  if (!propertyId || files.length === 0) {
    throw new ApiError("propertyId y archivos son requeridos", 400);
  }

  await ensureUploadDir();

  const savedImages: { url: string; order: number }[] = [];
  const currentOrder = parseInt(formData.get("startOrder") as string) || 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > MAX_FILE_SIZE || !file.type.startsWith("image/")) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${user.tenantId}-${propertyId}-${Date.now()}-${i}.webp`;

    await sharp(buffer)
      .resize(1600, 1200, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(UPLOAD_DIR, filename));

    await sharp(buffer)
      .resize(400, 300, { fit: "cover" })
      .webp({ quality: 75 })
      .toFile(path.join(UPLOAD_DIR, `thumb-${filename}`));

    savedImages.push({ url: `/uploads/${filename}`, order: currentOrder + i });
  }

  if (savedImages.length > 0) {
    await PropertyService.addImages(propertyId, savedImages);
  }

  return NextResponse.json({ images: savedImages, count: savedImages.length });
});
