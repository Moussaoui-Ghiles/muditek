import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isAcquisitionPreviewEnvironment } from "./publication";

export type AcquisitionFamily =
  | "commercial-decision"
  | "operational-workflow"
  | "definition-economics"
  | "template"
  | "signal-method";

export type SearchIntent = "informational" | "commercial-investigation" | "transactional";
export type UniqueValue = "procedure" | "data" | "tool" | "template" | "calculation";
export type AcquisitionStatus = "draft" | "review" | "published" | "retired";

export type AcquisitionCitation = {
  title: string;
  href: string;
  publisher: string;
};

export type AcquisitionPageDefinition = {
  slug: string;
  family: AcquisitionFamily;
  title: string;
  description: string;
  canonicalPath: string;
  primaryQuery: string;
  searchIntent: SearchIntent;
  sourcePath: string;
  citations: AcquisitionCitation[];
  uniqueValue: UniqueValue;
  relatedPaths: string[];
  commercialTarget: string;
  lastChecked: string;
  releaseWave: 1 | 2 | 3 | 4;
  status: AcquisitionStatus;
};

const DIAGNOSTIC_SOURCE =
  "content/playbooks/outbound-failure-diagnostic.md";
const FAZIO_SOURCE = "https://www.youtube.com/watch?v=GUMR2FKPNww";
const COLE_OFFER_SOURCE = "https://www.youtube.com/watch?v=HHARrAUO31w";
const COLE_OUTBOUND_SOURCE = "https://www.youtube.com/watch?v=oWYKaIULG9Q";

const methodCitations: AcquisitionCitation[] = [
  { title: "Outbound failure diagnostic", href: "/playbooks/outbound-failure-diagnostic", publisher: "Muditek" },
  { title: "Building a $10 million offer", href: COLE_OFFER_SOURCE, publisher: "Cole Gordon" },
];

const deliveryCitations: AcquisitionCitation[] = [
  { title: "Outbound failure diagnostic", href: "/playbooks/outbound-failure-diagnostic", publisher: "Muditek" },
  { title: "Email sender guidelines", href: "https://support.google.com/a/answer/81126", publisher: "Google" },
  { title: "Email authentication does not guarantee delivery", href: "https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/email-protection-basics-in-microsoft-365-part-five-mastering-email-authenticatio/4139039", publisher: "Microsoft" },
];

type Seed = Omit<AcquisitionPageDefinition, "canonicalPath" | "sourcePath" | "citations" | "commercialTarget" | "lastChecked" | "status"> & {
  citations?: AcquisitionCitation[];
};

type PageTuple = readonly [
  slug: string,
  title: string,
  description: string,
  primaryQuery: string,
  uniqueValue: UniqueValue,
  relatedPaths: string[],
  citations?: AcquisitionCitation[],
];

type TemplateTuple = readonly [
  slug: string,
  title: string,
  description: string,
  primaryQuery: string,
  relatedPaths: string[],
];

type SignalTuple = readonly [
  slug: string,
  title: string,
  description: string,
  primaryQuery: string,
  relatedPaths: string[],
  citations?: AcquisitionCitation[],
];

function definePage(seed: Seed): AcquisitionPageDefinition {
  const root = seed.family === "template"
    ? "/templates"
    : seed.family === "commercial-decision"
      ? "/appointment-setting"
      : "/outbound";
  const sourceFolder = seed.family === "template"
    ? "templates"
    : seed.family === "commercial-decision"
      ? "commercial"
      : "outbound";
  return {
    ...seed,
    canonicalPath: `${root}/${seed.slug}`,
    sourcePath: `content/acquisition/${sourceFolder}/${seed.slug}.md`,
    citations: seed.citations ?? methodCitations,
    commercialTarget: "/appointment-setting",
    lastChecked: "2026-08-24",
    status: "published",
  };
}

