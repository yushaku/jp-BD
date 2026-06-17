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

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function getSalePercent(
  regularPrice: string,
  salePrice: string,
): number | null {
  const regular = parseFloat(regularPrice);
  const sale = parseFloat(salePrice);
  if (!regular || !sale || sale >= regular) return null;
  return Math.round((1 - sale / regular) * 100);
}
