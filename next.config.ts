import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.mwonya.com',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'artist.mwonya.com',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'mwonya-kasfa-assets-store.s3.us-east-1.amazonaws.com',
        pathname: '/*',
      },
    ],
  },
};

export default nextConfig;
