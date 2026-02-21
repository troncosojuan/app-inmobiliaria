import Image from "next/image";
import {
  MapPin, BedDouble, Bath, Maximize2, Car, Building2,
  Calendar, Compass, CheckCircle2,
} from "lucide-react";
import {
  PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS,
  formatPrice, formatArea,
} from "@app-inmobiliaria/types";
import type { TenantWithPlan } from "@/lib/tenant";
import type { Property, PropertyImage } from "@app-inmobiliaria/db";

type FullProperty = Property & {
  images: PropertyImage[];
  agent: { name: string | null; avatar: string | null; email: string } | null;
};

interface PropertyInfoProps {
  property: FullProperty;
  tenant: TenantWithPlan;
}

export function PropertyInfo({ property, tenant }: PropertyInfoProps) {
  const typeLabel = PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS];
  const opLabel = OPERATION_TYPE_LABELS[property.operation as keyof typeof OPERATION_TYPE_LABELS];
  const amenities = (property.amenities as string[]) || [];

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className="rounded-md px-3 py-1 text-sm font-semibold text-white"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            {opLabel}
          </span>
          <span className="rounded-md bg-muted px-3 py-1 text-sm font-semibold text-foreground">
            {typeLabel}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {property.title}
        </h1>

        <div className="mt-2 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {property.address}, {property.neighborhood && `${property.neighborhood}, `}
            {property.city}, {property.state}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-bold" style={{ color: tenant.primaryColor }}>
            {formatPrice(Number(property.price), property.currency)}
          </span>
          {property.expenses && (
            <span className="text-sm text-muted-foreground">
              + {formatPrice(Number(property.expenses), "ARS")} expensas
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {property.totalArea && (
          <SpecCard icon={Maximize2} label="Sup. total" value={formatArea(property.totalArea)} />
        )}
        {property.coveredArea && (
          <SpecCard icon={Building2} label="Sup. cubierta" value={formatArea(property.coveredArea)} />
        )}
        {property.bedrooms !== null && property.bedrooms > 0 && (
          <SpecCard icon={BedDouble} label="Dormitorios" value={property.bedrooms.toString()} />
        )}
        {property.bathrooms !== null && property.bathrooms > 0 && (
          <SpecCard icon={Bath} label="Baños" value={property.bathrooms.toString()} />
        )}
        {property.garages !== null && property.garages > 0 && (
          <SpecCard icon={Car} label="Cocheras" value={property.garages.toString()} />
        )}
        {property.rooms !== null && property.rooms > 0 && (
          <SpecCard icon={Building2} label="Ambientes" value={property.rooms.toString()} />
        )}
        {property.yearBuilt && (
          <SpecCard icon={Calendar} label="Año" value={property.yearBuilt.toString()} />
        )}
        {property.orientation && (
          <SpecCard icon={Compass} label="Orientación" value={property.orientation} />
        )}
      </div>

      <div>
        <h2 className="mb-3 text-xl font-semibold text-foreground">Descripción</h2>
        <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
          {property.description}
        </p>
      </div>

      {amenities.length > 0 && (
        <div>
          <h2 className="mb-3 text-xl font-semibold text-foreground">Características</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: tenant.accentColor }} />
                {amenity}
              </div>
            ))}
          </div>
        </div>
      )}

      {property.agent && (
        <div className="rounded-xl border bg-muted/50 p-4">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">AGENTE</h2>
          <div className="flex items-center gap-3">
            {property.agent.avatar ? (
              <Image
                src={property.agent.avatar}
                alt={property.agent.name || "Agente"}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-white font-semibold"
                style={{ backgroundColor: tenant.primaryColor }}
              >
                {property.agent.name?.charAt(0) || "A"}
              </div>
            )}
            <div>
              <div className="font-medium text-foreground">{property.agent.name}</div>
              <div className="text-sm text-muted-foreground">{property.agent.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpecCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-3 text-center">
      <Icon className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
