"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import {
  SlidersHorizontal, X, ChevronDown, MapPin,
  Banknote, BedDouble, Home, Check,
} from "lucide-react";
import type { TenantWithPlan } from "@/lib/tenant";

interface PropertyFiltersProps {
  tenant: TenantWithPlan;
  cities: { city: string; count: number }[];
  currentFilters: Record<string, string | undefined>;
}

const OPERATIONS = [
  { value: "SALE", label: "Venta" },
  { value: "RENT", label: "Alquiler" },
  { value: "TEMPORARY", label: "Temporal" },
];

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Depto" },
  { value: "HOUSE", label: "Casa" },
  { value: "PH", label: "PH" },
  { value: "OFFICE", label: "Oficina" },
  { value: "COMMERCIAL", label: "Local" },
  { value: "LAND", label: "Terreno" },
  { value: "WAREHOUSE", label: "Galpón" },
  { value: "COUNTRY_HOUSE", label: "Country" },
  { value: "FARM", label: "Campo" },
];

const BEDROOMS = [
  { value: "", label: "Todos" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

export function PropertyFilters({ cities, currentFilters }: PropertyFiltersProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [priceMin, setPriceMin] = useState(currentFilters.minPrice || "");
  const [priceMax, setPriceMax] = useState(currentFilters.maxPrice || "");
  const priceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const selectedTypes = currentFilters.types
    ? currentFilters.types.split(",").filter(Boolean)
    : [];

  const buildParams = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      const merged = { ...currentFilters, ...overrides };
      for (const [k, v] of Object.entries(merged)) {
        if (v) params.set(k, v);
      }
      params.delete("page");
      return params.toString();
    },
    [currentFilters]
  );

  const navigate = useCallback(
    (overrides: Record<string, string | undefined>) => {
      router.push(`/propiedades?${buildParams(overrides)}`);
    },
    [router, buildParams]
  );

  const toggleOperation = (value: string) => {
    const current = currentFilters.operation || "";
    navigate({ operation: current === value ? "" : value });
  };

  const toggleType = (value: string) => {
    let next: string[];
    if (selectedTypes.includes(value)) {
      next = selectedTypes.filter((t) => t !== value);
    } else {
      next = [...selectedTypes, value];
    }
    navigate({ types: next.length ? next.join(",") : "", type: "" });
  };

  const toggleBedrooms = (value: string) => {
    const current = currentFilters.bedrooms || "";
    navigate({ bedrooms: current === value ? "" : value });
  };

  const setCity = (value: string) => navigate({ city: value });

  const handlePriceChange = (key: "minPrice" | "maxPrice", value: string) => {
    if (key === "minPrice") setPriceMin(value);
    else setPriceMax(value);
    clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(() => {
      navigate({ [key]: value });
    }, 600);
  };

  const clearFilters = () => {
    setPriceMin("");
    setPriceMax("");
    router.push("/propiedades");
  };

  const activeFilterCount = [
    currentFilters.operation,
    currentFilters.types || currentFilters.type,
    currentFilters.city,
    currentFilters.bedrooms,
    currentFilters.minPrice,
    currentFilters.maxPrice,
  ].filter(Boolean).length;

  const hasFilters = activeFilterCount > 0;

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filtros
          {hasFilters && (
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Limpiar
            </button>
          )}
          <button
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? "Ocultar" : "Ver filtros"}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Filter body */}
      <div className={`${mobileOpen ? "block" : "hidden"} lg:block`}>

        {/* Operación */}
        <FilterSection label="Operación">
          <div className="flex flex-wrap gap-2">
            {OPERATIONS.map((op) => (
              <PillButton
                key={op.value}
                active={currentFilters.operation === op.value}
                onClick={() => toggleOperation(op.value)}
              >
                {op.label}
              </PillButton>
            ))}
          </div>
        </FilterSection>

        {/* Tipo — multi-select */}
        <FilterSection
          label="Tipo de propiedad"
          icon={<Home className="h-3.5 w-3.5" />}
          hint={selectedTypes.length === 0 ? "Podés elegir varios" : undefined}
        >
          <div className="flex flex-wrap gap-1.5">
            {PROPERTY_TYPES.map((t) => {
              const active = selectedTypes.includes(t.value);
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleType(t.value)}
                  className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    active
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-input bg-background text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {active && <Check className="h-3 w-3 shrink-0" />}
                  {t.label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Ciudad */}
        {cities.length > 0 && (
          <FilterSection label="Ciudad" icon={<MapPin className="h-3.5 w-3.5" />}>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <select
                value={currentFilters.city || ""}
                onChange={(e) => setCity(e.target.value)}
                className="h-9 w-full appearance-none rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todas las ciudades</option>
                {cities.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city} ({c.count})
                  </option>
                ))}
              </select>
            </div>
          </FilterSection>
        )}

        {/* Dormitorios */}
        <FilterSection label="Dormitorios" icon={<BedDouble className="h-3.5 w-3.5" />}>
          <div className="flex gap-1.5">
            {BEDROOMS.map((b) => (
              <PillButton
                key={b.value}
                active={(currentFilters.bedrooms || "") === b.value}
                onClick={() => toggleBedrooms(b.value)}
                small
              >
                {b.label}
              </PillButton>
            ))}
          </div>
        </FilterSection>

        {/* Precio */}
        <FilterSection label="Precio (USD)" icon={<Banknote className="h-3.5 w-3.5" />} last>
          <div className="overflow-hidden rounded-lg border border-input bg-background">
            <div className="flex items-center">
              <div className="flex flex-1 items-center gap-1.5 px-3">
                <span className="shrink-0 text-xs font-medium text-muted-foreground">USD</span>
                <input
                  type="number"
                  placeholder="Desde"
                  value={priceMin}
                  onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                  className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
              </div>
              <div className="h-5 w-px shrink-0 bg-border" />
              <div className="flex flex-1 items-center gap-1.5 px-3">
                <span className="shrink-0 text-xs font-medium text-muted-foreground">USD</span>
                <input
                  type="number"
                  placeholder="Hasta"
                  value={priceMax}
                  onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                  className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
              </div>
            </div>
          </div>
        </FilterSection>

      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────────── */

function FilterSection({
  label,
  icon,
  hint,
  last = false,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`px-5 py-4 ${!last ? "border-t border-border/60" : "border-t border-border/60"}`}>
      <div className="mb-3 flex items-center gap-1.5">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {hint && (
          <span className="ml-auto text-[11px] text-muted-foreground/60 italic">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function PillButton({
  active,
  onClick,
  children,
  small = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border font-medium transition-all ${
        small ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-sm"
      } ${
        active
          ? "border-primary bg-primary text-white shadow-sm"
          : "border-input bg-background text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
