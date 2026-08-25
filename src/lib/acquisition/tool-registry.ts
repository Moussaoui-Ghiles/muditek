import { isAcquisitionPreviewEnvironment } from "./publication";

export type ToolComponentKey =
  | "outbound-funnel-economics-calculator"
  | "csv-list-quality-auditor"
  | "outbound-brief-builder"
  | "sales-prospecting-tool-finder"
  | "public-b2b-signal-finder"
  | "email-authentication-checker"
  | "dmarc-checker"
  | "dkim-checker"
  | "dmarc-generator"
  | "spf-checker"
  | "spf-generator"
  | "qualified-meeting-specification-builder"
  | "cms-healthcare-staffing-explorer"
  | "email-header-analyzer"
  | "mail-provider-lookup"
  | "google-workspace-email-authentication-setup"
  | "microsoft-365-email-authentication-setup"
  | "cold-email-infrastructure-planner"
  | "outbound-market-runway-calculator"
  | "signal-evidence-grader"
  | "outbound-failure-diagnostic";

export type ToolDefinition = {
  slug: string;
  component: ToolComponentKey;
  title: string;
  description: string;
  canonicalPath: `/tools/${string}`;
  primaryQuery: string;
  searchIntent: "commercial" | "informational" | "utility";
  privacy: string;
  methodSource: string;
  sourceUrls: string[];
  updatedAt: string;
  status: "published" | "review" | "draft" | "retired";
  serverBacked: boolean;
};

const LEGACY_TOOLS: ToolDefinition[] = [
  { slug: "outbound-funnel-economics-calculator", component: "outbound-funnel-economics-calculator", title: "Outbound Funnel Economics Calculator", description: "Calculate stage conversion rates and acquisition economics for one fixed outbound cohort.", canonicalPath: "/tools/outbound-funnel-economics-calculator", primaryQuery: "outbound funnel calculator", searchIntent: "utility", privacy: "All calculations run in this browser. Inputs and results are not sent or stored.", methodSource: "/skills/outbound-funnel-economics", sourceUrls: [], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "csv-list-quality-auditor", component: "csv-list-quality-auditor", title: "CSV List Quality Auditor", description: "Check a prospect CSV for duplicates, missing fields, invalid domains, verification gaps, and ICP exclusions.", canonicalPath: "/tools/csv-list-quality-auditor", primaryQuery: "lead list quality checker", searchIntent: "utility", privacy: "The CSV stays in this browser. Its contents are not sent or stored.", methodSource: "/skills/list-quality-scorecard", sourceUrls: [], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "outbound-brief-builder", component: "outbound-brief-builder", title: "Outbound Brief Builder", description: "Turn offer, market, qualification, signal, and exclusion decisions into an exportable outbound brief.", canonicalPath: "/tools/outbound-brief-builder", primaryQuery: "outbound brief template", searchIntent: "utility", privacy: "All processing happens in this browser. Inputs and exports are not sent or stored.", methodSource: "/skills/buyer-signal-list-research", sourceUrls: [], updatedAt: "2026-08-24", status: "published", serverBacked: false },
];

