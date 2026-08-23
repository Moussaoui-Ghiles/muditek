import type { MetadataRoute } from "next";
import { getPublishedLibraryItems } from "../lib/library-manifest";
import { libraryCanonicalPath } from "../lib/publication-index";

const BASE = "https://muditek.com";
const SITE_UPDATED = new Date("2026-08-23");

const STATIC_PAGES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/appointment-setting", priority: 0.95, changeFrequency: "monthly" },
  { path: "/appointment-setting-pricing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ai-implementation", priority: 0.85, changeFrequency: "monthly" },
  { path: "/library", priority: 0.9, changeFrequency: "weekly" },
  { path: "/skills", priority: 0.75, changeFrequency: "weekly" },
  { path: "/playbooks", priority: 0.75, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.75, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/newsletter", priority: 0.7, changeFrequency: "weekly" },
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
      lastModified: SITE_UPDATED,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...getManifestSitemapEntries(),
  ];
}
