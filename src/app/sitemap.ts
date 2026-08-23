import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";
import { INDUSTRY_SLUGS } from "@/lib/industries";
import { CASE_STUDIES } from "@/lib/case-studies";
import { SHOW_MUDIKIT_ON_WEBSITE } from "@/lib/portal-features";

const BASE = "https://muditek.com";

export const dynamic = "force-dynamic";

// Single stable "site last updated" date for static pages that carry no real
// per-page date. Avoids emitting a false "everything updated right now" signal.
const SITE_UPDATED = new Date("2026-05-04");

const MARKETING: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  // Real per-page dateModified, where the page declares one in its JSON-LD.
  lastModified?: string;
}> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/mudiagent", priority: 0.9, changeFrequency: "monthly" },
  { path: "/revenue-leak-audit", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pe-ops", priority: 0.9, changeFrequency: "monthly" },
  { path: "/appointment-setting", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-23" },
  { path: "/appointment-setting-pricing", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-08-23" },
  { path: "/tools/appointment-setting-quote-calculator", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-08-23" },
  { path: "/ai-act", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/newsletter", priority: 0.8, changeFrequency: "weekly" },
  { path: "/tools/revenue-leak-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/mudiagent-vs-chatgpt", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-05-04" },
  { path: "/pe-ops-vs-juniper-square", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-05-04" },
  { path: "/who-we-help", priority: 0.7, changeFrequency: "monthly" },
  { path: "/case-studies", priority: 0.7, changeFrequency: "monthly" },
  { path: "/subscribe", priority: 0.7, changeFrequency: "monthly" },
];

const MUDIKIT_MARKETING: typeof MARKETING = [
  { path: "/mudikit", priority: 0.8, changeFrequency: "monthly" },
  { path: "/mudikit-vs-skool", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-05-04" },
  { path: "/mudikit-vs-circle", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-05-04" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const marketing = SHOW_MUDIKIT_ON_WEBSITE
    ? [...MARKETING, ...MUDIKIT_MARKETING]
    : MARKETING;

  const entries: MetadataRoute.Sitemap = marketing.map((m) => ({
    url: `${BASE}${m.path}`,
    lastModified: m.lastModified ? new Date(m.lastModified) : SITE_UPDATED,
    changeFrequency: m.changeFrequency,
    priority: m.priority,
  }));

  for (const slug of INDUSTRY_SLUGS) {
    entries.push({
      url: `${BASE}/who-we-help/${slug}`,
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const study of CASE_STUDIES) {
    entries.push({
      url: `${BASE}/case-studies/${study.slug}`,
      lastModified: new Date(study.date),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  try {
    const sql = getDb();
    const issues = (await sql`
      SELECT slug, sent_at, updated_at
      FROM newsletter_issues
      WHERE status = 'sent'
        AND slug IS NOT NULL
        AND html IS NOT NULL
        AND length(trim(html)) > 0
        AND (
          stats->>'portal_article' = 'true'
          OR stats->>'portalArticle' = 'true'
          OR (
            stats->>'source' = 'beehiiv'
            AND COALESCE(stats->>'portal_article', stats->>'portalArticle', 'true') <> 'false'
          )
        )
      ORDER BY sent_at DESC
    `) as Array<{
      slug: string;
      sent_at: Date | null;
      updated_at: Date | null;
    }>;
    for (const issue of issues) {
      entries.push({
        url: `${BASE}/newsletter/${issue.slug}`,
        lastModified: issue.sent_at ?? issue.updated_at ?? now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch (err) {
    console.error("sitemap: failed to load newsletter issues", err);
  }

  return entries;
}
