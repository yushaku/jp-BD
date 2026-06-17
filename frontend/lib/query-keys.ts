export const queryKeys = {
  cart: ["cart"] as const,
  hero: ["hero"] as const,
  menu: (location: string) => ["menu", location] as const,
  products: (params?: Record<string, string>) =>
    ["products", params ?? {}] as const,
  product: (slug: string) => ["product", slug] as const,
  category: (slug: string) => ["category", slug] as const,
};
