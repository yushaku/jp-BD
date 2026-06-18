import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ArticleFooter() {
  return (
    <footer className="mt-12 border-t border-jp-border pt-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Link
          href="/tin-tuc"
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-jp-indigo transition-colors duration-200 hover:text-jp-gold"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Quay lại tin tức
        </Link>
        <Link
          href="/shop"
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-jp-indigo transition-colors duration-200 hover:text-jp-gold"
        >
          Khám phá sản phẩm
          <ArrowRight aria-hidden />
        </Link>
      </div>
    </footer>
  );
}
