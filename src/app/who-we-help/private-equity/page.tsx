import type { Metadata } from "next";
import { IndustryPage } from "@/components/industry-page";
import { INDUSTRIES } from "@/lib/industries";
import { getCaseStudyByIndustry } from "@/lib/case-studies";

const config = INDUSTRIES["private-equity"];
const caseStudy = getCaseStudyByIndustry("private-equity")!;

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: {
    canonical: `https://muditek.com/who-we-help/${config.slug}`,
  },
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    url: `https://muditek.com/who-we-help/${config.slug}`,
    type: "article",
  },
};

export default function PrivateEquityIndustryPage() {
  return (
    <IndustryPage
      data={{
        slug: config.slug,
        config,
        heroEyebrow: "Muditek / Private Equity",
        heroHeadline: (
          <>
            PE firms lose 30+ hours/week to manual investor admin{" "}
            <span className="text-sky-400 italic font-medium">in 2026.</span>
          </>
        ),
        heroSubhead:
          "Spreadsheets for KYC, Word templates for subscription agreements, email for signatures, and quarterly fire drills for bank reconciliation. Every hour your ops team spends on this is an hour not spent on investments.",
        heroSecondaryParagraph:
          "We've built the operational infrastructure once. Now we configure it for your fund structures, jurisdictions, and stakeholder model — delivered in weeks, owned by you forever.",
        stats: [
          { value: "3-5 days", label: "LP onboarding in 2026" },
          { value: "12+", label: "Jurisdictions modeled" },
          { value: "1/10th", label: "Cost vs Juniper Square" },
        ],
        problems: [
          {
            num: "01",
            title: "Investor onboarding takes weeks",
            body: "Each new LP runs through jurisdiction-specific document collection, identity verification, AML/PEP screening, and signed subscription agreements. The work is sequential, manual, and error-prone — and it scales linearly with every new investor.",
            euroPain: "30+ hrs/week, opportunity cost on growth",
          },
          {
            num: "02",
            title: "KYC lives in spreadsheets",
            body: "Document expiry tracked by hand. Compliance officer hunts for expiring proofs of address before each audit. One missed expiry surfaces during the regulator review and turns a Tuesday into a fire drill.",
            euroPain: "Reputational + regulatory risk",
          },
          {
            num: "03",
            title: "Documents and fees in Word and Excel",
            body: "Subscription agreements copy-pasted per investor. Fee computation in formulas nobody trusts. K-1s and position statements reformatted manually each quarter. Forty investors equals forty chances for a copy-paste error.",
            euroPain: "Hours per LP, every quarter",
          },
        ],
        solutions: [
          {
            num: "01",
            title: "Self-service LP portal",
            body: "Jurisdiction-aware document requirements. The investor onboards themselves, sees exactly what's required for their jurisdiction, uploads documents through structured forms. Compliance reviews from a single queue with automated expiry alerts.",
            via: "Custom build — owned by your firm",
          },
          {
            num: "02",
            title: "One-click document generation",
            body: "Subscription agreements, position statements, K-1s, and fund reports generate from live data with one click. Built-in e-signatures with multi-party staged signing. No DocuSign, no per-envelope costs, no copy-paste errors.",
            via: "Connected to your CRM, fund admin, and accounting",
          },
          {
            num: "03",
            title: "Automated fee + reconciliation",
            body: "Fees compute from your fund terms — hurdle rates, waterfalls, clawbacks, in your structure not a template. Bank reconciliation matches every six hours and flags discrepancies the moment they appear, not at quarter-end.",
            via: "Rules from your LPA, audit log on every change",
          },
        ],
        caseStudy: {
          headline: caseStudy.headline,
          paragraph: caseStudy.problem[0],
          resultRows: caseStudy.results.map((r) => ({
            before: r.before,
            after: r.after,
          })),
          topMetrics: caseStudy.topMetrics,
          caseStudySlug: caseStudy.slug,
        },
        faqs: [
          {
            q: "We're already looking at Juniper Square. Why not just use that?",
            a: "Juniper Square charges $700K+/year and you never own the system. We build it once, you own it forever. Same capabilities — investor onboarding, KYC, document generation, fee computation — but custom-fit to your fund structures and deployed on your infrastructure. Total 3-year cost lands around 1/10th of the Juniper Square subscription. See /pe-ops-vs-juniper-square for the side-by-side.",
          },
          {
            q: "Can you really build a full PE ops platform in 4-8 weeks?",
            a: "We already built it. The hard problems — multi-entity structures, multi-jurisdiction compliance, document generation, e-signatures, fee computation with hurdle rates — are solved. We don't reuse the code; we reuse the knowledge. Each engagement is custom for your firm, milestone-based, with working software at every checkpoint.",
          },
          {
            q: "What does 'you own the system' actually mean?",
            a: "Complete source code in your repository. Database on your infrastructure. No subscription fees, no per-seat licensing, no vendor lock-in. Your developers can extend or modify the system independently. If you cancel our optional retainer, the platform keeps running.",
          },
          {
            q: "What about new jurisdictions and regulatory changes?",
            a: "Optional retainer at €5-10K/month. Every new fund launch, jurisdiction expansion, or regulatory change gets handled. Without it, your team maintains the system using the source code you own. Some firms keep us; some take it in-house after the build. Both work.",
          },
          {
            q: "Is this a fit for venture capital or just private equity?",
            a: "Both. The platform supports private equity, venture capital, real estate, and merchant banking structures. We've built it for firms running parallel funds across multiple strategies. The configuration is per-firm; the underlying engine handles each model.",
          },
        ],
        serviceSchemaName: "Operational Infrastructure for PE & VC Firms",
        serviceSchemaDescription:
          "Custom operational infrastructure for private equity and venture capital firms — investor onboarding, KYC automation, document generation, fee computation, e-signatures, and bank reconciliation. Owned by the firm, not subscribed.",
        datePublished: "2026-05-03",
        dateModified: "2026-05-03",
      }}
    />
  );
}
