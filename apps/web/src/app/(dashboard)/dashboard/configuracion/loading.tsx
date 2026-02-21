import { Skeleton } from "@app-inmobiliaria/ui";

function FormSection({ rows = 2 }: { rows?: number }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: rows * 2 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConfigLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-56" />
      </div>

      <FormSection rows={1} />
      <FormSection rows={1} />
      <FormSection rows={3} />
      <FormSection rows={1} />

      {/* Submit */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </div>
  );
}