const FIRST_WAVE_TOOLS: ToolDefinition[] = [
{ slug: "sales-prospecting-tool-finder", component: "sales-prospecting-tool-finder", title: "Sales Prospecting Tool Finder", description: "Find prospecting tools by the records or public evidence you need. Every result links to the provider's own product and pricing pages.", canonicalPath: "/tools/sales-prospecting-tool-finder", primaryQuery: "sales prospecting tools", searchIntent: "commercial", privacy: "Selections stay in this browser. Muditek does not receive or store them.", methodSource: "https://business.linkedin.com/sales-solutions/sales-navigator", sourceUrls: ["https://www.apollo.io/product/search", "https://about.crunchbase.com/products/crunchbase-pro/", "https://builtwith.com/lead-generation"], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "public-b2b-signal-finder", component: "public-b2b-signal-finder", title: "Public B2B Signal Finder", description: "Choose a market and see public facts that can prioritize account research. Signals are context, not proof of buying intent.", canonicalPath: "/tools/public-b2b-signal-finder", primaryQuery: "b2b intent signals", searchIntent: "utility", privacy: "Your market selection stays in this browser.", methodSource: "https://www.sec.gov/search-filings", sourceUrls: ["https://data.cms.gov/provider-data/dataset/4pq5-n9py", "https://www.usaspending.gov/", "https://safer.fmcsa.dot.gov/CompanySnapshot.aspx"], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "email-authentication-checker", component: "email-authentication-checker", title: "Email Authentication Checker", description: "Inspect a domain's public MX, SPF, DMARC, and optional DKIM records without inventing a deliverability score.", canonicalPath: "/tools/email-authentication-checker", primaryQuery: "email authentication checker", searchIntent: "utility", privacy: "The submitted domain and optional selector are sent to Muditek's stateless endpoint, which queries Cloudflare DNS. The application does not persist them or add them to analytics.", methodSource: "https://datatracker.ietf.org/doc/html/rfc7489", sourceUrls: ["https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/", "https://datatracker.ietf.org/doc/html/rfc7208", "https://datatracker.ietf.org/doc/html/rfc6376"], updatedAt: "2026-08-24", status: "published", serverBacked: true },
  { slug: "dmarc-checker", component: "dmarc-checker", title: "DMARC Checker", description: "Read the public DMARC record for a domain and display its published tags. No pass, fail, or deliverability score is inferred.", canonicalPath: "/tools/dmarc-checker", primaryQuery: "dmarc checker", searchIntent: "utility", privacy: "The submitted domain is sent to a stateless DNS endpoint. The application does not persist it or add it to analytics.", methodSource: "https://datatracker.ietf.org/doc/html/rfc7489", sourceUrls: ["https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/"], updatedAt: "2026-08-24", status: "published", serverBacked: true },
  { slug: "dkim-checker", component: "dkim-checker", title: "DKIM Checker", description: "Look up a public DKIM TXT record using the domain and selector supplied by the sending provider.", canonicalPath: "/tools/dkim-checker", primaryQuery: "dkim checker", searchIntent: "utility", privacy: "The domain and selector are sent to a stateless DNS endpoint. The application does not persist them or add them to analytics.", methodSource: "https://datatracker.ietf.org/doc/html/rfc6376", sourceUrls: ["https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/"], updatedAt: "2026-08-24", status: "published", serverBacked: true },
  { slug: "dmarc-generator", component: "dmarc-generator", title: "DMARC Record Generator", description: "Build a DMARC TXT value from an explicit policy, rollout percentage, and optional report addresses.", canonicalPath: "/tools/dmarc-generator", primaryQuery: "dmarc generator", searchIntent: "utility", privacy: "The record is generated in this browser. Inputs and output are not sent or stored.", methodSource: "https://datatracker.ietf.org/doc/html/rfc7489", sourceUrls: [], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "spf-checker", component: "spf-checker", title: "SPF Checker", description: "Inspect the public SPF record and its recursively referenced include and redirect domains, with cycle and lookup-count warnings.", canonicalPath: "/tools/spf-checker", primaryQuery: "spf checker", searchIntent: "utility", privacy: "The submitted domain is sent to a stateless DNS endpoint. The application does not persist it or add it to analytics.", methodSource: "https://datatracker.ietf.org/doc/html/rfc7208", sourceUrls: ["https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/"], updatedAt: "2026-08-24", status: "published", serverBacked: true },
  { slug: "spf-generator", component: "spf-generator", title: "SPF Record Generator", description: "Build one SPF record from explicitly selected providers, IP mechanisms, and an enforcement policy.", canonicalPath: "/tools/spf-generator", primaryQuery: "spf generator", searchIntent: "utility", privacy: "The record is generated in this browser. Inputs and output are not sent or stored.", methodSource: "https://datatracker.ietf.org/doc/html/rfc7208", sourceUrls: [], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "qualified-meeting-specification-builder", component: "qualified-meeting-specification-builder", title: "Qualified Meeting Specification Builder", description: "Write the company, buyer, problem, attendance, no-show, and dispute rules that make a meeting billable.", canonicalPath: "/tools/qualified-meeting-specification-builder", primaryQuery: "qualified meeting definition", searchIntent: "utility", privacy: "The specification is built in this browser. Inputs and output are not sent or stored.", methodSource: "/playbooks/outbound-failure-diagnostic", sourceUrls: [], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "cms-healthcare-staffing-explorer", component: "cms-healthcare-staffing-explorer", title: "CMS Healthcare Staffing Explorer", description: "Search official CMS nursing-home provider records by state and review published beds, ownership, ratings, and turnover fields.", canonicalPath: "/tools/cms-healthcare-staffing-explorer", primaryQuery: "nursing home staffing data", searchIntent: "utility", privacy: "The state and optional filters are sent to Muditek's stateless endpoint and then to the official CMS API. The application does not persist them or add them to analytics.", methodSource: "https://data.cms.gov/provider-data/dataset/4pq5-n9py", sourceUrls: ["https://data.cms.gov/provider-data/topics/nursing-homes/"], updatedAt: "2026-08-24", status: "published", serverBacked: true },
];

