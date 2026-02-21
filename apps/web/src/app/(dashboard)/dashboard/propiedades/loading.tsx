import { Skeleton } from "@app-inmobiliaria/ui";

export default function PropertiesLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        {/* Header */}
        <div className="border-b px-5 py-3">
          <div className="flex items-center gap-8">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="hidden h-4 w-16 md:block" />
            <Skeleton className="hidden h-4 w-20 sm:block" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        </div>
        {/* Rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b px-5 py-4 last:border-b-0">
            <Skeleton className="h-10 w-14 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="hidden h-4 w-20 md:block" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
