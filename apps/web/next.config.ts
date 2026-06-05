import type { NextConfig } from 'next';

const apiRoot = (process.env.API_URL ?? 'http://localhost:3001').trim().replace(/\/$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiRoot}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
