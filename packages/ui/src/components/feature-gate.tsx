"use client";

import type { ReactNode } from "react";
import { Lock } from "lucide-react";

interface FeatureGateProps {
  enabled: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  featureName?: string;
}

function DefaultFallback({ featureName }: { featureName?: string }) {
  return (
    <div className="relative rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 p-6">
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {featureName || "Esta función"} no está disponible en tu plan
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Contactá a soporte para mejorar tu plan y desbloquear esta función.
          </p>
        </div>
      </div>
    </div>
  );
}

export function FeatureGate({ enabled, children, fallback, featureName }: FeatureGateProps) {
  if (enabled) return <>{children}</>;
  return <>{fallback ?? <DefaultFallback featureName={featureName} />}</>;
}

export function FeatureGateInline({
  enabled,
  children,
  tooltip,
}: {
  enabled: boolean;
  children: ReactNode;
  tooltip?: string;
}) {
  if (enabled) return <>{children}</>;

  return (
    <div className="relative inline-block cursor-not-allowed opacity-50" title={tooltip || "No disponible en tu plan"}>
      <div className="pointer-events-none">{children}</div>
    </div>
  );
}
