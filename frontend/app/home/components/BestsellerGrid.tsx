import { ProductCard } from "@/components/ProductCard";
import type { WcProduct } from "@/lib/types";

export function BestsellerGrid({ products }: { products: WcProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="text-center text-muted-foreground">Chưa có sản phẩm nào.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          rank={index + 1}
          variant="bestseller"
        />
      ))}
    </div>
  );
}
