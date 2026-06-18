import { NextResponse } from "next/server";
import { submitProductReview } from "@/lib/product-reviews-server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isFinite(productId) || productId < 1) {
    return NextResponse.json(
      { message: "Sản phẩm không hợp lệ." },
      { status: 400 },
    );
  }

  let body: {
    author?: string;
    email?: string;
    content?: string;
    rating?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Dữ liệu không hợp lệ." },
      { status: 400 },
    );
  }

  const author = String(body.author ?? "").trim();
  const email = String(body.email ?? "").trim();
  const content = String(body.content ?? "").trim();
  const rating = Number(body.rating ?? 0);

  if (!author || !email || !content || rating < 1 || rating > 5) {
    return NextResponse.json(
      {
        message:
          "Vui lòng điền họ tên, email hợp lệ, chọn sao và nội dung đánh giá.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await submitProductReview({
      productId,
      author,
      email,
      content,
      rating,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể gửi đánh giá.";
    const status = message.includes("đã mua") ? 403 : 500;
    return NextResponse.json({ message }, { status });
  }
}
