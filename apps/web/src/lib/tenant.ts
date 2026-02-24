import { TenantService } from "@app-inmobiliaria/api";
import { headers } from "next/headers";

export const getTenant = async (slugOverride?: string) => {
  const headersList = await headers();
  const slug = slugOverride
    || headersList.get("x-tenant-slug")
    || process.env.DEFAULT_TENANT
    || "demo-inmobiliaria";

  const customDomain = headersList.get("x-custom-domain");

  if (customDomain && !slugOverride) {
    return TenantService.getByCustomDomain(customDomain);
  }

  return TenantService.getBySlug(slug);
};

export type TenantWithPlan = NonNullable<Awaited<ReturnType<typeof getTenant>>>;
