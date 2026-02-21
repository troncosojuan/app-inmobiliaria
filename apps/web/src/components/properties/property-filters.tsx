"use client";

import { useRouter } from "next/navigation";
import { useCallback, useId } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { TenantWithPlan } from "@/lib/tenant";

interface PropertyFiltersProps {
  tenant: TenantWithPlan;
  cities: { city: string; count: number }[];
  currentFilters: Record<string, string | undefined>;
}

export function PropertyFilters({ tenant, cities, currentFilters }: PropertyFiltersProps) {
  const router = useRouter();
  const id = useId();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(currentFilters)) {
        if (v && k !== key) params.set(k, v);
      }
      if (value) {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`/propiedades?${params.toString()}`);
    },
    [router, currentFilters]
  );

  const clearFilters = () => {
    router.push("/propiedades");
  };

  const hasFilters = Object.values(currentFilters).some((v) => v && v !== "1");

  return (
    <div className="space-y-6 rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </h2>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      <FilterGroup label="Operación" htmlFor={`${id}-operation`}>
        <FilterSelect
          id={`${id}-operation`}
          value={currentFilters.operation || ""}
          onChange={(v) => updateFilter("operation", v)}
          options={[
            { value: "", label: "Todas" },
            { value: "SALE", label: "Venta" },
            { value: "RENT", label: "Alquiler" },
            { value: "TEMPORARY", label: "Temporal" },
          ]}
        />
      </FilterGroup>

      <FilterGroup label="Tipo de propiedad" htmlFor={`${id}-type`}>
        <FilterSelect
          id={`${id}-type`}
          value={currentFilters.type || ""}
          onChange={(v) => updateFilter("type", v)}
          options={[
            { value: "", label: "Todos" },
            { value: "APARTMENT", label: "Departamento" },
            { value: "HOUSE", label: "Casa" },
            { value: "PH", label: "PH" },
            { value: "OFFICE", label: "Oficina" },
            { value: "COMMERCIAL", label: "Local" },
            { value: "LAND", label: "Terreno" },
            { value: "WAREHOUSE", label: "Galpón" },
            { value: "COUNTRY_HOUSE", label: "Country" },
            { value: "FARM", label: "Campo" },
          ]}
        />
      </FilterGroup>

      <FilterGroup label="Ubicación" htmlFor={`${id}-city`}>
        <FilterSelect
          id={`${id}-city`}
          value={currentFilters.city || ""}
          onChange={(v) => updateFilter("city", v)}
          options={[
            { value: "", label: "Todas" },
            ...cities.map((c) => ({
              value: c.city,
              label: `${c.city} (${c.count})`,
            })),
          ]}
        />
      </FilterGroup>

      <FilterGroup label="Dormitorios" htmlFor={`${id}-bedrooms`}>
        <FilterSelect
          id={`${id}-bedrooms`}
          value={currentFilters.bedrooms || ""}
          onChange={(v) => updateFilter("bedrooms", v)}
          options={[
            { value: "", label: "Cualquiera" },
            { value: "1", label: "1+" },
            { value: "2", label: "2+" },
            { value: "3", label: "3+" },
            { value: "4", label: "4+" },
          ]}
        />
      </FilterGroup>

      <FilterGroup label="Precio mínimo" htmlFor={`${id}-minPrice`}>
        <input
          id={`${id}-minPrice`}
          type="number"
          placeholder="Desde"
          value={currentFilters.minPrice || ""}
          onChange={(e) => updateFilter("minPrice", e.target.value)}
          className="h-9 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm"
        />
      </FilterGroup>

      <FilterGroup label="Precio máximo" htmlFor={`${id}-maxPrice`}>
        <input
          id={`${id}-maxPrice`}
          type="number"
          placeholder="Hasta"
          value={currentFilters.maxPrice || ""}
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
          className="h-9 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm"
        />
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function FilterSelect({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
