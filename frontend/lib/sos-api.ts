import { wpApiUrl } from "./config";
import { DEFAULT_BANNER_SLIDES } from "./home-banners";
import type { BannerSlide, HeroData, MenuItem, ProductReviewsData } from "./types";

const HERO_REVALIDATE = 300;

async function sosFetch<T>(path: string, revalidate = HERO_REVALIDATE): Promise<T> {
  const res = await fetch(new URL(`/wp-json/sos/v1${path}`, wpApiUrl), {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`SOS API error ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function getHero(): Promise<HeroData> {
  try {
    return await sosFetch<HeroData>("/hero");
  } catch {
    return {
      eyebrow: "JP Bùi Đặng",
      title: "Thực phẩm, mỹ phẩm & TPCN chính hãng từ Nhật Bản",
      subtitle:
        "Nguồn hàng Nhật Bản uy tín — thực phẩm tươi lành, J-Beauty và thực phẩm bổ sung an toàn.",
      cta: "Khám phá ngay",
    };
  }
}

export async function getBannerSlides(): Promise<BannerSlide[]> {
  try {
    const slides = await sosFetch<BannerSlide[]>("/banners");
    return slides.length > 0 ? slides : DEFAULT_BANNER_SLIDES;
  } catch {
    return DEFAULT_BANNER_SLIDES;
  }
}

export async function getMenu(
  location = "primary",
): Promise<MenuItem[]> {
  try {
    const data = await sosFetch<{ items: MenuItem[] }>(`/menus/${location}`);
    return data.items;
  } catch {
    return [];
  }
}

const EMPTY_REVIEWS = {
  average: 0,
  count: 0,
  breakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  reviews: [],
} as const;

export async function getProductReviews(
  productId: number,
): Promise<ProductReviewsData> {
  try {
    return await sosFetch<ProductReviewsData>(
      `/products/${productId}/reviews`,
      60,
    );
  } catch {
    return { ...EMPTY_REVIEWS, reviews: [] };
  }
}
