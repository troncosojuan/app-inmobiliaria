import { prisma } from "@app-inmobiliaria/db";
import { compare } from "bcryptjs";
import { serialize } from "../utils/serialize";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  tenantId: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan: Record<string, unknown>;
  } | null;
}

const USER_INCLUDE = {
  tenant: {
    include: { plan: true },
  },
} as const;

function toAuthUser(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  tenantId: string;
  tenant: { id: string; name: string; slug: string; plan: Record<string, unknown> } | null;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    tenantId: user.tenantId,
    tenant: user.tenant
      ? {
          id: user.tenant.id,
          name: user.tenant.name,
          slug: user.tenant.slug,
          plan: user.tenant.plan,
        }
      : null,
  };
}

export class AuthService {
  static async validateCredentials(email: string, password: string): Promise<AuthUser | null> {
    if (!email || !password) return null;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: USER_INCLUDE,
    });

    if (!user || !user.isActive) return null;

    const isValid = await compare(password, user.passwordHash);
    if (!isValid) return null;

    return serialize(toAuthUser(user as Parameters<typeof toAuthUser>[0]));
  }

  static async getUserById(id: string): Promise<AuthUser | null> {
    if (!id) return null;

    const user = await prisma.user.findUnique({
      where: { id },
      include: USER_INCLUDE,
    });

    if (!user || !user.isActive) return null;

    return serialize(toAuthUser(user as Parameters<typeof toAuthUser>[0]));
  }
}
