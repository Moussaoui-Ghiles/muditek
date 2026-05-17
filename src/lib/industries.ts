export type IndustrySlug =
  | "private-equity"
  | "b2b-saas"
  | "agencies"
  | "telecom"
  | "fintech";

export type IndustryAccent = "primary" | "emerald" | "sky" | "neutral";

export interface IndustryConfig {
  slug: IndustrySlug;
  label: string;
  shortLabel: string;
  accent: IndustryAccent;
  metaTitle: string;
  metaDescription: string;
  oneLiner: string;
  primaryServicePath: string;
  primaryServiceLabel: string;
  caseStudySlug: string;
  relatedIndustries: IndustrySlug[];
  showMudikit: boolean;
  newsletterTag: string;
}

export const INDUSTRIES: Record<IndustrySlug, IndustryConfig> = {
  "private-equity": {
    slug: "private-equity",
    label: "Private Equity & VC",
    shortLabel: "Private Equity",
    accent: "sky",
    metaTitle: "AI Systems for Private Equity & VC in 2026 | Muditek",
    metaDescription:
      "Custom operational infrastructure for PE and VC firms in 2026: LP onboarding in 3-5 days, KYC, fee computation, document generation. You own the platform.",
    oneLiner:
      "Custom operational infrastructure for private equity and venture capital firms — investor onboarding, KYC, fee computation, and document generation, custom-built and owned forever.",
    primaryServicePath: "/pe-ops",
    primaryServiceLabel: "See PE Ops platform",
    caseStudySlug: "private-equity-onboarding",
    relatedIndustries: ["fintech", "b2b-saas"],
    showMudikit: false,
    newsletterTag: "industry-private-equity",
  },
  "b2b-saas": {
    slug: "b2b-saas",
    label: "B2B SaaS",
    shortLabel: "B2B SaaS",
    accent: "emerald",
    metaTitle: "AI Systems for B2B SaaS in 2026 | Muditek",
    metaDescription:
      "B2B SaaS at €800K-€1.8M ARR loses €80-180K/year to leakage in 2026. We diagnose where the money goes, then build the AI systems that fix it.",
    oneLiner:
      "B2B SaaS at €800K-€1.8M ARR — diagnose where pipeline, conversion, and churn leak money in 2026, then ship the AI systems that fix each leak.",
    primaryServicePath: "/revenue-leak-audit",
    primaryServiceLabel: "Run a Revenue Leak Audit",
    caseStudySlug: "saas-revenue-leak",
    relatedIndustries: ["agencies", "fintech"],
    showMudikit: true,
    newsletterTag: "industry-b2b-saas",
  },
  agencies: {
    slug: "agencies",
    label: "Marketing & Dev Agencies",
    shortLabel: "Agencies",
    accent: "primary",
    metaTitle: "AI Systems for Marketing & Dev Agencies in 2026 | Muditek",
    metaDescription:
      "Marketing & dev agencies lose 20+ hours/week to manual content, reporting, and ops in 2026. MudiKit + custom builds reclaim margin.",
    oneLiner:
      "Marketing and dev agencies recovering 20+ hours/week from manual content, reporting, and client ops — with MudiKit and targeted custom builds.",
    primaryServicePath: "/mudikit",
    primaryServiceLabel: "Get MudiKit - $47/mo",
    caseStudySlug: "agency-content-engine",
    relatedIndustries: ["b2b-saas", "telecom"],
    showMudikit: true,
    newsletterTag: "industry-agencies",
  },
  telecom: {
    slug: "telecom",
    label: "Telecom Operators",
    shortLabel: "Telecom",
    accent: "primary",
    metaTitle: "AI Systems for Telecom Operators in 2026 | Muditek",
    metaDescription:
      "Telecom operators in 2026: on-premises AI for SLA reporting, NOC automation, knowledge search, software ops. No cloud, no per-user fees.",
    oneLiner:
      "Telecom operators (50+ employees) deploying on-premises AI to automate SLA reporting, NOC operations, and knowledge search — without cloud or per-user fees.",
    primaryServicePath: "/mudiagent",
    primaryServiceLabel: "See mudiAgent",
    caseStudySlug: "telecom-noc-automation",
    relatedIndustries: ["fintech", "agencies"],
    showMudikit: true,
    newsletterTag: "industry-telecom",
  },
  fintech: {
    slug: "fintech",
    label: "Fintech & Payments",
    shortLabel: "Fintech",
    accent: "sky",
    metaTitle: "AI Systems for Fintech & Payments in 2026 | Muditek",
    metaDescription:
      "Fintech & payments in 2026: custom ops infrastructure for KYC review queues, expiry alerts, reconciliation, and compliance workflows you own.",
    oneLiner:
      "Fintech and payments firms automating KYC review queues, expiry alerts, reconciliation, and compliance workflows — with infrastructure you own end-to-end.",
    primaryServicePath: "/pe-ops",
    primaryServiceLabel: "See operational infrastructure",
    caseStudySlug: "fintech-compliance-ops",
    relatedIndustries: ["private-equity", "b2b-saas"],
    showMudikit: false,
    newsletterTag: "industry-fintech",
  },
};

export const INDUSTRY_SLUGS: IndustrySlug[] = [
  "private-equity",
  "b2b-saas",
  "agencies",
  "telecom",
  "fintech",
];

export function getIndustry(slug: string): IndustryConfig | null {
  if (!(slug in INDUSTRIES)) return null;
  return INDUSTRIES[slug as IndustrySlug];
}
