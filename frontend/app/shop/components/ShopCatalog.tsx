import { ProductGrid } from "@/components/ProductGrid";
import type { WcCategory, WcProduct } from "@/lib/types";
import { CategorySidebar, groupCategories } from "./CategorySidebar";

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
    <div className="flex flex-col-reverse gap-6 lg:flex-row lg:items-start lg:gap-8">
      <div className="min-w-0 flex-1">
        {activeCategory && (
          <header className="mb-4 pb-3">
            <h2 className="text-xl font-semibold text-jp-ink">
              {activeCategory.name}
            </h2>
            <p className="mt-1 text-sm text-jp-muted">
              {activeCategory.count} sản phẩm
            </p>
          </header>
        )}
        <ProductGrid products={products} columns="shop" />
      </div>

      <div className="w-full shrink-0 lg:w-64 xl:w-72">
        <CategorySidebar groups={groups} activeSlug={activeSlug} />
      </div>
    </div>
  );
}
