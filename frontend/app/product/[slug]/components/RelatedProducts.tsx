import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/ProductGrid";
import type { WcProduct } from "@/lib/types";

export function RelatedProducts({
  products,
  categorySlug,
}: {
  products: WcProduct[];
  categorySlug?: string;
}) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-12 border-t border-jp-border pt-10"
      aria-labelledby="related-products-heading"
    >
      <header className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row sm:items-end">
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
            Gợi ý cho bạn
          </p>
          <h2
            id="related-products-heading"
            className="mt-1 text-[1.65rem] font-semibold text-jp-ink"
          >
            Sản phẩm liên quan
          </h2>
        </div>
        {categorySlug && (
          <Link
            href={`/category/${categorySlug}`}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-sm font-semibold uppercase tracking-wider text-jp-indigo transition-colors duration-200 hover:text-jp-matcha"
          >
            Xem tất cả
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </header>
      <ProductGrid products={products} />
    </section>
  );
}
