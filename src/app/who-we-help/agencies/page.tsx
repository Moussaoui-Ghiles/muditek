import type { Metadata } from "next";
import { IndustryPage } from "@/components/industry-page";
import { INDUSTRIES } from "@/lib/industries";
import { getCaseStudyByIndustry } from "@/lib/case-studies";

const config = INDUSTRIES["agencies"];
const caseStudy = getCaseStudyByIndustry("agencies")!;

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

export default function AgenciesIndustryPage() {
  return (
    <IndustryPage
      data={{
        slug: config.slug,
        config,
        heroEyebrow: "Muditek / Agencies",
        heroHeadline: (
          <>
            Marketing and dev agencies lose 20+ hrs/week to manual content, reporting, and ops{" "}
            <span className="text-primary italic font-medium">in 2026.</span>
          </>
        ),
        heroSubhead:
          "Every retainer comes with weekly content, monthly reports, daily inboxes, and constant context-switching. The work expands faster than the headcount can absorb. Margin disappears into work nobody got hired to do.",
        heroSecondaryParagraph:
          "MudiKit is the operator library for agencies that want to stop doing the busywork: 64 Claude Code skills, implementation playbooks, the vault template, and outreach operating files. Where MudiKit isn't enough, we build custom on top.",
        stats: [
          { value: "20+ hrs", label: "Weekly busywork in 2026" },
          { value: "60x", label: "Throughput on social production" },
          { value: "$47/mo", label: "MudiKit subscription" },
        ],
        problems: [
          {
            num: "01",
            title: "Weekly content production eats the team",
            body: "Three to five posts per client per week, written in voice, sourced from each client's actual content, formatted per platform. The strategist drafts, the junior edits, the senior reviews, the account manager approves. By Friday half the team has spent half the week on posts that haven't shipped.",
            euroPain: "20+ hrs/week × hourly rate × every retainer",
          },
          {
            num: "02",
            title: "Reporting and QBRs are manual every cycle",
            body: "Pull metrics from each ad platform, screenshot dashboards, write commentary, format slides. Repeat per client, per month. The analyst spends two days on each report — and clients still ask the same questions on the QBR call.",
            euroPain: "2 days/client/month, all margin loss",
          },
          {
            num: "03",
            title: "Outbound and lead gen for the agency itself sit dead last",
            body: "Every agency owner says new business is the priority. Every Friday, they realize they did zero outbound this week because client work consumed it. Pipeline goes thin, then panic, then discount-pricing the next deal to fill the gap.",
            euroPain: "Lost retainers + discounted new business",
          },
        ],
        solutions: [
          {
            num: "01",
            title: "MudiKit content engine",
            body: "Configure each client's voice once. The engine ingests their newsletter, blog, and product updates, then generates platform-specific drafts. The senior reviews 30+ posts in 20 minutes — same quality bar, sixty times the throughput.",
            via: "MudiKit linkedin-content-writer + source-ingest skills",
          },
          {
            num: "02",
            title: "Reporting automation built on your stack",
            body: "Pull metrics from Google Ads, Meta, GA4, and your CRM into a templated monthly report per client. The narrative section gets drafted by the engine using the actual numbers. Analyst reviews in 30 minutes; client gets it on the 1st instead of the 7th.",
            via: "Custom build, often on top of your existing tools",
          },
          {
            num: "03",
            title: "Agentic outbound for new business",
            body: "Ideal-customer-profile defined once. The system identifies prospects, enriches contacts, drafts personalized first-touch, and tracks responses. The agency owner approves a daily list and pre-written messages in under 15 minutes.",
            via: "MudiKit outreach skills + custom configuration",
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
            q: "Will the AI-generated content actually sound like our clients?",
            a: "Yes — but only after you configure each client's voice. The engine learns from real samples (newsletter issues, blog posts, founder LinkedIn) and the senior reviewer rejects drafts that miss the voice. After two weeks of feedback, voice matching is consistent enough that drafts publish with light edits.",
          },
          {
            q: "Can we white-label this for our clients?",
            a: "MudiKit is licensed for your agency's use, including using it to deliver to your clients. You can't redistribute the library to your clients as their own subscription. The custom systems we build on top — voice configurations, reporting templates, outbound configurations — are yours to brand and resell.",
          },
          {
            q: "How is this different from Jasper, Copy.ai, or other AI content tools?",
            a: "Those tools are general-purpose content generators. MudiKit is specifically the skills, prompts, and configurations that I run my own business on, plus implementation playbooks. The difference is depth: Jasper writes; MudiKit ships systems that include voice config, review queue, scheduling integration, and per-client routing.",
          },
          {
            q: "What's the smallest agency this makes sense for?",
            a: "Three people and at least three retainer clients. Below that, the time savings don't justify the configuration overhead. Above five people, the math starts paying for itself in the first month.",
          },
          {
            q: "Do we need engineers on staff?",
            a: "Comfortable with a terminal and one engineer-or-engineering-curious team member is enough. If your agency has zero technical capacity, start with MudiKit's playbooks and a 30-minute call — we'll tell you whether to bring in a fractional implementer or wait until you have one in-house.",
          },
        ],
        serviceSchemaName: "AI Content + Outbound Systems for Marketing & Dev Agencies",
        serviceSchemaDescription:
          "MudiKit operator library plus custom AI systems for marketing and development agencies — content production engines, reporting automation, and agentic outbound for agency new business.",
        datePublished: "2026-05-03",
        dateModified: "2026-05-04",
      }}
    />
  );
}
