export type ProspectingTool = {
  name: string;
  workflows: Array<"people" | "companies" | "local" | "technology" | "funding">;
  description: string;
  sourceUrl: string;
  pricingUrl: string;
  lastChecked: string;
};

export const PROSPECTING_TOOLS: ProspectingTool[] = [
  { name: "LinkedIn Sales Navigator", workflows: ["people", "companies"], description: "Search LinkedIn members and accounts with Sales Navigator filters.", sourceUrl: "https://business.linkedin.com/sales-solutions/sales-navigator", pricingUrl: "https://business.linkedin.com/sales-solutions/sales-navigator/pricing", lastChecked: "2026-08-24" },
  { name: "Apollo", workflows: ["people", "companies"], description: "Search company and contact records and build prospect lists.", sourceUrl: "https://www.apollo.io/product/search", pricingUrl: "https://www.apollo.io/pricing", lastChecked: "2026-08-24" },
  { name: "Crunchbase", workflows: ["companies", "funding"], description: "Research private companies, funding events, acquisitions, and people.", sourceUrl: "https://about.crunchbase.com/products/crunchbase-pro/", pricingUrl: "https://about.crunchbase.com/products/pricing/", lastChecked: "2026-08-24" },
  { name: "BuiltWith", workflows: ["companies", "technology"], description: "Find websites that use a specified web technology.", sourceUrl: "https://builtwith.com/lead-generation", pricingUrl: "https://builtwith.com/pricing", lastChecked: "2026-08-24" },
  { name: "Wappalyzer", workflows: ["companies", "technology"], description: "Build company lists using detected website technologies.", sourceUrl: "https://www.wappalyzer.com/lists/", pricingUrl: "https://www.wappalyzer.com/pricing/", lastChecked: "2026-08-24" },
  { name: "Google Maps", workflows: ["local", "companies"], description: "Find public business profiles by category and location.", sourceUrl: "https://www.google.com/maps", pricingUrl: "https://www.google.com/maps", lastChecked: "2026-08-24" },
];

export function findProspectingTools(workflows: ProspectingTool["workflows"]): ProspectingTool[] {
  if (workflows.length === 0) return [];
  return PROSPECTING_TOOLS.filter((tool) => workflows.every((workflow) => tool.workflows.includes(workflow)));
}
