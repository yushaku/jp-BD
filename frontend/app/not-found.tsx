import Link from "next/link";
import { Home, ShoppingBag } from "lucide-react";
import { BackLink } from "@/components/BackLink";
import { buttonVariants } from "@/components/ui/button";
import { CATEGORY_CARDS } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <section
      role="alert"
      aria-live="polite"
      className="relative flex min-h-[min(72dvh,680px)] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(143,189,143,0.12),transparent_45%),radial-gradient(circle_at_85%_15%,rgba(232,213,204,0.35),transparent_50%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-lg">
        <p className="text-xs font-semibold tracking-[0.2em] text-jp-gold uppercase">
          Lỗi 404
        </p>

        <h1 className="mt-4 text-[clamp(1.75rem,5vw,2.5rem)] leading-tight font-semibold text-jp-ink">
          Không tìm thấy trang
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-jp-muted">
          Đường dẫn có thể đã thay đổi hoặc sản phẩm không còn bán. Hãy quay
          lại cửa hàng để tiếp tục mua sắm.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/shop"
            className={cn(
              buttonVariants({ size: "lg" }),
              "inline-flex w-full cursor-pointer uppercase tracking-wider transition-colors duration-200 sm:w-auto",
            )}
          >
            <ShoppingBag className="size-4" aria-hidden />
            Khám phá cửa hàng
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "inline-flex w-full cursor-pointer uppercase tracking-wider transition-colors duration-200 sm:w-auto",
            )}
          >
            <Home className="size-4" aria-hidden />
            Về trang chủ
          </Link>
        </div>

        <nav
          aria-label="Danh mục gợi ý"
          className="mt-10 border-t border-jp-border/60 pt-8"
        >
          <p className="mb-4 text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
            Hoặc xem danh mục
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORY_CARDS.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="inline-flex cursor-pointer items-center rounded-(--jp-radius) bg-jp-cream px-3 py-2 text-sm font-medium text-jp-indigo shadow-(--jp-shadow) transition-colors duration-200 hover:bg-white hover:text-jp-matcha"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <BackLink className="mt-8 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-jp-muted transition-colors duration-200 hover:text-jp-indigo" />
      </div>
    </section>
  );
}
