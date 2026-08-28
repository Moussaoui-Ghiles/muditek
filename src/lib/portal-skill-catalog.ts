export const PORTAL_SKILL_SECTIONS = [
  {
    id: "content-systems",
    title: "Content systems",
    description: "Plan, write, package, and distribute source-grounded content.",
    slugs: [
      "audience-content-os",
      "linkedin-content-writer",
      "x-content-writer",
      "newsletter",
      "tiktok-slideshow-machine",
      "lead-magnets",
    ],
  },
  {
    id: "outbound-execution",
    title: "Outbound execution",
    description: "Review the offer, define the market, model the funnel, and build the list.",
    slugs: [
      "cold-offer-review",
      "buyer-signal-list-research",
      "outbound-funnel-economics",
      "list-builder",
      "list-expander",
      "google-maps-owner-email-finder",
    ],
  },
] as const;

export type PortalSkillSection = (typeof PORTAL_SKILL_SECTIONS)[number];
export type PortalSkillSlug = PortalSkillSection["slugs"][number];

export const PORTAL_SKILL_SLUGS: readonly PortalSkillSlug[] =
  PORTAL_SKILL_SECTIONS.flatMap((section) => section.slugs);

const PORTAL_SKILL_SUMMARIES: Record<PortalSkillSlug, string> = {
  "audience-content-os":
    "Find a truthful topic, sharpen the hook, hold attention with real curiosity, and deliver the promised reward without inventing evidence.",
  "linkedin-content-writer":
    "Turn one complete source or draft into a source-faithful LinkedIn post with a clear hook and no unsupported claims.",
  "x-content-writer":
    "Choose the right native X format, surface the strongest true hook, and preserve every material fact from the source.",
  newsletter:
    "Build one complete newsletter issue around one reader, one promise, and one source-supported argument.",
  "tiktok-slideshow-machine":
    "Turn a verified slideshow reference into editable 9:16 HTML slides and locally rendered PNG files.",
  "lead-magnets":
    "Design a useful lead magnet that solves one narrow problem and leads naturally to the next paid problem.",
  "cold-offer-review":
    "Audit whether a cold buyer can understand, believe, judge, and accept an existing B2B offer.",
  "buyer-signal-list-research":
    "Define evidence-backed account fit, buyer roles, timing signals, sourcing rules, and list quality checks.",
  "outbound-funnel-economics":
    "Calculate outbound conversion, leakage, acquisition cost, gross profit, payback, and cohort economics from first-party inputs.",
  "list-builder":
    "Build a qualified company and contact list through explicit research, verification, and review steps.",
  "list-expander":
    "Expand a small set of verified companies into a larger qualified market using scored lookalikes.",
  "google-maps-owner-email-finder":
    "Collect explicit owner evidence and public website emails for reviewed local businesses without paid APIs or guessed data.",
};

const PORTAL_SKILL_SLUG_SET = new Set<string>(PORTAL_SKILL_SLUGS);

export function isPortalSkillSlug(slug: string): slug is PortalSkillSlug {
  return PORTAL_SKILL_SLUG_SET.has(slug);
}

export function getPortalSkillSection(slug: string): PortalSkillSection | undefined {
  return PORTAL_SKILL_SECTIONS.find((section) =>
    (section.slugs as readonly string[]).includes(slug),
  );
}

export function getPortalSkillSummary(slug: string): string | undefined {
  return isPortalSkillSlug(slug) ? PORTAL_SKILL_SUMMARIES[slug] : undefined;
}

export function groupPortalSkills<T extends { slug: string }>(items: readonly T[]) {
  const bySlug = new Map(items.map((item) => [item.slug, item]));

  return PORTAL_SKILL_SECTIONS.map((section) => ({
    ...section,
    items: section.slugs
      .map((slug) => bySlug.get(slug))
      .filter((item): item is T => Boolean(item)),
  })).filter((section) => section.items.length > 0);
}

export function filterPortalSkillItems<T extends { slug: string; category: string }>(
  items: readonly T[],
): T[] {
  return items.filter(
    (item) => item.category.trim().toLowerCase() !== "skill" || isPortalSkillSlug(item.slug),
  );
}
