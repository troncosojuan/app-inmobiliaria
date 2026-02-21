import { prisma } from "@app-inmobiliaria/db";
import { hash, compare } from "bcryptjs";
import { serialize } from "../utils/serialize";
import { ensureExists } from "../utils/service-helpers";
import type { CreateUserInput, UpdateUserInput, ChangePasswordInput } from "../validators/user.validators";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  isActive: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
};

export class UserService {
  static async getByTenant(tenantId: string) {
    const users = await prisma.user.findMany({
      where: { tenantId },
      select: {
        ...USER_SELECT,
        _count: { select: { properties: true, assignedLeads: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return serialize(users);
  }

  static async getById(tenantId: string, id: string) {
    const user = await prisma.user.findFirst({
      where: { id, tenantId },
      select: {
        ...USER_SELECT,
        _count: { select: { properties: true, assignedLeads: true } },
      },
    });
    return user ? serialize(user) : null;
  }

  static async create(tenantId: string, data: CreateUserInput) {
    await ensureExists("tenant", { id: tenantId, isActive: true }, "Tenant no encontrado o inactivo");

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { plan: true, _count: { select: { users: true } } },
    });

    if (tenant && tenant._count.users >= tenant.plan.maxUsers) {
      throw new Error(`Límite de usuarios alcanzado (${tenant.plan.maxUsers} para plan ${tenant.plan.name})`);
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error("Ya existe un usuario con ese email");

    const passwordHash = await hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        tenantId,
        isActive: true,
      },
      select: USER_SELECT,
    });
    return serialize(user);
  }

  static async update(tenantId: string, id: string, data: UpdateUserInput) {
    await ensureExists("user", { id, tenantId }, "Usuario no encontrado");

    if (data.email) {
      const existing = await prisma.user.findFirst({
        where: { email: data.email, NOT: { id } },
      });
      if (existing) throw new Error("Ya existe un usuario con ese email");
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
      },
      select: USER_SELECT,
    });
    return serialize(updated);
  }

  static async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Usuario no encontrado");

    const isValid = await compare(data.currentPassword, user.passwordHash);
    if (!isValid) throw new Error("La contraseña actual es incorrecta");

    const passwordHash = await hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { success: true };
  }

  static async toggleActive(tenantId: string, id: string) {
    const user = await ensureExists<{ id: string; isActive: boolean }>(
      "user", { id, tenantId }, "Usuario no encontrado"
    );
    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: USER_SELECT,
    });
    return serialize(updated);
  }

  static async delete(tenantId: string, id: string) {
    await ensureExists("user", { id, tenantId }, "Usuario no encontrado");
    await prisma.user.delete({ where: { id } });
    return { success: true };
  }
}
