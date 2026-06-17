import { Section } from "@/components/Section";
import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/woocommerce";
import { ShopCatalog } from "./components";

export const metadata = {
  title: "Cửa hàng",
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
    <Section title="Cửa hàng" description="Thực phẩm, mỹ phẩm & TPCN Nhật Bản">
      <ShopCatalog
        categories={categories}
        products={products}
        activeSlug={activeCategory?.slug}
        activeCategory={activeCategory}
      />
    </Section>
  );
}
