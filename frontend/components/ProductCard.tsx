import Image from "next/image";
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
    <Card className="overflow-hidden border-jp-border bg-jp-cream py-0 shadow-(--jp-shadow) transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(26,26,26,0.1)]">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square bg-white">
          {product.on_sale && (
            <Badge className="absolute left-2 top-2 z-10 uppercase">Sale</Badge>
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
          <h3 className="text-[1.05rem] font-semibold">{product.name}</h3>
          {volume && (
            <span className="mt-1 block text-xs text-muted-foreground">
              {volume}
            </span>
          )}
          <p className="mt-2 text-[0.95rem] font-semibold text-jp-indigo">
            {formatPrice(product.price)}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="border-0 bg-transparent pt-0">
        <AddToCartButton productId={product.id} />
      </CardFooter>
    </Card>
  );
}

export function ProductGrid({ products }: { products: WcProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="text-center text-muted-foreground">Chưa có sản phẩm nào.</p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
