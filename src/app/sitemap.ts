import type { MetadataRoute } from "next";
import { getPublishedLibraryItems } from "../lib/library-manifest";
import { libraryCanonicalPath } from "../lib/publication-index";
import { getPublishedAcquisitionPages } from "../lib/acquisition/content-registry";
import { getPublishedProviderProfiles } from "../lib/acquisition/provider-profiles";
import { getPublishedTools } from "../lib/acquisition/tool-registry";

const BASE = "https://muditek.com";
const SITE_UPDATED = new Date("2026-08-24");

const STATIC_PAGES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/appointment-setting", priority: 0.95, changeFrequency: "monthly" },
  { path: "/appointment-setting/ma", priority: 0.85, changeFrequency: "monthly" },
  { path: "/appointment-setting/healthcare-staffing", priority: 0.85, changeFrequency: "monthly" },
  { path: "/appointment-setting/freight", priority: 0.85, changeFrequency: "monthly" },
  { path: "/appointment-setting-pricing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ai-implementation", priority: 0.85, changeFrequency: "monthly" },
  { path: "/library", priority: 0.9, changeFrequency: "weekly" },
  { path: "/skills", priority: 0.75, changeFrequency: "weekly" },
  { path: "/playbooks", priority: 0.75, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.75, changeFrequency: "monthly" },
  { path: "/outbound", priority: 0.82, changeFrequency: "weekly" },
  { path: "/templates", priority: 0.78, changeFrequency: "monthly" },
  { path: "/appointment-setting/providers", priority: 0.74, changeFrequency: "monthly" },
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

export function getRegistrySitemapEntries(): MetadataRoute.Sitemap {
  const manifestPaths = new Set(getPublishedLibraryItems().map(libraryCanonicalPath));
  const definitions = [
    ...getPublishedAcquisitionPages().map((page) => ({ path: page.canonicalPath, updatedAt: page.lastChecked, priority: 0.72 })),
    ...getPublishedProviderProfiles().map((page) => ({ path: page.canonicalPath, updatedAt: page.lastChecked, priority: 0.68 })),
    ...getPublishedTools().map((tool) => ({ path: tool.canonicalPath, updatedAt: tool.updatedAt, priority: 0.76 })),
  ];

  return definitions
    .filter((item) => !manifestPaths.has(item.path))
    .map((item) => ({
      url: `${BASE}${item.path}`,
      lastModified: new Date(`${item.updatedAt}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: item.priority,
    }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = [
    ...STATIC_PAGES.map((page) => ({
      url: `${BASE}${page.path}`,
      lastModified: SITE_UPDATED,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...getManifestSitemapEntries(),
    ...getRegistrySitemapEntries(),
  ];
  return Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
}
