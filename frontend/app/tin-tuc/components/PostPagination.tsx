import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function pageHref(page: number) {
  return page <= 1 ? "/tin-tuc" : `/tin-tuc?page=${page}`;
}

function getPageNumbers(current: number, total: number): number[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export function PostPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Phân trang tin tức"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={pageHref(page - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-jp-border px-3 py-2 text-sm font-semibold text-jp-indigo hover:bg-jp-cream"
        >
          <ChevronLeft className="size-4" />
          Trước
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-jp-border px-3 py-2 text-sm font-semibold text-jp-muted opacity-50">
          <ChevronLeft className="size-4" />
          Trước
        </span>
      )}

      <div className="flex items-center gap-1">
        {pages.map((p, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;

          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-1 text-jp-muted" aria-hidden>
                  …
                </span>
              )}
              <Link
                href={pageHref(p)}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border text-sm font-semibold",
                  p === page
                    ? "border-jp-indigo bg-jp-indigo text-jp-cream"
                    : "border-jp-border text-jp-indigo hover:bg-jp-cream",
                )}
              >
                {p}
              </Link>
            </span>
          );
        })}
      </div>

      {page < totalPages ? (
        <Link
          href={pageHref(page + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-jp-border px-3 py-2 text-sm font-semibold text-jp-indigo hover:bg-jp-cream"
        >
          Sau
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-jp-border px-3 py-2 text-sm font-semibold text-jp-muted opacity-50">
          Sau
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
