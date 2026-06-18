import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, stripHtml, truncate } from "@/lib/format";
import type { WpPost } from "@/lib/types";
import { getPostFeaturedImage } from "@/lib/wordpress";

export function PostCard({ post }: { post: WpPost }) {
  const image = getPostFeaturedImage(post);
  const title = stripHtml(post.title.rendered);
  const excerpt = truncate(stripHtml(post.excerpt.rendered), 140);

  return (
    <Card className="group overflow-hidden border border-jp-border bg-jp-cream py-0 shadow-(--jp-shadow) transition-colors duration-200 hover:border-jp-gold/50">
      <Link
        href={`/tin-tuc/${post.slug}`}
        className="flex h-full cursor-pointer flex-col"
      >
        <div className="relative aspect-16/10 overflow-hidden bg-jp-paper">
          {image ? (
            <img
              src={image.source_url}
              alt={image.alt_text || title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-jp-muted">
              <Newspaper className="size-4" aria-hidden />
              Không có ảnh
            </div>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col py-4">
          <time
            dateTime={post.date}
            className="text-xs font-semibold uppercase tracking-wider text-jp-gold"
          >
            {formatDate(post.date)}
          </time>
          <h2 className="mt-2 text-[1.05rem] font-semibold leading-snug text-jp-ink transition-colors duration-200 group-hover:text-jp-indigo">
            {title}
          </h2>
          {excerpt && (
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-jp-muted">
              {excerpt}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-jp-indigo transition-colors duration-200 group-hover:text-jp-gold">
            Đọc thêm
            <ArrowRight className="size-3.5" aria-hidden />
          </span>
        </CardContent>
      </Link>
    </Card>
  );
}

function NewsEmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-(--jp-radius) border border-jp-border bg-jp-cream px-6 py-14 text-center shadow-(--jp-shadow)">
      <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-jp-paper">
        <Newspaper className="size-7 text-jp-gold" aria-hidden />
      </div>
      <h2 className="text-xl font-semibold text-jp-ink">Chưa có bài viết</h2>
      <p className="mt-2 text-sm text-jp-muted">
        Nội dung tin tức sẽ được cập nhật sớm. Quay lại sau nhé!
      </p>
    </div>
  );
}

export function PostGrid({ posts }: { posts: WpPost[] }) {
  if (posts.length === 0) {
    return <NewsEmptyState />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
