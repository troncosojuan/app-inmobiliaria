import { Skeleton } from "@app-inmobiliaria/ui";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 shadow-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-20" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-4 h-[250px] w-full" />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-4 h-[250px] w-full" />
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <Skeleton className="h-5 w-48" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
