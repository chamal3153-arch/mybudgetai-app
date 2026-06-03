import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Cloudflare Pages
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
};

export default nextConfig;
