import { stripHtml } from "@/lib/format";
import { getPageFeaturedImage } from "@/lib/wordpress";
import type { WpPage } from "@/lib/types";

export function WpPageView({ page }: { page: WpPage }) {
  const image = getPageFeaturedImage(page);
  const title = stripHtml(page.title.rendered);
  const excerpt = stripHtml(page.excerpt.rendered);
  const content = page.content.rendered.trim();

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-jp-gold">
          JP Bùi Đặng
        </p>
        <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-jp-ink">
          {title}
        </h1>
        {excerpt && (
          <p className="mx-auto mt-4 max-w-2xl text-jp-muted">{excerpt}</p>
        )}
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

      {content ? (
        <div
          className="prose prose-sm max-w-none text-jp-muted prose-headings:text-jp-ink prose-a:text-jp-indigo"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-center text-jp-muted">
          Nội dung đang được cập nhật. Vui lòng quay lại sau.
        </p>
      )}
    </article>
  );
}
