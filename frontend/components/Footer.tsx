import type { ReactNode } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { contactInfo, policyLinks, supportLinks } from "@/lib/contact";
import { CATEGORY_CARDS } from "@/lib/types";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "100% chính hãng" },
  { icon: Truck, label: "Giao toàn quốc" },
  { icon: Check, label: "Nhập khẩu uy tín" },
] as const;

const QUICK_LINKS = [
  { href: "/shop", label: "Cửa hàng" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
] as const;

const linkClass =
  "cursor-pointer text-sm text-jp-paper/80 transition-colors duration-200 hover:text-jp-gold";

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
      {children}
    </h3>
  );
}

function FooterLinkList({
  links,
}: {
  links: readonly { href: string; label: string }[];
}) {
  return (
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.href + link.label}>
          <Link href={link.href} className={linkClass}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const { brand, intro, address, contact, hours } = contactInfo;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-jp-border bg-jp-indigo text-jp-paper">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-4">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-2 text-xs font-semibold tracking-wide text-jp-cream uppercase"
            >
              <Icon className="size-4 shrink-0 text-jp-gold" aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-4">
          <Link
            href="/"
            className="inline-block cursor-pointer text-xl font-semibold text-jp-cream transition-colors duration-200 hover:text-jp-gold"
          >
            {brand}
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-jp-paper/80">
            {intro}
          </p>
          <nav aria-label="Liên kết nhanh" className="mt-5">
            <FooterHeading>Khám phá</FooterHeading>
            <FooterLinkList links={QUICK_LINKS} />
          </nav>
        </div>

        <div className="lg:col-span-2">
          <FooterHeading>Danh mục</FooterHeading>
          <ul className="space-y-2.5">
            {CATEGORY_CARDS.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/category/${cat.slug}`} className={linkClass}>
                  {cat.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/shop" className={linkClass}>
                Tất cả sản phẩm
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <FooterHeading>Hỗ trợ khách hàng</FooterHeading>
          <FooterLinkList links={supportLinks} />
          <div className="mt-6">
            <FooterHeading>Chính sách</FooterHeading>
            <FooterLinkList links={policyLinks} />
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <FooterHeading>Liên hệ</FooterHeading>
          <ul className="space-y-3 text-sm text-jp-paper/80">
            <li className="flex items-start gap-2.5">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-jp-gold"
                aria-hidden
              />
              <address className="not-italic leading-relaxed">
                {address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-jp-gold" aria-hidden />
              <a
                href={contact.hotlineHref}
                className="cursor-pointer font-semibold text-jp-cream transition-colors duration-200 hover:text-jp-gold"
              >
                {contact.hotline}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-jp-gold" aria-hidden />
              <a
                href={contact.emailHref}
                className="cursor-pointer transition-colors duration-200 hover:text-jp-gold"
              >
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5 border-t border-white/10 pt-3">
              <Clock
                className="mt-0.5 size-4 shrink-0 text-jp-gold"
                aria-hidden
              />
              <div className="space-y-1">
                <p>
                  <span className="text-jp-cream">{hours.weekdays.label}:</span>{" "}
                  {hours.weekdays.time}
                </p>
                <p>
                  <span className="text-jp-cream">{hours.weekend.label}:</span>{" "}
                  {hours.weekend.time}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-center text-xs text-jp-sakura sm:flex-row sm:text-left">
          <p>
            © {year} {brand}. Chính hãng · Nhập khẩu Nhật Bản.
          </p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-jp-gold" aria-hidden />
            Cam kết 100% hàng authentic
          </p>
        </div>
      </div>
    </footer>
  );
}