const workflowSeeds = ([
  ["define-outbound-icp", "How to Define an Outbound ICP", "Turn a broad market into explicit account, buyer, exclusion, and reachability rules.", "how to define an outbound ICP", "procedure", ["/outbound/build-a-qualified-account-list", "/outbound/verify-buyer-path-coverage"]],
  ["build-a-qualified-account-list", "How to Build a Qualified Account List", "Build from account rules first, then find contacts and verify usable buyer paths.", "how to build a B2B prospect list", "procedure", ["/outbound/define-outbound-icp", "/outbound/cost-per-contactable-account"]],
  ["verify-buyer-path-coverage", "How to Verify Buyer-Path Coverage", "Measure whether each qualified account has a usable route to a relevant buyer.", "verify B2B contact data", "calculation", ["/outbound/build-a-qualified-account-list", "/outbound/cost-per-contactable-account"]],
  ["design-an-outbound-cohort", "How to Design an Outbound Test Cohort", "Hold the segment, offer, channel, list source, and observation window stable enough to learn.", "outbound campaign test", "procedure", ["/outbound/track-an-outbound-cohort", "/outbound/diagnose-cold-email-replies"]],
  ["track-an-outbound-cohort", "How to Track Outbound From First Attempt to Customer", "Follow one fixed cohort through contact, conversation, meeting, opportunity, and customer stages.", "outbound sales tracking", "calculation", ["/outbound/design-an-outbound-cohort", "/outbound/conversation-to-booking-rate"]],
  ["diagnose-cold-email-replies", "How to Diagnose a Cold Email Campaign With Few Replies", "Check buyer paths and technical delivery before changing the offer or copy.", "cold email not getting replies", "procedure", ["/outbound/server-delivery-rate", "/outbound/positive-reply-rate"], deliveryCitations],
  ["qualify-outbound-replies", "How to Qualify Outbound Replies", "Separate any reply, relevant interest, qualified conversation, and sales opportunity.", "how to qualify cold email replies", "procedure", ["/outbound/qualified-conversation-rate", "/outbound/opportunity-rate"]],
  ["run-a-named-account-motion", "How to Run Named-Account Outbound", "Coordinate research and several buyer paths when the market is small and valuable.", "named account outbound", "procedure", ["/outbound/market-runway", "/outbound/verify-buyer-path-coverage"], [
    { title: "Outbound failure diagnostic", href: "/playbooks/outbound-failure-diagnostic", publisher: "Muditek" },
    { title: "Outbound setting team playbook", href: COLE_OUTBOUND_SOURCE, publisher: "Cole Gordon" },
  ]],
  ["evaluate-an-outbound-offer", "How to Evaluate an Offer Before Cold Outreach", "Test whether a stranger can understand the problem, outcome, method, proof, risk, and first commitment.", "cold outbound offer", "procedure", ["/templates/cold-offer-brief", "/templates/outbound-pilot-plan"], [
    { title: "Outbound failure diagnostic", href: "/playbooks/outbound-failure-diagnostic", publisher: "Muditek" },
    { title: "The only offer I'd sell", href: FAZIO_SOURCE, publisher: "Daniel Fazio" },
    { title: "Building a $10 million offer", href: COLE_OFFER_SOURCE, publisher: "Cole Gordon" },
  ]],
  ["review-outbound-weekly", "How to Run a Weekly Outbound Review", "Review one cohort in sequence and investigate the first weak stage instead of rewarding activity totals.", "weekly outbound review", "procedure", ["/outbound/track-an-outbound-cohort", "/templates/outbound-cohort-tracker"]],
 ] satisfies PageTuple[]).map(([slug, title, description, primaryQuery, uniqueValue, relatedPaths, citations]) => definePage({
  slug: slug as string,
  family: "operational-workflow",
  title: title as string,
  description: description as string,
  primaryQuery: primaryQuery as string,
  searchIntent: "informational",
  uniqueValue: uniqueValue as UniqueValue,
  relatedPaths: relatedPaths as string[],
  citations: citations as AcquisitionCitation[] | undefined,
  releaseWave: 2,
}));

