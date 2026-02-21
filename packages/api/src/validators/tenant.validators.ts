import { z } from "zod";

const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const createTenantSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  instagram: z.string().url().optional().nullable(),
  facebook: z.string().url().optional().nullable(),
  primaryColor: z.string().regex(hexColorRegex).default("#1e40af"),
  secondaryColor: z.string().regex(hexColorRegex).default("#f59e0b"),
  accentColor: z.string().regex(hexColorRegex).default("#10b981"),
  planId: z.string(),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;

export const updateTenantSchema = createTenantSchema.partial().omit({ slug: true });
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;

export const createTenantWithAdminSchema = createTenantSchema.extend({
  adminName: z.string().min(2, "El nombre del admin debe tener al menos 2 caracteres").optional(),
  adminEmail: z.string().email("Email del admin inválido"),
  adminPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
export type CreateTenantWithAdminInput = z.infer<typeof createTenantWithAdminSchema>;
