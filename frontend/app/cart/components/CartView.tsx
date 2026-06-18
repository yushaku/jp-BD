"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCart,
  useCheckoutHandoff,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { StoreCart, StoreCartItem } from "@/lib/types";

const TRUST_ITEMS = [
  "Nhập khẩu chính ngạch Nhật Bản",
  "Miễn phí vận chuyển đơn từ 500.000đ",
] as const;

function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-(--jp-radius)" />
        <Skeleton className="h-32 w-full rounded-(--jp-radius)" />
      </div>
      <Skeleton className="h-72 w-full rounded-(--jp-radius) lg:ml-auto" />
    </div>
  );
}

function CartEmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-(--jp-radius) border border-jp-border bg-jp-cream px-6 py-14 text-center shadow-(--jp-shadow)">
      <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-jp-paper">
        <ShoppingBag className="size-7 text-jp-gold" aria-hidden />
      </div>
      <h2 className="text-xl font-semibold text-jp-ink">Giỏ hàng trống</h2>
      <p className="mt-2 text-sm text-jp-muted">
        Bạn chưa thêm sản phẩm nào. Khám phá hàng Nhật chính hãng tại cửa hàng
        của chúng tôi.
      </p>
      <Link
        href="/shop"
        className={cn(
          buttonVariants(),
          "mt-6 inline-flex cursor-pointer bg-jp-indigo uppercase tracking-wider hover:bg-jp-indigo/90",
        )}
      >
        Khám phá sản phẩm
      </Link>
    </div>
  );
}

