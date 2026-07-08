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
    slug: "google-maps-company-finder",
    title: "Google Maps Company Finder",
    short: "Build precise local lead lists with SerpAPI Google Maps results.",
    description:
      "Enter a query and optional location. The tool returns local results with business name, website, address, rating, reviews and local-map metadata.",
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
  {
    slug: "apollo-lead-finder",
    title: "Apollo Lead Finder",
    short: "Enrich LinkedIn lead pages with public contact and profile fields.",
    description:
      "Pass a LinkedIn profile or company page URL to Apollo and return public profile snippets, contact methods, job titles and org details.",
    category: "Lead gen",
    access: "free",
  },
  {
    slug: "website-url-scraper",
    title: "Website URL Scraper",
    short: "Extract deduplicated URLs and embedded emails from any landing page.",
    description:
      "Fetches a public webpage, extracts anchor links, resolves relative URLs, and surfaces all inline email mentions.",
    category: "Research",
    access: "free",
  },
  {
    slug: "website-text-contact-extractor",
    title: "Website Contact Text Extractor",
    short: "Convert page HTML to clean text and extract emails/phones.",
    description:
      "Scrapes a webpage to readable text, then returns key contact signals with a safe preview for validation.",
    category: "Research",
    access: "free",
  },
];

export function getPortalTool(slug: string | null | undefined): PortalTool | null {
  if (!slug) return null;
  return PORTAL_TOOLS.find((tool) => tool.slug === slug) ?? null;
}
