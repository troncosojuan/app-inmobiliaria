import { z } from "zod";

export const onboardingSchema = z.object({
  agencyName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  slug: z
    .string()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .max(50)
    .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "Solo letras minúsculas, números y guiones"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  adminName: z.string().min(2, "Nombre requerido").max(100),
  adminEmail: z.string().email("Email inválido"),
  adminPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  planSlug: z.string().min(1, "Plan requerido"),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
