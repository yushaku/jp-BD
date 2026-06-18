import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { WcProduct } from "@/lib/types";

export function ProductBreadcrumb({ product }: { product: WcProduct }) {
  const category = product.categories[0];

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
      <Link
        href="/shop"
        className="cursor-pointer transition-colors duration-200 hover:text-jp-indigo"
      >
        Cửa hàng
      </Link>
      {category && (
        <>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <Link
            href={`/category/${category.slug}`}
            className="cursor-pointer transition-colors duration-200 hover:text-jp-indigo"
          >
            {category.name}
          </Link>
        </>
      )}
      <ChevronRight className="size-3.5 shrink-0" aria-hidden />
      <span className="line-clamp-1 font-medium text-jp-ink">{product.name}</span>
    </nav>
  );
}
