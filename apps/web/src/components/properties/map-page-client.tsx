"use client";

import { useState } from "react";
import { Map, SlidersHorizontal } from "lucide-react";
import { PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS } from "@app-inmobiliaria/types";
import { PropertyMap } from "./property-map";

interface MapPageClientProps {
  primaryColor: string;
  initialOperation?: string;
  initialType?: string;
}

export function MapPageClient({ primaryColor, initialOperation = "", initialType = "" }: MapPageClientProps) {
  const [type, setType] = useState(initialType);
  const [operation, setOperation] = useState(initialOperation);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Map className="h-6 w-6" style={{ color: primaryColor }} />
            Mapa de propiedades
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explorá propiedades disponibles por ubicación
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
          >
            <option value="">Todas las operaciones</option>
            {Object.entries(OPERATION_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
          >
            <option value="">Todos los tipos</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <PropertyMap
        primaryColor={primaryColor}
        filters={{ type: type || undefined, operation: operation || undefined }}
      />
    </div>
  );
}
