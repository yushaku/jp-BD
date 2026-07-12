"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BannerSlide, CountdownPromo, SidePromo } from "@/lib/types";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getRemaining(endDate: string) {
  const diff = Math.max(0, new Date(endDate).getTime() - Date.now());
  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

function CountdownUnits({ endDate }: { endDate: string }) {
  const [remaining, setRemaining] = useState<ReturnType<
    typeof getRemaining
  > | null>(null);

  useEffect(() => {
    setRemaining(getRemaining(endDate));
    const id = window.setInterval(
      () => setRemaining(getRemaining(endDate)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [endDate]);

  const units = remaining
    ? [
        { label: "Ngày", value: remaining.days },
        { label: "Giờ", value: remaining.hours },
        { label: "Phút", value: remaining.minutes },
        { label: "Giây", value: remaining.seconds },
      ]
    : [
        { label: "Ngày", value: null },
        { label: "Giờ", value: null },
        { label: "Phút", value: null },
        { label: "Giây", value: null },
      ];

  return (
    <div className="mt-3 flex flex-wrap gap-2" aria-live="polite">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex min-w-[3.25rem] flex-col items-center rounded-lg bg-white/95 px-2 py-1.5 text-jp-ink shadow-sm"
        >
          <span className="text-sm font-bold tabular-nums sm:text-base">
            {unit.value === null
              ? "--"
              : unit.label === "Ngày"
                ? unit.value
                : pad(unit.value)}
          </span>
          <span className="text-[0.6rem] font-medium text-jp-muted uppercase">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function CountdownBanner({ promo }: { promo: CountdownPromo }) {
  return (
    <article
      aria-label={promo.alt}
      className="relative flex min-h-44 overflow-hidden rounded-2xl bg-neutral-800 bg-cover bg-center p-5 sm:min-h-48 sm:p-6"
      style={{ backgroundImage: `url("${promo.src}")` }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-neutral-900/90 via-neutral-900/55 to-neutral-900/25"
        aria-hidden
      />
      <div className="relative z-10 flex max-w-[85%] flex-col justify-center sm:max-w-[58%]">
        <h3 className="text-lg font-bold text-white sm:text-xl">
          {promo.title}
        </h3>
        <CountdownUnits endDate={promo.endDate} />
        <Link
          href={promo.href}
          className={cn(
            buttonVariants({ size: "sm" }),
            "mt-4 w-fit rounded-lg bg-blue-600 px-5 text-white hover:bg-blue-700",
          )}
        >
          {promo.cta}
        </Link>
      </div>
    </article>
  );
}

function FeatureBanner({ slide }: { slide: BannerSlide }) {
  const title = slide.title ?? slide.alt;
  const cta = slide.cta ?? "Mua ngay";

  return (
    <article
      aria-label={slide.alt}
      className="relative size-full min-h-[17rem] overflow-hidden rounded-2xl bg-neutral-800 bg-cover bg-center shadow-(--jp-shadow) sm:min-h-[19rem] lg:min-h-[26rem]"
      style={{ backgroundImage: `url("${slide.src}")` }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-neutral-900/90 via-neutral-900/55 to-neutral-900/25"
        aria-hidden
      />
      <div className="relative z-10 flex h-full flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <h2 className="max-w-56 text-xl leading-tight font-bold text-white sm:max-w-xs sm:text-2xl lg:max-w-sm lg:text-[1.65rem]">
          {title}
        </h2>
        {slide.subtitle && (
          <p className="mt-2 max-w-52 text-sm text-white/85 sm:max-w-xs sm:text-base">
            {slide.subtitle}
          </p>
        )}
        {slide.href && (
          <Link
            href={slide.href}
            className={cn(
              buttonVariants({ size: "sm" }),
              "mt-5 w-fit rounded-lg bg-blue-600 px-5 text-white hover:bg-blue-700",
            )}
          >
            {cta}
          </Link>
        )}
      </div>
    </article>
  );
}

function SidePromoTile({ promo }: { promo: SidePromo }) {
  return (
    <article
      aria-label={promo.alt}
      className="relative flex min-h-40 overflow-hidden rounded-2xl bg-neutral-800 bg-cover bg-center p-4 sm:min-h-44 sm:p-5"
      style={{ backgroundImage: `url("${promo.src}")` }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-neutral-900/90 via-neutral-900/55 to-neutral-900/25"
        aria-hidden
      />
      <div className="relative z-10 flex flex-col justify-center">
        <h3 className="text-base font-bold text-white sm:text-lg">
          {promo.title}
        </h3>
        {promo.subtitle && (
          <p className="mt-1 text-xs text-white/90 sm:text-sm">
            {promo.subtitle}
          </p>
        )}
        <Link
          href={promo.href}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "mt-3 w-fit rounded-lg border-white/30 bg-white px-4 text-jp-ink hover:bg-white/90",
          )}
        >
          {promo.cta}
        </Link>
      </div>
    </article>
  );
}

export function PromoHeroGrid({
  feature,
  sidePromos,
}: {
  feature: BannerSlide;
  sidePromos: SidePromo[];
}) {
  return (
    <section
      aria-label="Khuyến mãi nổi bật"
      className="mx-auto max-w-6xl px-6 py-4 sm:py-6"
    >
      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr] lg:gap-5">
        <FeatureBanner slide={feature} />

        <div className="grid gap-4 lg:grid-rows-[1fr_1fr] lg:gap-5">
          {sidePromos.map((promo) => (
            <SidePromoTile key={promo.id} promo={promo} />
          ))}
        </div>
      </div>
    </section>
  );
}
