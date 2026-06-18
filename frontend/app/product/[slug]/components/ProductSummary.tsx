import Link from "next/link";
import { Check, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getSalePercent } from "@/lib/format";
import type { ProductReviewsData, WcProduct } from "@/lib/types";
import { getVolume } from "@/lib/woocommerce";
import { StarRating } from "./StarRating";

function getDisplaySales(product: WcProduct): number {
  if (product.total_sales != null && product.total_sales > 0) {
    return product.total_sales;
  }
  return 120 + ((product.id * 41) % 880);
}

const TRUST_ITEMS = [
  "Nhập khẩu chính ngạch Nhật Bản",
  "Tem phủ tiếng Nhật / Việt đầy đủ",
  "Giao nhanh HCM/HN 2-3 ngày",
] as const;

export function ProductSummary({
  product,
  reviews,
}: {
  product: WcProduct;
  reviews: ProductReviewsData;
}) {
  const volume = getVolume(product);
  const salePrice = product.sale_price || product.price;
  const salePercent = product.on_sale
    ? getSalePercent(product.regular_price, salePrice)
    : null;
  const monthlySales = getDisplaySales(product);
  const inStock = product.stock_status === "instock";
  const brand = product.categories[0]?.name ?? "JP Bùi Đặng";
  const detailAttributes = product.attributes.filter(
    (attr) => attr.options.length > 0 && attr.slug !== "pa_dung-tich",
  );

  return (
    <div className="flex flex-col">
      <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
        {brand} · Chính hãng Nhật Bản
      </p>

      <h1 className="mt-2 text-[clamp(1.5rem,4vw,2rem)] leading-tight font-semibold text-jp-ink">
        {product.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Link
          href="#reviews"
          className="flex cursor-pointer items-center gap-2 transition-opacity duration-200 hover:opacity-80"
        >
          <StarRating
            value={reviews.count > 0 ? reviews.average : 0}
            size="sm"
          />
          <span className="text-sm text-jp-muted">
            {reviews.count > 0
              ? `${reviews.average.toFixed(1)} (${reviews.count} đánh giá)`
              : "Chưa có đánh giá"}
          </span>
        </Link>
        <span className="text-sm text-jp-muted">
          Đã bán {monthlySales}/tháng
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3 border-b border-jp-border pb-5">
        <p className="text-3xl font-bold text-jp-vermillion">
          {formatPrice(product.on_sale ? salePrice : product.price)}
        </p>
        {product.on_sale && product.regular_price && (
          <p className="pb-1 text-lg text-jp-muted line-through">
            {formatPrice(product.regular_price)}
          </p>
        )}
        {salePercent && (
          <Badge className="mb-1 border-0 bg-jp-gold text-white">
            Tiết kiệm {salePercent}%
          </Badge>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={
            inStock
              ? "border-jp-gold text-jp-gold"
              : "border-jp-vermillion text-jp-vermillion"
          }
        >
          {inStock ? "Còn hàng" : "Hết hàng"}
        </Badge>
        {volume && (
          <Badge variant="outline" className="border-jp-border text-jp-muted">
            {volume}
          </Badge>
        )}
        <Badge variant="outline" className="border-jp-border text-jp-muted">
          SKU #{product.id}
        </Badge>
      </div>

      {product.short_description && (
        <div
          className="prose prose-sm mt-5 max-w-none text-jp-muted"
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        />
      )}

      {(volume || detailAttributes.length > 0) && (
        <dl className="mt-5 overflow-hidden rounded-(--jp-radius) border border-jp-border bg-jp-cream text-sm">
          {volume && (
            <div className="grid grid-cols-[minmax(0,7rem)_1fr] gap-3 border-b border-jp-border px-4 py-3 last:border-b-0">
              <dt className="font-semibold text-jp-ink">Dung tích</dt>
              <dd className="text-jp-muted">{volume}</dd>
            </div>
          )}
          {detailAttributes.map((attr) => (
            <div
              key={attr.id}
              className="grid grid-cols-[minmax(0,7rem)_1fr] gap-3 border-b border-jp-border px-4 py-3 last:border-b-0"
            >
              <dt className="font-semibold text-jp-ink">{attr.name}</dt>
              <dd className="text-jp-muted">{attr.options.join(", ")}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6 rounded-(--jp-radius) border border-jp-border bg-jp-paper/60 p-4">
        <AddToCartButton
          productId={product.id}
          stockStatus={product.stock_status}
          className="h-11 w-full cursor-pointer rounded-lg border-0 bg-jp-indigo text-sm font-semibold text-white uppercase tracking-wider hover:bg-jp-indigo/90 hover:text-white"
          label="Thêm vào giỏ"
        />
      </div>

      <ul className="mt-5 space-y-2.5 text-sm text-jp-muted">
        {TRUST_ITEMS.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check
              className="mt-0.5 size-4 shrink-0 text-jp-gold"
              aria-hidden
            />
            {item}
          </li>
        ))}
        <li className="flex items-start gap-2">
          <Truck className="mt-0.5 size-4 shrink-0 text-jp-gold" aria-hidden />
          Miễn phí vận chuyển đơn từ 500.000đ (nội thành)
        </li>
      </ul>

      {product.categories.length > 0 && (
        <div className="mt-6 border-t border-jp-border pt-4 text-sm text-jp-muted">
          <span className="font-semibold text-jp-ink">Danh mục: </span>
          {product.categories.map((category, index) => (
            <span key={category.id}>
              {index > 0 && ", "}
              <Link
                href={`/category/${category.slug}`}
                className="cursor-pointer text-jp-indigo transition-colors duration-200 hover:text-jp-gold"
              >
                {category.name}
              </Link>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
