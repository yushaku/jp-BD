"use client";

import { ArrowLeft } from "lucide-react";

export function BackLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className={className}
    >
      <ArrowLeft className="size-4" aria-hidden />
      Quay lại trang trước
    </button>
  );
}
