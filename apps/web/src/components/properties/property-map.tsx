"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Maximize2, Loader2 } from "lucide-react";
import { formatPrice, PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS } from "@app-inmobiliaria/types";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

interface MapProperty {
  id: string;
  title: string;
  slug: string;
  type: string;
  operation: string;
  price: number;
  currency: string;
  address: string;
  city: string;
  bedrooms: number | null;
  bathrooms: number | null;
  totalArea: number | null;
  latitude: number;
  longitude: number;
  isFeatured: boolean;
  images: { url: string }[];
}

interface PropertyMapProps {
  primaryColor: string;
  filters?: { type?: string; operation?: string };
}

const DEFAULT_CENTER: [number, number] = [-34.6037, -58.3816]; // Buenos Aires
const DEFAULT_ZOOM = 12;

async function fetchMapMarkers(filters?: { type?: string; operation?: string }): Promise<MapProperty[]> {
  const params = new URLSearchParams();
  if (filters?.type) params.set("type", filters.type);
  if (filters?.operation) params.set("operation", filters.operation);
  const res = await fetch(`/api/properties/map?${params}`);
  if (!res.ok) throw new Error("Error al cargar marcadores");
  return res.json();
}

export function PropertyMap({ primaryColor, filters }: PropertyMapProps) {
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setLeafletReady(true);
    });
  }, []);

  const { data: properties = [], isLoading: loading } = useQuery({
    queryKey: ["map-markers", filters?.type, filters?.operation],
    queryFn: () => fetchMapMarkers(filters),
  });

  const center = useMemo<[number, number]>(() => {
    if (properties.length === 0) return DEFAULT_CENTER;
    const avgLat = properties.reduce((s, p) => s + p.latitude, 0) / properties.length;
    const avgLng = properties.reduce((s, p) => s + p.longitude, 0) / properties.length;
    return [avgLat, avgLng];
  }, [properties]);

  if (!leafletReady) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-xl border bg-muted/30">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border shadow-sm">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />

      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-card/50 backdrop-blur-sm">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        className="h-[500px] w-full z-0"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((property) => (
          <Marker key={property.id} position={[property.latitude, property.longitude]}>
            <Popup minWidth={240} maxWidth={280}>
              <div className="space-y-2 p-0.5">
                {property.images[0] && (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg">
                    <Image
                      src={property.images[0].url}
                      alt={property.title}
                      fill
                      className="object-cover"
                      sizes="280px"
                    />
                    <span
                      className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[11px] font-semibold text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {OPERATION_TYPE_LABELS[property.operation as keyof typeof OPERATION_TYPE_LABELS]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold leading-tight" style={{ color: primaryColor }}>
                    {formatPrice(property.price, property.currency)}
                  </p>
                  <p className="mt-0.5 text-xs font-medium">{property.title}</p>
                  <p className="flex items-center gap-1 text-[11px] text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {property.address}, {property.city}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                  {property.bedrooms != null && (
                    <span className="flex items-center gap-0.5">
                      <BedDouble className="h-3 w-3" />
                      {property.bedrooms}
                    </span>
                  )}
                  {property.bathrooms != null && (
                    <span className="flex items-center gap-0.5">
                      <Bath className="h-3 w-3" />
                      {property.bathrooms}
                    </span>
                  )}
                  {property.totalArea != null && (
                    <span className="flex items-center gap-0.5">
                      <Maximize2 className="h-3 w-3" />
                      {property.totalArea}m²
                    </span>
                  )}
                </div>
                <Link
                  href={`/propiedades/${property.slug}`}
                  className="mt-1 block rounded-lg px-3 py-1.5 text-center text-xs font-medium text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Ver propiedad
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {!loading && (
        <div className="absolute bottom-3 left-3 z-[1000] rounded-lg bg-card/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow backdrop-blur">
          {properties.length} {properties.length === 1 ? "propiedad" : "propiedades"} en el mapa
        </div>
      )}
    </div>
  );
}
