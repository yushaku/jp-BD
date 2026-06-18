import { Package, ShieldCheck, Truck } from "lucide-react";
import { CATEGORY_CARDS } from "@/lib/types";
import type { WcCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const accentStyles = {
  default: {
    border: "border-jp-border",
    gradient:
      "from-jp-paper via-jp-cream to-white bg-[radial-gradient(circle_at_20%_80%,rgba(107,124,92,0.08),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(212,165,165,0.1),transparent_50%)]",
  },
  food: {
    border: "border-jp-gold",
    gradient:
      "from-jp-paper via-jp-cream to-white bg-[radial-gradient(circle_at_20%_80%,rgba(184,149,107,0.12),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(143,189,143,0.1),transparent_50%)]",
  },
  beauty: {
    border: "border-jp-sakura",
    gradient:
      "from-jp-paper via-jp-cream to-white bg-[radial-gradient(circle_at_20%_80%,rgba(232,213,204,0.35),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(212,165,165,0.12),transparent_50%)]",
  },
  supplement: {
    border: "border-jp-indigo",
    gradient:
      "from-jp-paper via-jp-cream to-white bg-[radial-gradient(circle_at_20%_80%,rgba(44,62,80,0.08),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(143,189,143,0.1),transparent_50%)]",
  },
} as const;

function getCategoryStyle(slug?: string) {
  const card = CATEGORY_CARDS.find(
    (category) => category.slug === slug || slug?.includes(category.slug),
  );
  if (!card) return accentStyles.default;
  return accentStyles[card.variant];
}

const trustItems = [
  { icon: ShieldCheck, label: "100% chính hãng" },
  { icon: Truck, label: "Giao toàn quốc" },
  { icon: Package, label: "Nhập khẩu Nhật" },
] as const;

export function ShopHero({
  activeCategory,
  productCount,
  categoryCount,
}: {
  activeCategory?: WcCategory;
  productCount: number;
  categoryCount: number;
}) {
  const style = getCategoryStyle(activeCategory?.slug);
  const description =
    activeCategory?.description?.replace(/<[^>]+>/g, "").trim() ||
    "Thực phẩm, mỹ phẩm & TPCN chính hãng từ Nhật Bản — nhập khẩu uy tín, giao hàng toàn quốc.";

  return (
    <section
      className={cn(
        "relative mb-8 overflow-hidden px-6 py-12 text-center sm:py-14",
        style.gradient,
      )}
    >
      <div className="relative mx-auto max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-jp-gold uppercase">
          Cửa hàng
        </p>

        <h1 className="mt-3 text-[clamp(1.75rem,4.5vw,2.75rem)] leading-tight font-semibold text-jp-ink">
          {activeCategory?.name ?? "Sản phẩm Nhật Bản"}
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-jp-muted">
          {description}
        </p>
      </div>
    </section>
  );
}
