import { TrustBadges } from "@/components/TrustBadges";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { getHero } from "@/lib/sos-api";
import {
  getCategoryBySlug,
  getPopularProducts,
  getProductsByCategory,
} from "@/lib/woocommerce";
import { getPosts } from "@/lib/wordpress";
import {
  AnnouncementBar,
  BestsellerGrid,
  CategoryProductSection,
  NewsPreview,
} from "./components";

export const revalidate = 60;

export default async function HomePage() {
  const [hero, bestsellers, foodCat, beautyCat, tpcnCat, newsPosts] =
    await Promise.all([
      getHero(),
      getPopularProducts(8),
      getCategoryBySlug("thuc-pham-nhat"),
      getCategoryBySlug("my-pham-nhat"),
      getCategoryBySlug("tpcn"),
      getPosts({ per_page: "3" }),
    ]);

  const [foodProducts, beautyProducts, tpcnProducts] = await Promise.all([
    foodCat ? getProductsByCategory(foodCat.id, 4) : Promise.resolve([]),
    beautyCat ? getProductsByCategory(beautyCat.id, 4) : Promise.resolve([]),
    tpcnCat ? getProductsByCategory(tpcnCat.id, 4) : Promise.resolve([]),
  ]);

  return (
    <>
      <AnnouncementBar />
      <Hero data={hero} />

      <Section title="Bán chạy" description="Được khách hàng tin chọn nhất">
        <BestsellerGrid products={bestsellers} />
      </Section>

      <CategoryProductSection
        title="Thực phẩm Nhật"
        description="Matcha, miso, gạo & đặc sản"
        variant="food"
        categorySlug="thuc-pham-nhat"
        products={foodProducts}
      />

      <CategoryProductSection
        title="Mỹ phẩm Nhật"
        description="Skincare & trang điểm J-Beauty"
        variant="beauty"
        categorySlug="my-pham-nhat"
        products={beautyProducts}
      />

      <CategoryProductSection
        title="Thực phẩm chức năng"
        description="Vitamin, collagen & bổ sung dinh dưỡng"
        variant="supplement"
        categorySlug="tpcn"
        products={tpcnProducts}
      />

      <TrustBadges />
      <NewsPreview posts={newsPosts} />
    </>
  );
}
