import { ProductGrid } from "@/components/ProductGrid";
import type { WcProduct } from "@/lib/types";

export function RelatedProducts({ products }: { products: WcProduct[] }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-jp-border pt-10">
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
          Gợi ý cho bạn
        </p>
        <h2 className="mt-1 text-[1.65rem] text-jp-ink">Sản phẩm liên quan</h2>
      </header>
      <ProductGrid products={products} />
    </section>
  );
}
