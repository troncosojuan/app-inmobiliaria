import Credentials from "next-auth/providers/credentials";
import { AuthService } from "../services/auth.service";
import type { NextAuthConfig } from "next-auth";

interface AuthConfigOptions {
  loginPath?: string;
  allowedRoles?: string[];
  extendUser?: (user: Record<string, unknown>) => Record<string, unknown>;
  extendToken?: (token: Record<string, unknown>, user: Record<string, unknown>) => Record<string, unknown>;
  extendSession?: (session: Record<string, unknown>, token: Record<string, unknown>) => Record<string, unknown>;
}

export function createAuthConfig(options: AuthConfigOptions = {}): NextAuthConfig {
  const {
    loginPath = "/login",
    allowedRoles,
    extendUser,
    extendToken,
    extendSession,
  } = options;

  return {
    providers: [
      Credentials({
        credentials: {
          email: {},
          password: {},
        },
        async authorize(credentials) {
          const email = credentials?.email as string;
          const password = credentials?.password as string;
          if (!email || !password) return null;

          const user = await AuthService.validateCredentials(email, password);
          if (!user) return null;

          if (allowedRoles && !allowedRoles.includes(user.role)) return null;

          const base: Record<string, unknown> = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
            tenant: user.tenant,
          };

          return extendUser ? { ...base, ...extendUser(base) } : base;
        },
      }),
    ],
    session: { strategy: "jwt" },
    pages: { signIn: loginPath },
    callbacks: {
      jwt({ token, user }) {
        if (user) {
          const u = user as unknown as Record<string, unknown>;
          token.id = u.id;
          token.role = u.role;
          token.tenantId = u.tenantId;
          token.tenant = u.tenant;
          if (extendToken) Object.assign(token, extendToken(token, u));
        }
        return token;
      },
      session({ session, token }) {
        if (session.user) {
          const su = session.user as unknown as Record<string, unknown>;
          su.id = token.id;
          su.role = token.role;
          su.tenantId = token.tenantId;
          su.tenant = token.tenant;
          if (extendSession) Object.assign(su, extendSession(su, token as Record<string, unknown>));
        }
        return session;
      },
    },
  };
}
