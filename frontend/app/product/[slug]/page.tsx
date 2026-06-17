import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductTabs } from "@/components/ProductTabs";
import { formatPrice, stripHtml } from "@/lib/format";
import {
  getProductBySlug,
  getVolume,
  isTpcnProduct,
} from "@/lib/woocommerce";

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

  const image = product.images[0];
  const volume = getVolume(product);
  const showSupplement = isTpcnProduct(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => img.src),
    description: stripHtml(product.short_description || product.description),
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
    <article className="mx-auto max-w-6xl px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[var(--jp-radius)] border border-jp-border bg-white">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-jp-muted">
              Không có ảnh
            </div>
          )}
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-jp-gold">
            Chính hãng Nhật Bản
          </p>
          <h1 className="text-[1.85rem]">{product.name}</h1>
          {volume && (
            <p className="mt-1 text-sm text-jp-muted">{volume}</p>
          )}
          <p className="mt-4 text-2xl font-semibold text-jp-indigo">
            {formatPrice(product.price)}
          </p>
          {product.short_description && (
            <div
              className="mt-4 border-l-[3px] border-jp-matcha pl-4 text-jp-muted"
              dangerouslySetInnerHTML={{
                __html: product.short_description,
              }}
            />
          )}
          <div className="mt-6 max-w-xs">
            <AddToCartButton productId={product.id} />
          </div>
          <div className="mt-6 border-t border-jp-border pt-4 text-sm text-jp-muted">
            Danh mục:{" "}
            {product.categories.map((c) => c.name).join(", ") || "—"}
          </div>
        </div>
      </div>

      <ProductTabs meta={product.sos_meta} showSupplement={showSupplement} />

      {product.description && (
        <div
          className="prose prose-sm mt-8 max-w-none text-jp-muted"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}
    </article>
  );
}