const economicsSeeds = ([
  ["market-runway", "Outbound Market Runway", "Calculate how long the remaining eligible market can support the planned account volume.", "outbound market size calculator", "calculation", ["/outbound/define-outbound-icp", "/templates/market-runway-worksheet"]],
  ["cost-per-contactable-account", "Cost per Contactable Account", "Calculate the cost of producing one qualified account with a verified path to a relevant buyer.", "cost per prospect", "calculation", ["/outbound/verify-buyer-path-coverage", "/outbound/build-a-qualified-account-list"]],
  ["server-delivery-rate", "Cold Email Server-Delivery Rate", "Define what a delivery event proves, what it does not prove, and how to calculate it.", "cold email delivery rate", "calculation", ["/outbound/diagnose-cold-email-replies", "/outbound/positive-reply-rate"], deliveryCitations],
  ["positive-reply-rate", "Cold Email Positive-Reply Rate", "Measure relevant positive replies against unique prospects with a recorded server-delivery event.", "cold email positive reply rate", "calculation", ["/outbound/server-delivery-rate", "/outbound/qualified-conversation-rate"]],
  ["qualified-conversation-rate", "Qualified-Conversation Rate", "Measure conversations that pass predefined qualification rules instead of counting every reply.", "qualified conversation rate", "calculation", ["/outbound/qualify-outbound-replies", "/outbound/conversation-to-booking-rate"]],
  ["conversation-to-booking-rate", "Conversation-to-Booking Rate", "Measure how often a qualified conversation becomes a scheduled sales meeting.", "conversation to meeting conversion rate", "calculation", ["/outbound/qualified-conversation-rate", "/outbound/meeting-attendance-rate"]],
  ["meeting-attendance-rate", "Meeting Attendance Rate", "Measure held meetings against booked meetings without hiding no-shows or cancellations.", "sales meeting show rate", "calculation", ["/outbound/conversation-to-booking-rate", "/outbound/opportunity-rate"]],
  ["opportunity-rate", "Qualified Opportunity Rate", "Measure held meetings that meet the agreed opportunity definition.", "sales meeting to opportunity conversion rate", "calculation", ["/templates/qualified-meeting-agreement", "/outbound/expected-gross-profit-per-meeting"]],
  ["expected-gross-profit-per-meeting", "Expected Gross Profit per Held Meeting", "Estimate the gross profit supported by one held meeting using the buyer's own deal economics.", "value of a sales meeting", "calculation", ["/outbound/opportunity-rate", "/outbound/break-even-customer-rate"]],
  ["break-even-customer-rate", "Break-Even Customer Rate for Outbound", "Calculate the customer rate needed for a cohort to recover its attributable acquisition cost.", "outbound break even calculator", "calculation", ["/outbound/expected-gross-profit-per-meeting", "/templates/outbound-pilot-plan"]],
 ] satisfies PageTuple[]).map(([slug, title, description, primaryQuery, uniqueValue, relatedPaths, citations]) => definePage({
  slug: slug as string,
  family: "definition-economics",
  title: title as string,
  description: description as string,
  primaryQuery: primaryQuery as string,
  searchIntent: "informational",
  uniqueValue: uniqueValue as UniqueValue,
  relatedPaths: relatedPaths as string[],
  citations: citations as AcquisitionCitation[] | undefined,
  releaseWave: 3,
}));

