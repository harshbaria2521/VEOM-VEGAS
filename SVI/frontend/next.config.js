/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Temporary dev workaround: Proxy API calls to FastAPI backend on 127.0.0.1:8000
  // to avoid browser CORS issues during local development.
  // Note for backend team: Replace with proper CORS whitelist origin in production.
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: 'http://127.0.0.1:5500/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
