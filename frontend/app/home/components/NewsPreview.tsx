import Link from "next/link";
import { PostGrid } from "@/app/tin-tuc/components";
import type { WpPost } from "@/lib/types";

export function NewsPreview({ posts }: { posts: WpPost[] }) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto my-6 max-w-6xl px-6">
      <div className="mb-6 flex flex-col items-center justify-between gap-3 border-b-2 border-jp-border pb-3 sm:flex-row sm:items-end">
        <header className="text-center sm:text-left">
          <h2 className="text-[1.65rem]">Tin tức</h2>
          <p className="mt-2 text-[0.95rem] text-jp-muted">
            Cập nhật mới nhất về sản phẩm Nhật Bản & mẹo chăm sóc sức khỏe
          </p>
        </header>
        <Link
          href="/tin-tuc"
          className="shrink-0 text-sm font-semibold uppercase tracking-wider text-jp-indigo hover:text-jp-matcha"
        >
          Xem tất cả →
        </Link>
      </div>
      <PostGrid posts={posts} />
    </section>
  );
}
