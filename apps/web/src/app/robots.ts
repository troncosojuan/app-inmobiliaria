import type { MetadataRoute } from "next";
import { getTenant } from "@/lib/tenant";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const tenant = await getTenant();

  const baseUrl = tenant?.customDomain
    ? `https://${tenant.customDomain}`
    : `http://localhost:3000`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
