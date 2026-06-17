"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-cart";

export function AddToCartButton({
  productId,
  label = "Thêm vào giỏ",
  className,
}: {
  productId: number;
  label?: string;
  className?: string;
}) {
  const { mutate, isPending } = useAddToCart();

  return (
    <Button
      type="button"
      variant="outline"
      className={className ?? "w-full uppercase tracking-wider"}
      disabled={isPending}
      onClick={() => mutate({ productId, quantity: 1 })}
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" />
          Đang thêm...
        </>
      ) : (
        label
      )}
    </Button>
  );
}
