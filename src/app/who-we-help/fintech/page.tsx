import type { Metadata } from "next";
import { IndustryPage } from "@/components/industry-page";
import { INDUSTRIES } from "@/lib/industries";
import { getCaseStudyByIndustry } from "@/lib/case-studies";

const config = INDUSTRIES["fintech"];
const caseStudy = getCaseStudyByIndustry("fintech")!;

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

export default function FintechIndustryPage() {
  return (
    <IndustryPage
      data={{
        slug: config.slug,
        config,
        heroEyebrow: "Muditek / Fintech",
        heroHeadline: (
          <>
            Fintech compliance ops scale linearly with every new customer{" "}
            <span className="text-sky-400 italic font-medium">in 2026.</span>
          </>
        ),
        heroSubhead:
          "KYC reviews live in spreadsheets. Document expiry tracking is manual. Sanctions and PEP screening live in separate tools. Every new account is more queue, more review time, more chances for a missed expiry that surfaces during the next regulator audit.",
        heroSecondaryParagraph:
          "We build custom compliance operations infrastructure on your own stack — single review queue, automated expiry alerts, jurisdiction-aware document rules, structured audit log. Owned by you, not subscribed.",
        stats: [
          { value: "<48 hr", label: "New-account review SLA" },
          { value: "30/14/7", label: "Day expiry alerts" },
          { value: "0", label: "Per-seat fees, ever" },
        ],
        problems: [
          {
            num: "01",
            title: "KYC review backlog grows with the customer base",
            body: "Each new customer requires identity verification, source-of-funds review, sanctions screening, and PEP checks — across multiple jurisdictions with different document requirements. Spreadsheet-driven review queues hit double-digit-day backlogs once volume scales.",
            euroPain: "Lost activations + customer-experience drag",
          },
          {
            num: "02",
            title: "Document expiry tracking is manual",
            body: "Each jurisdiction has its own validity periods. Compliance officer pivots a spreadsheet to find what's expiring this month. Inevitably one slips through and surfaces during the regulator audit. The fix is always 'we'll track it more carefully' — until it happens again.",
            euroPain: "Audit risk + reputational cost when found by regulator",
          },
          {
            num: "03",
            title: "SaaS KYC vendors force their workflow on yours",
            body: "Industry SaaS for KYC orchestration starts at five-figure annual subscriptions and requires your firm to conform to the vendor's process — not the other way around. Custom development quotes from traditional dev shops come in at €100-200K and 12+ months. Neither fits your pace.",
            euroPain: "Locked into someone else's workflow forever",
          },
        ],
        solutions: [
          {
            num: "01",
            title: "Custom compliance ops platform you own",
            body: "Single review queue surfaces every new account, every required document, every expiring credential — prioritized. Compliance officer works the queue, not the spreadsheet. Built on your infrastructure, in your codebase, on your timeline.",
            via: "Custom build, 4-8 weeks, full source ownership",
          },
          {
            num: "02",
            title: "Jurisdiction rules as configuration, not code",
            body: "Document requirements per jurisdiction live in config files. New jurisdiction = config edit, same-day live. No code change, no deployment cycle, no waiting on engineering. The platform adapts to your business expansion in hours, not quarters.",
            via: "Owned by your compliance team, version-controlled",
          },
          {
            num: "03",
            title: "Sanctions, PEP, expiry — inline in the queue",
            body: "Sanctions and PEP screening flow into the review queue with structured fields. Expiry alerts fire 30/14/7 days before any document goes stale, with one-click follow-up to the customer. Audit log captures every decision with reviewer ID and reasoning.",
            via: "Connected to your existing screening providers",
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
            q: "How is this different from off-the-shelf KYC vendors?",
            a: "Off-the-shelf vendors enforce their workflow on your firm. Our build is your workflow, in your codebase, on your infrastructure. Custom rules, custom audit log, custom integrations — and you own the source code. When you change jurisdictions or scale, the platform changes with you, not after a vendor product roadmap.",
          },
          {
            q: "Do you connect to our existing sanctions/PEP screening provider?",
            a: "Yes. We integrate with Refinitiv, ComplyAdvantage, Dow Jones Risk, and most other screening providers via their APIs. The screening result flows into the review queue as structured data, not as a separate tool the compliance officer has to flip between.",
          },
          {
            q: "What about regulatory audits?",
            a: "The platform captures every decision — who reviewed, when, what they saw, what they decided, why. Structured audit log on every record. Most regulator requests resolve from the audit log without needing the compliance officer to reconstruct decisions from email or memory.",
          },
          {
            q: "What's the typical engagement?",
            a: "Discovery: €8-15K, 2-4 weeks. Build: €40-80K, 4-8 weeks. Optional retainer: €5-10K/month for new jurisdictions, regulatory changes, integration updates. Most fintech engagements pay for themselves within the first year compared to a SaaS KYC subscription.",
          },
          {
            q: "Is this just for fintech or also for payments and crypto firms?",
            a: "Fintech, payments, regulated crypto firms, neobanks, and lending platforms — anyone running KYC at scale across multiple jurisdictions. The compliance pattern is similar; the configuration is per-firm. We've built it for firms running across SEPA, GCC, and APAC jurisdictions in parallel.",
          },
        ],
        serviceSchemaName: "Custom Compliance Operations Platform for Fintech",
        serviceSchemaDescription:
          "Custom-built KYC and compliance operations infrastructure for fintech and payments firms — single review queue, jurisdiction-aware document rules, automated expiry alerts, sanctions/PEP integration, structured audit log. Owned by the firm.",
        datePublished: "2026-05-03",
        dateModified: "2026-05-04",
      }}
    />
  );
}
