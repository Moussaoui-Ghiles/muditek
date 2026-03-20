/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "beehiiv-images-production.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "media.beehiiv.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/revenue-machine",
        destination: "/revenue-leak-audit",
        permanent: true,
      },
      {
        source: "/revenue-recovery",
        destination: "/revenue-leak-audit",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
