import { getTenant } from "@/lib/tenant";
import { PropertyService } from "@/lib/properties";
import { HeroResolver } from "@/components/home/template-resolver";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { SearchSection } from "@/components/home/search-section";
import { StatsSection } from "@/components/home/stats-section";
import { CTASection } from "@/components/home/cta-section";
import { notFound } from "next/navigation";

export default async function HomePage() {
  const tenant = await getTenant();
  if (!tenant) return notFound();

  const [featured, cities] = await Promise.all([
    PropertyService.getFeatured(tenant.id),
    PropertyService.getCities(tenant.id),
  ]);

  return (
    <>
      <HeroResolver tenant={tenant} templateSlug={(tenant as { templateSlug?: string }).templateSlug || "modern"} />
      <SearchSection tenant={tenant} cities={cities} />
      <FeaturedProperties tenant={tenant} properties={featured} />
      <StatsSection tenant={tenant} />
      <CTASection tenant={tenant} />
    </>
  );
}
