import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, stripHtml, truncate } from "@/lib/format";
import type { WpPost } from "@/lib/types";
import { getPostFeaturedImage } from "@/lib/wordpress";

export function PostCard({ post }: { post: WpPost }) {
  const image = getPostFeaturedImage(post);
  const excerpt = truncate(stripHtml(post.excerpt.rendered), 140);

  return (
    <Card className="overflow-hidden border-0 bg-jp-cream py-0 ring-0 shadow-(--jp-shadow) transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(26,26,26,0.1)]">
      <Link href={`/tin-tuc/${post.slug}`}>
        <div className="relative aspect-16/10 bg-jp-paper">
          {image ? (
            <img
              src={image.source_url}
              alt={image.alt_text || stripHtml(post.title.rendered)}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-jp-muted">
              Không có ảnh
            </div>
          )}
        </div>
        <CardContent className="py-4">
          <time
            dateTime={post.date}
            className="text-xs font-semibold uppercase tracking-wider text-jp-gold"
          >
            {formatDate(post.date)}
          </time>
          <h2 className="mt-2 text-[1.05rem] font-semibold leading-snug">
            {stripHtml(post.title.rendered)}
          </h2>
          {excerpt && (
            <p className="mt-2 line-clamp-3 text-sm text-jp-muted">{excerpt}</p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

export function PostGrid({ posts }: { posts: WpPost[] }) {
  if (posts.length === 0) {
    return <p className="text-center text-jp-muted">Chưa có bài viết nào.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
