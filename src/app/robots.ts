import type { MetadataRoute } from "next";

const PROTECTED = [
  "/admin",
  "/admin/",
  "/portal",
  "/portal/",
  "/welcome",
  "/preferences/",
  "/sign-in",
  "/sign-up",
  "/c/",
  "/api",
  "/api/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow all human + standard search engines, except protected paths
      { userAgent: "*", allow: "/", disallow: PROTECTED },

      // AI search & retrieval bots — allow (these power ChatGPT/Claude/Perplexity answers)
      { userAgent: "OAI-SearchBot", allow: "/", disallow: PROTECTED },
      { userAgent: "Claude-SearchBot", allow: "/", disallow: PROTECTED },
      { userAgent: "PerplexityBot", allow: "/", disallow: PROTECTED },

      // User-triggered fetchers — allow (fire when a user pastes a URL into chat)
      { userAgent: "ChatGPT-User", allow: "/", disallow: PROTECTED },
      { userAgent: "Claude-User", allow: "/", disallow: PROTECTED },
      { userAgent: "Perplexity-User", allow: "/", disallow: PROTECTED },
      { userAgent: "Google-Agent", allow: "/", disallow: PROTECTED },

      // Training bots — block (we publish for retrieval, not training datasets)
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "Meta-ExternalAgent", disallow: "/" },
      { userAgent: "Meta-ExternalFetcher", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      { userAgent: "cohere-ai", disallow: "/" },

      // Opt-out tokens (training opt-out signals)
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "Applebot-Extended", disallow: "/" },

      // Undeclared / non-compliant — block
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "Amazonbot", disallow: "/" },
    ],
    sitemap: "https://muditek.com/sitemap.xml",
  };
}
