import { prisma } from "@app-inmobiliaria/db";
import { serialize } from "../utils/serialize";
import { ensureExists } from "../utils/service-helpers";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
type ActivityType = "NOTE" | "CALL" | "EMAIL" | "VISIT" | "STATUS_CHANGE" | "TASK_CREATED" | "TASK_COMPLETED";

const TASK_STATUSES: TaskStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const TASK_PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  leadId?: string;
  assignedToId?: string;
}

interface CreateActivityInput {
  leadId: string;
  type: ActivityType;
  content: string;
}

export class CrmService {
  // ─── Tasks ───

  static async getTasksByTenant(tenantId: string, filters?: { status?: string; assignedToId?: string }) {
    const where: Record<string, unknown> = { tenantId };
    if (filters?.status) where.status = filters.status;
    if (filters?.assignedToId) where.assignedToId = filters.assignedToId;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        lead: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, avatar: true } },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { priority: "desc" }],
    });
    return serialize(tasks);
  }

  static async getUpcomingTasks(tenantId: string, userId: string, limit = 10) {
    const tasks = await prisma.task.findMany({
      where: {
        tenantId,
        assignedToId: userId,
        status: { in: ["PENDING", "IN_PROGRESS"] },
      },
      include: {
        lead: { select: { id: true, name: true } },
      },
      orderBy: [{ dueDate: "asc" }, { priority: "desc" }],
      take: limit,
    });
    return serialize(tasks);
  }

  static async getOverdueTasks(tenantId: string) {
    const tasks = await prisma.task.findMany({
      where: {
        tenantId,
        status: { in: ["PENDING", "IN_PROGRESS"] },
        dueDate: { lt: new Date() },
      },
      include: {
        lead: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: "asc" },
    });
    return serialize(tasks);
  }

  static async createTask(tenantId: string, createdById: string, data: CreateTaskInput) {
    const task = await prisma.task.create({
      data: {
        tenantId,
        createdById,
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: data.priority || "MEDIUM",
        leadId: data.leadId || null,
        assignedToId: data.assignedToId || createdById,
      },
      include: {
        lead: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });

    if (data.leadId) {
      await this.createActivity(tenantId, createdById, {
        leadId: data.leadId,
        type: "TASK_CREATED",
        content: `Tarea creada: ${data.title}`,
      });
    }

    return serialize(task);
  }

  static async updateTaskStatus(tenantId: string, userId: string, taskId: string, status: string) {
    if (!TASK_STATUSES.includes(status as TaskStatus)) {
      throw new Error(`Estado inválido: ${status}. Válidos: ${TASK_STATUSES.join(", ")}`);
    }

    const task = await ensureExists<{ id: string; leadId: string | null; title: string }>(
      "task", { id: taskId, tenantId }, "Tarea no encontrada"
    );

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: status as TaskStatus,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
      include: {
        lead: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });

    if (task.leadId && status === "COMPLETED") {
      await this.createActivity(tenantId, userId, {
        leadId: task.leadId,
        type: "TASK_COMPLETED",
        content: `Tarea completada: ${task.title}`,
      });
    }

    return serialize(updated);
  }

  static async deleteTask(tenantId: string, taskId: string) {
    await ensureExists("task", { id: taskId, tenantId }, "Tarea no encontrada");
    await prisma.task.delete({ where: { id: taskId } });
  }

  // ─── Activities ───

  static async getActivitiesByLead(tenantId: string, leadId: string) {
    const activities = await prisma.activity.findMany({
      where: { tenantId, leadId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return serialize(activities);
  }

  static async getRecentActivities(tenantId: string, limit = 20) {
    const activities = await prisma.activity.findMany({
      where: { tenantId },
      include: {
        user: { select: { id: true, name: true } },
        lead: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return serialize(activities);
  }

  static async createActivity(tenantId: string, userId: string, data: CreateActivityInput) {
    const activity = await prisma.activity.create({
      data: {
        tenantId,
        userId,
        leadId: data.leadId,
        type: data.type as ActivityType,
        content: data.content,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
    return serialize(activity);
  }

  // ─── Stats ───

  static async getTaskStats(tenantId: string) {
    const [pending, inProgress, completed, overdue] = await Promise.all([
      prisma.task.count({ where: { tenantId, status: "PENDING" } }),
      prisma.task.count({ where: { tenantId, status: "IN_PROGRESS" } }),
      prisma.task.count({ where: { tenantId, status: "COMPLETED" } }),
      prisma.task.count({
        where: {
          tenantId,
          status: { in: ["PENDING", "IN_PROGRESS"] },
          dueDate: { lt: new Date() },
        },
      }),
    ]);
    return { pending, inProgress, completed, overdue, total: pending + inProgress + completed };
  }
}
