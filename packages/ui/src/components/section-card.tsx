import * as React from "react";
import { cn } from "../utils";

interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  action?: React.ReactNode;
}

function SectionCard({
  title, description, icon, iconBg = "bg-blue-50", action, children, className, ...props
}: SectionCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)} {...props}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={cn("rounded-lg p-2", iconBg)}>{icon}</div>
            )}
            <div>
              {title && <h2 className="font-semibold text-foreground">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export { SectionCard, type SectionCardProps };
