import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["TENANT_ADMIN", "AGENT"]).default("AGENT"),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["TENANT_ADMIN", "AGENT"]).optional(),
  avatar: z.string().url().optional().nullable(),
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Ingresá tu contraseña actual"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
