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
      { userAgent: "*", allow: "/", disallow: PROTECTED },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: PROTECTED },
      { userAgent: "Claude-SearchBot", allow: "/", disallow: PROTECTED },
      { userAgent: "PerplexityBot", allow: "/", disallow: PROTECTED },
      { userAgent: "ChatGPT-User", allow: "/", disallow: PROTECTED },
      { userAgent: "Claude-User", allow: "/", disallow: PROTECTED },
      { userAgent: "Perplexity-User", allow: "/", disallow: PROTECTED },
      { userAgent: "Google-Agent", allow: "/", disallow: PROTECTED },
      { userAgent: "Google-Extended", allow: "/", disallow: PROTECTED },
      { userAgent: "Applebot-Extended", allow: "/", disallow: PROTECTED },
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "Meta-ExternalAgent", disallow: "/" },
      { userAgent: "Meta-ExternalFetcher", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      { userAgent: "cohere-ai", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "Amazonbot", disallow: "/" },
    ],
    sitemap: "https://muditek.com/sitemap.xml",
  };
}
