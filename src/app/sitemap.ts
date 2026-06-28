import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";
import { CASE_STUDIES } from "@/lib/case-studies";
import { PLAYBOOKS } from "@/lib/playbooks";
import { PUBLIC_SKILLS } from "@/lib/skills-public";
import { PUBLIC_WORKFLOWS } from "@/lib/workflows-public";
import { PUBLIC_TOOLS } from "@/lib/tools-public";
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
  // NOTE: /ai-act re-added once the pillar page is built (page dir is currently empty).
  // Retired consulting offers (/mudiagent, /pe-ops, /revenue-leak-audit, the /vs
  // pages, /who-we-help) now 301 to the funnel, so they are no longer listed here.
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/newsletter", priority: 0.8, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.8, changeFrequency: "weekly" },
  { path: "/tools/revenue-leak-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/case-studies", priority: 0.7, changeFrequency: "monthly" },
  { path: "/playbooks", priority: 0.8, changeFrequency: "weekly" },
  { path: "/skills", priority: 0.8, changeFrequency: "weekly" },
  { path: "/workflows", priority: 0.8, changeFrequency: "weekly" },
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

  for (const study of CASE_STUDIES) {
    entries.push({
      url: `${BASE}/case-studies/${study.slug}`,
      lastModified: new Date(study.date),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const p of PLAYBOOKS) {
    entries.push({
      url: `${BASE}/playbooks/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const s of PUBLIC_SKILLS) {
    entries.push({
      url: `${BASE}/skills/${s.slug}`,
      lastModified: new Date(s.date),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const t of PUBLIC_TOOLS) {
    entries.push({
      url: `${BASE}/tools/${t.slug}`,
      lastModified: new Date(t.date),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const w of PUBLIC_WORKFLOWS) {
    entries.push({
      url: `${BASE}/workflows/${w.slug}`,
      lastModified: new Date(w.date),
      changeFrequency: "monthly",
      priority: 0.6,
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
