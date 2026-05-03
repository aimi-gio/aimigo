import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Notion images come from S3 (uploaded files) and notion.so CDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        protocol: 'https',
        hostname: 'file.notion.so',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Cache images for 1 hour — matches page revalidate interval so
    // Vercel always re-fetches with a fresh (non-expired) Notion S3 URL
    minimumCacheTTL: 3600,
  },
};

export default nextConfig;
