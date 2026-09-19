import type { NextConfig } from 'next';

// INTENTIONAL LAB VULNERABILITY — DO NOT USE IN PRODUCTION
// Security headers are intentionally disabled or weakened

const nextConfig: NextConfig = {
  // INTENTIONAL: Missing security headers (Content-Security-Policy, X-Frame-Options, etc.)

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          // INTENTIONAL LAB VULNERABILITY — Permissive CORS
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