const templateSeeds = ([
  ["outbound-icp-worksheet", "Outbound ICP Worksheet", "Define account fit, buyer roles, exclusions, and reachable-market rules before list building.", "outbound ICP template", ["/outbound/define-outbound-icp", "/templates/account-research-checklist"]],
  ["account-research-checklist", "B2B Account Research Checklist", "Approve or reject an account using observable evidence instead of vague fit labels.", "B2B account research checklist", ["/outbound/build-a-qualified-account-list", "/templates/buyer-signal-evidence-log"]],
  ["buyer-signal-evidence-log", "Buyer Signal Evidence Log", "Record the source, observation date, commercial connection, and uncertainty for each signal.", "buyer intent signal template", ["/outbound/evaluate-buyer-signals", "/outbound/funding-signal-method"]],
  ["qualified-meeting-agreement", "Qualified Meeting Agreement Template", "Define who qualifies, what must happen in the meeting, and how cancellations and disputes are handled.", "qualified meeting definition template", ["/outbound/opportunity-rate", "/appointment-setting"]],
  ["outbound-cohort-tracker", "Outbound Cohort Tracker", "Track one cohort from its original entry through customer without changing denominators midstream.", "outbound tracking spreadsheet template", ["/outbound/track-an-outbound-cohort", "/outbound/review-outbound-weekly"]],
  ["outbound-pilot-plan", "Outbound Pilot Plan Template", "Fix the market, offer, channel, cohort, observation window, economics, and stop rules before launch.", "outbound pilot template", ["/outbound/design-an-outbound-cohort", "/outbound/break-even-customer-rate"]],
  ["cold-offer-brief", "Cold Offer Brief", "Document the buyer, problem, outcome, method, proof, risk, first commitment, price, and terms.", "cold offer template", ["/outbound/evaluate-an-outbound-offer", "/templates/outbound-pilot-plan"]],
  ["market-runway-worksheet", "Market Runway Worksheet", "Calculate remaining eligible accounts, activation rate, and simple runway with explicit assumptions.", "market runway template", ["/outbound/market-runway", "/templates/outbound-icp-worksheet"]],
 ] satisfies TemplateTuple[]).map(([slug, title, description, primaryQuery, relatedPaths]) => definePage({
  slug: slug as string,
  family: "template",
  title: title as string,
  description: description as string,
  primaryQuery: primaryQuery as string,
  searchIntent: "informational",
  uniqueValue: "template",
  relatedPaths: relatedPaths as string[],
  releaseWave: 2,
}));

const signalSeeds = ([
  ["evaluate-buyer-signals", "How to Evaluate a B2B Buyer Signal", "Test whether a public fact changes fit, priority, timing, or the reason for contact.", "B2B buyer signals", ["/templates/buyer-signal-evidence-log", "/outbound/intent-data-vs-public-signals"]],
  ["intent-data-vs-public-signals", "B2B Intent Data vs Public Signals", "Separate vendor-scored intent from observable public facts and avoid treating either as proof of purchase intent.", "B2B intent data vs buyer signals", ["/outbound/evaluate-buyer-signals", "/outbound/funding-signal-method"]],
  ["funding-signal-method", "How to Use Funding as an Outbound Signal", "Use funding only when a verified downstream change connects to the problem you solve.", "funding trigger sales prospecting", ["/outbound/evaluate-buyer-signals", "/templates/buyer-signal-evidence-log"]],
  ["hiring-signal-method", "How to Use Hiring as an Outbound Signal", "Connect a current role or hiring pattern to an operating change without claiming the company wants your service.", "hiring signals sales prospecting", ["/outbound/evaluate-buyer-signals", "/templates/buyer-signal-evidence-log"]],
  ["healthcare-staffing-signals", "Public Signals for Healthcare Staffing Outreach", "Use public facility and workforce facts to prioritize research while keeping need and intent unproven.", "healthcare staffing sales leads", ["/appointment-setting/healthcare-staffing", "/outbound/evaluate-buyer-signals"], [
    { title: "Outbound failure diagnostic", href: "/playbooks/outbound-failure-diagnostic", publisher: "Muditek" },
    { title: "Provider data catalog", href: "https://data.cms.gov/provider-data/", publisher: "Centers for Medicare & Medicaid Services" },
  ]],
 ] satisfies SignalTuple[]).map(([slug, title, description, primaryQuery, relatedPaths, citations]) => definePage({
  slug: slug as string,
  family: "signal-method",
  title: title as string,
  description: description as string,
  primaryQuery: primaryQuery as string,
  searchIntent: "commercial-investigation",
  uniqueValue: "procedure",
  relatedPaths: relatedPaths as string[],
  citations,
 releaseWave: 3,
}));

