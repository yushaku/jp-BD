import { ProductGrid } from "@/components/ProductCard";
import { Section } from "@/components/Section";
import { getProducts } from "@/lib/woocommerce";

export const metadata = {
  title: "Cửa hàng",
};

export const revalidate = 60;

export default async function ShopPage() {
  const products = await getProducts({ per_page: "24" });

  return (
    <Section title="Cửa hàng" description="Thực phẩm, mỹ phẩm & TPCN Nhật Bản">
      <ProductGrid products={products} />
    </Section>
  );
}
