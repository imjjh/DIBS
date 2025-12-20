import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_API_URL || 'http://localhost:8080'}/api/:path*`,
      },
      {
        source: '/oauth2/:path*',
        destination: `${process.env.BACKEND_API_URL || 'http://localhost:8080'}/oauth2/:path*`,
      },
    ];
  },
};

export default nextConfig;
