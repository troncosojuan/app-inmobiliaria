import type { Metadata } from "next";
import { FavoritesPageClient } from "@/components/properties/favorites-page-client";

export const metadata: Metadata = {
  title: "Mis favoritos",
  description: "Propiedades guardadas y comparador",
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <FavoritesPageClient />
    </div>
  );
}
