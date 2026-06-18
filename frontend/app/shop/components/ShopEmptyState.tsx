import Link from "next/link";
import { PackageSearch, ShoppingBag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ShopEmptyState({ categoryName }: { categoryName?: string }) {
  return (
    <div className="flex flex-col items-center rounded-(--jp-radius) bg-jp-cream/60 px-6 py-16 text-center shadow-(--jp-shadow)">
      <div className="mb-4 rounded-full bg-jp-paper p-4 ring-1 ring-jp-border">
        <PackageSearch className="size-8 text-jp-gold" aria-hidden />
      </div>

      <h2 className="text-lg font-semibold text-jp-ink">
        Chưa có sản phẩm
        {categoryName ? ` trong "${categoryName}"` : ""}
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-jp-muted">
        Danh mục này đang được cập nhật. Hãy khám phá các danh mục khác hoặc
        quay lại sau.
      </p>

      <Link
        href="/shop"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-6 inline-flex cursor-pointer gap-2 uppercase tracking-wider transition-colors duration-200",
        )}
      >
        <ShoppingBag className="size-4" aria-hidden />
        Xem tất cả sản phẩm
      </Link>
    </div>
  );
}
