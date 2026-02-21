"use client";

import Link from "next/link";
import { StaggerList, StaggerItem, AnimatedCounter } from "@/components/motion";
import { ICON_COLORS, type ColorKey } from "@app-inmobiliaria/ui";
import {
  Building2, Users, TrendingUp, Star, BarChart3, UserCog,
  Calculator, Settings, Plus, FileSpreadsheet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Building2, Users, TrendingUp, Star, BarChart3, UserCog,
  Calculator, Settings, Plus, FileSpreadsheet,
};

interface MetricCard {
  label: string;
  value: number;
  suffix?: string;
  iconName: string;
  color: ColorKey;
  href: string;
}

interface AnimatedStatsProps {
  cards: MetricCard[];
}

export function AnimatedStats({ cards }: AnimatedStatsProps) {
  return (
    <StaggerList className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const colors = ICON_COLORS[card.color];
        const Icon = ICON_MAP[card.iconName] || Building2;
        return (
          <StaggerItem key={card.label}>
            <Link href={card.href}>
              <div className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <div className={`inline-flex rounded-lg p-2.5 ${colors.bg}`}>
                    <div className={colors.text}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground transition-colors group-hover:text-foreground"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </div>
                <div className="mt-4 text-3xl font-bold text-foreground">
                  <AnimatedCounter
                    value={card.value}
                    suffix={card.suffix}
                    duration={1.2}
                    decimals={card.suffix === "%" ? 1 : 0}
                  />
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{card.label}</div>
              </div>
            </Link>
          </StaggerItem>
        );
      })}
    </StaggerList>
  );
}
