import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import type { WcProduct } from "@/lib/types";

const accentColors = {
  default: "border-jp-border",
  food: "border-jp-gold",
  beauty: "border-jp-sakura",
  supplement: "border-jp-indigo",
} as const;

export function CategoryProductSection({
  title,
  description,
  variant = "default",
  categorySlug,
  products,
}: {
  title: string;
  description?: string;
  variant?: keyof typeof accentColors;
  categorySlug: string;
  products: WcProduct[];
}) {
  return (
    <section className="mx-auto mb-12 max-w-6xl px-6">
      <header
        className={`mb-6 flex flex-col items-center justify-between gap-3 border-b-2 pb-3 sm:flex-row sm:items-end ${accentColors[variant]}`}
      >
        <div className="text-center sm:text-left">
          <h2 className="text-[1.65rem]">{title}</h2>
          {description && (
            <p className="mt-2 text-[0.95rem] text-jp-muted">{description}</p>
          )}
        </div>
        <Link
          href={`/category/${categorySlug}`}
          className="shrink-0 text-sm font-semibold uppercase tracking-wider text-jp-indigo hover:text-jp-gold"
        >
          Xem tất cả →
        </Link>
      </header>
      <ProductGrid products={products} />
    </section>
  );
}
