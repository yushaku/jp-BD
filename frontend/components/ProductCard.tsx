import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice, getSalePercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getVolume } from "@/lib/woocommerce";
import type { WcProduct } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";

const TOP_RANK_STYLES = [
  { bg: "bg-[#e8913a]", tip: "border-t-[#e8913a]" },
  { bg: "bg-[#f0a04b]", tip: "border-t-[#f0a04b]" },
  { bg: "bg-[#f5b85a]", tip: "border-t-[#f5b85a]" },
  { bg: "bg-jp-muted", tip: "border-t-jp-muted" },
  { bg: "bg-jp-muted", tip: "border-t-jp-muted" },
  { bg: "bg-jp-muted", tip: "border-t-jp-muted" },
] as const;

function getFakeReviewCount(productId: number): number {
  return 36 + ((productId * 67) % 924);
}

function getDisplaySales(product: WcProduct): number {
  if (product.total_sales != null && product.total_sales > 0) {
    return product.total_sales;
  }
  return 120 + ((product.id * 41) % 880);
}

function getBrandLabel(product: WcProduct): string {
  return product.categories[0]?.name.toUpperCase() ?? "JP BÙI ĐẶNG";
}

function TopRankBadge({ rank }: { rank: number }) {
  const style = TOP_RANK_STYLES[Math.min(rank - 1, TOP_RANK_STYLES.length - 1)];

  return (
    <div className="absolute top-0 left-0 z-10 w-6 text-center text-white sm:w-12">
      <div className={cn("relative px-1.5 py-2 shadow-sm", style.bg)}>
        <span className="block text-[0.45rem] font-bold uppercase leading-none tracking-wide sm:text-[0.5rem]">
          Top
        </span>
        <span className="block text-base font-bold leading-none sm:text-lg">
          {rank}
        </span>
        <span
          className={cn(
            "absolute -bottom-2 left-1/2 block size-0 -translate-x-1/2 border-x-22 border-t-8 border-x-transparent",
            style.tip,
          )}
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
  const volume = getVolume(product);
  const salePrice = product.sale_price || product.price;
  const salePercent = product.on_sale
    ? getSalePercent(product.regular_price, salePrice)
    : null;
  const reviewCount = getFakeReviewCount(product.id);
  const monthlySales = getDisplaySales(product);
  const brand = getBrandLabel(product);

  return (
    <Card
      className={cn(
        "overflow-hidden border-jp-border py-0 shadow-(--jp-shadow) transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(26,26,26,0.1)]",
        isBestseller ? "bg-white" : "flex h-full flex-col bg-jp-cream",
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className={cn("block", !isBestseller && "flex flex-1 flex-col")}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-white",
            isBestseller ? "aspect-square" : "aspect-4/5",
          )}
        >
          {rank != null && <TopRankBadge rank={rank} />}

          {image ? (
            <img
              src={image.src}
              alt={image.alt || product.name}
              loading="lazy"
              decoding="async"
              className={cn(
                "absolute inset-0 size-full transition-transform duration-300 group-hover/card:scale-[1.03]",
                isBestseller ? "object-contain p-4" : "object-cover",
              )}
            />
          ) : (
            <div
              className={cn(
                "flex h-full items-center justify-center text-muted-foreground",
                isBestseller
                  ? "text-sm"
                  : "px-2 text-center text-xs sm:text-sm",
              )}
            >
              Không có ảnh
            </div>
          )}

          {salePercent && (
            <Badge
              variant="default"
              className={cn(
                "absolute z-10 border-0 font-bold",
                isBestseller
                  ? "top-2 right-2 bg-jp-matcha p-2 text-white sm:text-xs"
                  : "right-1.5 bottom-1.5 bg-jp-vermillion px-1.5 py-0.5 text-[0.6rem] sm:right-2 sm:bottom-2 sm:text-xs",
              )}
            >
              -{salePercent}%
            </Badge>
          )}
        </div>

        <CardContent
          className={cn(
            "px-3 sm:px-4",
            isBestseller
              ? "space-y-1.5 pt-3 pb-4 sm:pt-4"
              : "flex flex-1 flex-col pt-3 pb-2 sm:pt-4",
          )}
        >
          {isBestseller && (
            <p className="text-[0.6rem] font-medium tracking-[0.08em] text-jp-muted uppercase sm:text-[0.65rem]">
              {brand}
            </p>
          )}

          <h3
            className={cn(
              "line-clamp-2 text-sm leading-snug font-semibold",
              isBestseller ? "text-jp-ink sm:text-[0.95rem]" : "sm:text-[1.05rem]",
            )}
          >
            {product.name}
          </h3>

          {!isBestseller && volume && (
            <span className="mt-1 block text-[0.65rem] text-muted-foreground sm:text-xs">
              {volume}
            </span>
          )}

          <div
            className={cn(
              "flex flex-wrap items-baseline gap-1.5 sm:gap-2",
              isBestseller ? "pt-0.5" : "mt-2",
            )}
          >
            <p
              className={cn(
                "font-semibold",
                isBestseller
                  ? "text-base font-bold text-jp-vermillion sm:text-lg"
                  : "text-sm text-jp-gold sm:text-[0.95rem]",
              )}
            >
              {formatPrice(product.on_sale ? salePrice : product.price)}
            </p>
            {product.on_sale && product.regular_price && (
              <p
                className={cn(
                  "text-jp-muted line-through",
                  isBestseller
                    ? "text-xs sm:text-sm"
                    : "text-[0.65rem] sm:text-xs",
                )}
              >
                {formatPrice(product.regular_price)}
              </p>
            )}
          </div>

          <div
            className={cn(
              "flex items-center justify-between gap-1",
              isBestseller ? "gap-2 pt-1" : "mt-2",
            )}
          >
            <div className="flex min-w-0 items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "size-3 shrink-0 sm:size-3.5",
                    isBestseller
                      ? "fill-[#f5c518] text-[#f5c518]"
                      : "fill-jp-gold text-jp-gold",
                  )}
                  aria-hidden
                />
              ))}
              <span className="ml-0.5 text-[0.65rem] text-jp-muted sm:text-xs">
                ({reviewCount})
              </span>
            </div>
            <span className="shrink-0 text-[0.65rem] whitespace-nowrap text-jp-muted sm:text-xs">
              {isBestseller
                ? `bán (${monthlySales})/tháng`
                : `${monthlySales}/tháng`}
            </span>
          </div>
        </CardContent>
      </Link>

      {!isBestseller && (
        <CardFooter className="border-0 bg-transparent px-3 pt-0 pb-3 sm:px-4 sm:pb-4">
          <AddToCartButton
            productId={product.id}
            stockStatus={product.stock_status}
            className="h-8 w-full text-[0.65rem] uppercase tracking-wide sm:h-9 sm:text-xs"
          />
        </CardFooter>
      )}
    </Card>
  );
}