const commercialSeeds = ([
  ["b2b-appointment-setting-services", "B2B Appointment-Setting Service Scope Checklist", "Define the work, billing event, qualification rule, and economics before comparing appointment-setting providers.", "appointment setting service scope checklist", "procedure", ["/appointment-setting/pay-per-qualified-meeting-vs-retainer", "/templates/qualified-meeting-agreement"]],
  ["pay-per-qualified-meeting-vs-retainer", "Pay per Qualified Meeting vs Retainer", "Compare retainers, outcome fees, and hybrid pricing using one held-meeting rule and the buyer's own economics.", "pay per appointment vs retainer", "calculation", ["/appointment-setting/appointment-setting-agency-pricing-models", "/tools/appointment-setting-quote-calculator"]],
  ["outsourced-sdr-vs-in-house-sdr", "Outsourced SDR vs In-House SDR", "Compare the total cost, usable capacity, ownership, and sales work required by each SDR model.", "outsourced SDR vs in house SDR", "calculation", ["/appointment-setting/outbound-sales-outsourcing", "/outbound/market-runway"]],
  ["outbound-sales-outsourcing", "Outbound Sales Outsourcing: Scope and Ownership", "Decide which outbound jobs leave the company, what stays with the buyer, and how delivery is measured.", "outbound sales outsourcing", "procedure", ["/appointment-setting/outsourced-sdr-vs-in-house-sdr", "/templates/outbound-cohort-tracker"]],
  ["cold-email-outreach-agency", "How to Evaluate a Cold-Email Outreach Agency", "Audit sending infrastructure, buyer-path coverage, message testing, data ownership, and reporting before signing.", "cold email outreach agency", "procedure", ["/outbound/diagnose-cold-email-replies", "/tools/email-authentication-checker"], deliveryCitations],
  ["outsourced-lead-generation", "Outsourced Lead Generation: Define the Deliverable", "Separate accounts, contacts, replies, booked meetings, held meetings, and qualified opportunities before buying volume.", "outsourced lead generation", "procedure", ["/appointment-setting/appointment-setting-vs-lead-generation", "/templates/account-research-checklist"]],
  ["appointment-setting-vs-lead-generation", "Appointment Setting vs Lead Generation", "Choose the service by its delivery event, required buyer work, and evidence instead of the label on the proposal.", "appointment setting vs lead generation", "procedure", ["/appointment-setting/outsourced-lead-generation", "/tools/qualified-meeting-specification-builder"]],
  ["appointment-setting-quote-and-contract", "How to Evaluate an Appointment-Setting Quote and Contract", "Check the invoice trigger, qualification, price, ownership, operation, disputes, and exit terms in one review.", "appointment setting contract", "procedure", ["/appointment-setting/appointment-setting-agency-pricing-models", "/tools/appointment-setting-quote-calculator"]],
  ["insurance-appointment-setting", "B2B Insurance Appointment Setting", "Define the market, compliance gate, public-signal limits, qualified meeting, and provider controls for insurance outreach.", "insurance appointment setting", "procedure", ["/appointment-setting", "/templates/qualified-meeting-agreement"], [
    { title: "State insurance department directory", href: "https://content.naic.org/state-insurance-departments", publisher: "NAIC" },
    { title: "Outbound failure diagnostic", href: "/playbooks/outbound-failure-diagnostic", publisher: "Muditek" },
  ]],
  ["appointment-setting-agency-pricing-models", "Appointment-Setting Agency Pricing Models", "Compare retainers, booked-meeting fees, qualified-held-meeting fees, and hybrid operating models.", "appointment setting agency pricing", "calculation", ["/appointment-setting-pricing", "/appointment-setting/appointment-setting-quote-and-contract"]],
  ["when-appointment-setting-will-not-work", "When Appointment Setting Will Not Work", "Test market depth, economics, offer clarity, sales capacity, and infrastructure before adding meetings.", "does appointment setting work", "procedure", ["/outbound/market-runway", "/playbooks/outbound-failure-diagnostic"]],
  ["appointment-setting-small-b2b-market", "Appointment Setting for a Small B2B Market", "Calculate reachable market and runway, set account-level limits, and avoid exhausting a narrow market.", "appointment setting small market", "calculation", ["/outbound/market-runway", "/templates/market-runway-worksheet"]],
] satisfies PageTuple[]).map(([slug, title, description, primaryQuery, uniqueValue, relatedPaths, citations]) => definePage({
  slug: slug as string,
  family: "commercial-decision",
  title: title as string,
  description: description as string,
  primaryQuery: primaryQuery as string,
  searchIntent: "commercial-investigation",
  uniqueValue: uniqueValue as UniqueValue,
  relatedPaths: relatedPaths as string[],
  citations: citations as AcquisitionCitation[] | undefined,
  releaseWave: 1,
}));

