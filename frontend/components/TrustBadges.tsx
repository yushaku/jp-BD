import Link from "next/link";
import { Globe, MessageCircle, ShieldCheck, Truck } from "lucide-react";
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
  },
  {
    icon: ShieldCheck,
    title: "100% chính hãng",
    desc: "Cam kết hàng authentic",
  },
  {
    icon: MessageCircle,
    title: "Tư vấn tận tâm",
    desc: "Hỗ trợ chọn sản phẩm phù hợp",
  },
  {
    icon: Truck,
    title: "Giao nhanh toàn quốc",
    desc: "HCM/HN 2-3 ngày",
  },
] as const;

function PromoBanner({ promo }: { promo: (typeof promos)[number] }) {
  if (promo.wide) {
    return (
      <article className="group relative min-h-56 overflow-hidden rounded-(--jp-radius) bg-jp-paper shadow-(--jp-shadow) sm:min-h-64 lg:min-h-72">
        <div className="grid h-full lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="relative z-10 flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10">
            <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-jp-gold uppercase sm:text-xs">
              {promo.eyebrow}
            </p>
            <h3 className="mt-3 max-w-sm text-xl leading-snug font-semibold text-jp-ink sm:text-2xl">
              {promo.title}
            </h3>
            <Link
              href={promo.href}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-6 w-fit border-jp-border bg-white px-6 text-jp-gold uppercase tracking-wider hover:bg-white hover:text-jp-gold",
              )}
            >
              {promo.cta}
            </Link>
          </div>

          <div className="relative min-h-44 overflow-hidden lg:min-h-full">
            <img
              src={promo.src}
              alt={promo.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative min-h-56 overflow-hidden rounded-(--jp-radius) bg-white shadow-(--jp-shadow) sm:min-h-64 lg:min-h-72">
      {"badge" in promo && promo.badge && (
        <span className="absolute top-4 right-4 z-10 flex size-16 items-center justify-center rounded-full bg-jp-vermillion p-2 text-center text-[0.65rem] leading-tight font-bold text-white uppercase sm:size-20 sm:text-xs">
          {promo.badge}
        </span>
      )}

      <div className="flex h-full flex-col px-5 pt-8 pb-0 sm:px-6 sm:pt-10">
        <h3 className="pr-16 text-xl leading-snug font-semibold text-jp-ink sm:text-2xl">
          {promo.title}
        </h3>
        {"period" in promo && promo.period && (
          <p className="mt-2 text-sm text-jp-gold">{promo.period}</p>
        )}
        <Link
          href={promo.href}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-5 w-fit border-jp-border bg-white px-6 text-jp-gold uppercase tracking-wider hover:bg-white hover:text-jp-gold",
          )}
        >
          {promo.cta}
        </Link>

        <div className="relative mt-auto min-h-36 overflow-hidden sm:min-h-40">
          <img
            src={promo.src}
            alt={promo.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-x-0 bottom-0 h-full w-full object-cover object-bottom transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </div>
    </article>
  );
}

export function TrustBadges() {
  return (
    <section className="mx-auto mb-12 max-w-6xl px-6">
      <div className="my-24 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-5">
        {promos.map((promo) => (
          <PromoBanner key={promo.href} promo={promo} />
        ))}
      </div>

      <header className="mb-8 border-b-2 border-jp-matcha pb-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-jp-gold">
          Tại sao chọn chúng tôi
        </p>
        <h2 className="mt-1 text-[1.65rem] text-jp-ink">Cam kết chất lượng</h2>
      </header>

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <li
              key={item.title}
              className="flex flex-col items-center rounded-(--jp-radius) px-3 py-5 text-center shadow-(--jp-shadow) sm:px-4 sm:py-6"
            >
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-jp-paper ring-1 ring-jp-border sm:mb-4 sm:size-11">
                <Icon className="size-5 text-jp-matcha" aria-hidden />
              </span>
              <h3 className="text-sm font-semibold leading-snug text-jp-ink sm:text-[1.05rem]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-jp-muted sm:text-sm">
                {item.desc}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
