"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";

export function CartNavLink() {
  const { data: cart } = useCart();
  const count = cart?.items_count ?? 0;

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-1 text-xs font-bold uppercase text-jp-ink hover:text-jp-gold"
    >
      <ShoppingCart className="size-4" />
      <span className="text-jp-ink">Giỏ hàng</span>
      {count > 0 && (
        <span className="absolute -right-3 -top-2 flex size-4 items-center justify-center rounded-full bg-jp-vermillion text-[0.6rem] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
