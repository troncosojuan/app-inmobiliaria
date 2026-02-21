import NextAuth from "next-auth";
import { createAuthConfig } from "@app-inmobiliaria/api";

export const { handlers, signIn, signOut, auth } = NextAuth(
  createAuthConfig({
    loginPath: "/login",
    allowedRoles: ["PLATFORM_ADMIN"],
  })
);
