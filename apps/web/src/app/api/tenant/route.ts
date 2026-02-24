import { NextResponse } from "next/server";
import { TenantService, updateTenantSchema } from "@app-inmobiliaria/api";
import { apiHandler, requireTenantAdmin, validateBody } from "@/lib/api-helpers";
import { revalidatePath } from "next/cache";

export const PATCH = apiHandler(async (request) => {
  const user = await requireTenantAdmin();
  const body = await request.json();
  const data = validateBody(updateTenantSchema, body);
  const tenant = await TenantService.update(user.tenantId, data as Record<string, unknown>);
  // Revalidate public pages so template/color/config changes apply immediately
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath("/mapa");
  revalidatePath("/contacto");
  return NextResponse.json(tenant);
});
