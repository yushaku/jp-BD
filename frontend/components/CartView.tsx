"use client";

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCart,
  useCheckoutHandoff,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { data: cart, isLoading, isError } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const checkout = useCheckoutHandoff();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-40 w-full lg:ml-auto lg:max-w-xs" />
      </div>
    );
  }

  if (isError || !cart || cart.items.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">Giỏ hàng trống.</p>
        <Link
          href="/shop"
          className={cn(buttonVariants(), "inline-flex")}
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="space-y-4">
        {cart.items.map((item) => (
          <li key={item.key}>
            <Card className="border-jp-border bg-jp-cream py-4">
              <CardContent className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-white">
                  {item.images[0] && (
                    <Image
                      src={item.images[0].src}
                      alt={item.images[0].alt || item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm font-semibold text-jp-indigo">
                    {formatPrice(
                      item.prices.price,
                      item.prices.currency_minor_unit,
                    )}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={updateItem.isPending}
                      onClick={() =>
                        updateItem.mutate({
                          key: item.key,
                          quantity: item.quantity - 1,
                        })
                      }
                    >
                      <Minus />
                    </Button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={updateItem.isPending}
                      onClick={() =>
                        updateItem.mutate({
                          key: item.key,
                          quantity: item.quantity + 1,
                        })
                      }
                    >
                      <Plus />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-destructive"
                      disabled={removeItem.isPending}
                      onClick={() => removeItem.mutate(item.key)}
                    >
                      <Trash2 />
                      Xóa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <Card className="h-fit border-jp-border bg-jp-cream">
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-lora)]">
            Tổng cộng
          </CardTitle>
          <CardDescription>
            Chuyển sang WordPress để chọn phương thức thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-2xl font-semibold text-jp-indigo">
            {formatPrice(
              cart.totals.total_price,
              cart.totals.currency_minor_unit,
            )}
          </p>
          <Button
            type="button"
            className="w-full uppercase tracking-wider"
            disabled={checkout.isPending}
            onClick={() => checkout.mutate()}
          >
            {checkout.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Đang chuyển...
              </>
            ) : (
              "Thanh toán"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
