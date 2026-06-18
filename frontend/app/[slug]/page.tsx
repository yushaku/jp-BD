import { notFound } from "next/navigation";
import { WpPageView } from "@/components/WpPageView";
import { stripHtml } from "@/lib/format";
import { getPageBySlug, getPages } from "@/lib/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: "Trang không tồn tại" };
  }

  const description = stripHtml(page.excerpt.rendered);

  return {
    title: stripHtml(page.title.rendered),
    description: description || undefined,
  };
}

export default async function WordPressPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <WpPageView page={page} />;
}