export const ACQUISITION_PAGES: readonly AcquisitionPageDefinition[] = [
  ...commercialSeeds,
  ...workflowSeeds,
  ...economicsSeeds,
  ...templateSeeds,
  ...signalSeeds,
];

function assertRegistry(pages: readonly AcquisitionPageDefinition[]): void {
  const slugs = new Set<string>();
  const paths = new Set<string>();
  const queries = new Set<string>();
  for (const page of pages) {
    if (slugs.has(`${page.family}:${page.slug}`)) throw new Error(`Duplicate acquisition slug: ${page.slug}`);
    if (paths.has(page.canonicalPath)) throw new Error(`Duplicate acquisition canonical: ${page.canonicalPath}`);
    const query = page.primaryQuery.toLowerCase();
    if (queries.has(query)) throw new Error(`Duplicate acquisition primary query: ${page.primaryQuery}`);
    if (page.relatedPaths.length < 2) throw new Error(`Acquisition page needs two related paths: ${page.slug}`);
    if (page.citations.length === 0) throw new Error(`Acquisition page needs a citation: ${page.slug}`);
    slugs.add(`${page.family}:${page.slug}`);
    paths.add(page.canonicalPath);
    queries.add(query);
  }
}

assertRegistry(ACQUISITION_PAGES);

export function isAcquisitionPreview(): boolean {
  return isAcquisitionPreviewEnvironment();
}

export function getAcquisitionPage(family: AcquisitionFamily, slug: string): AcquisitionPageDefinition | undefined {
  return ACQUISITION_PAGES.find((page) => page.family === family && page.slug === slug);
}

export function getRenderableAcquisitionPage(family: AcquisitionFamily, slug: string): AcquisitionPageDefinition | undefined {
  const page = getAcquisitionPage(family, slug);
  if (!page || page.status === "retired") return undefined;
  if (page.status !== "published" && !isAcquisitionPreview()) return undefined;
  return page;
}

export function getRenderableAcquisitionPages(families?: AcquisitionFamily[]): AcquisitionPageDefinition[] {
  return ACQUISITION_PAGES.filter((page) =>
    (!families || families.includes(page.family)) &&
    page.status !== "retired" &&
    (page.status === "published" || isAcquisitionPreview()),
  );
}

export function getPublishedAcquisitionPages(): AcquisitionPageDefinition[] {
  return ACQUISITION_PAGES.filter((page) => page.status === "published");
}

export function getAcquisitionPathsForSitemap(): string[] {
  return getPublishedAcquisitionPages().map((page) => page.canonicalPath);
}

export function readAcquisitionMarkdown(page: AcquisitionPageDefinition): string {
  if (!page.sourcePath.startsWith("content/acquisition/")) throw new Error("Invalid acquisition source path");
  return readFileSync(join(/* turbopackIgnore: true */ process.cwd(), page.sourcePath), "utf8").trim();
}

export const ACQUISITION_SOURCE_REFERENCE = DIAGNOSTIC_SOURCE;
