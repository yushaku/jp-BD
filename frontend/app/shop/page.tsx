import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/woocommerce";
import { ShopCatalog, ShopHero } from "./components";

export const metadata = {
  title: "Cửa hàng",
  description:
    "Thực phẩm, mỹ phẩm & TPCN chính hãng từ Nhật Bản. Nhập khẩu uy tín, giao hàng toàn quốc.",
};

export const revalidate = 60;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;
  const categories = await getCategories();

  const activeCategory = categorySlug
    ? ((await getCategoryBySlug(categorySlug)) ??
      categories.find((category) => category.slug === categorySlug) ??
      categories[0])
    : categories[0];

  const products = activeCategory
    ? await getProductsByCategory(activeCategory.id, 24)
    : [];

  return (
    <>
      <ShopHero
        activeCategory={activeCategory}
        productCount={products.length}
        categoryCount={categories.length}
      />
      <div className="mx-auto mb-12 max-w-6xl px-6">
        <ShopCatalog
          categories={categories}
          products={products}
          activeSlug={activeCategory?.slug}
          activeCategory={activeCategory}
        />
      </div>
    </>
  );
}
