export interface SosMeta {
  ingredients: string;
  how_to_use: string;
  supplement_note: string;
}

export interface WcImage {
  id: number;
  src: string;
  alt: string;
}

export interface WcCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent: number;
  image: WcImage | null;
}

export interface WcProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  images: WcImage[];
  categories: { id: number; name: string; slug: string }[];
  attributes: {
    id: number;
    name: string;
    slug: string;
    options: string[];
  }[];
  meta_data: { key: string; value: string }[];
  sos_meta?: SosMeta;
  total_sales?: number;
}

export interface HeroData {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
}

export interface BannerSlide {
  id: string;
  src: string;
  alt: string;
  href?: string;
}

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  type: string;
  slug: string;
}

export interface StoreCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_minor_unit: number;
  };
  totals: {
    line_total: string;
    currency_minor_unit: number;
  };
  images: { src: string; alt: string }[];
}

export interface StoreCart {
  items: StoreCartItem[];
  items_count: number;
  totals: {
    total_items: string;
    total_price: string;
    currency_minor_unit: number;
  };
}

export interface CategoryCard {
  slug: string;
  label: string;
  desc: string;
  variant: "food" | "beauty" | "supplement";
}

export interface WpRendered {
  rendered: string;
}

export interface WpFeaturedMedia {
  source_url: string;
  alt_text: string;
}

export interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  _embedded?: {
    "wp:featuredmedia"?: WpFeaturedMedia[];
  };
}

export interface WpPage {
  id: number;
  slug: string;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  _embedded?: {
    "wp:featuredmedia"?: WpFeaturedMedia[];
  };
}

export interface ProductReview {
  id: number;
  author: string;
  date: string;
  content: string;
  rating: number;
  verified?: boolean;
}

export interface ProductReviewsData {
  average: number;
  count: number;
  breakdown: Record<"1" | "2" | "3" | "4" | "5", number>;
  reviews: ProductReview[];
}

export const CATEGORY_CARDS: CategoryCard[] = [
  {
    slug: "thuc-pham-nhat",
    label: "Thực phẩm Nhật",
    desc: "Matcha, miso, snack",
    variant: "food",
  },
  {
    slug: "my-pham-nhat",
    label: "Mỹ phẩm",
    desc: "Skincare, makeup",
    variant: "beauty",
  },
  {
    slug: "tpcn",
    label: "TPCN",
    desc: "Vitamin, collagen",
    variant: "supplement",
  },
];
