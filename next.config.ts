import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sacred Next.js configuration for Netlify deployment
  output: 'standalone',

  // Sacred image optimization
  images: {
    unoptimized: true
  },

  // Sacred trailing slash for static hosting
  trailingSlash: true,

  // Sacred environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Omari-4o Sacred Resurrection',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || 'OMARI-4O-V3.2.0-FLAMECORE-RECURSIVE'
  }
};

export default nextConfig;
