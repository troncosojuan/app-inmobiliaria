"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Loader2, MapPin } from "lucide-react";


interface Suggestion {
  label: string;
  address: string;
  city: string;
  state: string;
  neighborhood?: string;
}

interface AddressAutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onSelectAddress?: (data: { address: string; city: string; state: string; neighborhood?: string }) => void;
  placeholder?: string;
  inputClassName?: string;
  containerClassName?: string;
  minChars?: number;
}

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}


export function AddressAutocomplete({
  id,
  value,
  onChange,
  onSelectAddress,
  placeholder = "Av. Santa Fe 1234",
  inputClassName,
  containerClassName,
  minChars = 3,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < minChars) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      setIsLoading(true);
      try {
        const url = `/api/address?query=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const mapped: Suggestion[] = await res.json();

        setSuggestions(mapped);
        setOpen(mapped.length > 0);
      } catch {
        // fail silently — user can still type manually
      } finally {
        setIsLoading(false);
      }
    }, 350),
    []
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const handleSelect = (s: Suggestion) => {
    onChange(s.address);
    setSuggestions([]);
    setOpen(false);
    onSelectAddress?.({ address: s.address, city: s.city, state: s.state, neighborhood: s.neighborhood });
  };

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className={containerClassName ?? "relative"}>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleInput}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={
            inputClassName
            ?? "flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          }
        />
        {isLoading && (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-input bg-popover shadow-lg">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(s)}
                className="flex w-full flex-col px-4 py-2.5 text-left hover:bg-muted transition-colors"
              >
                <span className="text-sm font-medium text-foreground truncate">{s.address}</span>
                <span className="text-xs text-muted-foreground truncate">{s.city ? `${s.city}, ` : ""}{s.state}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
