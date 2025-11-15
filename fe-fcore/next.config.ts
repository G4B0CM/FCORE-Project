import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'primefaces.org',
        pathname: '/cdn/primereact/**',
      },
      {
        protocol: 'https',
        hostname: '4kwallpapers.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.piranirisk.com',
        pathname: '/hs-fs/hubfs/**',
      },
    ],
  },
};
export default nextConfig;
