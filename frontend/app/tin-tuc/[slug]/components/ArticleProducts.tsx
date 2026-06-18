import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/ProductGrid";
import type { WcProduct } from "@/lib/types";

export function ArticleProducts({ products }: { products: WcProduct[] }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="mx-auto mt-12 max-w-6xl border-t border-jp-border px-6 pt-10"
      aria-labelledby="article-products-heading"
    >
      <header className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row sm:items-end">
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
            Sản phẩm nổi bật
          </p>
          <h2
            id="article-products-heading"
            className="mt-1 text-[1.65rem] font-semibold text-jp-ink"
          >
            Có thể bạn quan tâm
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-sm font-semibold uppercase tracking-wider text-jp-indigo transition-colors duration-200 hover:text-jp-gold"
        >
          Xem tất cả
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </header>
      <ProductGrid products={products} />
    </section>
  );
}
