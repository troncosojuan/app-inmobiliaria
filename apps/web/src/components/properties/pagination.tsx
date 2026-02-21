import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TenantWithPlan } from "@/lib/tenant";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  tenant: TenantWithPlan;
  searchParams: Record<string, string | undefined>;
}

export function Pagination({ currentPage, totalPages, tenant, searchParams }: PaginationProps) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    params.set("page", page.toString());
    return `/propiedades?${params.toString()}`;
  };

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Paginación">
      <Link
        href={createPageUrl(Math.max(1, currentPage - 1))}
        className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition-colors ${
          currentPage === 1
            ? "pointer-events-none opacity-50"
            : "hover:bg-muted"
        }`}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((page) => {
        if (page === "dots-start" || page === "dots-end") {
          return (
            <span key={page} className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground">
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={createPageUrl(page as number)}
            aria-current={isActive ? "page" : undefined}
            className="flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors"
            style={
              isActive
                ? { backgroundColor: tenant.primaryColor, color: "white", borderColor: tenant.primaryColor }
                : {}
            }
          >
            {page}
          </Link>
        );
      })}

      <Link
        href={createPageUrl(Math.min(totalPages, currentPage + 1))}
        className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition-colors ${
          currentPage === totalPages
            ? "pointer-events-none opacity-50"
            : "hover:bg-muted"
        }`}
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}

function getVisiblePages(current: number, total: number): (number | "dots-start" | "dots-end")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 3) return [1, 2, 3, 4, "dots-end", total];
  if (current >= total - 2) return [1, "dots-start", total - 3, total - 2, total - 1, total];
  return [1, "dots-start", current - 1, current, current + 1, "dots-end", total];
}
