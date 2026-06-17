import { CategoryNav } from "@/components/CategoryNav";
import { Disclaimer, TrustBadges } from "@/components/TrustBadges";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductCard";
import { Section } from "@/components/Section";
import { getHero } from "@/lib/sos-api";
import {
  getCategoryBySlug,
  getPopularProducts,
  getProductsByCategory,
} from "@/lib/woocommerce";
import { CATEGORY_CARDS } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const [hero, popular, foodCat, beautyCat, tpcnCat] = await Promise.all([
    getHero(),
    getPopularProducts(8),
    getCategoryBySlug("thuc-pham-nhat"),
    getCategoryBySlug("my-pham-nhat"),
    getCategoryBySlug("tpcn"),
  ]);

  const [foodProducts, beautyProducts, tpcnProducts] = await Promise.all([
    foodCat ? getProductsByCategory(foodCat.id, 4) : Promise.resolve([]),
    beautyCat ? getProductsByCategory(beautyCat.id, 4) : Promise.resolve([]),
    tpcnCat ? getProductsByCategory(tpcnCat.id, 4) : Promise.resolve([]),
  ]);

  return (
    <>
      <Hero data={hero} />
      <CategoryNav categories={CATEGORY_CARDS} />

      <Section title="Sản phẩm nổi bật" description="Được khách hàng tin chọn">
        <ProductGrid products={popular} />
      </Section>

      <Section
        title="Thực phẩm Nhật"
        description="Matcha, miso, gạo & đặc sản"
        variant="food"
      >
        <ProductGrid products={foodProducts} />
      </Section>

      <Section
        title="Mỹ phẩm Nhật"
        description="Skincare & trang điểm J-Beauty"
        variant="beauty"
      >
        <ProductGrid products={beautyProducts} />
      </Section>

      <Section
        title="Thực phẩm chức năng"
        description="Vitamin, collagen & bổ sung dinh dưỡng"
        variant="supplement"
      >
        <ProductGrid products={tpcnProducts} />
      </Section>

      <TrustBadges />
      <Disclaimer />
    </>
  );
}
