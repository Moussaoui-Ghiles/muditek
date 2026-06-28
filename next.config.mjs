/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
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
      // Retired consulting offers -> portal funnel (2026-06 pivot).
      {
        source: "/pe-ops",
        destination: "/portal",
        permanent: true,
      },
      {
        source: "/mudiagent",
        destination: "/portal",
        permanent: true,
      },
      {
        source: "/revenue-leak-audit",
        destination: "/tools/revenue-leak-calculator",
        permanent: true,
      },
      {
        source: "/mudiagent-vs-chatgpt",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/pe-ops-vs-juniper-square",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/who-we-help",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/who-we-help/:path*",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/revenue-machine",
        destination: "/tools/revenue-leak-calculator",
        permanent: true,
      },
      {
        source: "/revenue-recovery",
        destination: "/tools/revenue-leak-calculator",
        permanent: true,
      },
      // /buy handled by src/app/buy/page.tsx (do not re-add a config redirect here)
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
