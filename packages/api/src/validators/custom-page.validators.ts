import { z } from "zod";

export const createCustomPageSchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres").max(100),
  slug: z
    .string()
    .min(2, "El slug debe tener al menos 2 caracteres")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Solo letras minúsculas, números y guiones"),
  content: z.string().min(1, "El contenido no puede estar vacío"),
  isPublished: z.boolean().default(false),
});

export type CreateCustomPageInput = z.infer<typeof createCustomPageSchema>;

export const updateCustomPageSchema = createCustomPageSchema.partial();
export type UpdateCustomPageInput = z.infer<typeof updateCustomPageSchema>;
