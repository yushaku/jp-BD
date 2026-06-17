import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
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
    <html lang="vi" className={cn(quicksand.variable)} suppressHydrationWarning>
      <body className="min-h-screen font-(family-name:--font-quicksand) antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
