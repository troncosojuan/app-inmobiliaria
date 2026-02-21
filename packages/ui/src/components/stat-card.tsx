import * as React from "react";
import { cn } from "../utils";
import { ICON_COLORS } from "../utils/color-schemes";
import type { ColorKey } from "../utils/color-schemes";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
  colorScheme?: ColorKey;
  showArrow?: boolean;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ label, value, subtitle, icon, className, colorScheme = "blue", showArrow = false }, ref) => {
    const colors = ICON_COLORS[colorScheme];

    return (
      <div
        ref={ref}
        className={cn(
          "group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md",
          className
        )}
      >
        <div className="flex items-center justify-between">
          {icon && (
          <div className={cn("inline-flex rounded-lg p-2.5", colors.bg)}>
            <div className={colors.text}>{icon}</div>
            </div>
          )}
          {showArrow && (
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
          )}
        </div>
        <div className="mt-4 text-3xl font-bold text-foreground">{value}</div>
        <div className="mt-1 text-sm text-muted-foreground">
          {label}
          {subtitle && <span className="text-muted-foreground/60"> {subtitle}</span>}
        </div>
      </div>
    );
  }
);
StatCard.displayName = "StatCard";

export { StatCard, type StatCardProps };
