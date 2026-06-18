import { wpApiUrl } from "./config";
import type { ProductReviewsData } from "./types";
import { getProductReviews as getSosProductReviews } from "./sos-api";
import { wcConsumerKey, wcConsumerSecret } from "./config";

const EMPTY_REVIEWS: ProductReviewsData = {
  average: 0,
  count: 0,
  breakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  reviews: [],
};

interface WcApiReview {
  id: number;
  date_created: string;
  review: string;
  rating: number;
  reviewer: string;
  status: string;
}

function hasWcAuth(): boolean {
  return Boolean(wcConsumerKey && wcConsumerSecret);
}

async function wcReviewsFetch(
  productId: number,
): Promise<ProductReviewsData> {
  const url = new URL("/wp-json/wc/v3/products/reviews", wpApiUrl);
  url.searchParams.set("product", String(productId));
  url.searchParams.set("per_page", "50");
  url.searchParams.set("status", "approved");

  const credentials = Buffer.from(
    `${wcConsumerKey}:${wcConsumerSecret}`,
  ).toString("base64");

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`WooCommerce reviews error ${res.status}`);
  }

  const items = (await res.json()) as WcApiReview[];
  const breakdown: ProductReviewsData["breakdown"] = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
  };

  const reviews = items.map((item) => {
    const rating = Math.max(0, Math.min(5, item.rating));
    if (rating >= 1 && rating <= 5) {
      breakdown[String(rating) as keyof typeof breakdown]++;
    }
    return {
      id: item.id,
      author: item.reviewer,
      date: item.date_created,
      content: item.review,
      rating,
    };
  });

  const count = reviews.length;
  const average =
    count > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / count
      : 0;

  return { average, count, breakdown, reviews };
}

export async function getProductReviews(
  productId: number,
): Promise<ProductReviewsData> {
  const sos = await getSosProductReviews(productId);
  if (sos.count > 0 || sos.reviews.length > 0) {
    return sos;
  }

  if (hasWcAuth()) {
    try {
      return await wcReviewsFetch(productId);
    } catch {
      return EMPTY_REVIEWS;
    }
  }

  return sos;
}
