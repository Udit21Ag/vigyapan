import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '64.227.179.189',
        pathname: '/backend/media/**',
      },
      {
        protocol: 'https',
        hostname: 'vigyapan.digital',
        pathname: '/backend/media/**',
      },
            {
        protocol: 'https',
        hostname: 'www.vigyapan.digital',
        pathname: '/backend/media/**',
      },
    ],
  },
};

export default nextConfig;
