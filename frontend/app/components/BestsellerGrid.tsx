import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPrice, getSalePercent } from "@/lib/format";
import { getVolume } from "@/lib/woocommerce";
import type { WcProduct } from "@/lib/types";

function BestsellerCard({
  product,
  rank,
}: {
  product: WcProduct;
  rank: number;
}) {
  const image = product.images[0];
  const volume = getVolume(product);
  const salePercent = product.on_sale
    ? getSalePercent(product.regular_price, product.sale_price || product.price)
    : null;

  return (
    <Card className="relative overflow-hidden border-jp-border bg-jp-cream py-0 shadow-(--jp-shadow) transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(26,26,26,0.1)]">
      <Badge className="absolute left-2 top-2 z-10 bg-jp-vermillion uppercase">
        TOP {rank}
      </Badge>
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square bg-white">
          {salePercent && (
            <Badge
              variant="outline"
              className="absolute right-2 top-2 z-10 border-jp-vermillion bg-white text-jp-vermillion"
            >
              -{salePercent}%
            </Badge>
          )}
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Không có ảnh
            </div>
          )}
        </div>
        <CardContent className="pt-4">
          <h3 className="line-clamp-2 text-[1.05rem] font-semibold">
            {product.name}
          </h3>
          {volume && (
            <span className="mt-1 block text-xs text-muted-foreground">
              {volume}
            </span>
          )}
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <p className="text-[0.95rem] font-semibold text-jp-indigo">
              {formatPrice(product.price)}
            </p>
            {product.on_sale && product.regular_price && (
              <p className="text-xs text-jp-muted line-through">
                {formatPrice(product.regular_price)}
              </p>
            )}
          </div>
          {product.total_sales != null && product.total_sales > 0 && (
            <p className="mt-1 text-xs text-jp-muted">
              Đã bán {product.total_sales}
            </p>
          )}
        </CardContent>
      </Link>
      <CardFooter className="border-0 bg-transparent pt-0">
        <AddToCartButton
          productId={product.id}
          stockStatus={product.stock_status}
        />
      </CardFooter>
    </Card>
  );
}

export function BestsellerGrid({ products }: { products: WcProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="text-center text-muted-foreground">Chưa có sản phẩm nào.</p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => (
        <BestsellerCard key={product.id} product={product} rank={index + 1} />
      ))}
    </div>
  );
}
