import Link from "next/link";
import type { CategoryCard } from "@/lib/types";

const borderColors: Record<CategoryCard["variant"], string> = {
  food: "border-t-jp-matcha hover:border-jp-matcha",
  beauty: "border-t-jp-sakura hover:border-jp-sakura",
  supplement: "border-t-jp-indigo hover:border-jp-indigo",
};

export function CategoryNav({ categories }: { categories: CategoryCard[] }) {
  return (
    <nav
      aria-label="Danh mục sản phẩm"
      className="mx-auto mb-12 grid max-w-4xl gap-4 px-6 md:grid-cols-3"
    >
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className={`block rounded-(--jp-radius) border border-jp-border border-t-[3px] bg-jp-cream p-7 text-center shadow-(--jp-shadow) transition hover:-translate-y-0.5 ${borderColors[cat.variant]}`}
        >
          <span className="mb-1 block text-2xl font-semibold text-jp-muted opacity-70">
            {cat.kanji}
          </span>
          <span className="block text-sm font-semibold tracking-wide">
            {cat.label}
          </span>
          <span className="mt-1 block text-xs text-jp-muted">{cat.desc}</span>
        </Link>
      ))}
    </nav>
  );
}
