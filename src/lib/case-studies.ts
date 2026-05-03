import type { IndustryAccent, IndustrySlug } from "./industries";

export interface CaseStudyResultRow {
  metric: string;
  before: string;
  after: string;
}

export interface CaseStudyTopMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  industry: IndustrySlug;
  industryLabel: string;
  accent: IndustryAccent;
  date: string;
  headline: string;
  subhead: string;
  metaTitle: string;
  metaDescription: string;
  ogEyebrow: string;
  problem: string[];
  approach: string[];
  results: CaseStudyResultRow[];
  topMetrics: CaseStudyTopMetric[];
  quote: string;
  quoteAttribution: string;
  isAnonymizedQuote: true;
  primaryServicePath: string;
  primaryServiceLabel: string;
  buildTimeline: string;
  ownership: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "private-equity-onboarding",
    industry: "private-equity",
    industryLabel: "Private Equity & VC",
    accent: "sky",
    date: "2026-04-12",
    headline:
      "How a regulated merchant banking firm cut LP onboarding from weeks to 3-5 days.",
    subhead:
      "26 modules, 7 stakeholder roles, 9 automated workflows. Custom-built for one firm, owned by them, delivered in 3 months.",
    metaTitle:
      "Private Equity Onboarding: Weeks to 3-5 Days in 2026 | Muditek Case Study",
    metaDescription:
      "How a regulated merchant banking firm cut LP onboarding from weeks to 3-5 days in 2026. 26 modules, 7 roles, 9 workflows, owned platform. KYC automated, fees computed.",
    ogEyebrow: "PE Case Study",
    problem: [
      "A regulated merchant banking firm managed private equity, venture capital, and real estate investments across multiple jurisdictions. Their compliance team tracked LP onboarding, KYC documents, and expiry dates across spreadsheets and email threads.",
      "Each new LP took weeks: jurisdiction-specific document collection, identity checks, AML screening, source-of-funds review, and signed subscription agreements. Forty LPs across four jurisdictions meant forty parallel manual workflows. One LP's proof of address expired two months unnoticed before the annual audit caught it.",
      "Document generation happened in Word templates, copy-paste-formatted per investor. Fee computation lived in spreadsheets. Bank reconciliation was a quarterly fire drill. The team was spending 30+ hours per week on operations that scaled linearly with every new investor.",
    ],
    approach: [
      "We mapped every workflow end-to-end with their ops team, compliance officer, and managing partner. We quantified the manual effort, designed the architecture, and delivered a complete specification with clear ROI before any code was written.",
      "Then we built it. A self-service LP portal with jurisdiction-aware document requirements. A single review queue for compliance with automated expiry alerts. One-click document generation from live data. Built-in e-signatures with multi-party staged signing. Automatic fee computation from fund terms. Bank reconciliation matching every six hours.",
      "Twenty-six modules. Seven stakeholder portals (LPs, managing partners, arrangers, introducers, compliance, ops, legal). Nine automated workflows triggered by signed documents and committed capital. The firm owns the source code, the database, and the infrastructure.",
    ],
    results: [
      {
        metric: "LP onboarding",
        before: "Weeks per LP, email + spreadsheets",
        after: "3-5 days, self-service portal",
      },
      {
        metric: "KYC tracking",
        before: "Spreadsheet, manual expiry checks",
        after: "Single queue, automated expiry alerts",
      },
      {
        metric: "Subscription agreements",
        before: "Word templates, copy-paste per LP",
        after: "One-click generation from live data",
      },
      {
        metric: "Signatures",
        before: "PDFs over email, no audit trail",
        after: "Built-in e-sig, multi-party staged",
      },
      {
        metric: "Fee computation",
        before: "Spreadsheets, manual per fund",
        after: "Automatic from live fund terms",
      },
      {
        metric: "Bank reconciliation",
        before: "Quarterly manual fire drill",
        after: "Automated matching every 6 hours",
      },
      {
        metric: "Stakeholder views",
        before: "Everyone uses email",
        after: "7 roles, tailored portals",
      },
    ],
    topMetrics: [
      { value: "26", label: "Modules built" },
      { value: "7", label: "Stakeholder roles" },
      { value: "9", label: "Automated workflows" },
      { value: "3 mo", label: "Build to live" },
    ],
    quote:
      "Our compliance person used to live in a spreadsheet. Now she works from one queue, and the system tells her what needs attention. We onboard new LPs in days, not weeks.",
    quoteAttribution: "Anonymous Operations Lead, regulated merchant banking firm",
    isAnonymizedQuote: true,
    primaryServicePath: "/pe-ops",
    primaryServiceLabel: "See PE Ops platform",
    buildTimeline: "3 months",
    ownership: "Full source code, database, and infrastructure",
  },
  {
    slug: "saas-revenue-leak",
    industry: "b2b-saas",
    industryLabel: "B2B SaaS",
    accent: "emerald",
    date: "2026-04-08",
    headline:
      "A €800K ARR B2B SaaS found €120K/year in pipeline leakage in two weeks.",
    subhead:
      "Speed-to-lead, pipeline conversion, and churn — diagnosed in euros, then fixed with three targeted AI systems.",
    metaTitle:
      "B2B SaaS Revenue Leak: €120K/Year Recovered in 2026 | Muditek Case Study",
    metaDescription:
      "How a €800K ARR B2B SaaS found €120K/year in pipeline leakage in 2026: speed-to-lead, conversion gaps, and churn diagnosed in euros, then fixed with AI systems.",
    ogEyebrow: "SaaS Case Study",
    problem: [
      "A B2B SaaS company at €800K ARR was growing — but margin wasn't keeping up. Pipeline looked healthy on the dashboard. Conversion looked normal. Churn was 'within range.' Yet the founder couldn't tell where the money was actually going.",
      "Their CRM showed average lead-response time at 'under an hour.' But when we filtered for inbound demos requested before noon on weekdays, the median was 47 minutes. Research from InsideSales.com and Harvard Business Review shows conversion drops 80% when response exceeds 5 minutes. Each delayed lead was a slow, invisible loss.",
      "Their demo-to-close conversion sat at 14% — below the 20-25% B2B SaaS benchmark from OpenView. Monthly churn was 1.2%, double best-in-class. Multiplied across MRR, this compounded into mid-six-figure revenue waste per year. None of it was visible until we put it in euros.",
    ],
    approach: [
      "We ran the diagnostic. Every claim quantified in euros, with the formula shown. Speed-to-lead leakage: €38K/year. Pipeline conversion gap (14% → 20%): €52K/year. Excess churn vs benchmark: €31K/year. Total identified and verifiable revenue leak: €121K/year on €800K ARR.",
      "Then we built three targeted systems. An inbound speed-to-lead engine that responds in under 60 seconds with personalized context pulled from the prospect's domain. An agentic SDR that re-engages stalled deals 14 days into pipeline silence. A churn-signal monitor that flags accounts trending toward cancellation 30 days early.",
      "Each system was scoped, deployed, and measured against the diagnostic baseline. Within 90 days, the leak was closing on schedule, with monthly attribution reports showing exactly which euros came from which system.",
    ],
    results: [
      {
        metric: "Speed-to-lead median",
        before: "47 minutes",
        after: "Under 60 seconds",
      },
      {
        metric: "Demo-to-close",
        before: "14%",
        after: "On track to 20% in 90 days",
      },
      {
        metric: "Stalled-pipeline re-engagement",
        before: "Manual, inconsistent",
        after: "Auto, 14-day trigger",
      },
      {
        metric: "Churn early warning",
        before: "Reactive (after cancel notice)",
        after: "30 days early via signal monitor",
      },
      {
        metric: "Revenue attribution",
        before: "Aggregate dashboards",
        after: "Per-system euro impact, monthly",
      },
      {
        metric: "Identified annual leak",
        before: "Unknown",
        after: "€121K, with formulas",
      },
    ],
    topMetrics: [
      { value: "€121K", label: "Annual leak found" },
      { value: "2 wks", label: "Diagnostic to report" },
      { value: "3", label: "Targeted systems" },
      { value: "90 days", label: "To close the leak" },
    ],
    quote:
      "I knew we were leaking somewhere. I didn't know it was over a hundred grand a year until they put it in euros with the formula. Then it was obvious which fixes paid for themselves first.",
    quoteAttribution: "Anonymous Founder, B2B SaaS firm at €800K ARR",
    isAnonymizedQuote: true,
    primaryServicePath: "/revenue-leak-audit",
    primaryServiceLabel: "Run a Revenue Leak Audit",
    buildTimeline: "2-week diagnostic, 90-day fix",
    ownership: "Audit report + 3 deployed systems, owned by client",
  },
  {
    slug: "agency-content-engine",
    industry: "agencies",
    industryLabel: "Marketing & Dev Agencies",
    accent: "primary",
    date: "2026-04-05",
    headline:
      "A 5-person marketing agency cut social production from 20 hrs/week to 20 minutes.",
    subhead:
      "MudiKit skills + a custom content engine replaced an entire manual production workflow. Same quality, 60x throughput.",
    metaTitle:
      "Agency Content Engine: 20 Hours to 20 Minutes in 2026 | Muditek Case Study",
    metaDescription:
      "How a 5-person marketing agency cut social content production from 20 hrs/week to 20 minutes in 2026 using MudiKit skills and a custom content engine.",
    ogEyebrow: "Agency Case Study",
    problem: [
      "A 5-person marketing agency served seven retainer clients. Each client needed 3-5 social posts per week, written in their voice, sourced from their newsletter or product updates, with platform-specific formatting for LinkedIn, Twitter, and email summaries.",
      "The team spent 20+ hours per week on content production alone. The strategist wrote first drafts. The junior edited. The senior reviewed. The account manager approved. By Friday, half the team had spent half the week writing posts that hadn't shipped yet.",
      "Margin was the problem. The agency charged a flat retainer per client. Time spent on content production was time NOT spent on strategy, new business, or higher-margin work. They were losing money on every retainer that needed weekly content — and every retainer needed weekly content.",
    ],
    approach: [
      "We built a content engine using MudiKit's `linkedin-content-writer` and `source-ingest` skills as the foundation, then customized for the agency's specific client voices. The engine ingests each client's newsletter, blog, and product updates, distills the source material, and generates platform-specific drafts in each client's voice.",
      "Drafts route to a single review queue. The senior strategist reviews 30+ posts in 20 minutes — same quality bar, same client voice, sixty times the throughput. Approved posts publish through the agency's existing scheduling tool. Rejected posts feed back into the engine to improve voice matching.",
      "The agency kept full ownership of the engine. The skills are licensed via MudiKit. The custom voice configurations and review queue belong to them. They've since added two new retainer clients without adding headcount.",
    ],
    results: [
      {
        metric: "Weekly content production",
        before: "20+ hours across team",
        after: "20 minutes (senior review only)",
      },
      {
        metric: "Posts shipped per week",
        before: "21-35 (across 7 clients)",
        after: "30+ approved, 60+ generated",
      },
      {
        metric: "Voice matching",
        before: "Manual per-client style guide",
        after: "Auto, learned from each client's content",
      },
      {
        metric: "Review queue",
        before: "Email + Slack threads",
        after: "Single approval queue",
      },
      {
        metric: "New retainers added",
        before: "Capacity-blocked",
        after: "+2 clients, no new hires",
      },
      {
        metric: "Agency margin per retainer",
        before: "Negative or flat",
        after: "Positive after first month",
      },
    ],
    topMetrics: [
      { value: "60x", label: "Throughput gain" },
      { value: "20 min", label: "Per week, senior review" },
      { value: "+2", label: "Retainers added, no new hires" },
      { value: "$47/mo", label: "MudiKit subscription" },
    ],
    quote:
      "We weren't slow at writing. We were slow at writing twenty-one posts a week in seven different voices. The engine kills the part nobody got hired to do.",
    quoteAttribution: "Anonymous Founder, 5-person marketing agency",
    isAnonymizedQuote: true,
    primaryServicePath: "/buy",
    primaryServiceLabel: "Get MudiKit — $47/mo",
    buildTimeline: "2 weeks (configure + deploy)",
    ownership: "Custom voice configs + review queue owned by agency; MudiKit subscription for the underlying skills",
  },
  {
    slug: "telecom-noc-automation",
    industry: "telecom",
    industryLabel: "Telecom Operators",
    accent: "primary",
    date: "2026-04-02",
    headline:
      "A 50-person regional telco cut weekly SLA report production from 2-3 days to under one hour.",
    subhead:
      "On-premises mudiAgent reads NOC tickets, fault logs, and vendor portals — generates the SLA report by Friday morning, every Friday.",
    metaTitle:
      "Telecom NOC Automation: SLA Report in Under 1 Hour in 2026 | Muditek Case Study",
    metaDescription:
      "How a 50-person regional telecom operator cut weekly SLA report production from 2-3 days to under 1 hour with on-premises mudiAgent in 2026. NOC tickets to report, automated.",
    ogEyebrow: "Telecom Case Study",
    problem: [
      "A regional telecom operator with 50 employees and three NOC engineers ran weekly SLA reporting manually. Every Monday, an engineer pulled tickets from the OSS, joined them with vendor portal exports, cross-referenced the contract penalty matrix, and assembled a 30-40 page customer-facing PDF report.",
      "The process took 2-3 working days every week. Multiply by every customer, every region, and the NOC was spending nearly half its capacity on backward-looking paperwork instead of forward-looking network operations. Errors slipped through: contractual penalties miscounted, downtime windows misclassified.",
      "Cloud AI wasn't an option. NOC data includes customer infrastructure detail, contractual penalty structures, and vendor-confidential fault information. Sending it to a third-party LLM API was a contract violation. The data had to stay on-site.",
    ],
    approach: [
      "We deployed mudiAgent on a workstation in the NOC's secure rack. On-premises, no internet egress for inference, full audit trail on every query. The agent connects to the OSS, the ticketing system (ServiceNow), and the vendor portals via existing read-only credentials.",
      "Every Friday at 06:00, the agent pulls the week's tickets, classifies each by SLA-relevant categories (downtime windows, MTTR, severity), cross-references the per-customer penalty matrix, and assembles the customer-specific report PDFs. By 06:45 the engineer has 12 reports in their inbox to review.",
      "Reviewing 12 reports takes 45 minutes. Sending them takes 5 more. The NOC's three engineers got back two and a half days a week — which they spent on proactive network monitoring, the work they were actually hired to do.",
    ],
    results: [
      {
        metric: "Weekly SLA report production",
        before: "2-3 working days",
        after: "Under 1 hour (review only)",
      },
      {
        metric: "NOC capacity reclaimed",
        before: "~50% on backward paperwork",
        after: "~10% on review, 90% on ops",
      },
      {
        metric: "Penalty miscount rate",
        before: "Occasional, hard to detect",
        after: "Zero (rule-based, auditable)",
      },
      {
        metric: "Data location",
        before: "Cloud SaaS not allowed",
        after: "On-premises, no egress",
      },
      {
        metric: "Per-user cost",
        before: "Cloud AI per-seat fees blocked deployment",
        after: "One on-prem deployment, all NOC users",
      },
      {
        metric: "Vendor portal integrations",
        before: "Manual exports",
        after: "Automated read-only pulls",
      },
    ],
    topMetrics: [
      { value: "2.5 days", label: "Reclaimed weekly" },
      { value: "<1 hr", label: "Review per report cycle" },
      { value: "100%", label: "On-premises, no egress" },
      { value: "12", label: "Customer reports auto-generated" },
    ],
    quote:
      "Our contract with the regulator says customer infrastructure data doesn't leave our racks. Cloud AI was off the table. Mudiagent on-prem is the first thing that worked inside the constraint.",
    quoteAttribution: "Anonymous NOC Lead, regional telecom operator",
    isAnonymizedQuote: true,
    primaryServicePath: "/mudiagent",
    primaryServiceLabel: "See mudiAgent",
    buildTimeline: "4 weeks (pilot deployment)",
    ownership: "Hardware + agent live on-prem, full audit trail, no cloud dependency",
  },
  {
    slug: "fintech-compliance-ops",
    industry: "fintech",
    industryLabel: "Fintech & Payments",
    accent: "sky",
    date: "2026-03-28",
    headline:
      "A 30-person fintech cut KYC review backlog from 14 days to under 48 hours.",
    subhead:
      "Single review queue, automated expiry alerts, jurisdiction-aware document checks. Custom-built and owned, not subscribed.",
    metaTitle:
      "Fintech Compliance Ops: KYC Backlog 14 Days to 48 Hours in 2026 | Muditek Case Study",
    metaDescription:
      "How a 30-person fintech cut KYC review backlog from 14 days to under 48 hours in 2026. Single queue, automated expiry alerts, owned compliance infrastructure.",
    ogEyebrow: "Fintech Case Study",
    problem: [
      "A 30-person fintech firm processed customer KYC across multiple jurisdictions. Each new account required identity verification, source-of-funds review, sanctions screening, and politically-exposed-persons (PEP) checks — with documents that expire on different schedules per jurisdiction.",
      "Compliance ran in spreadsheets and email threads. New-account review backlog averaged 14 days. Document expiry was tracked manually; periodically a customer's proof of address went stale unnoticed and surfaced during the next audit.",
      "Industry SaaS for KYC orchestration started at five-figure annual subscriptions and required workflow conformance to the vendor's process, not the firm's. Custom development quotes from traditional dev shops came in at €100-200K and 12+ months. Neither option fit the firm's pace.",
    ],
    approach: [
      "We built a custom KYC operations platform on the firm's own infrastructure. Single review queue surfaces every new account, every required document, and every expiring credential in one prioritized list. Compliance officer works the queue, not the spreadsheet.",
      "Per-jurisdiction document rules are encoded as configuration, not code. When the firm expands to a new jurisdiction, compliance updates a config file — the queue adapts automatically. Expiry alerts fire 30 / 14 / 7 days before any document goes stale, with one-click follow-up to the customer.",
      "Sanctions screening, PEP checks, and source-of-funds documentation flow into the review queue with structured fields. The compliance officer approves, rejects, or requests-more-info from a single interface. Audit log captures every decision with reviewer ID and reasoning.",
    ],
    results: [
      {
        metric: "New-account review backlog",
        before: "14-day average",
        after: "Under 48 hours",
      },
      {
        metric: "Document expiry tracking",
        before: "Manual spreadsheet",
        after: "Automated alerts at 30/14/7 days",
      },
      {
        metric: "Jurisdiction onboarding",
        before: "Code change, weeks of dev",
        after: "Config file edit, same day",
      },
      {
        metric: "Audit trail",
        before: "Email + spreadsheet history",
        after: "Structured log per decision",
      },
      {
        metric: "Sanctions / PEP screening",
        before: "Separate tools, manual sync",
        after: "Inline in review queue",
      },
      {
        metric: "Cost vs SaaS alternative",
        before: "5-figure annual subscription",
        after: "One-time build + optional retainer",
      },
    ],
    topMetrics: [
      { value: "<48 hr", label: "New-account review SLA" },
      { value: "30/14/7", label: "Day expiry alerts" },
      { value: "0", label: "Per-seat fees" },
      { value: "Owned", label: "Source + database" },
    ],
    quote:
      "We outgrew the spreadsheet but we didn't want to inherit a SaaS vendor's process. They built ours, in our codebase, on our infrastructure. We changed jurisdictions twice this year — config edit, same day live.",
    quoteAttribution: "Anonymous Head of Compliance, 30-person fintech",
    isAnonymizedQuote: true,
    primaryServicePath: "/pe-ops",
    primaryServiceLabel: "See operational infrastructure",
    buildTimeline: "5 weeks (build to live)",
    ownership: "Source code, database, on customer's infrastructure",
  },
];

export const CASE_STUDY_SLUGS = CASE_STUDIES.map((c) => c.slug);

export function getCaseStudy(slug: string): CaseStudy | null {
  return CASE_STUDIES.find((c) => c.slug === slug) ?? null;
}

export function getCaseStudyByIndustry(industry: IndustrySlug): CaseStudy | null {
  return CASE_STUDIES.find((c) => c.industry === industry) ?? null;
}
