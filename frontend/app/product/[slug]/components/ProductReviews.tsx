"use client";

import { useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import type { ProductReviewsData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { InteractiveStarRating, StarRating } from "./StarRating";

function RatingBreakdown({
  breakdown,
  total,
}: {
  breakdown: ProductReviewsData["breakdown"];
  total: number;
}) {
  const rows = [5, 4, 3, 2, 1] as const;

  return (
    <div className="space-y-2">
      {rows.map((stars) => {
        const count = breakdown[String(stars) as keyof typeof breakdown];
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <div
            key={stars}
            className="grid grid-cols-[2.5rem_1fr_2rem] items-center gap-2 text-sm"
          >
            <span className="text-jp-muted">{stars} sao</span>
            <div className="h-2 overflow-hidden rounded-full bg-jp-border">
              <div
                className="h-full rounded-full bg-jp-gold transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-right text-jp-muted">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ProductReviews({
  productId,
  initialData,
}: {
  productId: number;
  initialData: ProductReviewsData;
}) {
  const data = initialData;
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const author = String(formData.get("author") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    if (!author || !email || !content || rating < 1) {
      toast.error("Vui lòng điền đầy đủ thông tin và chọn số sao.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, email, content, rating }),
      });

      const body = (await res.json()) as { message?: string };

      if (!res.ok) {
        throw new Error(body.message ?? "Không thể gửi đánh giá.");
      }

      toast.success(body.message ?? "Đã gửi đánh giá thành công.");
      form.reset();
      setRating(5);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể gửi đánh giá.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="reviews" className="mt-12 pt-10">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-jp-gold uppercase">
          Khách hàng nói gì
        </p>
        <h2 className="mt-1 text-[1.65rem] text-jp-ink">
          Đánh giá & bình luận
        </h2>
      </header>

      <div className="flex flex-col gap-8">
        <div className="rounded-(--jp-radius) bg-jp-cream p-5 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-4xl font-bold text-jp-ink">
                {data.count > 0 ? data.average.toFixed(1) : "—"}
              </p>
              <StarRating value={data.average} size="lg" className="mt-2" />
              <p className="mt-2 text-sm text-jp-muted">
                {data.count > 0
                  ? `${data.count} đánh giá`
                  : "Chưa có đánh giá nào"}
              </p>
            </div>
            {data.count > 0 && (
              <div className="w-full md:max-w-sm">
                <RatingBreakdown
                  breakdown={data.breakdown}
                  total={data.count}
                />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-(--jp-radius) bg-jp-cream p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-jp-ink">Viết đánh giá</h3>
          <p className="mt-1 text-sm text-jp-muted">
            Chỉ khách đã mua sản phẩm mới được đánh giá. Vui lòng dùng{" "}
            <strong className="font-semibold text-jp-ink">
              email đặt hàng
            </strong>
            .
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label>Đánh giá của bạn *</Label>
              <InteractiveStarRating
                value={rating}
                onChange={setRating}
                disabled={submitting}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="review-author">Họ và tên *</Label>
                <Input
                  id="review-author"
                  name="author"
                  placeholder="Nguyễn Văn A"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-email">Email đặt hàng *</Label>
                <Input
                  id="review-email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  disabled={submitting}
                />
                <p className="text-xs text-jp-muted">
                  Phải trùng email trong đơn hàng đã thanh toán.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-content">Nội dung đánh giá *</Label>
              <Textarea
                id="review-content"
                name="content"
                rows={4}
                placeholder="Sản phẩm dùng thấy thế nào? Chất lượng, mùi hương, đóng gói..."
                required
                disabled={submitting}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="uppercase tracking-wider"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi đánh giá"
              )}
            </Button>
          </form>
        </div>

        {data.reviews.length > 0 ? (
          <ul className="space-y-4 bg-jp-cream">
            {data.reviews.map((review) => (
              <li key={review.id} className="rounded-(--jp-radius) p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-jp-ink">
                        {review.author}
                      </p>
                      {review.verified && (
                        <span className="rounded bg-jp-matcha/15 px-1.5 py-0.5 text-[0.65rem] font-semibold text-jp-matcha uppercase">
                          Đã mua hàng
                        </span>
                      )}
                    </div>
                    <time
                      dateTime={review.date}
                      className="text-xs text-jp-muted"
                    >
                      {formatDate(review.date)}
                    </time>
                  </div>
                  <StarRating value={review.rating} size="sm" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-jp-muted">
                  {review.content}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center rounded-(--jp-radius)",
              "px-6 py-10 text-center bg-jp-cream",
            )}
          >
            <MessageSquare className="size-8 text-jp-muted" aria-hidden />
            <p className="mt-3 font-medium text-jp-ink">
              Chưa có bình luận nào
            </p>
            <p className="mt-1 text-sm text-jp-muted">
              Hãy là người đầu tiên đánh giá sản phẩm này.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
