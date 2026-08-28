/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/*": [
      "./content/skills/**/*",
      "./content/public-skills/**/*",
    ],
    "/skills/[slug]": [
      "./content/skills/**/*",
      "./content/public-skills/**/*",
    ],
    "/playbooks/[slug]": [
      "./content/playbooks/**/*",
      "./content/downloads/playbooks/**/*",
      "./public/playbooks/**/*",
    ],
    "/api/library/playbooks/[slug]": [
      "./content/playbooks/**/*",
      "./public/playbooks/**/*",
    ],
    "/api/portal/skills/[slug]/download": [
      "./content/skills/**/*",
      "./content/public-skills/**/*",
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
        destination: "/playbooks/outbound-failure-diagnostic",
        permanent: true,
      },
      {
        source: "/revenue-recovery",
        destination: "/playbooks/outbound-failure-diagnostic",
        permanent: true,
      },
      {
        source: "/revenue-leak-audit",
        destination: "/playbooks/outbound-failure-diagnostic",
        permanent: true,
      },
      {
        source: "/mudiagent",
        destination: "/ai-implementation#mudiagent",
        permanent: true,
      },
      {
        source: "/mudiagent-vs-chatgpt",
        destination: "/ai-implementation#mudiagent",
        permanent: true,
      },
      {
        source: "/pe-ops",
        destination: "/ai-implementation#operations",
        permanent: true,
      },
      {
        source: "/pe-ops-vs-juniper-square",
        destination: "/ai-implementation#operations",
        permanent: true,
      },
      {
        source: "/ai-act/:path*",
        destination: "/ai-implementation#governance",
        permanent: true,
      },
      {
        source: "/case-studies/:path*",
        destination: "/library",
        permanent: true,
      },
      {
        source: "/who-we-help/:path*",
        destination: "/ai-implementation#applications",
        permanent: true,
      },
      {
        source: "/mudikit",
        destination: "/library",
        permanent: true,
      },
      {
        source: "/mudikit-vs-skool",
        destination: "/library",
        permanent: true,
      },
      {
        source: "/mudikit-vs-circle",
        destination: "/library",
        permanent: true,
      },
      {
        source: "/portal/skills/:slug",
        destination: "/skills/:slug",
        permanent: true,
      },
      {
        source: "/portal/playbooks",
        destination: "/playbooks",
        permanent: true,
      },
      {
        source: "/portal/playbooks/:slug",
        destination: "/playbooks/:slug",
        permanent: true,
      },
      {
        source: "/portal/tools",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/portal/tools/:slug",
        destination: "/tools/:slug",
        permanent: true,
      },
      {
        source: "/portal/workflow-archive/:path*",
        destination: "/portal",
        permanent: true,
      },
      {
        source: "/portal/mudikit",
        destination: "/library",
        permanent: true,
      },
      {
        source: "/portal/newsletter/:slug",
        destination: "/newsletter/:slug",
        permanent: true,
      },
      {
        source: "/resources",
        destination: "/library",
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
