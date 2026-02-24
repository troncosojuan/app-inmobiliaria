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
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < minChars) {
        setSuggestions([]);
        setOpen(false);
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/address?query=${encodeURIComponent(query)}`);
        if (!res.ok) return;
        const mapped: Suggestion[] = await res.json();
        setSuggestions(mapped);
        setActiveIndex(-1);
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
    const val = e.target.value;
    onChange(val);
    if (val.length >= minChars) setIsLoading(true);
    fetchSuggestions(val);
  };

  const handleSelect = (s: Suggestion) => {
    // For locality results (no street), keep whatever the user typed as address
    // For street results, fill in the street
    if (s.address) onChange(s.address);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
    onSelectAddress?.({
      address: s.address,
      city: s.city,
      state: s.state,
      neighborhood: s.neighborhood,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      } else {
        // No item selected — select first suggestion automatically
        e.preventDefault();
        handleSelect(suggestions[0]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
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
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={
            inputClassName ??
            "flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          }
        />
        {isLoading && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </span>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-input bg-popover shadow-lg">
          {suggestions.map((s, i) => {
            // Locality result: address is empty, show city as primary
            const primary = s.address || s.city;
            const secondary = s.address
              ? [s.city, s.state].filter(Boolean).join(", ")
              : s.state;
            return (
              <li key={i}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(s)}
                  className={`flex w-full flex-col px-4 py-2.5 text-left transition-colors ${
                    i === activeIndex ? "bg-muted" : "hover:bg-muted"
                  }`}
                >
                  <span className="text-sm font-medium text-foreground truncate">{primary}</span>
                  {secondary && (
                    <span className="text-xs text-muted-foreground truncate">{secondary}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
