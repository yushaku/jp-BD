import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function NewsBreadcrumb({ articleTitle }: { articleTitle?: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-jp-muted"
    >
      <Link
        href="/"
        className="cursor-pointer transition-colors duration-200 hover:text-jp-indigo"
      >
        Trang chủ
      </Link>
      <ChevronRight className="size-3.5 shrink-0" aria-hidden />
      {articleTitle ? (
        <>
          <Link
            href="/tin-tuc"
            className="cursor-pointer transition-colors duration-200 hover:text-jp-indigo"
          >
            Tin tức
          </Link>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1 font-medium text-jp-ink">
            {articleTitle}
          </span>
        </>
      ) : (
        <span className="font-medium text-jp-ink">Tin tức</span>
      )}
    </nav>
  );
}
