import { cache } from "react";
import NextAuth from "next-auth";
import { createAuthConfig } from "@app-inmobiliaria/api";
import type { UserSession } from "@app-inmobiliaria/types";

export const { handlers, signIn, signOut, auth } = NextAuth(
  createAuthConfig({
    loginPath: "/login",
  })
);

export const getCurrentUser = cache(async (): Promise<UserSession | null> => {
  const session = await auth();
  if (!session?.user) return null;

  const u = session.user as unknown as Record<string, unknown>;
  return {
    id: u.id as string,
    email: u.email as string,
    name: (u.name as string) || null,
    role: u.role as UserSession["role"],
    tenantId: (u.tenantId as string) || null,
    tenant: u.tenant as UserSession["tenant"],
  };
});

/**
 * Safe helper for pages protected by the dashboard layout.
 * The layout already redirects unauthenticated users,
 * so this acts as a type-narrowing safety net.
 */
export async function requireAuth(): Promise<UserSession & { tenantId: string }> {
  const { redirect } = await import("next/navigation");
  const user = await getCurrentUser();
  if (!user?.tenantId) redirect("/login");
  return user as UserSession & { tenantId: string };
}
