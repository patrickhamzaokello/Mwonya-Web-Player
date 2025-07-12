/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.mwonya.com',
      },
      {
        protocol: 'https',
        hostname: 'artist.mwonya.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'www.promptengineering.org',
        pathname: '/**', // Updated to match all paths under www.promptengineering.org
      },
      {
        protocol: 'https',
        hostname: 'mwonya-kasfa-assets-store.s3.us-east-1.amazonaws.com',
      },
    ],
    // Optional: Add image optimization settings
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Optimize for single-page application behavior
  trailingSlash: false,
  
  // Enable compression
  compress: true,
  
  // Clean redirects function
  async redirects() {
    return [];
  },
  
  // Add security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Optional: Add experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;