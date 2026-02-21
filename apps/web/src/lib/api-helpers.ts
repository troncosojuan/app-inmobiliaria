import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./auth";
import type { UserSession } from "@app-inmobiliaria/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 400
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function requireTenantUser(): Promise<UserSession & { tenantId: string }> {
  const user = await getCurrentUser();
  if (!user?.tenantId) {
    throw new ApiError("No autorizado", 401);
  }
  return user as UserSession & { tenantId: string };
}

export async function requireTenantAdmin(): Promise<UserSession & { tenantId: string }> {
  const user = await requireTenantUser();
  if (user.role !== "TENANT_ADMIN" && user.role !== "PLATFORM_ADMIN") {
    throw new ApiError("Permisos insuficientes", 403);
  }
  return user;
}

type RouteContext = { params: Promise<Record<string, string>> };

type RouteHandler = (
  request: NextRequest,
  context: RouteContext
) => Promise<NextResponse>;

export function apiHandler(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      const message = error instanceof Error ? error.message : "Error interno del servidor";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  };
}

export function validateBody<T>(schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: { flatten: () => unknown } } }, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ApiError("Datos inválidos", 400);
  }
  return result.data as T;
}
