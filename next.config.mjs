/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/*": [
      "./content/playbooks/10000-cold-email-system.md",
      "./content/playbooks/google-maps-outbound.md",
      "./content/skills/google-maps-owner-email-finder/**/*",
    ],
    "/portal/playbooks/[slug]": [
      "./content/playbooks/**/*.html",
      "./content/downloads/playbooks/**/*",
      "./public/playbooks/**/*",
    ],
    "/portal/skills/[slug]": [
      "./content/playbooks/**/*.html",
      "./content/downloads/playbooks/**/*",
      "./public/playbooks/**/*",
    ],
    "/api/portal/resources/[slug]/html": [
      "./content/playbooks/**/*.html",
      "./public/playbooks/**/*",
    ],
    "/api/portal/resources/[slug]/download": [
      "./content/playbooks/**/*.html",
      "./content/downloads/playbooks/**/*",
      "./public/playbooks/**/*",
    ],
    "/api/portal/resources/[slug]/page/[file]": [
      "./content/downloads/playbooks/**/*",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
      // /buy handled by src/app/buy/page.tsx (do not re-add a config redirect here)
      {
        source: "/tools",
        destination: "/tools/revenue-leak-calculator",
        permanent: true,
      },
      {
        // Legacy LinkedIn campaign URLs — UUID at root → /c/[id]
        source: "/:id(:?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})",
        destination: "/c/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
