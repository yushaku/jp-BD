import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductCard";
import { Section } from "@/components/Section";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/woocommerce";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return {
    title: category?.name ?? "Danh mục",
    description: category?.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category.id, 24);

  return (
    <Section title={category.name} description={category.description}>
      <ProductGrid products={products} />
    </Section>
  );
}
