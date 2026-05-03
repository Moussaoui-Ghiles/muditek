import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";
import { INDUSTRY_SLUGS } from "@/lib/industries";
import { CASE_STUDY_SLUGS } from "@/lib/case-studies";

const BASE = "https://muditek.com";

const MARKETING: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/mudiagent", priority: 0.9, changeFrequency: "monthly" },
  { path: "/revenue-leak-audit", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pe-ops", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/newsletter", priority: 0.8, changeFrequency: "weekly" },
  { path: "/buy", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/revenue-leak-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/mudiagent-vs-chatgpt", priority: 0.7, changeFrequency: "monthly" },
  { path: "/pe-ops-vs-juniper-square", priority: 0.7, changeFrequency: "monthly" },
  { path: "/mudikit-vs-skool", priority: 0.7, changeFrequency: "monthly" },
  { path: "/mudikit-vs-circle", priority: 0.7, changeFrequency: "monthly" },
  { path: "/who-we-help", priority: 0.7, changeFrequency: "monthly" },
  { path: "/case-studies", priority: 0.7, changeFrequency: "monthly" },
  { path: "/resources", priority: 0.8, changeFrequency: "weekly" },
  { path: "/subscribe", priority: 0.7, changeFrequency: "monthly" },
];

const RESOURCE_SLUGS = [
  "clawchief-blueprint",
  "claude-code-self-evolving",
  "judgment-moat",
  "claude-code-tips",
  "google-maps-outbound",
  "skill-creator-blueprint",
  "claude-dispatch-guide",
  "agentic-sdr-setup-guide",
  "cowork-setup-guide",
  "gtm-skills-guide",
  "sequoia-autopilot-playbook",
  "ai-data-agent-guide",
  "ai-productivity-scorecard",
  "openclaw-outbound",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = MARKETING.map((m) => ({
    url: `${BASE}${m.path}`,
    lastModified: now,
    changeFrequency: m.changeFrequency,
    priority: m.priority,
  }));

  for (const slug of RESOURCE_SLUGS) {
    entries.push({
      url: `${BASE}/resources/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const slug of INDUSTRY_SLUGS) {
    entries.push({
      url: `${BASE}/who-we-help/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const slug of CASE_STUDY_SLUGS) {
    entries.push({
      url: `${BASE}/case-studies/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  try {
    const sql = getDb();
    const issues = (await sql`SELECT slug, sent_at, updated_at FROM newsletter_issues WHERE status = 'sent' AND slug IS NOT NULL ORDER BY sent_at DESC`) as Array<{
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
