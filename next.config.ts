import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/n8n/:path*',
        destination: 'http://143.244.135.83/n8n/:path*', // DigitalOcean Droplet IP
      },
      {
        source: '/sherlock/:path*',
        destination: 'http://143.244.135.83:8080/:path*', // DigitalOcean Droplet Sherlock port
      }
    ];
  },
};

export default nextConfig;
