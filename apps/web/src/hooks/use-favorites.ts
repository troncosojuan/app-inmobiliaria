"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

export interface FavoriteProperty {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  type: string;
  operation: string;
  city: string;
  bedrooms: number | null;
  bathrooms: number | null;
  totalArea: number | null;
  imageUrl: string;
}

const STORAGE_KEY = "property-favorites";

function getStoredFavorites(): FavoriteProperty[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: FavoriteProperty[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>(() => getStoredFavorites());

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const addFavorite = useCallback((property: FavoriteProperty) => {
    setFavorites((prev) => {
      if (prev.some((p) => p.id === property.id)) return prev;
      return [...prev, property];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((p) => p.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (property: FavoriteProperty) => {
      setFavorites((prev) => {
        const exists = prev.some((p) => p.id === property.id);
        if (exists) {
          return prev.filter((p) => p.id !== property.id);
        }
        return [...prev, property];
      });
    },
    []
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const favoritesCount = useMemo(() => favorites.length, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount,
  };
}
