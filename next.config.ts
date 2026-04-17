import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/n8n/:path*',
        destination: 'http://40.81.230.135/n8n/:path*', // Azure VM IP
      },
      {
        source: '/sherlock/:path*',
        destination: 'http://40.81.230.135/sherlock/:path*', // Azure VM IP
      },
      {
        source: '/api/:path*',
        destination: 'http://40.81.230.135/api/:path*', // Azure VM API Handler (NO TIMEOUT)
      }
    ];
  },
};

export default nextConfig;
