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
];

export function getPortalTool(slug: string | null | undefined): PortalTool | null {
  if (!slug) return null;
  return PORTAL_TOOLS.find((tool) => tool.slug === slug) ?? null;
}
