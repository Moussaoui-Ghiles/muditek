export type PortalToolAccess = "free" | "mudikit";

export type PortalTool = {
  slug: string;
  title: string;
  short: string;
  description: string;
  category: string;
  access: PortalToolAccess;
  publicHref?: string;
};

export const PORTAL_TOOLS: PortalTool[] = [
  {
    slug: "revenue-leak-calculator",
    title: "Revenue Leak Calculator",
    short: "Estimate annual pipeline leakage across 5 categories.",
    description:
      "Enter MRR, lead volume, response time, close rate, churn, and channel spend. Returns euro-denominated leak amounts per category with formulas and the benchmark each calculation is grounded in.",
    category: "Diagnostic",
    access: "free",
    publicHref: "/tools/revenue-leak-calculator",
  },
  {
    slug: "google-maps-lead-finder",
    title: "Google Maps Lead Finder",
    short: "Pull local business leads from Google Maps through Apify.",
    description:
      "Enter a business type and location. The workbench runs the Google Maps Apify actor and returns real businesses, websites, phones, ratings, review counts, and any emails returned by the scraper.",
    category: "Lead gen",
    access: "free",
  },
  {
    slug: "linkedin-serper-lead-finder",
    title: "LinkedIn Serper Lead Finder",
    short: "Search LinkedIn profiles through programmable Google queries.",
    description:
      "Build targeted LinkedIn profile searches with role, market, and company keywords. The workbench uses Serper to return live Google results for LinkedIn profiles.",
    category: "Lead gen",
    access: "free",
  },
];

export function getPortalTool(slug: string | null | undefined): PortalTool | null {
  if (!slug) return null;
  return PORTAL_TOOLS.find((tool) => tool.slug === slug) ?? null;
}
