import Link from "next/link";
import type { WcCategory } from "@/lib/types";

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

export function CategorySidebar({
  groups,
  activeSlug,
}: {
  groups: CategoryGroup[];
  activeSlug?: string;
}) {
  return (
    <aside className="rounded-(--jp-radius) p-4 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-jp-ink">Danh mục</h2>

      <nav aria-label="Danh mục sản phẩm" className="mt-4 space-y-4">
        {groups.map(({ category, children }) => {
          const isParentActive = activeSlug === category.slug;

          return (
            <div key={category.id}>
              <Link
                href={`/shop?category=${category.slug}`}
                className={`block text-sm leading-snug transition-colors ${
                  isParentActive
                    ? "font-semibold text-jp-indigo"
                    : "font-medium text-jp-ink hover:text-jp-matcha"
                }`}
              >
                {category.name}
              </Link>

              {children.length > 0 && (
                <ul className="mt-2 space-y-1.5 border-l border-jp-border pl-3">
                  {children.map((child) => {
                    const isChildActive = activeSlug === child.slug;

                    return (
                      <li key={child.id}>
                        <Link
                          href={`/shop?category=${child.slug}`}
                          className={`block text-sm leading-snug transition-colors ${
                            isChildActive
                              ? "font-semibold text-jp-indigo"
                              : "text-jp-muted hover:text-jp-matcha"
                          }`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
