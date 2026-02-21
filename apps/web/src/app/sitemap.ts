import type { MetadataRoute } from "next";
import { getTenant } from "@/lib/tenant";
import { PropertyService } from "@app-inmobiliaria/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenant = await getTenant();
  if (!tenant) return [];

  const baseUrl = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : `http://localhost:3000`;

  const properties = await PropertyService.getSlugsForSitemap(tenant.id);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/venta`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/alquiler`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mapa`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = (properties as { slug: string; updatedAt: Date }[]).map((p) => ({
    url: `${baseUrl}/propiedades/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
