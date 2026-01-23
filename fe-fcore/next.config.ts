import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
      {
        protocol: 'https',
        hostname: 'tectalic.com',
        pathname: '/wp-content/**',
      },
      {
        protocol: 'https',
        hostname: 'webandcrafts.com',
        pathname: '/_next/**',
      },
      {
        protocol: 'https',
        hostname: 'img.uxcel.com',
        pathname: '/cdn-cgi/**',
      },
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
        pathname: '//intuzwebsite/**',
      },
    ],
  },
};
export default nextConfig;
