import Link from "next/link";
import { CartNavLink } from "@/components/CartNavLink";
import { MobileNav } from "@/components/MobileNav";
import { getMenu } from "@/lib/sos-api";
import { siteUrl } from "@/lib/config";

const FALLBACK_NAV = [
  { href: "/shop", label: "Cửa hàng" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
];

function mapMenuUrl(url: string): string {
  if (url.startsWith(siteUrl)) {
    return url.replace(siteUrl, "") || "/";
  }
  return url;
}

export async function Header() {
  const menuItems = await getMenu("primary");
  const nav =
    menuItems.length > 0
      ? menuItems.map((item) => ({
          href: mapMenuUrl(item.url),
          label: item.title,
        }))
      : FALLBACK_NAV;

  return (
    <header className="sticky top-0 z-50 border-b border-jp-border bg-jp-cream shadow-(--jp-shadow)">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-6">
          <MobileNav items={nav} />
          <Link href="/" className="truncate text-lg font-semibold text-jp-ink">
            JP Bùi Đặng
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-jp-ink hover:text-jp-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <CartNavLink />
          <Link
            href="/account"
            className="hidden text-xs font-semibold uppercase tracking-wider text-jp-ink hover:text-jp-gold sm:inline"
          >
            Tài khoản
          </Link>
        </div>
      </div>
    </header>
  );
}
