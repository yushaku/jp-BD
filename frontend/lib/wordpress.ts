import { wpApiUrl } from "./config";
import type { WpFeaturedMedia, WpPost } from "./types";

const REVALIDATE = 60;
export const POSTS_PER_PAGE = 12;

export interface PostsPageResult {
  posts: WpPost[];
  total: number;
  totalPages: number;
  page: number;
}

async function wpFetch<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`/wp-json/wp/v2${path}`, wpApiUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: REVALIDATE },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function getPostsPage(page = 1): Promise<PostsPageResult> {
  const safePage = Math.max(1, page);

  try {
    const url = new URL("/wp-json/wp/v2/posts", wpApiUrl);
    url.searchParams.set("per_page", String(POSTS_PER_PAGE));
    url.searchParams.set("page", String(safePage));
    url.searchParams.set("status", "publish");
    url.searchParams.set("_embed", "1");

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE },
    });

    if (!res.ok) {
      if (res.status === 400 && safePage > 1) {
        return { posts: [], total: 0, totalPages: 0, page: safePage };
      }
      throw new Error(`WordPress API error ${res.status}: /posts`);
    }

    const posts = (await res.json()) as WpPost[];
    const total = Number(res.headers.get("X-WP-Total") ?? 0);
    const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1);

    return { posts, total, totalPages, page: safePage };
  } catch {
    return { posts: [], total: 0, totalPages: 0, page: safePage };
  }
}

export async function getPosts(
  params: Record<string, string> = {},
): Promise<WpPost[]> {
  try {
    return await wpFetch<WpPost[]>("/posts", {
      per_page: String(POSTS_PER_PAGE),
      status: "publish",
      _embed: "1",
      ...params,
    });
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WpPost | null> {
  try {
    const posts = await wpFetch<WpPost[]>("/posts", {
      slug,
      status: "publish",
      _embed: "1",
    });
    return posts[0] ?? null;
  } catch {
    return null;
  }
}

export function getPostFeaturedImage(
  post: WpPost,
): WpFeaturedMedia | null {
  return post._embedded?.["wp:featuredmedia"]?.[0] ?? null;
}
