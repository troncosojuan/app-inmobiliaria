import * as React from "react";
import { cn } from "../utils";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
  config: Record<string, { label: string; bgClass: string }>;
}

function StatusBadge({ status, config, className, ...props }: StatusBadgeProps) {
  const statusInfo = config[status] || { label: status, bgClass: "bg-muted text-muted-foreground" };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        statusInfo.bgClass,
        className
      )}
      {...props}
    >
      {statusInfo.label}
    </span>
  );
}

export { StatusBadge, type StatusBadgeProps };
