import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { getVolume } from "@/lib/woocommerce";
import type { WcProduct } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: WcProduct }) {
  const image = product.images[0];
  const volume = getVolume(product);

  return (
    <Card className="flex h-full flex-col overflow-hidden border-jp-border bg-jp-cream py-0 shadow-(--jp-shadow) transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(26,26,26,0.1)]">
      <Link href={`/product/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-4/5 overflow-hidden bg-white">
          {product.on_sale && (
            <Badge className="absolute left-1.5 top-1.5 z-10 text-[0.6rem] uppercase sm:left-2 sm:top-2 sm:text-xs">
              Sale
            </Badge>
          )}
          {image ? (
            <img
              src={image.src}
              alt={image.alt || product.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center text-xs text-muted-foreground sm:text-sm">
              Không có ảnh
            </div>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col px-3 pt-3 pb-2 sm:px-4 sm:pt-4">
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold sm:text-[1.05rem]">
            {product.name}
          </h3>
          {volume && (
            <span className="mt-1 block text-[0.65rem] text-muted-foreground sm:text-xs">
              {volume}
            </span>
          )}
          <p className="mt-auto pt-2 text-sm font-semibold text-jp-indigo sm:text-[0.95rem]">
            {formatPrice(product.price)}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="border-0 bg-transparent px-3 pt-0 pb-3 sm:px-4 sm:pb-4">
        <AddToCartButton
          productId={product.id}
          stockStatus={product.stock_status}
          className="h-8 w-full text-[0.65rem] uppercase tracking-wide sm:h-9 sm:text-xs"
        />
      </CardFooter>
    </Card>
  );
}

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
      : "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6";

  return (
    <div className={gridClassName}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
