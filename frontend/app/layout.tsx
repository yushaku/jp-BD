import type { Metadata } from "next";
import { Be_Vietnam_Pro, Lora } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "JP Bùi Đặng — Thực phẩm, mỹ phẩm & TPCN Nhật Bản",
    template: "%s | JP Bùi Đặng",
  },
  description:
    "Thực phẩm, mỹ phẩm & TPCN chính hãng từ Nhật Bản. Nhập khẩu uy tín, giao hàng toàn quốc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={cn(lora.variable, beVietnam.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-[family-name:var(--font-be-vietnam)] antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
