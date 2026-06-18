import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, stripHtml, truncate } from "@/lib/format";
import type { WpPost } from "@/lib/types";
import { getPostFeaturedImage } from "@/lib/wordpress";
import { cn } from "@/lib/utils";

export function FeaturedPost({ post }: { post: WpPost }) {
  const image = getPostFeaturedImage(post);
  const title = stripHtml(post.title.rendered);
  const excerpt = truncate(stripHtml(post.excerpt.rendered), 220);

  return (
    <article className="group mb-10 overflow-hidden rounded-(--jp-radius) border border-jp-border bg-jp-cream shadow-(--jp-shadow)">
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Link
          href={`/tin-tuc/${post.slug}`}
          className="relative block min-h-52 cursor-pointer overflow-hidden bg-jp-paper sm:min-h-64 lg:min-h-80"
        >
          {image ? (
            <img
              src={image.source_url}
              alt={image.alt_text || title}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full min-h-52 items-center justify-center text-sm text-jp-muted">
              Không có ảnh
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-jp-ink/30 via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-transparent lg:to-jp-cream/20"
            aria-hidden
          />
        </Link>

        <div className="flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
            Mới nhất
          </p>
          <time
            dateTime={post.date}
            className="mt-2 text-xs font-semibold uppercase tracking-wider text-jp-muted"
          >
            {formatDate(post.date)}
          </time>
          <h2 className="mt-3 text-[clamp(1.35rem,3vw,1.85rem)] leading-tight font-semibold text-jp-ink">
            <Link
              href={`/tin-tuc/${post.slug}`}
              className="cursor-pointer transition-colors duration-200 hover:text-jp-indigo"
            >
              {title}
            </Link>
          </h2>
          {excerpt && (
            <p className="mt-3 text-sm leading-relaxed text-jp-muted sm:text-base">
              {excerpt}
            </p>
          )}
          <Link
            href={`/tin-tuc/${post.slug}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "mt-6 w-fit cursor-pointer border-jp-border bg-white text-jp-indigo uppercase tracking-wider transition-colors duration-200 hover:border-jp-indigo hover:bg-white hover:text-jp-indigo",
            )}
          >
            Đọc bài viết
            <ArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
