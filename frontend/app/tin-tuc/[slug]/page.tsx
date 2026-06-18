import { notFound } from "next/navigation";
import { NewsBreadcrumb } from "@/app/tin-tuc/components";
import { formatDate, stripHtml } from "@/lib/format";
import { getPopularProducts } from "@/lib/woocommerce";
import { getPostBySlug, getPostFeaturedImage } from "@/lib/wordpress";
import { ArticleFooter, ArticleProducts } from "./components";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Bài viết không tồn tại" };
  }

  return {
    title: stripHtml(post.title.rendered),
    description: stripHtml(post.excerpt.rendered),
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, products] = await Promise.all([
    getPostBySlug(slug),
    getPopularProducts(4),
  ]);

  if (!post) {
    notFound();
  }

  const image = getPostFeaturedImage(post);
  const title = stripHtml(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered);

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-6 sm:py-10">
        <NewsBreadcrumb articleTitle={title} />

        <header className="mb-8 border-b border-jp-border pb-8">
          <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
            Bài viết
          </p>
          <time
            dateTime={post.date}
            className="mt-3 block text-xs font-semibold uppercase tracking-wider text-jp-muted"
          >
            {formatDate(post.date)}
          </time>
          <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.35rem)] leading-tight font-semibold text-jp-ink">
            {title}
          </h1>
          {excerpt && (
            <p className="mt-4 text-base leading-relaxed text-jp-muted">
              {excerpt}
            </p>
          )}
        </header>

        {image && (
          <figure className="relative mb-10 overflow-hidden rounded-(--jp-radius) border border-jp-border bg-jp-paper shadow-(--jp-shadow)">
            <div className="relative aspect-16/10">
              <img
                src={image.source_url}
                alt={image.alt_text || title}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          </figure>
        )}

        <div
          className="prose prose-base max-w-none leading-relaxed text-jp-muted prose-headings:font-semibold prose-headings:text-jp-ink prose-p:leading-relaxed prose-a:font-medium prose-a:text-jp-indigo prose-a:no-underline prose-a:transition-colors prose-a:hover:text-jp-gold prose-strong:text-jp-ink prose-img:rounded-(--jp-radius) prose-img:border prose-img:border-jp-border"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>

      <ArticleProducts products={products} />

      <div className="mx-auto max-w-3xl px-6 pb-10">
        <ArticleFooter />
      </div>
    </>
  );
}
