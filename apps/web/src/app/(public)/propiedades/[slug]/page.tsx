import { getTenant } from "@/lib/tenant";
import { PropertyService } from "@/lib/properties";
import { OPERATION_TYPE_LABELS } from "@app-inmobiliaria/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { PropertyInfo } from "@/components/properties/property-info";
import { ContactForm } from "@/components/properties/contact-form";
import { TrackPropertyView } from "@/components/analytics/track-view";
import { SimilarProperties } from "@/components/properties/similar-properties";
import { PropertyDetailFavorite } from "@/components/properties/property-detail-favorite";
import { PropertyBadges } from "@/components/properties/property-badges";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenant();
  if (!tenant) return {};

  const property = await PropertyService.getBySlug(tenant.id, slug);
  if (!property) return {};

  const description = property.metaDescription || property.description.slice(0, 160);
  const image = property.images?.[0]?.url;

  const title = property.metaTitle || property.title;

  return {
    title,
    description,
    alternates: {
      canonical: `/propiedades/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: property.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const tenant = await getTenant();
  if (!tenant) return notFound();

  const property = await PropertyService.getBySlug(tenant.id, slug);
  if (!property) return notFound();

  const similarProperties = await PropertyService.getSimilar(tenant.id, property.id, 4);

  const opLabel = OPERATION_TYPE_LABELS[property.operation as keyof typeof OPERATION_TYPE_LABELS] || property.operation;
  const currencyCode = property.currency === "ARS" ? "ARS" : "USD";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `/propiedades/${property.slug}`,
    datePosted: property.createdAt,
    ...(property.images?.[0] && { image: property.images.map((img: { url: string }) => img.url) }),
    offers: {
      "@type": "Offer",
      price: Number(property.price),
      priceCurrency: currencyCode,
      availability: property.status === "ACTIVE" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      category: opLabel,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      addressCountry: "AR",
    },
    ...(property.totalArea && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.totalArea,
        unitCode: "MTK",
      },
    }),
    ...(property.bedrooms && { numberOfBedrooms: property.bedrooms }),
    ...(property.bathrooms && { numberOfBathroomsTotal: property.bathrooms }),
    seller: {
      "@type": "RealEstateAgent",
      name: tenant.name,
      email: tenant.email,
      ...(tenant.phone && { telephone: tenant.phone }),
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <TrackPropertyView propertyId={property.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <Link href="/propiedades" className="hover:text-foreground">Propiedades</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{property.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <PropertyBadges
            isFeatured={property.isFeatured}
            createdAt={property.createdAt instanceof Date ? property.createdAt.toISOString() : String(property.createdAt)}
          />
          <PropertyDetailFavorite
            property={{
              id: property.id,
              title: property.title,
              slug: property.slug,
              price: Number(property.price),
              currency: property.currency,
              type: property.type,
              operation: property.operation,
              city: property.city,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              totalArea: property.totalArea,
              imageUrl: property.images?.[0]?.url || "",
            }}
          />
        </div>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <PropertyGallery images={property.images} title={property.title} />
          <PropertyInfo property={property} tenant={tenant} />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ContactForm property={property} tenant={tenant} />
        </aside>
      </div>

      {property.virtualTourUrl && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-foreground">Tour virtual</h2>
          <div className="aspect-video overflow-hidden rounded-xl border shadow-sm">
            <iframe
              src={property.virtualTourUrl}
              className="h-full w-full"
              allowFullScreen
              allow="xr-spatial-tracking"
              title="Tour virtual"
            />
          </div>
        </section>
      )}

      <SimilarProperties
        properties={similarProperties.map((p: Record<string, unknown>) => ({
          id: p.id as string,
          title: p.title as string,
          slug: p.slug as string,
          price: Number(p.price),
          currency: p.currency as string,
          type: p.type as string,
          operation: p.operation as string,
          city: p.city as string,
          neighborhood: p.neighborhood as string | null,
          address: p.address as string,
          bedrooms: p.bedrooms as number | null,
          bathrooms: p.bathrooms as number | null,
          totalArea: p.totalArea as number | null,
          isFeatured: p.isFeatured as boolean,
          createdAt: String(p.createdAt),
          images: (p.images as { url: string }[]) || [],
        }))}
        primaryColor={tenant.primaryColor}
      />
    </div>
  );
}
