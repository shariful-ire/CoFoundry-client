/** @type {import('next').NextConfig} */
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
