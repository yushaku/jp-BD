"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";

export function CartNavLink() {
  const [mounted, setMounted] = useState(false);
  const { data: cart } = useCart();
  const count = cart?.items_count ?? 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/cart"
      className="relative text-xs font-semibold uppercase tracking-wider text-jp-ink hover:text-jp-matcha"
    >
      Giỏ hàng
      {mounted && count > 0 && (
        <span className="absolute -right-3 -top-2 flex size-4 items-center justify-center rounded-full bg-jp-vermillion text-[0.6rem] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
