"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

export function FavoritesNavIndicator() {
  const { favoritesCount } = useFavorites();

  return (
    <Link
      href="/favoritos"
      className="relative ml-1 rounded-lg p-2 text-foreground transition-colors hover:bg-muted"
      aria-label={`Favoritos (${favoritesCount})`}
    >
      <Heart className="h-5 w-5" />
      {favoritesCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {favoritesCount > 9 ? "9+" : favoritesCount}
        </span>
      )}
    </Link>
  );
}
