import type { Metadata } from "next";
import { PostGrid, PostPagination } from "./components";
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
  const { posts, totalPages, page: currentPage } = await getPostsPage(page);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">
          Tin tức
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-jp-muted">
          Cập nhật mới nhất về sản phẩm Nhật Bản, mẹo chăm sóc sức khỏe và ưu
          đãi từ JP Bùi Đặng.
        </p>
      </header>

      <PostGrid posts={posts} />
      <PostPagination page={currentPage} totalPages={totalPages} />
    </section>
  );
}
