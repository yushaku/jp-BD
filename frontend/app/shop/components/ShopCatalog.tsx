import { LayoutGrid } from "lucide-react";
import { ProductGrid } from "@/components/ProductGrid";
import type { WcCategory, WcProduct } from "@/lib/types";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { CategorySidebar, groupCategories } from "./CategorySidebar";
import { ShopEmptyState } from "./ShopEmptyState";

export function ShopCatalog({
  categories,
  products,
  activeSlug,
  activeCategory,
}: {
  categories: WcCategory[];
  products: WcProduct[];
  activeSlug?: string;
  activeCategory?: WcCategory;
}) {
  const groups = groupCategories(categories);

  return (
    <>
      <CategoryFilterBar groups={groups} activeSlug={activeSlug} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="w-full shrink-0 lg:w-64 xl:w-72">
          <CategorySidebar groups={groups} activeSlug={activeSlug} />
        </div>

        <div className="min-w-0 flex-1">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
              <LayoutGrid className="size-3.5" aria-hidden />
              Đang xem
            </p>
            <h2 className="mt-1 text-xl font-semibold text-jp-ink">
              {activeCategory?.name ?? "Tất cả sản phẩm"}
            </h2>
          </div>
          {activeCategory && (
            <p className="text-sm text-jp-muted">
              <span className="font-semibold text-jp-ink">
                {products.length}
              </span>{" "}
              / {activeCategory.count} sản phẩm
            </p>
          )}
        </header>

        {products.length === 0 ? (
          <ShopEmptyState categoryName={activeCategory?.name} />
        ) : (
          <ProductGrid products={products} columns="shop" />
        )}
        </div>
      </div>
    </>
  );
}