const LATER_WAVE_TOOLS: ToolDefinition[] = [
  { slug: "email-header-analyzer", component: "email-header-analyzer", title: "Email Header Analyzer", description: "Parse raw message headers locally and report the SPF, DKIM, and DMARC verdicts written by receiving systems. No fresh authentication or deliverability result is inferred.", canonicalPath: "/tools/email-header-analyzer", primaryQuery: "email header analyzer", searchIntent: "utility", privacy: "Headers are parsed in this browser. They are not sent, stored, or added to analytics.", methodSource: "https://datatracker.ietf.org/doc/html/rfc7601", sourceUrls: ["https://datatracker.ietf.org/doc/html/rfc7208", "https://datatracker.ietf.org/doc/html/rfc7489"], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "mail-provider-lookup", component: "mail-provider-lookup", title: "Mail Provider Lookup", description: "Read a domain's public MX records and match only documented provider hostnames. Unknown providers remain unknown.", canonicalPath: "/tools/mail-provider-lookup", primaryQuery: "mail provider lookup", searchIntent: "utility", privacy: "The domain is sent to Muditek's stateless DNS endpoint. The application does not persist it or add it to analytics.", methodSource: "https://support.google.com/a/answer/174125", sourceUrls: ["https://learn.microsoft.com/en-us/microsoft-365/admin/setup/domains-faq", "https://www.fastmail.help/hc/en-us/articles/1500000280261", "https://proton.me/support/mail", "https://www.zoho.com/mail/help/adminconsole/dns-configuration.html"], updatedAt: "2026-08-24", status: "published", serverBacked: true },
  { slug: "google-workspace-email-authentication-setup", component: "google-workspace-email-authentication-setup", title: "Google Workspace Email Authentication Setup", description: "Build a Google Workspace SPF and DMARC configuration checklist from an explicit policy choice, with links to Google's current instructions.", canonicalPath: "/tools/google-workspace-email-authentication-setup", primaryQuery: "google workspace spf dmarc setup", searchIntent: "utility", privacy: "The checklist is built in this browser. Inputs and output are not sent or stored.", methodSource: "https://support.google.com/a/answer/10685027", sourceUrls: ["https://support.google.com/a/answer/2466580"], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "microsoft-365-email-authentication-setup", component: "microsoft-365-email-authentication-setup", title: "Microsoft 365 Email Authentication Setup", description: "Build a Microsoft 365 SPF and DMARC configuration checklist from an explicit policy choice, with links to Microsoft's current instructions.", canonicalPath: "/tools/microsoft-365-email-authentication-setup", primaryQuery: "microsoft 365 spf dmarc setup", searchIntent: "utility", privacy: "The checklist is built in this browser. Inputs and output are not sent or stored.", methodSource: "https://learn.microsoft.com/en-us/defender-office-365/email-authentication-spf-configure", sourceUrls: ["https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dmarc-configure"], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "cold-email-infrastructure-planner", component: "cold-email-infrastructure-planner", title: "Cold Email Infrastructure Planner", description: "Calculate sequence volume, mailbox and domain requirements, spare capacity, and monthly infrastructure cost from buyer-supplied operating limits and prices.", canonicalPath: "/tools/cold-email-infrastructure-planner", primaryQuery: "cold email infrastructure planner", searchIntent: "utility", privacy: "All calculations run in this browser. Inputs and results are not sent or stored.", methodSource: "/outbound/diagnose-cold-email-replies", sourceUrls: ["https://support.google.com/a/answer/81126"], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "outbound-market-runway-calculator", component: "outbound-market-runway-calculator", title: "Outbound Market Runway Calculator", description: "Calculate how many activation periods remain in one deduplicated market from eligible accounts, exclusions, prior activation, and your planned activation rate.", canonicalPath: "/tools/outbound-market-runway-calculator", primaryQuery: "outbound market runway calculator", searchIntent: "utility", privacy: "All calculations run in this browser. Inputs and results are not sent or stored.", methodSource: "/outbound/market-runway", sourceUrls: [], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "signal-evidence-grader", component: "signal-evidence-grader", title: "Public Signal Evidence Grader", description: "Check whether a public fact has the source, date, account match, and explicit evidence needed for prioritization. The tool never assigns an intent score.", canonicalPath: "/tools/signal-evidence-grader", primaryQuery: "b2b signal evidence checker", searchIntent: "utility", privacy: "The evidence checklist runs in this browser. Inputs and results are not sent or stored.", methodSource: "/outbound/evaluate-buyer-signals", sourceUrls: [], updatedAt: "2026-08-24", status: "published", serverBacked: false },
  { slug: "outbound-failure-diagnostic", component: "outbound-failure-diagnostic", title: "Outbound Funnel Diagnostic Tool", description: "Enter one fixed cohort and find the first complete break from qualified reach through clients without guessing at unmeasured causes.", canonicalPath: "/tools/outbound-failure-diagnostic", primaryQuery: "outbound funnel diagnostic calculator", searchIntent: "utility", privacy: "The cohort is analyzed in this browser. Counts and results are not sent or stored.", methodSource: "/playbooks/outbound-failure-diagnostic", sourceUrls: [], updatedAt: "2026-08-24", status: "published", serverBacked: false },
];

