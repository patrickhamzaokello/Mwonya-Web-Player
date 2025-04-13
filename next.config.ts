import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['assets.mwonya.com','mwonya-kasfa-assets-store.s3.us-east-1.amazonaws.com'],
  },
};

export default nextConfig;
