import type { Metadata } from "next";
import { IndustryPage } from "@/components/industry-page";
import { INDUSTRIES } from "@/lib/industries";
import { getCaseStudyByIndustry } from "@/lib/case-studies";

const config = INDUSTRIES["b2b-saas"];
const caseStudy = getCaseStudyByIndustry("b2b-saas")!;

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

export default function B2bSaasIndustryPage() {
  return (
    <IndustryPage
      data={{
        slug: config.slug,
        config,
        heroEyebrow: "Muditek / B2B SaaS",
        heroHeadline: (
          <>
            B2B SaaS at €800K-€1.8M ARR loses €80-180K/year to revenue leakage{" "}
            <span className="text-emerald-400 italic font-medium">in 2026.</span>
          </>
        ),
        heroSubhead:
          "Speed-to-lead decay, pipeline conversion gaps, excess churn, untracked channel ROI, and stalled outbound. The leak is real; the dashboards just don't show it in euros.",
        heroSecondaryParagraph:
          "We diagnose where each euro is going across five revenue categories with the formulas shown. Then we build the AI systems that close the leaks — measured against the diagnostic baseline every month.",
        stats: [
          { value: "€80-180K", label: "Annual leak typical in 2026" },
          { value: "5", label: "Revenue categories diagnosed" },
          { value: "90 days", label: "Audit to fix shipped" },
        ],
        problems: [
          {
            num: "01",
            title: "Speed-to-lead decay is invisible",
            body: "Your CRM says inbound response is 'under an hour.' Filter for weekday demos before noon and the median is 47 minutes. Research shows conversion drops 80% when response exceeds 5 minutes. Every late response is a slow, invisible loss.",
            euroPain: "€30-50K/year on most stacks",
          },
          {
            num: "02",
            title: "Pipeline conversion below benchmark",
            body: "B2B SaaS demo-to-close benchmarks land around 20-25%. Most stacks sit at 12-16% and accept it. Every percentage point below benchmark, multiplied by deal volume and ACV, is recoverable revenue you've already paid to source.",
            euroPain: "€40-80K/year at €1M ARR",
          },
          {
            num: "03",
            title: "Excess churn compounds against MRR",
            body: "Best-in-class B2B SaaS keeps monthly churn near 0.5%. Many stacks sit at 1-2% and treat it as inevitable. The excess compounds against your entire MRR base — the longer it runs, the more it costs.",
            euroPain: "€20-50K/year, compounding",
          },
        ],
        solutions: [
          {
            num: "01",
            title: "Speed-to-lead engine",
            body: "Inbound demo requests get a personalized response in under 60 seconds — pulled from the prospect's domain, last-product-update, and intent signals. The first conversation happens before the prospect closes the tab.",
            via: "Custom build, deployed in 2-3 weeks",
          },
          {
            num: "02",
            title: "Agentic SDR for stalled deals",
            body: "When a deal sits at the same stage for 14 days, the system re-engages with a context-aware nudge — not a templated drip. Each nudge references the actual conversation, the actual blocker, and the actual next step.",
            via: "Built on the same agentic SDR pattern in our resources",
          },
          {
            num: "03",
            title: "Churn-signal monitor",
            body: "Account behavior trending toward cancellation — drop in usage, fewer logged-in users, support-ticket sentiment shift — flags 30 days before the cancel notice. Customer success gets the list weekly with the actual signal.",
            via: "Connects to your product analytics and support tools",
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
            q: "How is this different from a CRO consultant or a growth agency?",
            a: "We don't run experiments and bill hours. We diagnose your leak in euros with formulas, then build and deploy the AI systems that fix each leak. The deliverable is working software your team owns — not a slide deck or a 90-day plan.",
          },
          {
            q: "What happens if the diagnostic doesn't find €150K+ in waste?",
            a: "Then you don't pay for the diagnostic. Our €50K guarantee on the Revenue Leak Audit means the diagnostic is free if we can't find waste worth at least €150K/year. We've never returned that result on a serious B2B SaaS at €800K+ ARR — but the guarantee is contractual.",
          },
          {
            q: "Do you replace our CRM, support tools, or marketing automation?",
            a: "No. We layer on top of what you already use. The systems we build connect to your CRM, your product analytics, your support tooling, and your email — they don't replace any of them. Lower switching cost; faster deployment.",
          },
          {
            q: "What's the typical engagement size?",
            a: "Diagnostic: €2K (Revenue Leak Audit). Build: €15-50K depending on which leaks need closing. Optional retainer: €3-8K/month for monitoring, optimization, and new system additions. Most engagements pay for themselves in the first quarter.",
          },
          {
            q: "We're not at €800K ARR yet. Should we wait?",
            a: "If you're under €500K ARR, the leakage usually doesn't justify the build cost — start with the newsletter and MudiKit ($47/mo) to build the operator muscles yourself. Above €800K, the math typically works. Book a 30-minute call if you want a direct read on where you stand.",
          },
        ],
        serviceSchemaName: "B2B SaaS Revenue Leak Diagnostic + AI Fix Systems",
        serviceSchemaDescription:
          "Diagnostic that quantifies B2B SaaS revenue leakage in euros across speed-to-lead, pipeline conversion, churn, channel ROI, and outbound. Followed by custom AI systems that close each identified leak.",
        datePublished: "2026-05-03",
        dateModified: "2026-05-03",
      }}
    />
  );
}
