"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WcImage } from "@/lib/types";

export function ProductGallery({
  images,
  name,
  onSale,
  salePercent,
}: {
  images: WcImage[];
  name: string;
  onSale?: boolean;
  salePercent?: number | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-(--jp-radius) border border-jp-border bg-jp-cream text-jp-muted shadow-(--jp-shadow)">
        Không có ảnh
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-(--jp-radius) border border-jp-border bg-white shadow-(--jp-shadow)">
        <img
          src={active.src}
          alt={active.alt || name}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 size-full object-contain p-4 sm:p-6"
        />
        {onSale && salePercent && (
          <Badge className="absolute top-3 right-3 z-10 border-0 bg-jp-vermillion px-2.5 py-1 text-xs font-bold uppercase shadow-md">
            -{salePercent}%
          </Badge>
        )}
      </div>

      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                aria-label={`Xem ảnh ${index + 1}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative aspect-square cursor-pointer overflow-hidden rounded-(--jp-radius) border bg-white p-1 transition-colors duration-200",
                  index === activeIndex
                    ? "border-jp-indigo ring-2 ring-jp-indigo/20"
                    : "border-jp-border hover:border-jp-gold",
                )}
              >
                <img
                  src={image.src}
                  alt={image.alt || `${name} ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
