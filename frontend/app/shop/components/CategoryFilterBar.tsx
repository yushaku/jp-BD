import Link from "next/link";
import type { CategoryGroup } from "./CategorySidebar";
import { cn } from "@/lib/utils";

export function CategoryFilterBar({
  groups,
  activeSlug,
}: {
  groups: CategoryGroup[];
  activeSlug?: string;
}) {
  return (
    <nav aria-label="Lọc danh mục" className="mb-6 lg:hidden">
      <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
        Danh mục
      </p>
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {groups.map(({ category, children }) => {
          const isActive =
            activeSlug === category.slug ||
            children.some((child) => child.slug === activeSlug);

          return (
            <div key={category.id} className="flex shrink-0 gap-2">
              <Link
                href={`/shop?category=${category.slug}`}
                className={cn(
                  "inline-flex cursor-pointer items-center rounded-(--jp-radius) px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                  isActive
                    ? "bg-jp-indigo text-white shadow-(--jp-shadow)"
                    : "bg-jp-cream text-jp-ink shadow-(--jp-shadow) hover:bg-white hover:text-jp-matcha",
                )}
              >
                {category.name}
              </Link>

              {isActive &&
                children.map((child) => {
                  const isChildActive = activeSlug === child.slug;

                  return (
                    <Link
                      key={child.id}
                      href={`/shop?category=${child.slug}`}
                      className={cn(
                        "inline-flex cursor-pointer items-center rounded-(--jp-radius) px-3 py-2 text-sm whitespace-nowrap transition-colors duration-200",
                        isChildActive
                          ? "bg-jp-gold/15 font-semibold text-jp-indigo"
                          : "bg-jp-paper text-jp-muted hover:text-jp-indigo",
                      )}
                    >
                      {child.name}
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
