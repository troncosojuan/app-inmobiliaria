"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, BedDouble, Bath, Maximize2 } from "lucide-react";
import { PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS, formatPrice } from "@app-inmobiliaria/types";
import Atropos from "atropos/react";
import "atropos/css";
import { ScrollReveal, StaggerList, StaggerItem } from "@/components/motion";
import type { TenantWithPlan } from "@/lib/tenant";
import type { Property, PropertyImage } from "@app-inmobiliaria/db";

interface FeaturedPropertiesProps {
  tenant: TenantWithPlan;
  properties: (Property & { images: PropertyImage[] })[];
}

export function FeaturedProperties({ tenant, properties }: FeaturedPropertiesProps) {
  if (properties.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <ScrollReveal>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Propiedades destacadas</h2>
            <p className="mt-2 text-muted-foreground">Las mejores opciones seleccionadas para vos</p>
          </div>
          <Link
            href="/propiedades"
            className="group hidden items-center gap-1 text-sm font-medium transition-colors sm:flex"
            style={{ color: tenant.primaryColor }}
          >
            Ver todas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </ScrollReveal>

      <StaggerList className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" slow>
        {properties.map((property) => (
          <StaggerItem key={property.id}>
            <PropertyCard3D property={property} tenant={tenant} />
          </StaggerItem>
        ))}
      </StaggerList>

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/propiedades"
          className="inline-flex items-center gap-1 text-sm font-medium"
          style={{ color: tenant.primaryColor }}
        >
          Ver todas las propiedades
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function PropertyCard3D({
  property,
  tenant,
}: {
  property: Property & { images: PropertyImage[] };
  tenant: TenantWithPlan;
}) {
  const image = property.images[0];
  const typeLabel = PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS];
  const opLabel = OPERATION_TYPE_LABELS[property.operation as keyof typeof OPERATION_TYPE_LABELS];
  const templateSlug = (tenant as { templateSlug?: string }).templateSlug || "modern";
  const isClassic = templateSlug === "classic";
  const isMinimal = templateSlug === "minimal";
  const cardClass = isClassic
    ? "group block overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-lg"
    : isMinimal
      ? "group block overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-none transition-shadow hover:shadow-md"
      : "group block overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-xl";
  const priceClass = isClassic
    ? "rounded-lg bg-white/90 px-3 py-1.5 text-lg font-bold text-foreground shadow backdrop-blur"
    : isMinimal
      ? "rounded-full bg-foreground/90 px-3 py-1.5 text-lg font-bold text-background shadow"
      : "rounded-lg bg-slate-900/80 px-3 py-1.5 text-lg font-bold text-white backdrop-blur";

  return (
    <Atropos
      className="atropos-property"
      rotateXMax={8}
      rotateYMax={8}
      shadow={false}
      highlight={false}
      rotateTouch={false}
    >
      <Link
        href={`/propiedades/${property.slug}`}
        className={cardClass}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image.url}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              data-atropos-offset="3"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Maximize2 className="h-12 w-12" />
            </div>
          )}

          <div className="absolute left-3 top-3 flex gap-2" data-atropos-offset="5">
            <span
              className="rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              {opLabel}
            </span>
            <span className="rounded-md bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow backdrop-blur">
              {typeLabel}
            </span>
          </div>

          <div className="absolute bottom-3 left-3" data-atropos-offset="7">
            <span className={priceClass}>
              {formatPrice(Number(property.price), property.currency)}
            </span>
          </div>
        </div>

        <div className="p-4" data-atropos-offset="2">
          <h3 className="font-semibold text-foreground line-clamp-1 transition-colors group-hover:text-primary">
            {property.title}
          </h3>

          <div className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">
              {property.neighborhood || property.address}, {property.city}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4 border-t pt-3 text-sm text-muted-foreground">
            {property.bedrooms !== null && property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <BedDouble className="h-4 w-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms !== null && property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.totalArea && (
              <div className="flex items-center gap-1">
                <Maximize2 className="h-4 w-4" />
                <span>{property.totalArea} m²</span>
              </div>
            )}
            {property.expenses && (
              <span className="ml-auto text-xs text-muted-foreground">
                Exp: {formatPrice(Number(property.expenses), "ARS")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Atropos>
  );
}
