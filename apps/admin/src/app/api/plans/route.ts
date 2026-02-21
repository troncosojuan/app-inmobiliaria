import { NextResponse } from "next/server";
import { PlanService } from "@app-inmobiliaria/api";
import { apiHandler, requirePlatformAdmin } from "@/lib/api-helpers";

export const GET = apiHandler(async () => {
  await requirePlatformAdmin();
  const plans = await PlanService.getAll();
  return NextResponse.json(plans);
});
