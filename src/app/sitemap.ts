import type { MetadataRoute } from "next";
import { getPublishedLibraryItems } from "../lib/library-manifest";
import { libraryCanonicalPath } from "../lib/publication-index";

const BASE = "https://muditek.com";

const STATIC_PAGES: Array<{
  path: string;
  updatedAt: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "", updatedAt: "2026-08-28", priority: 1, changeFrequency: "weekly" },
  { path: "/appointment-setting", updatedAt: "2026-08-28", priority: 0.95, changeFrequency: "monthly" },
  { path: "/appointment-setting-pricing", updatedAt: "2026-08-28", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ai-implementation", updatedAt: "2026-08-23", priority: 0.85, changeFrequency: "monthly" },
  { path: "/library", updatedAt: "2026-08-28", priority: 0.9, changeFrequency: "weekly" },
  { path: "/skills", updatedAt: "2026-08-28", priority: 0.75, changeFrequency: "weekly" },
  { path: "/playbooks", updatedAt: "2026-08-28", priority: 0.75, changeFrequency: "weekly" },
  { path: "/tools", updatedAt: "2026-08-28", priority: 0.75, changeFrequency: "monthly" },
  { path: "/about", updatedAt: "2026-08-23", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", updatedAt: "2026-08-23", priority: 0.3, changeFrequency: "monthly" },
  { path: "/newsletter", updatedAt: "2026-08-23", priority: 0.7, changeFrequency: "weekly" },
];

export function getManifestSitemapEntries(): MetadataRoute.Sitemap {
  return getPublishedLibraryItems().map((item) => ({
    url: `${BASE}${libraryCanonicalPath(item)}`,
    lastModified: new Date(`${item.updatedAt}T00:00:00.000Z`),
    changeFrequency: item.kind === "tool" ? "monthly" : "weekly",
    priority: item.kind === "playbook" && item.slug === "outbound-failure-diagnostic" ? 0.85 : 0.7,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_PAGES.map((page) => ({
      url: `${BASE}${page.path}`,
      lastModified: new Date(`${page.updatedAt}T00:00:00.000Z`),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...getManifestSitemapEntries(),
  ];
}
