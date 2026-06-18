import type { WcProduct } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  columns = "default",
}: {
  products: WcProduct[];
  columns?: "default" | "shop";
}) {
  if (products.length === 0) {
    return (
      <p className="text-center text-muted-foreground">Chưa có sản phẩm nào.</p>
    );
  }

  const gridClassName =
    columns === "shop"
      ? "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5"
      : "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5 lg:gap-5";

  return (
    <div className={gridClassName}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
