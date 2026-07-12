import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice, getSalePercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { WcProduct } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";

const TOP_RANK_STYLES = [
  { bg: "bg-[#e8913a]", tip: "bg-[#e8913a]" },
  { bg: "bg-[#f0a04b]", tip: "bg-[#f0a04b]" },
  { bg: "bg-[#f5b85a]", tip: "bg-[#f5b85a]" },
  { bg: "bg-jp-gold", tip: "bg-jp-gold" },
  { bg: "bg-jp-gold", tip: "bg-jp-gold" },
  { bg: "bg-jp-gold", tip: "bg-jp-gold" },
] as const;

function getBrandLabel(product: WcProduct): string {
  return product.categories[0]?.name.toUpperCase() ?? "JP BÙI ĐẶNG";
}

function TopRankBadge({ rank }: { rank: number }) {
  const style = TOP_RANK_STYLES[Math.min(rank - 1, TOP_RANK_STYLES.length - 1)];

  return (
    <div
      hidden={!rank}
      className="absolute top-0 left-0 z-10 w-10 text-center text-white sm:w-12"
    >
      <div className={cn("relative w-full px-1.5 py-2 shadow-sm", style.bg)}>
        <span className="block text-[0.45rem] font-bold uppercase leading-none tracking-wide sm:text-[0.5rem]">
          Top
        </span>
        <span className="block text-base font-bold leading-none sm:text-lg">
          {rank}
        </span>
        <span
          className={cn(
            "absolute -bottom-2 left-0 block h-2 w-full",
            style.tip,
          )}
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          aria-hidden
        />
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  rank,
  variant = rank != null ? "bestseller" : "default",
}: {
  product: WcProduct;
  rank?: number;
  variant?: "default" | "bestseller";
}) {
  const isBestseller = variant === "bestseller";
  const image = product.images[0];
  const salePrice = product.sale_price || product.price;
  const salePercent = product.on_sale
    ? getSalePercent(product.regular_price, salePrice)
    : null;
  const brand = getBrandLabel(product);
  const productHref = `/product/${product.slug}`;

  return (
    <Card
      className={cn(
        "flex aspect-3/4 w-full flex-col gap-0 overflow-hidden rounded-2xl border-2 border-jp-border/50 p-0 transition-all duration-200",
        "hover:border-jp-gold",
      )}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {rank != null && <TopRankBadge rank={rank} />}

        {salePercent && (
          <Badge
            variant="default"
            className="absolute bg-jp-matcha top-3 right-3 z-10 px-3 py-2 text-lg"
          >
            -{salePercent}%
          </Badge>
        )}

        <Link
          href={productHref}
          className="flex size-full items-center justify-center"
        >
          {image ? (
            <img
              src={image.src}
              alt={image.alt || product.name}
              loading="lazy"
              decoding="async"
              className="size-full object-contain transition-transform duration-300 group-hover/card:scale-[1.1]"
            />
          ) : (
            <span className="text-sm text-jp-muted">Không có ảnh</span>
          )}
        </Link>
      </div>

      <div className="flex shrink-0 rounded-t-[18px] flex-col bg-jp-paper p-3 shadow sm:p-3.5">
        <Link href={productHref} className="block min-w-0">
          {isBestseller && (
            <p className="mb-0.5 text-[0.55rem] font-semibold tracking-widest text-jp-muted uppercase sm:text-[0.6rem]">
              {brand}
            </p>
          )}

          <h3 className="line-clamp-1 text-sm leading-snug font-bold text-jp-ink sm:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-end justify-between gap-2 sm:mt-2 sm:gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <p className="text-base font-bold text-jp-ink sm:text-lg">
                {formatPrice(product.on_sale ? salePrice : product.price)}
              </p>
              {product.on_sale && product.regular_price && (
                <p className="text-[0.65rem] text-jp-muted line-through sm:text-xs">
                  {formatPrice(product.regular_price)}
                </p>
              )}
            </div>
          </div>

          <AddToCartButton
            productId={product.id}
            stockStatus={product.stock_status}
            className="h-8 shrink-0 rounded-lg border-0 bg-jp-indigo px-2.5 text-[0.6rem] font-semibold text-white uppercase tracking-wide hover:bg-jp-indigo/90 hover:text-white sm:h-9 sm:px-3 sm:text-[0.65rem]"
          />
        </div>
      </div>
    </Card>
  );
}
