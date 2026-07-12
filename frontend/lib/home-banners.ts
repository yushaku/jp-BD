import type { BannerSlide, CountdownPromo, SidePromo } from "./types";

export const DEFAULT_BANNER_SLIDES: BannerSlide[] = [
  {
    id: "j-beauty",
    src: "https://myphamthuanchay.com/images/photo/banner/yeu-lan-da-moc-159.jpg",
    alt: "Mỹ phẩm Nhật Bản chính hãng",
    title: "Giảm đến 25% mỹ phẩm & TPCN Nhật",
    subtitle: "Deal tốt cho skincare, vitamin và đặc sản Nhật Bản.",
    cta: "Mua ngay",
    href: "/category/my-pham-nhat",
  },
  {
    id: "j-food",
    src: "https://myphamthuanchay.com/images/photo/banner/vegan-my-pham-thuan-chay-song-thuan-chay-158.jpg",
    alt: "Thực phẩm Nhật Bản nhập khẩu",
    title: "Thực phẩm Nhật nhập khẩu",
    subtitle: "Matcha, miso, gạo và đặc sản tươi mới.",
    cta: "Khám phá",
    href: "/category/thuc-pham-nhat",
  },
];

export const DEFAULT_COUNTDOWN_PROMO: CountdownPromo = {
  id: "j-beauty-sale",
  title: "Mỹ phẩm J-Beauty",
  href: "/category/my-pham-nhat",
  cta: "Mua ngay",
  src: "https://myphamthuanchay.com/images/photo/banner/yeu-lan-da-moc-159.jpg",
  alt: "Ưu đãi mỹ phẩm Nhật Bản",
  endDate: "2026-09-30T23:59:59+07:00",
};

export const DEFAULT_SIDE_PROMOS: SidePromo[] = [
  {
    id: "tpcn",
    title: "TPCN Nhật Bản",
    subtitle: "Vitamin & collagen",
    href: "/category/tpcn",
    cta: "Xem chi tiết",
    src: "https://myphamthuanchay.com/images/photo/banner/vegan-my-pham-thuan-chay-song-thuan-chay-158.jpg",
    alt: "Thực phẩm chức năng Nhật Bản",
  },
  {
    id: "j-food",
    title: "Thực phẩm Nhật",
    subtitle: "Matcha, miso & đặc sản",
    href: "/category/thuc-pham-nhat",
    cta: "Xem chi tiết",
    src: "https://myphamthuanchay.com/images/photo/banner/yeu-lan-da-moc-159.jpg",
    alt: "Thực phẩm Nhật Bản",
  },
];

export const DEFAULT_PROMO_HERO = {
  feature: DEFAULT_BANNER_SLIDES[0],
  countdown: DEFAULT_COUNTDOWN_PROMO,
  sidePromos: DEFAULT_SIDE_PROMOS,
} satisfies import("./types").PromoHeroData;
