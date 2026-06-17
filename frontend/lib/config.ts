export const wpPublicUrl =
  process.env.NEXT_PUBLIC_WP_URL ?? "http://localhost:8080";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const wpApiUrl =
  process.env.WORDPRESS_API_URL ?? process.env.NEXT_PUBLIC_WP_URL ?? "http://localhost:8080";

/** Same-origin proxy path — see `next.config.ts` rewrites. Avoids browser CORS to WP. */
export const wpStoreApiBase = "/api/wc-store";
export const wpSosApiBase = "/api/sos";

export const wcConsumerKey = process.env.WC_CONSUMER_KEY ?? "";
export const wcConsumerSecret = process.env.WC_CONSUMER_SECRET ?? "";
