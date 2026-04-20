import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://muditek.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/mudiagent`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/revenue-leak-audit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/pe-ops`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/newsletter`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/tools/revenue-leak-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/mudiagent-vs-chatgpt`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pe-ops-vs-juniper-square`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/resources`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/resources/claude-code-tips`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
