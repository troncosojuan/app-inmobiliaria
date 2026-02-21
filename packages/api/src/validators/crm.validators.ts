import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres").max(200),
  description: z.string().max(1000).optional(),
  dueDate: z.string().datetime({ offset: true }).optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  leadId: z.string().optional(),
  assignedToId: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

export const createActivitySchema = z.object({
  type: z.enum(["NOTE", "CALL", "EMAIL", "VISIT", "STATUS_CHANGE", "TASK_CREATED", "TASK_COMPLETED"]),
  content: z.string().min(1, "El contenido no puede estar vacío").max(2000),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;

export const createApiKeySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
});

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
