import Link from "next/link";
import { getMenu } from "@/lib/sos-api";
import { siteUrl } from "@/lib/config";

const FALLBACK_NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/shop", label: "Cửa hàng" },
  { href: "/category/thuc-pham-nhat", label: "Thực phẩm Nhật" },
  { href: "/category/my-pham-nhat", label: "Mỹ phẩm" },
  { href: "/category/tpcn", label: "TPCN" },
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
    <header className="sticky top-0 z-50 border-b border-jp-border bg-jp-cream shadow-[var(--jp-shadow)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-lora)] text-lg font-semibold text-jp-ink"
        >
          JP Bùi Đặng
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-jp-ink hover:text-jp-matcha"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="text-xs font-semibold uppercase tracking-wider text-jp-ink hover:text-jp-matcha"
          >
            Giỏ hàng
          </Link>
          <Link
            href="/account"
            className="hidden text-xs font-semibold uppercase tracking-wider text-jp-ink hover:text-jp-matcha sm:inline"
          >
            Tài khoản
          </Link>
        </div>
      </div>
    </header>
  );
}
