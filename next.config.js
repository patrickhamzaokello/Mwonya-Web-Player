/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    output: "standalone",
    eslint: {
      ignoreDuringBuilds: true,
    },
  images: {
    domains: ['assets.mwonya.com','artist.mwonya.com','mwonya-kasfa-assets-store.s3.us-east-1.amazonaws.com'],
  },
}

module.exports = nextConfig 