export const TOOL_REGISTRY = [...LEGACY_TOOLS, ...FIRST_WAVE_TOOLS, ...LATER_WAVE_TOOLS] as const satisfies readonly ToolDefinition[];

export function getToolDefinition(slug: string): ToolDefinition | undefined {
  return TOOL_REGISTRY.find((tool) => tool.slug === slug);
}

export function getPublishedTools(): ToolDefinition[] {
  return TOOL_REGISTRY.filter((tool) => tool.status === "published");
}

export function isPreviewEnvironment(): boolean {
  return isAcquisitionPreviewEnvironment();
}

export function getRenderableTools(): ToolDefinition[] {
  const preview = isPreviewEnvironment();
  return TOOL_REGISTRY.filter((tool) => tool.status === "published" || (preview && tool.status === "review"));
}

export function getRenderableTool(slug: string): ToolDefinition | undefined {
  return getRenderableTools().find((tool) => tool.slug === slug);
}

export function validateToolRegistry(tools: readonly ToolDefinition[] = TOOL_REGISTRY): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const queries = new Set<string>();
  for (const tool of tools) {
    if (slugs.has(tool.slug)) errors.push(`Duplicate slug: ${tool.slug}`);
    if (queries.has(tool.primaryQuery)) errors.push(`Duplicate primary query: ${tool.primaryQuery}`);
    if (tool.canonicalPath !== `/tools/${tool.slug}`) errors.push(`Canonical path does not match slug: ${tool.slug}`);
    if (!tool.methodSource) errors.push(`Missing method source: ${tool.slug}`);
    slugs.add(tool.slug);
    queries.add(tool.primaryQuery);
  }
  return errors;
}
