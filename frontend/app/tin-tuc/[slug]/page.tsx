import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { formatDate, stripHtml } from "@/lib/format";
import { getPostBySlug, getPostFeaturedImage } from "@/lib/wordpress";

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
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const image = getPostFeaturedImage(post);
  const title = stripHtml(post.title.rendered);

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/tin-tuc"
        className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-jp-indigo hover:text-jp-matcha"
      >
        <ChevronLeft className="size-4" />
        Quay lại tin tức
      </Link>

      <header className="mb-8">
        <time
          dateTime={post.date}
          className="text-xs font-semibold uppercase tracking-wider text-jp-gold"
        >
          {formatDate(post.date)}
        </time>
        <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.25rem)] leading-tight">
          {title}
        </h1>
      </header>

      {image && (
        <div className="relative mb-8 aspect-16/10 overflow-hidden rounded-(--jp-radius) bg-jp-paper">
          <img
            src={image.source_url}
            alt={image.alt_text || title}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-sm max-w-none text-jp-muted prose-headings:text-jp-ink prose-a:text-jp-indigo"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </article>
  );
}
