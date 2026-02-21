import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import { MapPageClient } from "@/components/properties/map-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  return {
    title: `Mapa de propiedades | ${tenant?.name}`,
    description: `Explorá propiedades en el mapa de ${tenant?.name}`,
    alternates: { canonical: "/mapa" },
  };
}

export default async function MapPage() {
  const tenant = await getTenant();
  if (!tenant) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <MapPageClient primaryColor={tenant.primaryColor} />
    </div>
  );
}
