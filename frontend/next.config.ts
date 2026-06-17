import type { NextConfig } from "next";

const wpUrl = process.env.NEXT_PUBLIC_WP_URL ?? "http://localhost:8080";
const wpHostname = new URL(wpUrl).hostname;

const nextConfig: NextConfig = {
  output: "standalone",
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
