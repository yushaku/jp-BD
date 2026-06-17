import type { NextConfig } from "next";

const wpUrl = process.env.NEXT_PUBLIC_WP_URL ?? "http://localhost:8080";
const wpHostname = new URL(wpUrl).hostname;
const wpBackendUrl =
  process.env.WORDPRESS_API_URL ?? process.env.NEXT_PUBLIC_WP_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/wc-store/:path*",
        destination: `${wpBackendUrl}/wp-json/wc/store/v1/:path*`,
      },
      {
        source: "/api/sos/:path*",
        destination: `${wpBackendUrl}/wp-json/sos/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: wpHostname,
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: wpHostname,
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
