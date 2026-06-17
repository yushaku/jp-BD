import { wcConsumerKey, wcConsumerSecret, wpApiUrl } from "./config";
import type { WcCategory, WcProduct } from "./types";

const REVALIDATE = 60;

function authHeader(): string {
  const credentials = Buffer.from(
    `${wcConsumerKey}:${wcConsumerSecret}`,
  ).toString("base64");
  return `Basic ${credentials}`;
}

async function wcFetch<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`/wp-json/wc/v3${path}`, wpApiUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    next: { revalidate: REVALIDATE },
  });

  if (!res.ok) {
    throw new Error(`WooCommerce API error ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function getProducts(
  params: Record<string, string> = {},
): Promise<WcProduct[]> {
  if (!wcConsumerKey || !wcConsumerSecret) {
    return [];
  }
  return wcFetch<WcProduct[]>("/products", {
    per_page: "12",
    status: "publish",
    ...params,
  });
}

export async function getProductBySlug(slug: string): Promise<WcProduct | null> {
  if (!wcConsumerKey || !wcConsumerSecret) {
    return null;
  }
  const products = await wcFetch<WcProduct[]>("/products", { slug });
  return products[0] ?? null;
}

export async function getCategories(): Promise<WcCategory[]> {
  if (!wcConsumerKey || !wcConsumerSecret) {
    return [];
  }
  return wcFetch<WcCategory[]>("/products/categories", {
    per_page: "20",
    hide_empty: "true",
  });
}

export async function getCategoryBySlug(
  slug: string,
): Promise<WcCategory | null> {
  if (!wcConsumerKey || !wcConsumerSecret) {
    return null;
  }
  const categories = await wcFetch<WcCategory[]>("/products/categories", {
    slug,
  });
  return categories[0] ?? null;
}

export async function getPopularProducts(limit = 8): Promise<WcProduct[]> {
  return getProducts({
    orderby: "popularity",
    per_page: String(limit),
  });
}

export async function getProductsByCategory(
  categoryId: number,
  limit = 4,
): Promise<WcProduct[]> {
  return getProducts({
    category: String(categoryId),
    per_page: String(limit),
  });
}

export function getVolume(product: WcProduct): string | null {
  const attr = product.attributes.find(
    (a) => a.slug === "pa_dung-tich" || a.slug === "dung-tich",
  );
  return attr?.options[0] ?? null;
}

export function isTpcnProduct(product: WcProduct): boolean {
  return product.categories.some((c) => c.slug === "tpcn");
}
