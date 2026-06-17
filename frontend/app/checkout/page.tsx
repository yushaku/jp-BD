"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCheckoutHandoff } from "@/hooks/use-cart";

export default function CheckoutPage() {
  const { mutate, isPending, isError, error } = useCheckoutHandoff();

  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      {isError ? (
        <>
          <p className="mb-4 text-destructive">
            {error instanceof Error
              ? error.message
              : "Không thể chuyển sang thanh toán."}
          </p>
          <Link href="/cart" className={cn(buttonVariants({ variant: "link" }))}>
            Quay lại giỏ hàng
          </Link>
        </>
      ) : (
        <p className="inline-flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {isPending ? "Đang chuyển sang trang thanh toán..." : "Đang xử lý..."}
        </p>
      )}
    </div>
  );
}