function CartItemCard({
  item,
  isUpdating,
  isRemoving,
  onUpdate,
  onRemove,
}: {
  item: StoreCartItem;
  isUpdating: boolean;
  isRemoving: boolean;
  onUpdate: (quantity: number) => void;
  onRemove: () => void;
}) {
  const unitPrice = formatPrice(
    item.prices.price,
    item.prices.currency_minor_unit,
  );
  const lineTotal = formatPrice(
    item.totals.line_total,
    item.totals.currency_minor_unit,
  );

  return (
    <li className="overflow-hidden rounded-(--jp-radius) border border-jp-border bg-jp-cream shadow-(--jp-shadow) transition-colors duration-200 hover:border-jp-gold/40">
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-(--jp-radius) border border-jp-border bg-white sm:size-24">
          {item.images[0] ? (
            <img
              src={item.images[0].src}
              alt={item.images[0].alt || item.name}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-jp-paper">
              <ShoppingBag className="size-6 text-jp-muted" aria-hidden />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 font-semibold text-jp-ink">
                {item.name}
              </h3>
              <p className="mt-1 text-sm text-jp-muted">
                Đơn giá:{" "}
                <span className="font-medium text-jp-indigo">{unitPrice}</span>
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 cursor-pointer text-jp-muted hover:bg-destructive/10 hover:text-destructive"
              disabled={isRemoving}
              aria-label={`Xóa ${item.name}`}
              onClick={onRemove}
            >
              <Trash2 />
            </Button>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
            <div
              className="inline-flex items-center overflow-hidden rounded-(--jp-radius) border border-jp-border bg-white"
              role="group"
              aria-label={`Số lượng ${item.name}`}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer rounded-none hover:bg-jp-paper"
                disabled={isUpdating || item.quantity <= 1}
                aria-label="Giảm số lượng"
                onClick={() => onUpdate(item.quantity - 1)}
              >
                <Minus />
              </Button>
              <span className="w-10 text-center text-sm font-semibold text-jp-ink">
                {item.quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer rounded-none hover:bg-jp-paper"
                disabled={isUpdating}
                aria-label="Tăng số lượng"
                onClick={() => onUpdate(item.quantity + 1)}
              >
                <Plus />
              </Button>
            </div>

            <p className="text-base font-bold text-jp-vermillion">
              {lineTotal}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

function CartSummary({
  cart,
  checkoutPending,
  onCheckout,
  className,
}: {
  cart: StoreCart;
  checkoutPending: boolean;
  onCheckout: () => void;
  className?: string;
}) {
  const subtotal = formatPrice(
    cart.totals.total_items,
    cart.totals.currency_minor_unit,
  );
  const total = formatPrice(
    cart.totals.total_price,
    cart.totals.currency_minor_unit,
  );

  return (
    <aside className={className}>
      <div className="rounded-(--jp-radius) border border-jp-border bg-jp-cream/95 p-5 shadow-(--jp-shadow) backdrop-blur-sm sm:p-6">
        <h2 className="text-lg font-semibold text-jp-ink">Tóm tắt đơn hàng</h2>
        <p className="mt-1 text-sm text-jp-muted">
          {cart.items_count} sản phẩm trong giỏ
        </p>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-jp-muted">Tạm tính</dt>
            <dd className="font-medium text-jp-ink">{subtotal}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-jp-muted">Vận chuyển</dt>
            <dd className="font-medium text-jp-gold">Tính khi thanh toán</dd>
          </div>
        </dl>

        <Separator className="my-5 bg-jp-border" />

        <div className="flex items-end justify-between gap-4">
          <span className="text-sm font-semibold text-jp-ink">Tổng cộng</span>
          <p className="text-2xl font-bold text-jp-vermillion">{total}</p>
        </div>

        <Button
          type="button"
          className="mt-6 h-11 w-full cursor-pointer border-0 bg-jp-indigo text-sm font-semibold uppercase tracking-wider hover:bg-jp-indigo/90"
          disabled={checkoutPending}
          onClick={onCheckout}
        >
          {checkoutPending ? (
            <>
              <Loader2 className="animate-spin" />
              Đang chuyển...
            </>
          ) : (
            "Thanh toán"
          )}
        </Button>

        <p className="mt-3 text-center text-xs text-jp-muted">
          Chuyển sang WordPress để chọn phương thức thanh toán
        </p>

        <Link
          href="/shop"
          className="mt-4 flex cursor-pointer items-center justify-center gap-1.5 text-sm text-jp-indigo transition-colors hover:text-jp-gold"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Tiếp tục mua sắm
        </Link>

        <ul className="mt-6 space-y-2 border-t border-jp-border pt-5 text-xs text-jp-muted">
          {TRUST_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check
                className="mt-0.5 size-3.5 shrink-0 text-jp-gold"
                aria-hidden
              />
              {item}
            </li>
          ))}
          <li className="flex items-start gap-2">
            <Truck
              className="mt-0.5 size-3.5 shrink-0 text-jp-gold"
              aria-hidden
            />
            Giao nhanh HCM/HN 2–3 ngày
          </li>
        </ul>
      </div>
    </aside>
  );
}

function MobileCheckoutBar({
  total,
  checkoutPending,
  onCheckout,
}: {
  total: string;
  checkoutPending: boolean;
  onCheckout: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-jp-border bg-jp-cream/95 px-4 py-3 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-jp-muted">Tổng cộng</p>
          <p className="truncate text-lg font-bold text-jp-vermillion">
            {total}
          </p>
        </div>
        <Button
          type="button"
          className="h-11 shrink-0 cursor-pointer border-0 bg-jp-indigo px-6 text-sm font-semibold uppercase tracking-wider hover:bg-jp-indigo/90"
          disabled={checkoutPending}
          onClick={onCheckout}
        >
          {checkoutPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Thanh toán"
          )}
        </Button>
      </div>
    </div>
  );
}

export function CartView() {
  const { data: cart, isLoading, isError } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const checkout = useCheckoutHandoff();

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (isError || !cart || cart.items.length === 0) {
    return <CartEmptyState />;
  }

  const total = formatPrice(
    cart.totals.total_price,
    cart.totals.currency_minor_unit,
  );

  return (
    <>
      <div className="grid gap-8 pb-24 lg:grid-cols-[1fr_340px] lg:pb-0">
        <ul className="space-y-4" aria-label="Sản phẩm trong giỏ">
          {cart.items.map((item) => (
            <CartItemCard
              key={item.key}
              item={item}
              isUpdating={updateItem.isPending}
              isRemoving={removeItem.isPending}
              onUpdate={(quantity) =>
                updateItem.mutate({ key: item.key, quantity })
              }
              onRemove={() => removeItem.mutate(item.key)}
            />
          ))}
        </ul>

        <CartSummary
          cart={cart}
          checkoutPending={checkout.isPending}
          onCheckout={() => checkout.mutate()}
          className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
        />
      </div>

      <MobileCheckoutBar
        total={total}
        checkoutPending={checkout.isPending}
        onCheckout={() => checkout.mutate()}
      />
    </>
  );
}
