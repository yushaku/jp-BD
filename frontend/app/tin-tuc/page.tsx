import type { Metadata } from "next";
import {
  FeaturedPost,
  NewsBreadcrumb,
  PostGrid,
  PostPagination,
} from "./components";
import { getPostsPage } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Tin tức",
  description:
    "Tin tức, mẹo sử dụng và cập nhật về thực phẩm, mỹ phẩm & TPCN Nhật Bản từ JP Bùi Đặng.",
};

export const revalidate = 60;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, total, totalPages, page: currentPage } = await getPostsPage(page);

  const featuredPost = currentPage === 1 && posts.length > 0 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <section className="mx-auto max-w-6xl px-6 py-6 sm:py-10">
      <NewsBreadcrumb />

      <header className="mb-10 border-b-2 border-jp-gold pb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
          Bài viết & cập nhật
        </p>
        <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-semibold text-jp-ink">
          Tin tức
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-jp-muted">
          Cập nhật mới nhất về sản phẩm Nhật Bản, mẹo chăm sóc sức khỏe và ưu
          đãi từ JP Bùi Đặng.
        </p>
        {total > 0 && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-jp-muted">
            {total} bài viết
            {totalPages > 1 && (
              <>
                {" "}
                · Trang {currentPage}/{totalPages}
              </>
            )}
          </p>
        )}
      </header>

      {posts.length === 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <>
          {featuredPost && <FeaturedPost post={featuredPost} />}

          {gridPosts.length > 0 && (
            <div>
              {featuredPost && (
                <h2 className="mb-6 text-lg font-semibold text-jp-ink">
                  Bài viết khác
                </h2>
              )}
              <PostGrid posts={gridPosts} />
            </div>
          )}
        </>
      )}

      <PostPagination page={currentPage} totalPages={totalPages} />
    </section>
  );
}
