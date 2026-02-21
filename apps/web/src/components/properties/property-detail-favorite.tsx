"use client";

import { FavoriteButton } from "./favorite-button";
import type { FavoriteProperty } from "@/hooks/use-favorites";

interface Props {
  property: FavoriteProperty;
}

export function PropertyDetailFavorite({ property }: Props) {
  return <FavoriteButton property={property} variant="full" />;
}
