"use client";

import { Heart } from "lucide-react";
import { useFavorites, type FavoriteProperty } from "@/hooks/use-favorites";
import { cn } from "@app-inmobiliaria/ui";
import { toast } from "sonner";

interface FavoriteButtonProps {
  property: FavoriteProperty;
  variant?: "icon" | "full";
  className?: string;
}

export function FavoriteButton({ property, variant = "icon", className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(property.id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property);
    toast.success(active ? "Eliminado de favoritos" : "Agregado a favoritos", {
      duration: 2000,
    });
  }

  if (variant === "full") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
          active
            ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
            : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
          className,
        )}
      >
        <Heart className={cn("h-4 w-4 transition-all", active && "fill-current")} />
        {active ? "Guardada" : "Guardar"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full transition-all",
        active
          ? "bg-red-500 text-white shadow-md shadow-red-500/25"
          : "bg-white/90 text-muted-foreground shadow backdrop-blur hover:text-red-500",
        className,
      )}
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart className={cn("h-4 w-4 transition-all", active && "fill-current")} />
    </button>
  );
}
