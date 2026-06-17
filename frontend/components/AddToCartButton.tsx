"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-cart";

export function AddToCartButton({
  productId,
  stockStatus = "instock",
  label = "Thêm vào giỏ",
  className,
}: {
  productId: number;
  stockStatus?: string;
  label?: string;
  className?: string;
}) {
  const { mutate, isPending } = useAddToCart();
  const outOfStock = stockStatus !== "instock";

  return (
    <Button
      type="button"
      variant="outline"
      className={className ?? "w-full uppercase tracking-wider"}
      disabled={isPending || outOfStock}
      onClick={() => mutate({ productId, quantity: 1 })}
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" />
          Đang thêm...
        </>
      ) : outOfStock ? (
        "Hết hàng"
      ) : (
        label
      )}
    </Button>
  );
}
