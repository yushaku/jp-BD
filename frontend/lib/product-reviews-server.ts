import { wpApiUrl, wcConsumerKey, wcConsumerSecret } from "./config";

function hasWcAuth(): boolean {
  return Boolean(wcConsumerKey && wcConsumerSecret);
}

function wcAuthHeader(): string {
  const credentials = Buffer.from(
    `${wcConsumerKey}:${wcConsumerSecret}`,
  ).toString("base64");
  return `Basic ${credentials}`;
}

interface WcOrderLineItem {
  product_id: number;
}

interface WcOrder {
  billing: { email: string };
  line_items: WcOrderLineItem[];
}

async function wcApiFetch<T>(
  path: string,
  params: Record<string, string> = {},
  init?: RequestInit,
): Promise<T> {
  const url = new URL(`/wp-json/wc/v3${path}`, wpApiUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      Authorization: wcAuthHeader(),
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WooCommerce API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

async function sosPost<T>(path: string, body: unknown): Promise<Response> {
  return fetch(new URL(`/wp-json/sos/v1${path}`, wpApiUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}

export async function customerHasPurchasedProduct(
  email: string,
  productId: number,
): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return false;

  const eligibilityRes = await sosPost<{
    purchased?: boolean;
    eligible?: boolean;
  }>(`/products/${productId}/reviews/eligibility`, { email: normalizedEmail });

  if (eligibilityRes.ok) {
    const data = await eligibilityRes.json();
    return Boolean(data.purchased);
  }

  if (!hasWcAuth()) {
    return false;
  }

  let page = 1;
  while (page <= 10) {
    const orders = await wcApiFetch<WcOrder[]>("/orders", {
      per_page: "100",
      page: String(page),
      status: "completed,processing",
    });

    if (!orders.length) break;

    const purchased = orders.some(
      (order) =>
        order.billing?.email?.toLowerCase() === normalizedEmail &&
        order.line_items?.some((item) => item.product_id === productId),
    );

    if (purchased) return true;
    if (orders.length < 100) break;
    page += 1;
  }

  return false;
}

export async function submitProductReview(input: {
  productId: number;
  author: string;
  email: string;
  content: string;
  rating: number;
}): Promise<{ message: string; pending?: boolean }> {
  const { productId, author, email, content, rating } = input;

  const sosRes = await sosPost<{ message: string; pending?: boolean }>(
    `/products/${productId}/reviews`,
    { author, email, content, rating },
  );

  if (sosRes.ok) {
    return sosRes.json();
  }

  const sosError = (await sosRes.json().catch(() => ({}))) as {
    message?: string;
    code?: string;
  };

  if (sosRes.status !== 404 && sosError.message) {
    throw new Error(sosError.message);
  }

  if (!hasWcAuth()) {
    throw new Error(
      "Không thể gửi đánh giá lúc này. Vui lòng thử lại sau hoặc liên hệ shop.",
    );
  }

  const purchased = await customerHasPurchasedProduct(email, productId);
  if (!purchased) {
    throw new Error(
      "Chỉ khách đã mua sản phẩm mới được đánh giá. Vui lòng dùng email đặt hàng.",
    );
  }

  await wcApiFetch("/products/reviews", {}, {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      review: content,
      reviewer: author,
      reviewer_email: email,
      rating,
    }),
  });

  return {
    message: "Cảm ơn bạn! Đánh giá đã được ghi nhận.",
    pending: false,
  };
}
