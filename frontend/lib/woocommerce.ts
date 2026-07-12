import { wcConsumerKey, wcConsumerSecret, wpApiUrl } from "./config";
import type { WcCategory, WcProduct } from "./types";

const REVALIDATE = 60;

function hasWcAuth(): boolean {
  return Boolean(wcConsumerKey && wcConsumerSecret);
}

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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  // ponytail: internal docker hits http://wordpress — WC only accepts key auth when is_ssl()
  if (url.protocol === "http:") {
    headers["X-Forwarded-Proto"] = "https";
  }
  if (url.protocol === "https:") {
    headers.Authorization = authHeader();
  } else {
    url.searchParams.set("consumer_key", wcConsumerKey);
    url.searchParams.set("consumer_secret", wcConsumerSecret);
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: REVALIDATE },
  });

  if (!res.ok) {
    throw new Error(`WooCommerce API error ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

interface StoreProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  on_sale: boolean;
  is_in_stock: boolean;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
  };
  images: { id: number; src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  attributes: {
    id: number;
    name: string;
    taxonomy: string;
    terms: { name: string }[];
  }[];
}

interface StoreCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;
  image: { src: string; alt: string } | null;
}

async function storeFetch<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`/wp-json/wc/store/v1${path}`, wpApiUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: REVALIDATE },
  });

  if (!res.ok) {
    throw new Error(`WooCommerce Store API error ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

function mapStoreProduct(product: StoreProduct): WcProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    permalink: product.permalink,
    description: product.description,
    short_description: product.short_description,
    price: product.prices.price,
    regular_price: product.prices.regular_price,
    sale_price: product.prices.sale_price,
    on_sale: product.on_sale,
    stock_status: product.is_in_stock ? "instock" : "outofstock",
    images: product.images.map((image) => ({
      id: image.id,
      src: image.src,
      alt: image.alt,
    })),
    categories: product.categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    })),
    attributes: product.attributes.map((attribute) => ({
      id: attribute.id,
      name: attribute.name,
      slug: attribute.taxonomy.replace(/^pa_/, ""),
      options: attribute.terms.map((term) => term.name),
    })),
    meta_data: [],
  };
}

function mapStoreCategory(category: StoreCategory): WcCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parent: category.parent,
    count: category.count,
    image: category.image
      ? { id: 0, src: category.image.src, alt: category.image.alt }
      : null,
  };
}

export async function getProducts(
  params: Record<string, string> = {},
): Promise<WcProduct[]> {
  if (!hasWcAuth()) {
    const products = await storeFetch<StoreProduct[]>("/products", {
      per_page: "12",
      ...params,
    });
    return products.map(mapStoreProduct);
  }

  return wcFetch<WcProduct[]>("/products", {
    per_page: "12",
    status: "publish",
    ...params,
  });
}

export async function getProductBySlug(slug: string): Promise<WcProduct | null> {
  if (!hasWcAuth()) {
    const products = await storeFetch<StoreProduct[]>("/products", { slug });
    const product = products[0];
    return product ? mapStoreProduct(product) : null;
  }

  const products = await wcFetch<WcProduct[]>("/products", { slug });
  return products[0] ?? null;
}

export async function getCategories(): Promise<WcCategory[]> {
  if (!hasWcAuth()) {
    const categories = await storeFetch<StoreCategory[]>("/products/categories", {
      per_page: "100",
    });
    return categories
      .filter((category) => category.count > 0)
      .map(mapStoreCategory);
  }

  const all: WcCategory[] = [];
  let page = 1;

  while (true) {
    const batch = await wcFetch<WcCategory[]>("/products/categories", {
      per_page: "100",
      hide_empty: "true",
      page: String(page),
    });
    all.push(...batch);
    if (batch.length < 100) {
      break;
    }
    page += 1;
  }

  return all;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<WcCategory | null> {
  if (!hasWcAuth()) {
    const categories = await storeFetch<StoreCategory[]>("/products/categories");
    const category = categories.find((item) => item.slug === slug);
    return category ? mapStoreCategory(category) : null;
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
