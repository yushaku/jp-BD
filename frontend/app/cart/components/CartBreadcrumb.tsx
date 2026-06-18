import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function CartBreadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-jp-muted"
    >
      <Link href="/" className="cursor-pointer transition-colors hover:text-jp-indigo">
        Trang chủ
      </Link>
      <ChevronRight className="size-3.5 shrink-0" aria-hidden />
      <Link
        href="/shop"
        className="cursor-pointer transition-colors hover:text-jp-indigo"
      >
        Cửa hàng
      </Link>
      <ChevronRight className="size-3.5 shrink-0" aria-hidden />
      <span className="font-medium text-jp-ink">Giỏ hàng</span>
    </nav>
  );
}
