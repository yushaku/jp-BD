import { notFound } from "next/navigation";
import { ProductTabs } from "@/components/ProductTabs";
import { getSalePercent, stripHtml } from "@/lib/format";
import { getProductReviews } from "@/lib/product-reviews";
import {
  getProductBySlug,
  getProductsByCategory,
  isTpcnProduct,
} from "@/lib/woocommerce";
import {
  ProductBreadcrumb,
  ProductGallery,
  ProductReviews,
  ProductSummary,
  RelatedProducts,
} from "./components";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.name,
    description: product
      ? stripHtml(product.short_description || product.description)
      : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getProductReviews(product.id);

  const showSupplement = isTpcnProduct(product);
  const salePrice = product.sale_price || product.price;
  const salePercent = product.on_sale
    ? getSalePercent(product.regular_price, salePrice)
    : null;

  const relatedCategoryId = product.categories[0]?.id;
  const relatedProducts = relatedCategoryId
    ? (await getProductsByCategory(relatedCategoryId, 5)).filter(
        (item) => item.id !== product.id,
      ).slice(0, 4)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => img.src),
    description: stripHtml(product.short_description || product.description),
    ...(reviews.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: reviews.average,
        reviewCount: reviews.count,
      },
    }),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability:
        product.stock_status === "instock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <article className="mx-auto max-w-6xl px-6 py-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProductBreadcrumb product={product} />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images}
          name={product.name}
          onSale={product.on_sale}
          salePercent={salePercent}
        />
        <ProductSummary product={product} reviews={reviews} />
      </div>

      <ProductTabs meta={product.sos_meta} showSupplement={showSupplement} />

      {product.description && (
        <section className="mt-10 border-t border-jp-border pt-8">
          <h2 className="mb-4 text-xl font-semibold text-jp-ink">
            Mô tả chi tiết
          </h2>
          <div
            className="prose prose-sm max-w-none text-jp-muted prose-headings:text-jp-ink prose-a:text-jp-indigo"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      )}

      <ProductReviews productId={product.id} initialData={reviews} />

      <RelatedProducts products={relatedProducts} />
    </article>
  );
}
