import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  email: z.string().email("Ingresá un email válido"),
  phone: z.string().optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
  propertyId: z.string().optional().nullable(),
  tenantId: z.string(),
  source: z.string().optional().default("website"),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const updateLeadStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "IN_VISIT", "OFFER", "CONVERTED", "LOST"]),
});
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;

export const addNoteSchema = z.object({
  notes: z.string().max(5000, "Las notas no pueden exceder 5000 caracteres"),
});
export type AddNoteInput = z.infer<typeof addNoteSchema>;

export const assignAgentSchema = z.object({
  assignedToId: z.string().nullable(),
});
export type AssignAgentInput = z.infer<typeof assignAgentSchema>;

export const updateLeadSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "IN_VISIT", "OFFER", "CONVERTED", "LOST"]).optional(),
  notes: z.string().max(5000).optional(),
  assignedToId: z.string().nullable().optional(),
});
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
