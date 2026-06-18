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

  const relatedCategoryId = product.categories[0]?.id;
  const relatedCategorySlug = product.categories[0]?.slug;

  const [reviews, categoryProducts] = await Promise.all([
    getProductReviews(product.id),
    relatedCategoryId
      ? getProductsByCategory(relatedCategoryId, 5)
      : Promise.resolve([]),
  ]);

  const relatedProducts = categoryProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  const showSupplement = isTpcnProduct(product);
  const salePrice = product.sale_price || product.price;
  const salePercent = product.on_sale
    ? getSalePercent(product.regular_price, salePrice)
    : null;

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
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductSummary product={product} reviews={reviews} />
        </div>
      </div>

      <section className="mt-10 bg-jp-cream p-4 rounded-2xl shadow-(--jp-shadow)">
        <header className="mb-4">
          <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
            Thông tin sử dụng
          </p>
          <h2 className="mt-1 text-lg font-semibold text-jp-ink">
            Thành phần & hướng dẫn
          </h2>
        </header>
        <ProductTabs meta={product.sos_meta} showSupplement={showSupplement} />
      </section>

      {product.description && (
        <section className="mt-12 border-t border-jp-border pt-10 bg-jp-cream rounded-2xl p-4 shadow-(--jp-shadow)">
          <header className="mb-6">
            <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
              Chi tiết sản phẩm
            </p>
            <h2 className="mt-1 text-[1.65rem] font-semibold text-jp-ink">
              Mô tả chi tiết
            </h2>
          </header>
          <div
            className="prose prose-base max-w-none leading-relaxed text-jp-muted prose-headings:font-semibold prose-headings:text-jp-ink prose-p:leading-relaxed prose-a:font-medium prose-a:text-jp-indigo prose-a:no-underline prose-a:transition-colors prose-a:hover:text-jp-matcha prose-strong:text-jp-ink prose-img:rounded-(--jp-radius) prose-img:border prose-img:border-jp-border"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      )}

      <ProductReviews productId={product.id} initialData={reviews} />

      <RelatedProducts
        products={relatedProducts}
        categorySlug={relatedCategorySlug}
      />
    </article>
  );
}
