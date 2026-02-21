import { NextRequest, NextResponse } from "next/server";
import { TenantService, PlanService, onboardingSchema } from "@app-inmobiliaria/api";
import { withRateLimit } from "@/lib/rate-limit";

export const POST = withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const result = onboardingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const data = result.data;

    const plans = await PlanService.getAll();
    const plan = plans.find((p: { slug: string }) => p.slug === data.planSlug);
    if (!plan) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 400 });
    }

    const tenant = await TenantService.create({
      name: data.agencyName,
      slug: data.slug,
      email: data.email,
      phone: data.phone,
      planId: plan.id,
      adminName: data.adminName,
      adminEmail: data.adminEmail,
      adminPassword: data.adminPassword,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
    });

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
      message: "¡Tu inmobiliaria fue creada con éxito!",
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    const status = message.includes("slug") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}, { limit: 5, windowMs: 60_000 });
