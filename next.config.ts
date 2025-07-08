import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wrkybuztxahikpudoxcv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/sign-in',
        destination: '/auth/sign-in',
      },
      {
        source: '/sign-up',
        destination: '/auth/sign-up',
      },
      {
        source: '/forgot-password',
        destination: '/auth/forgot-password',
      },
      {
        source: '/reset-password',
        destination: '/auth/reset-password',
      },
      {
        source: '/home',
        destination: '/root/home',
      },
      {
        source: '/upload',
        destination: '/root/upload',
      },
      {
        source: '/settings',
        destination: '/root/settings',
      },
      {
        source: '/profiles',
        destination: '/root/profiles',
      },
      {
        source: '/editor',
        destination: '/root/editor',
      },
      {
        source: '/skills',
        destination: '/root/skills',
      },
      {
        source: '/leads',
        destination: '/root/leads',
      },
      {
        source: '/game',
        destination: '/root/game',
      },
    ];
  },
};

export default nextConfig;
