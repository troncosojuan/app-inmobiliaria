"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ArrowLeftRight, X, MapPin, BedDouble, Bath, Maximize2 } from "lucide-react";
import { formatPrice, PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS } from "@app-inmobiliaria/types";
import { useFavorites, type FavoriteProperty } from "@/hooks/use-favorites";
import { Button, EmptyState } from "@app-inmobiliaria/ui";
import { cn } from "@app-inmobiliaria/ui";

export function FavoritesPageClient() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [comparing, setComparing] = useState<string[]>([]);

  function toggleCompare(id: string) {
    setComparing((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev,
    );
  }

  const compareItems = favorites.filter((f) => comparing.includes(f.id));

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="h-12 w-12" />}
        title="No tenés favoritos guardados"
        description="Explorá propiedades y tocá el corazón para guardarlas acá."
        action={
          <Link href="/propiedades">
            <Button>Ver propiedades</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis favoritos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {favorites.length} propiedad{favorites.length !== 1 ? "es" : ""} guardada{favorites.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {comparing.length >= 2 && (
            <button
              onClick={() => {}}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ArrowLeftRight className="h-4 w-4" />
              Comparar ({comparing.length})
            </button>
          )}
          <button
            onClick={clearFavorites}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Trash2 className="h-4 w-4" />
            Limpiar todo
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((property) => (
          <div key={property.id} className="relative">
            <button
              onClick={() => toggleCompare(property.id)}
              className={cn(
                "absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded border-2 transition-all",
                comparing.includes(property.id)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-white/80 bg-white/50 backdrop-blur",
              )}
              title="Seleccionar para comparar"
            >
              {comparing.includes(property.id) && (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            <Link
              href={`/propiedades/${property.slug}`}
              className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {property.imageUrl ? (
                  <Image
                    src={property.imageUrl}
                    alt={property.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Maximize2 className="h-12 w-12" />
                  </div>
                )}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFavorite(property.id); }}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow transition-transform hover:scale-110"
                  aria-label="Quitar de favoritos"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
                <div className="absolute bottom-3 left-3">
                  <span className="rounded-md bg-slate-900/80 px-2.5 py-1 text-sm font-bold text-white backdrop-blur">
                    {formatPrice(property.price, property.currency)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary font-medium">
                    {OPERATION_TYPE_LABELS[property.operation as keyof typeof OPERATION_TYPE_LABELS]}
                  </span>
                  <span>{PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS]}</span>
                </div>
                <h3 className="mt-1.5 font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="line-clamp-1">{property.city}</span>
                </div>
                <div className="mt-2 flex items-center gap-3 border-t pt-2 text-sm text-muted-foreground">
                  {property.bedrooms != null && property.bedrooms > 0 && (
                    <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{property.bedrooms}</span>
                  )}
                  {property.bathrooms != null && property.bathrooms > 0 && (
                    <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{property.bathrooms}</span>
                  )}
                  {property.totalArea && (
                    <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{property.totalArea}m²</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {compareItems.length >= 2 && <CompareTable items={compareItems} onClose={() => setComparing([])} />}
    </div>
  );
}

function CompareTable({ items, onClose }: { items: FavoriteProperty[]; onClose: () => void }) {
  const rows: { label: string; render: (p: FavoriteProperty) => React.ReactNode }[] = [
    { label: "Precio", render: (p) => <span className="font-semibold">{formatPrice(p.price, p.currency)}</span> },
    { label: "Tipo", render: (p) => PROPERTY_TYPE_LABELS[p.type as keyof typeof PROPERTY_TYPE_LABELS] || p.type },
    { label: "Operación", render: (p) => OPERATION_TYPE_LABELS[p.operation as keyof typeof OPERATION_TYPE_LABELS] || p.operation },
    { label: "Ubicación", render: (p) => p.city },
    { label: "Dormitorios", render: (p) => p.bedrooms ?? "-" },
    { label: "Baños", render: (p) => p.bathrooms ?? "-" },
    { label: "Superficie", render: (p) => p.totalArea ? `${p.totalArea} m²` : "-" },
  ];

  return (
    <div className="mt-8 overflow-hidden rounded-xl border bg-card shadow-lg">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">Comparador</h3>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="w-32 p-3 text-left text-xs font-medium text-muted-foreground" />
              {items.map((item) => (
                <th key={item.id} className="p-3 text-center">
                  <Link href={`/propiedades/${item.slug}`} className="group">
                    <div className="relative mx-auto mb-2 h-20 w-32 overflow-hidden rounded-lg bg-muted">
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="128px" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-1">
                      {item.title}
                    </span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b last:border-0">
                <td className="p-3 text-xs font-medium text-muted-foreground">{row.label}</td>
                {items.map((item) => (
                  <td key={item.id} className="p-3 text-center text-sm text-foreground">
                    {row.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
