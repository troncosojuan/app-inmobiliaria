"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronDown } from "lucide-react";

const AMENITIES_LIST = [
  "Pileta",
  "Pileta cubierta",
  "Quincho",
  "SUM",
  "Gimnasio",
  "Sauna",
  "Jacuzzi",
  "Laundry",
  "Lavadero",
  "Baulera",
  "Jardín",
  "Terraza",
  "Balcón",
  "Patio",
  "Galería",
  "Parrilla",
  "Fogón",
  "Seguridad 24hs",
  "Portería",
  "CCTV",
  "Acceso controlado",
  "Sala de juegos",
  "Sala de reuniones",
  "Coworking",
  "Play",
  "Microcine",
  "Solarium",
  "Paddle",
  "Tenis",
  "Cancha de fútbol",
  "Bike room",
  "Pet friendly",
  "Ascensor",
  "Acceso para discapacitados",
  "Generador",
  "Gas natural",
  "Calefacción central",
  "Aire acondicionado central",
];

interface AmenityPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function AmenityPicker({ value, onChange }: AmenityPickerProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? AMENITIES_LIST.filter((a) => a.toLowerCase().includes(q)) : AMENITIES_LIST;
  }, [search]);

  const toggle = (amenity: string) => {
    if (value.includes(amenity)) {
      onChange(value.filter((a) => a !== amenity));
    } else {
      onChange([...value, amenity]);
    }
  };

  const removeTag = (amenity: string) => {
    onChange(value.filter((a) => a !== amenity));
  };

  return (
    <div className="space-y-2">
      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {amenity}
              <button
                type="button"
                onClick={() => removeTag(amenity)}
                className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5 transition-colors"
                aria-label={`Quitar ${amenity}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Picker toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground hover:bg-muted transition-colors"
      >
        <span>{value.length === 0 ? "Seleccionar amenities..." : `${value.length} seleccionado${value.length !== 1 ? "s" : ""}`}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="rounded-lg border border-input bg-popover shadow-lg">
          {/* Search */}
          <div className="border-b p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar amenity..."
                className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                autoFocus
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">Sin resultados</p>
            ) : (
              filtered.map((amenity) => {
                const checked = value.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 hover:bg-muted transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(amenity)}
                      className="h-4 w-4 rounded border-input text-primary accent-primary"
                    />
                    <span className="text-sm text-foreground">{amenity}</span>
                  </label>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-2 text-right">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
