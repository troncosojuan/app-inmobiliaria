"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Maximize2 } from "lucide-react";
import { formatPrice, PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS } from "@app-inmobiliaria/types";
import { FavoriteButton } from "./favorite-button";
import { PropertyBadges } from "./property-badges";
import type { FavoriteProperty } from "@/hooks/use-favorites";

interface SimilarProperty {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  type: string;
  operation: string;
  city: string;
  neighborhood: string | null;
  address: string;
  bedrooms: number | null;
  bathrooms: number | null;
  totalArea: number | null;
  isFeatured: boolean;
  createdAt: string;
  images: { url: string }[];
}

interface SimilarPropertiesProps {
  properties: SimilarProperty[];
  primaryColor: string;
}

function toFavorite(p: SimilarProperty): FavoriteProperty {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    price: p.price,
    currency: p.currency,
    type: p.type,
    operation: p.operation,
    city: p.city,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    totalArea: p.totalArea,
    imageUrl: p.images[0]?.url || "",
  };
}

export function SimilarProperties({ properties, primaryColor }: SimilarPropertiesProps) {
  if (properties.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-bold text-foreground">Propiedades similares</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {properties.map((property) => (
          <Link
            key={property.id}
            href={`/propiedades/${property.slug}`}
            className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              {property.images[0] ? (
                <Image
                  src={property.images[0].url}
                  alt={property.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Maximize2 className="h-10 w-10" />
                </div>
              )}

              <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
                <span
                  className="rounded-md px-2 py-0.5 text-[11px] font-semibold text-white shadow"
                  style={{ backgroundColor: primaryColor }}
                >
                  {OPERATION_TYPE_LABELS[property.operation as keyof typeof OPERATION_TYPE_LABELS]}
                </span>
                <PropertyBadges
                  isFeatured={property.isFeatured}
                  createdAt={property.createdAt}
                  size="sm"
                />
              </div>

              <div className="absolute right-2 top-2">
                <FavoriteButton property={toFavorite(property)} />
              </div>

              <div className="absolute bottom-2 left-2">
                <span className="rounded-md bg-slate-900/80 px-2 py-1 text-sm font-bold text-white backdrop-blur">
                  {formatPrice(property.price, property.currency)}
                </span>
              </div>
            </div>

            <div className="p-3">
              <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="line-clamp-1">{property.neighborhood || property.city}</span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                {property.bedrooms != null && property.bedrooms > 0 && (
                  <span className="flex items-center gap-0.5"><BedDouble className="h-3.5 w-3.5" />{property.bedrooms}</span>
                )}
                {property.bathrooms != null && property.bathrooms > 0 && (
                  <span className="flex items-center gap-0.5"><Bath className="h-3.5 w-3.5" />{property.bathrooms}</span>
                )}
                {property.totalArea && (
                  <span className="flex items-center gap-0.5"><Maximize2 className="h-3.5 w-3.5" />{property.totalArea}m²</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
