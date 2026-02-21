"use client";

import { Sparkles, Star, Clock } from "lucide-react";
import { cn } from "@app-inmobiliaria/ui";

interface PropertyBadgesProps {
  isFeatured?: boolean;
  createdAt?: string | Date;
  priceReduced?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const DAYS_NEW = 7;

function isNew(createdAt?: string | Date): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const diff = Date.now() - created.getTime();
  return diff < DAYS_NEW * 24 * 60 * 60 * 1000;
}

function daysAgo(createdAt: string | Date): string {
  const diff = Date.now() - new Date(createdAt).getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  return `Hace ${days}d`;
}

export function PropertyBadges({ isFeatured, createdAt, priceReduced, size = "md", className }: PropertyBadgesProps) {
  const badges: React.ReactNode[] = [];
  const base = size === "sm"
    ? "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
    : "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold";
  const iconSize = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";

  if (isNew(createdAt)) {
    badges.push(
      <span key="new" className={cn(base, "bg-emerald-500 text-white shadow")}>
        <Sparkles className={iconSize} />
        Nueva
      </span>
    );
  }

  if (priceReduced) {
    badges.push(
      <span key="reduced" className={cn(base, "bg-orange-500 text-white shadow")}>
        Precio reducido
      </span>
    );
  }

  if (isFeatured) {
    badges.push(
      <span key="featured" className={cn(base, "bg-amber-500 text-white shadow")}>
        <Star className={cn(iconSize, "fill-current")} />
        Destacada
      </span>
    );
  }

  if (createdAt && !isNew(createdAt)) {
    const days = daysAgo(createdAt);
    badges.push(
      <span key="date" className={cn(base, "bg-white/90 text-muted-foreground shadow backdrop-blur dark:bg-slate-800/90 dark:text-slate-300")}>
        <Clock className={iconSize} />
        {days}
      </span>
    );
  }

  if (badges.length === 0) return null;

  return <div className={cn("flex flex-wrap gap-1.5", className)}>{badges}</div>;
}
