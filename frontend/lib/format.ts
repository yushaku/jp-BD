export function formatPrice(
  price: string | number,
  minorUnit = 0,
  currency = "VND",
): string {
  const raw = typeof price === "string" ? parseFloat(price) : price;
  const amount = minorUnit > 0 ? raw / Math.pow(10, minorUnit) : raw;

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
