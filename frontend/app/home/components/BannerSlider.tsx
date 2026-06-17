"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { BannerSlide } from "@/lib/types";

const AUTO_PLAY_MS = 5000;
const BANNER_HEIGHT = "h-[calc(100dvh-4rem)]";

function BannerSlideMedia({
  slide,
  priority = false,
}: {
  slide: BannerSlide;
  priority?: boolean;
}) {
  const image = (
    <img
      src={slide.src}
      alt={slide.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className="absolute inset-0 size-full object-cover object-center"
    />
  );

  if (slide.href) {
    return (
      <Link href={slide.href} className="absolute inset-0 block">
        {image}
      </Link>
    );
  }

  return image;
}

export function BannerSlider({ slides }: { slides: BannerSlide[] }) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (slides.length === 0) return null;

  const showControls = slides.length > 1;

  return (
    <section
      aria-label="Banner khuyến mãi"
      className={`banner-slider relative w-full border-b border-jp-border bg-jp-paper ${BANNER_HEIGHT}`}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        loop={showControls}
        autoplay={
          showControls
            ? { delay: AUTO_PLAY_MS, disableOnInteraction: false }
            : false
        }
        pagination={showControls ? { clickable: true } : false}
        navigation={
          showControls
            ? {
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }
            : false
        }
        onBeforeInit={(swiper) => {
          if (!showControls) return;
          if (
            swiper.params.navigation &&
            typeof swiper.params.navigation !== "boolean"
          ) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        className={`w-full ${BANNER_HEIGHT}`}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="h-full!">
            <div
              className={`relative w-full overflow-hidden bg-jp-paper ${BANNER_HEIGHT}`}
            >
              <BannerSlideMedia slide={slide} priority={index === 0} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {showControls && (
        <>
          <button
            ref={prevRef}
            type="button"
            aria-label="Banner trước"
            className="absolute left-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-jp-cream/90 text-jp-ink shadow-(--jp-shadow) transition hover:bg-white md:left-4 md:size-10"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            ref={nextRef}
            type="button"
            aria-label="Banner tiếp theo"
            className="absolute right-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-jp-cream/90 text-jp-ink shadow-(--jp-shadow) transition hover:bg-white md:right-4 md:size-10"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}
    </section>
  );
}
