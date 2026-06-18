import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HeroData } from "@/lib/types";

export function Hero({ data }: { data: HeroData }) {
  return (
    <section className="relative mb-12 bg-linear-to-br from-jp-paper via-jp-cream to-white px-6 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(107,124,92,0.08),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(212,165,165,0.1),transparent_50%)]" />
      <div className="relative">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-jp-gold">
          {data.eyebrow}
        </p>
        <h1 className="mx-auto mb-4 max-w-3xl text-[clamp(1.85rem,4.5vw,3rem)] leading-tight">
          {data.title}
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-[1.05rem] leading-relaxed text-muted-foreground">
          {data.subtitle}
        </p>
        <Link
          href="/shop"
          className={cn(
            buttonVariants({ size: "lg" }),
            "inline-flex uppercase tracking-wider",
          )}
        >
          {data.cta}
        </Link>
      </div>
    </section>
  );
}
