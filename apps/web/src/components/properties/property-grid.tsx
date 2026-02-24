"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Maximize2, Car } from "lucide-react";
import { PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS, formatPrice } from "@app-inmobiliaria/types";
import { StaggerList, StaggerItem } from "@/components/motion";
import { FavoriteButton } from "./favorite-button";
import { PropertyBadges } from "./property-badges";
import type { FavoriteProperty } from "@/hooks/use-favorites";
import type { TenantWithPlan } from "@/lib/tenant";
import type { Property, PropertyImage as PropertyImg, User } from "@app-inmobiliaria/db";

type PropertyWithRelations = Property & {
  images: PropertyImg[];
  agent: Pick<User, "name" | "avatar"> | null;
};

interface PropertyGridProps {
  properties: PropertyWithRelations[];
  tenant: TenantWithPlan;
}

export function PropertyGrid({ properties, tenant }: PropertyGridProps) {
  const templateSlug = (tenant as { templateSlug?: string }).templateSlug || "modern";
  const isClassic = templateSlug === "classic";
  const isMinimal = templateSlug === "minimal";
  const cardClass = isClassic
    ? "group block overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
    : isMinimal
      ? "group block overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-none transition-all duration-300 hover:shadow-md"
      : "group block overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1";
  const priceClass = isClassic
    ? "rounded-lg bg-white/90 px-3 py-1.5 text-lg font-bold text-foreground shadow backdrop-blur"
    : isMinimal
      ? "rounded-full bg-foreground/90 px-3 py-1.5 text-lg font-bold text-background shadow"
      : "rounded-lg bg-slate-900/80 px-3 py-1.5 text-lg font-bold text-white backdrop-blur";
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
        <Maximize2 className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">No se encontraron propiedades</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Probá ajustando los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <StaggerList className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <StaggerItem key={property.id}>
          <Link
            href={`/propiedades/${property.slug}`}
            className={cardClass}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              {property.images[0] ? (
                <Image
                  src={property.images[0].url}
                  alt={property.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Maximize2 className="h-16 w-16" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                <span
                  className="rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow"
                  style={{ backgroundColor: tenant.primaryColor }}
                >
                  {OPERATION_TYPE_LABELS[property.operation as keyof typeof OPERATION_TYPE_LABELS]}
                </span>
                <span className="rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow backdrop-blur">
                  {PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS]}
                </span>
                <PropertyBadges
                  isFeatured={property.isFeatured}
                  createdAt={property.createdAt instanceof Date ? property.createdAt.toISOString() : String(property.createdAt)}
                />
              </div>

              <div className="absolute right-3 top-3">
                <FavoriteButton
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
                    imageUrl: property.images[0]?.url || "",
                  }}
                />
              </div>

              <div className="absolute bottom-3 left-3">
                <span className={priceClass}>
                  {formatPrice(Number(property.price), property.currency)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-foreground line-clamp-1 transition-colors group-hover:text-primary">
                {property.title}
              </h3>

              <div className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-1">
                  {property.neighborhood || property.address}, {property.city}
                </span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {property.description}
              </p>

              <div className="mt-3 flex items-center gap-4 border-t pt-3 text-sm text-muted-foreground">
                {property.bedrooms !== null && property.bedrooms > 0 && (
                  <div className="flex items-center gap-1" title="Dormitorios">
                    <BedDouble className="h-4 w-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms !== null && property.bathrooms > 0 && (
                  <div className="flex items-center gap-1" title="Baños">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                {property.totalArea && (
                  <div className="flex items-center gap-1" title="Superficie total">
                    <Maximize2 className="h-4 w-4" />
                    <span>{property.totalArea} m²</span>
                  </div>
                )}
                {property.garages !== null && property.garages > 0 && (
                  <div className="flex items-center gap-1" title="Cocheras">
                    <Car className="h-4 w-4" />
                    <span>{property.garages}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
