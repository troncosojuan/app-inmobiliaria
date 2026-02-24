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

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function MapPage({ searchParams }: Props) {
  const [tenant, params] = await Promise.all([getTenant(), searchParams]);
  if (!tenant) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <MapPageClient
        primaryColor={tenant.primaryColor}
        initialOperation={params.operation}
        initialType={params.type}
      />
    </div>
  );
}
