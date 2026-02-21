import { Suspense } from "react";
import { FeatureGateService } from "@app-inmobiliaria/api";
import { requireAuth } from "@/lib/auth";
import { FeatureGate, Skeleton } from "@app-inmobiliaria/ui";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";

export const metadata = { title: "Analytics" };

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export default async function AnalyticsPage() {
  const user = await requireAuth();
  const hasAnalytics = await FeatureGateService.checkFeature(user.tenantId, "analytics");

  return (
    <FeatureGate enabled={hasAnalytics} featureName="Analytics">
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsDashboard />
      </Suspense>
    </FeatureGate>
  );
}
