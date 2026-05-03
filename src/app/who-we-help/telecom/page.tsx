import type { Metadata } from "next";
import { IndustryPage } from "@/components/industry-page";
import { INDUSTRIES } from "@/lib/industries";
import { getCaseStudyByIndustry } from "@/lib/case-studies";

const config = INDUSTRIES["telecom"];
const caseStudy = getCaseStudyByIndustry("telecom")!;

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

export default function TelecomIndustryPage() {
  return (
    <IndustryPage
      data={{
        slug: config.slug,
        config,
        heroEyebrow: "Muditek / Telecom",
        heroHeadline: (
          <>
            Telecom NOCs spend half their week on backward-looking paperwork{" "}
            <span className="text-primary italic font-medium">in 2026.</span>
          </>
        ),
        heroSubhead:
          "SLA reports, vendor escalation summaries, and customer-facing fault breakdowns — all assembled by hand from OSS exports, spreadsheets, and email. Cloud AI isn't an option when customer infrastructure data can't leave your racks.",
        heroSecondaryParagraph:
          "mudiAgent runs on-premises. The agent reads tickets from your OSS, joins them with vendor portal exports, and generates the customer-facing reports — without any data leaving your infrastructure.",
        stats: [
          { value: "<1 hr", label: "Weekly SLA report cycle" },
          { value: "100%", label: "On-prem, no egress" },
          { value: "20-50", label: "Concurrent users, no per-seat fees" },
        ],
        problems: [
          {
            num: "01",
            title: "Weekly SLA reporting eats the NOC",
            body: "Pull tickets from the OSS, join with vendor portal exports, cross-reference the per-customer penalty matrix, write commentary, format the PDF. Repeat per customer, every week. Two to three working days every cycle, multiplied by every customer.",
            euroPain: "~50% of NOC capacity on backward paperwork",
          },
          {
            num: "02",
            title: "Cloud AI is contractually blocked",
            body: "Customer infrastructure detail, contractual penalty structures, vendor-confidential fault information — none of it can leave your racks. Cloud AI APIs are off the table. Per-user enterprise AI tools don't fit the deployment model and don't run autonomously.",
            euroPain: "Compliance + procurement blockers on every cloud tool",
          },
          {
            num: "03",
            title: "Knowledge lives in heads, not systems",
            body: "Senior NOC engineers know how the network actually behaves. New hires take months to come up to speed. The institutional knowledge — vendor quirks, recurring fault patterns, customer-specific configurations — is in someone's head, not searchable, not shared.",
            euroPain: "Onboarding time + key-person risk",
          },
        ],
        solutions: [
          {
            num: "01",
            title: "On-prem mudiAgent for SLA reporting",
            body: "Agent runs on a workstation in your secure rack. Reads OSS tickets, joins vendor portal exports, classifies by SLA-relevant categories, applies your penalty matrix, generates customer-facing PDFs by Friday morning. Engineer reviews 12 reports in 45 minutes.",
            via: "mudiAgent, on-premises, no internet egress for inference",
          },
          {
            num: "02",
            title: "Knowledge search across your operational corpus",
            body: "Trained on your runbooks, post-mortems, vendor documentation, and historical tickets. New hires ask 'has this fault happened before?' and get the answer with the original ticket and resolution — instead of asking the senior engineer in the next chair.",
            via: "Same on-prem deployment, multi-user from day one",
          },
          {
            num: "03",
            title: "Scheduled monitoring and follow-up",
            body: "Daily fault summary at 06:00. Weekly customer report at 06:00 Friday. Monthly vendor escalation review on the 1st. Set once, runs forever — without anyone opening a chat interface to type a prompt.",
            via: "Scheduled jobs on the on-prem agent, no human-in-the-loop required",
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
            q: "Why on-premises and not cloud?",
            a: "Customer infrastructure data, contractual penalty structures, and vendor-confidential fault information often can't leave your racks under existing customer or regulator agreements. mudiAgent runs entirely on a device in your office. No internet egress for inference. Full audit trail. Meets data residency and contractual constraints that block every cloud AI tool.",
          },
          {
            q: "What hardware do we need?",
            a: "A workstation-class machine — typically a server or high-spec workstation in your secure rack. Hardware spec depends on user count and concurrent workload; we size it during the discovery phase. Most regional telcos run mudiAgent on a single machine for the entire NOC.",
          },
          {
            q: "How does this compare to ChatGPT Enterprise or Microsoft Copilot?",
            a: "Both are cloud-based, per-user pricing, can't operate systems autonomously, can't run on a schedule, and process data on third-party servers. mudiAgent is on-prem, one-time deployment, autonomous operation, and meets data residency requirements. See /mudiagent-vs-chatgpt for the side-by-side.",
          },
          {
            q: "What integrations work out of the box?",
            a: "OSS/BSS systems (most major vendors), ticketing (ServiceNow, Jira, ITSM platforms), monitoring (NMS-class tools), file servers, vendor portals, email, messaging (WhatsApp Business, Teams), databases. Custom integrations are part of the deployment scope.",
          },
          {
            q: "What's the typical engagement size?",
            a: "Pilot deployment: €15K one-time. One agent, one workflow, live in 4 weeks — typically the SLA report or NOC knowledge search. Optional retainer at €3K/month for monitoring, optimization, and scaling. Full multi-workflow deployment ranges from €40K-100K depending on integrations.",
          },
        ],
        serviceSchemaName: "On-Premises AI for Telecom Operators",
        serviceSchemaDescription:
          "mudiAgent on-premises AI for telecom operators — automated SLA reporting, NOC knowledge search, scheduled monitoring, and software operation. Runs entirely on customer infrastructure with no cloud dependency.",
        datePublished: "2026-05-03",
        dateModified: "2026-05-03",
      }}
    />
  );
}
