import Link from "next/link";
import type { WcCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export type CategoryGroup = {
  category: WcCategory;
  children: WcCategory[];
};

export function groupCategories(categories: WcCategory[]): CategoryGroup[] {
  const parents = categories.filter((category) => category.parent === 0);

  return parents.map((category) => ({
    category,
    children: categories.filter((child) => child.parent === category.id),
  }));
}

function CategoryLink({
  href,
  name,
  count,
  isActive,
  nested = false,
}: {
  href: string;
  name: string;
  count?: number;
  isActive: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2 rounded-(--jp-radius) px-2 py-1.5 text-sm leading-snug transition-colors duration-200",
        nested ? "pl-3" : "",
        isActive
          ? "border-l-2 border-jp-gold bg-jp-paper/70 font-semibold text-jp-indigo"
          : "font-medium text-jp-ink hover:bg-jp-paper/50 hover:text-jp-gold",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="truncate">{name}</span>
      {count != null && count > 0 && (
        <span
          className={cn(
            "shrink-0 rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold tabular-nums",
            isActive
              ? "bg-jp-indigo/10 text-jp-indigo"
              : "bg-jp-border/60 text-jp-muted",
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

export function CategorySidebar({
  groups,
  activeSlug,
}: {
  groups: CategoryGroup[];
  activeSlug?: string;
}) {
  return (
    <aside className="hidden rounded-(--jp-radius) bg-jp-cream p-4 shadow-(--jp-shadow) lg:block lg:sticky lg:top-24">
      <h2 className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
        Danh mục
      </h2>

      <nav aria-label="Danh mục sản phẩm" className="mt-4 space-y-3">
        {groups.map(({ category, children }) => {
          const isParentActive = activeSlug === category.slug;
          const hasActiveChild = children.some(
            (child) => child.slug === activeSlug,
          );

          return (
            <div key={category.id}>
              <CategoryLink
                href={`/shop?category=${category.slug}`}
                name={category.name}
                count={category.count}
                isActive={isParentActive}
              />

              {children.length > 0 && (
                <ul
                  className={cn(
                    "mt-1 space-y-0.5 border-l border-jp-border pl-2",
                    hasActiveChild && "border-jp-gold/40",
                  )}
                >
                  {children.map((child) => (
                    <li key={child.id}>
                      <CategoryLink
                        href={`/shop?category=${child.slug}`}
                        name={child.name}
                        count={child.count}
                        isActive={activeSlug === child.slug}
                        nested
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
