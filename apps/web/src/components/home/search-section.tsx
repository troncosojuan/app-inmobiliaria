"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import type { TenantWithPlan } from "@/lib/tenant";

interface SearchSectionProps {
  tenant: TenantWithPlan;
  cities: { city: string; count: number }[];
}

export function SearchSection({ tenant, cities }: SearchSectionProps) {
  const router = useRouter();
  const id = useId();
  const [operation, setOperation] = useState("SALE");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (operation) params.set("operation", operation);
    if (type) params.set("type", type);
    if (city) params.set("city", city);
    if (search) params.set("search", search);
    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <section className="relative -mt-8 z-10 mx-auto max-w-5xl px-4">
      <form
        onSubmit={handleSearch}
        className="rounded-2xl border bg-card p-4 shadow-xl shadow-slate-200/50 sm:p-6"
      >
        <div className="mb-5 flex gap-1 overflow-x-auto rounded-lg bg-muted p-1 [-webkit-overflow-scrolling:touch]" role="radiogroup" aria-label="Tipo de operación">
          {[
            { value: "SALE", label: "Venta" },
            { value: "RENT", label: "Alquiler" },
            { value: "TEMPORARY", label: "Temporal" },
          ].map((op) => (
            <button
              key={op.value}
              type="button"
              role="radio"
              aria-checked={operation === op.value}
              onClick={() => setOperation(op.value)}
              className="min-w-0 flex-1 shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-all"
              style={
                operation === op.value
                  ? { backgroundColor: tenant.primaryColor, color: "white" }
                  : { color: "#64748b" }
              }
            >
              {op.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor={`${id}-search`} className="mb-1.5 block text-xs font-medium text-muted-foreground">Buscar</label>
            <AddressAutocomplete
              id={`${id}-search`}
              value={search}
              onChange={(value) => setSearch(value)}
              onSelectAddress={(data) => {
                setSearch(data.address || data.city);
                if (data.city) setCity(data.city);
              }}
              placeholder="Barrio, direccion..."
              minChars={3}
              inputClassName="h-11 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-9 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor={`${id}-type`} className="mb-1.5 block text-xs font-medium text-muted-foreground">Tipo</label>
            <select
              id={`${id}-type`}
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Todos los tipos</option>
              <option value="APARTMENT">Departamento</option>
              <option value="HOUSE">Casa</option>
              <option value="PH">PH</option>
              <option value="OFFICE">Oficina</option>
              <option value="COMMERCIAL">Local comercial</option>
              <option value="LAND">Terreno</option>
              <option value="WAREHOUSE">Galpón</option>
              <option value="COUNTRY_HOUSE">Casa en country</option>
              <option value="FARM">Campo</option>
            </select>
          </div>

          <div>
            <label htmlFor={`${id}-city`} className="mb-1.5 block text-xs font-medium text-muted-foreground">Ubicación</label>
            <select
              id={`${id}-city`}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Todas las zonas</option>
              {cities.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city} ({c.count})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              <Search className="h-4 w-4" />
              Buscar
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
