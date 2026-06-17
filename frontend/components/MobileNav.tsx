"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type NavItem = {
  href: string;
  label: string;
};

const linkClassName =
  "block rounded-(--jp-radius) px-3 py-3 text-sm font-semibold uppercase tracking-wider text-jp-ink hover:bg-jp-paper hover:text-jp-matcha";

export function MobileNav({ items }: { items: NavItem[] }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Mở menu"
        type="button"
      >
        <MenuIcon />
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Mở menu"
          />
        }
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(100%,18rem)] bg-jp-cream p-0">
        <SheetHeader className="border-b border-jp-border px-4 py-4">
          <SheetTitle className="text-left text-lg font-semibold text-jp-ink">
            JP Bùi Đặng
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col px-2 py-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClassName}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-jp-border px-4 py-4">
          <Link
            href="/account"
            className={linkClassName}
            onClick={() => setOpen(false)}
          >
            Tài khoản
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
