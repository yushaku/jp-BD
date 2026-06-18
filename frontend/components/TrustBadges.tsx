import Link from "next/link";
import {
  ArrowRight,
  Globe,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const promos = [
  {
    href: "/category/my-pham-nhat",
    eyebrow: "J-BEAUTY MỸ PHẨM NHẬT",
    title: "Khám phá routine dịu nhẹ từ mỹ phẩm Nhật Bản",
    cta: "Xem chi tiết",
    src: "https://myphamthuanchay.com/images/photo/banner/vegan-my-pham-thuan-chay-song-thuan-chay-158.jpg",
    alt: "Mỹ phẩm Nhật Bản chính hãng",
    wide: true,
  },
  {
    href: "/shop",
    title: "Săn sale giảm 10%",
    period: "Áp dụng từ ngày 01/09 - 30/09",
    badge: "Mua 1 tặng 1",
    cta: "Săn sale",
    src: "https://myphamthuanchay.com/images/photo/banner/yeu-lan-da-moc-159.jpg",
    alt: "Ưu đãi sản phẩm Nhật Bản",
    wide: false,
  },
] as const;

const items = [
  {
    icon: Globe,
    title: "Nhập khẩu Nhật Bản",
    desc: "Nguồn gốc rõ ràng, giấy tờ đầy đủ",
    iconClass: "text-jp-gold",
    iconBg: "bg-jp-gold/10 ring-jp-gold/20",
  },
  {
    icon: ShieldCheck,
    title: "100% chính hãng",
    desc: "Cam kết hàng authentic",
    iconClass: "text-jp-gold",
    iconBg: "bg-jp-gold/10 ring-jp-gold/20",
  },
  {
    icon: MessageCircle,
    title: "Tư vấn tận tâm",
    desc: "Hỗ trợ chọn sản phẩm phù hợp",
    iconClass: "text-jp-indigo",
    iconBg: "bg-jp-indigo/10 ring-jp-indigo/20",
  },
  {
    icon: Truck,
    title: "Giao nhanh toàn quốc",
    desc: "HCM/HN 2-3 ngày",
    iconClass: "text-jp-vermillion",
    iconBg: "bg-jp-vermillion/10 ring-jp-vermillion/20",
  },
] as const;

const ctaClass = cn(
  buttonVariants({ variant: "outline" }),
  "cursor-pointer border-jp-border bg-white/90 px-5 text-jp-gold uppercase tracking-wider backdrop-blur-sm transition-colors duration-200 hover:border-jp-gold hover:bg-white hover:text-jp-gold",
);

const imageHoverClass =
  "absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100";

function PromoBanner({ promo }: { promo: (typeof promos)[number] }) {
  if (promo.wide) {
    return (
      <article className="group relative min-h-56 overflow-hidden rounded-(--jp-radius) border border-jp-border bg-jp-cream shadow-(--jp-shadow) sm:min-h-64 lg:min-h-72">
        <div className="grid h-full lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="relative z-10 flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10">
            <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-jp-gold uppercase sm:text-xs">
              {promo.eyebrow}
            </p>
            <h3 className="mt-3 max-w-sm text-xl leading-snug font-semibold text-jp-ink sm:text-2xl">
              {promo.title}
            </h3>
            <Link href={promo.href} className={cn(ctaClass, "mt-6 w-fit")}>
              {promo.cta}
              <ArrowRight aria-hidden />
            </Link>
          </div>

          <div className="relative min-h-44 overflow-hidden lg:min-h-full">
            <img
              src={promo.src}
              alt={promo.alt}
              loading="lazy"
              decoding="async"
              className={imageHoverClass}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-r from-jp-cream via-jp-cream/20 to-transparent lg:from-jp-cream/90 lg:via-transparent"
              aria-hidden
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative min-h-56 overflow-hidden rounded-(--jp-radius) border border-jp-border bg-jp-cream shadow-(--jp-shadow) sm:min-h-64 lg:min-h-72">
      {"badge" in promo && promo.badge && (
        <span className="absolute top-4 right-4 z-10 flex size-16 items-center justify-center rounded-full bg-jp-vermillion p-2 text-center text-[0.65rem] leading-tight font-bold text-white uppercase shadow-md ring-4 ring-jp-vermillion/20 sm:size-20 sm:text-xs">
          {promo.badge}
        </span>
      )}

      <div className="flex h-full flex-col px-5 pt-8 pb-0 sm:px-6 sm:pt-10">
        <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-jp-gold uppercase sm:text-xs">
          Ưu đãi đặc biệt
        </p>
        <h3 className="mt-2 pr-16 text-xl leading-snug font-semibold text-jp-ink sm:text-2xl">
          {promo.title}
        </h3>
        {"period" in promo && promo.period && (
          <p className="mt-2 text-sm text-jp-muted">{promo.period}</p>
        )}
        <Link href={promo.href} className={cn(ctaClass, "mt-5 w-fit")}>
          {promo.cta}
          <ArrowRight aria-hidden />
        </Link>

        <div className="relative mt-auto min-h-36 overflow-hidden sm:min-h-40">
          <img
            src={promo.src}
            alt={promo.alt}
            loading="lazy"
            decoding="async"
            className={cn(
              imageHoverClass,
              "inset-x-0 bottom-0 h-full w-full object-bottom",
            )}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-jp-cream via-jp-cream/40 to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </article>
  );
}

function TrustBadgeCard({ item }: { item: (typeof items)[number] }) {
  const Icon = item.icon;

  return (
    <li className="group flex flex-col items-center rounded-(--jp-radius) border border-jp-border bg-jp-cream px-3 py-5 text-center shadow-(--jp-shadow) transition-colors duration-200 hover:border-jp-gold/50 sm:px-4 sm:py-6">
      <span
        className={cn(
          "mb-3 flex size-11 items-center justify-center rounded-full ring-1 transition-colors duration-200 group-hover:ring-jp-gold/30 sm:mb-4 sm:size-12",
          item.iconBg,
        )}
      >
        <Icon className={cn("size-5 sm:size-6", item.iconClass)} aria-hidden />
      </span>
      <h3 className="text-base font-semibold leading-snug text-jp-ink sm:text-[1.05rem]">
        {item.title}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-jp-muted sm:text-sm">
        {item.desc}
      </p>
    </li>
  );
}

export function TrustBadges() {
  return (
    <section
      className="mx-auto mb-12 max-w-6xl px-6"
      aria-labelledby="trust-badges-heading"
    >
      <header className="mb-8 border-b-2 border-jp-gold pb-3 text-center">
        <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
          Tại sao chọn chúng tôi
        </p>
        <h2
          id="trust-badges-heading"
          className="mt-1 text-[1.65rem] font-semibold text-jp-ink"
        >
          Cam kết chất lượng
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-[0.95rem] text-jp-muted">
          Hàng Nhật chính hãng, nguồn gốc minh bạch và dịch vụ tận tâm từ lúc tư
          vấn đến khi giao tận tay.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((item) => (
          <TrustBadgeCard key={item.title} item={item} />
        ))}
      </ul>

      <div className="mt-16 lg:mt-20">
        <header className="mb-6 flex flex-col items-center justify-between gap-3 border-b-2 border-jp-border pb-3 sm:flex-row sm:items-end">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
              Ưu đãi nổi bật
            </p>
            <h2 className="mt-1 text-[1.65rem] font-semibold text-jp-ink">
              Khuyến mãi & bộ sưu tập
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-sm font-semibold uppercase tracking-wider text-jp-indigo transition-colors duration-200 hover:text-jp-gold"
          >
            Xem tất cả
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-5">
          {promos.map((promo) => (
            <PromoBanner key={promo.href} promo={promo} />
          ))}
        </div>
      </div>
    </section>
  );
}
