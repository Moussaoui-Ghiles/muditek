import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NewsletterInline } from "@/components/newsletter-inline";

export const metadata: Metadata = {
  title: "Resources | Muditek",
  description:
    "Free playbooks, guides, and tools from Muditek. AI systems, revenue operations, and automation walkthroughs.",
  openGraph: {
    title: "Resources | Muditek",
    description: "Free playbooks, guides, and tools from Muditek.",
    url: "https://muditek.com/resources",
  },
  alternates: {
    canonical: "https://muditek.com/resources",
  },
};

const resources = [
  {
    slug: "clawchief-blueprint",
    title: "The Chief of Staff Blueprint",
    description:
      "7 text files just replaced a $75K/year executive assistant. Full end-to-end build guide for turning OpenClaw into an autonomous chief of staff — inbox, calendar, outreach, tasks, meeting notes, on 3 cron jobs, 4 skills, and 8 markdown files. Extracted verbatim from snarktank/clawchief.",
    tag: "Blueprint",
    date: "April 2026",
  },
  {
    slug: "claude-code-self-evolving",
    title: "How To Transform Claude Code Into A Self-Evolving System",
    description:
      "The system that took corrections from 4-5 per session to near zero by session 20. Every mistake Claude makes gets captured, verified, and turned into a permanent rule it never breaks again. Full setup guide.",
    tag: "Guide",
    date: "March 2026",
  },
  {
    slug: "openclaw-outbound",
    title: "The OpenClaw Outbound Playbook",
    description:
      "300K cold emails/month. 153 calls booked. $1,200 total cost. The complete autonomous outbound system — daily ops, infrastructure map, and the 2-email philosophy backed by 4.7M emails of data.",
    tag: "Playbook",
    date: "March 2026",
  },
  {
    slug: "judgment-moat",
    title: "The Judgment Moat",
    description:
      "Why 6 skill files beat 1,000 specialists. How encoded judgment is replacing vertical AI wrappers as the real competitive advantage.",
    tag: "Playbook",
    date: "March 2026",
  },
  {
    slug: "claude-code-tips",
    title: "The Claude Code 45-Tip Power User Playbook",
    description:
      "All 45 Claude Code tips from basics to running 3 AI agents in parallel from your phone. Full setup commands, code examples, and walkthroughs.",
    tag: "Playbook",
    date: "March 2026",
  },
  {
    slug: "google-maps-outbound",
    title: "The Google Maps Outbound Playbook",
    description:
      "Claude Code + Google Maps = 2,000 leads a day for $10/mo. Full scraper logic, infrastructure setup, and multi-channel sequencing.",
    tag: "Playbook",
    date: "March 2026",
  },
  {
    slug: "skill-creator-blueprint",
    title: "The Skill Creator Blueprint",
    description:
      "How to build Claude Code skills that encode your expertise into reusable, transferable AI instructions.",
    tag: "Playbook",
    date: "March 2026",
  },
  {
    slug: "claude-dispatch-guide",
    title: "Claude Dispatch Setup Guide",
    description:
      "Full walkthrough for setting up Claude Dispatch and Remote Control. Text tasks from your phone, get results back automatically.",
    tag: "Guide",
    date: "March 2026",
  },
  {
    slug: "agentic-sdr-setup-guide",
    title: "Agentic SDR Setup Guide",
    description:
      "$269/month. 3 channels. 157+ booked calls. The full autonomous outbound system with OpenClaw, Instantly, and PhantomBuster.",
    tag: "Guide",
    date: "March 2026",
  },
  {
    slug: "cowork-setup-guide",
    title: "Cowork Setup Guide",
    description:
      "Get Claude Cowork running on your machine. Plugins, skills, scheduled tasks, and the full autonomous workflow.",
    tag: "Guide",
    date: "March 2026",
  },
  {
    slug: "gtm-skills-guide",
    title: "GTM Skills Guide",
    description:
      "Go-to-market skills for AI agents. Outreach, content, lead generation, and pipeline automation playbooks.",
    tag: "Guide",
    date: "March 2026",
  },
  {
    slug: "sequoia-autopilot-playbook",
    title: "Sequoia Autopilot Playbook",
    description:
      "Automated content and distribution system inspired by the Sequoia growth framework.",
    tag: "Playbook",
    date: "March 2026",
  },
  {
    slug: "ai-data-agent-guide",
    title: "AI Data Agent Guide",
    description:
      "Build AI agents that scrape, enrich, and organize business data. Full pipeline from raw sources to actionable intelligence.",
    tag: "Guide",
    date: "March 2026",
  },
  {
    slug: "ai-productivity-scorecard",
    title: "AI Productivity Scorecard",
    description:
      "Score your AI adoption maturity across 6 dimensions. Find where you are losing time and money.",
    tag: "Tool",
    date: "March 2026",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Navbar />

      <section className="pt-40 pb-20 px-6 md:px-12">
        <div className="max-w-[1800px] mx-auto">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight">
            Resources
          </h1>
          <p className="text-foreground/40 text-lg mt-4 max-w-xl">
            Free playbooks, guides, and tools. No email gate. Just value.
          </p>
        </div>
      </section>

      <NewsletterInline tags={["source:resources"]} />

      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-[1800px] mx-auto">
          {resources.map((r, i) => (
            <Link
              key={r.slug}
              href={`/resources/${r.slug}`}
              className="group flex items-start md:items-center justify-between py-8 md:py-10 border-t border-white/[0.06] first:border-t-0 hover:bg-white/[0.02] transition-colors -mx-6 px-6 md:-mx-12 md:px-12"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400/70 bg-emerald-400/10 px-2 py-0.5 rounded-sm">
                    {r.tag}
                  </span>
                  <span className="text-[10px] text-foreground/20 uppercase tracking-wider">
                    {r.date}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight group-hover:text-foreground transition-colors text-foreground/80">
                  {r.title}
                </h2>
                <p className="text-foreground/30 text-sm mt-2 max-w-2xl">
                  {r.description}
                </p>
              </div>
              <span className="text-foreground/20 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300 text-xl ml-8 shrink-0">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
