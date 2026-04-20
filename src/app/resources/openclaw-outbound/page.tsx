import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { NewsletterInline } from "@/components/newsletter-inline";

export const metadata: Metadata = {
  title:
    "The OpenClaw Outbound Playbook — Full Setup, Daily Ops & Infrastructure | Muditek",
  description:
    "300K cold emails/month. 153 calls booked. $1,200 total cost. The complete OpenClaw system: 2-email philosophy, 45-day coverage cycle, infrastructure map, and lessons from 4.7M emails.",
  openGraph: {
    title: "The OpenClaw Outbound Playbook",
    description:
      "300K cold emails/month. 153 calls booked. $1,200 total cost. The complete autonomous outbound system.",
    url: "https://muditek.com/resources/openclaw-outbound",
    type: "article",
  },
  alternates: {
    canonical: "https://muditek.com/resources/openclaw-outbound",
  },
};

/* ─── Reusable components ─── */

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-black uppercase tracking-[0.25em] text-primary/80 mb-5">
      {children}
    </p>
  );
}

function MetricCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-white/[0.06] p-6 md:p-8 text-center">
      <div className="text-3xl md:text-4xl font-black tracking-tight text-primary stat-glow">
        {value}
      </div>
      <div className="text-sm font-bold uppercase tracking-[0.15em] text-foreground/60 mt-2">
        {label}
      </div>
    </div>
  );
}

function Step({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5 md:gap-6 py-6 border-b border-white/[0.06] last:border-b-0">
      <div className="shrink-0 w-11 h-11 rounded-xl bg-primary text-background flex items-center justify-center text-lg font-black">
        {num}
      </div>
      <div>
        <h3 className="text-xl md:text-[22px] font-black uppercase tracking-tight mb-1">
          {title}
        </h3>
        <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  );
}

function TimelineItem({
  time,
  title,
  children,
}: {
  time: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6 md:gap-8 py-6 border-b border-white/[0.06] last:border-b-0">
      <div className="shrink-0 w-20 md:w-24 font-mono text-lg md:text-xl font-bold text-primary pt-0.5">
        {time}
      </div>
      <div>
        <h3 className="text-xl md:text-[22px] font-black uppercase tracking-tight mb-1">
          {title}
        </h3>
        <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  );
}

function InfraRow({
  name,
  detail,
  cost,
}: {
  name: string;
  detail: string;
  cost: string;
}) {
  return (
    <div className="stat-row flex justify-between items-baseline py-4 border-b border-white/[0.06] last:border-b-0">
      <div>
        <div className="text-lg font-bold text-foreground">{name}</div>
        <div className="text-sm text-foreground/50 mt-0.5">{detail}</div>
      </div>
      <div className="shrink-0 ml-6 font-mono text-base md:text-lg font-bold text-primary">
        {cost}
      </div>
    </div>
  );
}

function Callout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-primary/[0.06] border-l-4 border-primary rounded-r-xl p-6 my-8">
      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">
        {title}
      </h4>
      <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-base md:text-lg text-foreground/70 leading-relaxed pl-7 relative before:content-[''] before:absolute before:left-0 before:top-[13px] before:w-2.5 before:h-0.5 before:bg-primary">
      {children}
    </li>
  );
}

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink";

/* ─── Page ─── */

export default function OpenClawOutboundPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "The OpenClaw Outbound Playbook — Full Setup, Daily Ops & Infrastructure",
    description:
      "300K cold emails/month. 153 calls booked. $1,200 total cost. The complete autonomous outbound system.",
    author: {
      "@type": "Person",
      name: "Ghiles Moussaoui",
      url: "https://muditek.com/about",
    },
    publisher: { "@type": "Organization", name: "Muditek" },
    datePublished: "2026-03-27",
    mainEntityOfPage: "https://muditek.com/resources/openclaw-outbound",
  };

  return (
    <>
      <JsonLd data={schemaData} />
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section className="pt-36 md:pt-44 pb-16 md:pb-24 px-6 md:px-12">
        <div className="max-w-[860px] mx-auto">
          <Link
            href="/resources"
            className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/30 hover:text-foreground/60 transition-colors mb-8 inline-block"
          >
            &larr; Resources
          </Link>

          <SectionTag>
            Full Setup &bull; Daily Playbook &bull; Infrastructure Map
          </SectionTag>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[-0.03em] leading-[0.92]">
            The OpenClaw
            <br />
            Outbound Playbook
          </h1>

          <p className="text-xl md:text-2xl text-foreground/70 mt-6 max-w-[620px] leading-relaxed">
            300,000 cold emails per month. 153 calls booked. $1,200 total cost.
            The entire team is one AI agent running on a $7&nbsp;VPS.
          </p>

          <p className="text-lg md:text-xl text-foreground/60 mt-4 max-w-[620px] leading-relaxed">
            The complete system — daily operation, infrastructure, the math
            behind the 2-email philosophy, and every lesson from 4.7&nbsp;million
            emails of data.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12">
            <MetricCard value="300K" label="Emails / Month" />
            <MetricCard value="153" label="Calls Booked" />
            <MetricCard value="$0.004" label="Per Email" />
            <MetricCard value="95%+" label="Deliverability" />
          </div>

          <p className="text-sm text-foreground/40 mt-8">
            Data from 10+ B2B clients over 8 months. Based on Liam
            Sheridan&apos;s OpenClaw system, with post-install hardening from
            Moritz Kremb and multi-agent architecture from Sandra Leow.
          </p>
        </div>
      </section>

      {/* ═══════════ CORE INSIGHT ═══════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-[860px] mx-auto">
          <SectionTag>The Core Insight</SectionTag>

          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-6">
            The Problem Isn&apos;t Copy. It&apos;s Coverage.
          </h2>

          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-4">
            Only 3-5% of your Total Addressable Market is buying at any given
            moment. Most outbound teams email the same 20% of their list over
            and over — and miss the other 80% entirely.
          </p>

          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
            The fix isn&apos;t better subject lines. It&apos;s reaching your
            entire TAM every 45 days so you{" "}
            <strong className="text-foreground">
              mathematically can&apos;t miss a buying window
            </strong>
            .
          </p>

          {/* Coverage formula */}
          <div className="bg-[#111215] rounded-2xl border border-white/[0.06] p-6 md:p-8 mt-8 font-mono text-sm md:text-base leading-loose text-primary/90 relative overflow-hidden">
            <span className="absolute top-4 right-5 text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-foreground/20">
              Coverage Formula
            </span>
            <span className="text-foreground/40">TAM size:</span>{" "}
            <span className="text-foreground/90">10,000 contacts</span>
            <br />
            <span className="text-foreground/40">Coverage cycle:</span>{" "}
            <span className="text-foreground/90">45 days</span>
            <br />
            <span className="text-foreground/40">New contacts/day:</span>{" "}
            <span className="text-foreground/90">10,000 / 45 = 222</span>
            <br />
            <span className="text-foreground/40">Emails/day:</span>{" "}
            <span className="text-foreground/90">222 x 2 = 444</span>
            <br />
            <span className="text-foreground/40">Sending accounts:</span>{" "}
            <span className="text-foreground/90">444 / 20 = 22-25</span>
            <br />
            <br />
            <span className="text-foreground/30">
              {"// 30 days = too aggressive (spammy)"}
            </span>
            <br />
            <span className="text-foreground/30">
              {"// 60 days = too slow (miss buying windows)"}
            </span>
            <br />
            <span className="text-foreground/30">
              {"// 45 days = catches every prospect within"}
            </span>
            <br />
            <span className="text-foreground/30">
              {"//   45 days of their buying window"}
            </span>
          </div>

          <Callout title="The Volume Thesis">
            &ldquo;1,500-3,000 emails/day is the baseline for serious pipeline
            generation. Most people drastically underestimate.&rdquo; Send to
            MORE people with fewer emails each — not fewer people with longer
            sequences.
          </Callout>
        </div>
      </section>

      {/* ═══════════ 2-EMAIL PHILOSOPHY ═══════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-[860px] mx-auto">
          <SectionTag>The 2-Email Philosophy</SectionTag>

          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-6">
            Why 2 Emails — Not 7, Not 12
          </h2>

          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-8">
            Every cold email guru says &ldquo;follow up 7 times.&rdquo; 4.7
            million emails of data says they&apos;re wrong.
          </p>

          {/* Data table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-white/[0.08]">
                  <th className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/50 pb-3 pr-4">
                    Email #
                  </th>
                  <th className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/50 pb-3 pr-4">
                    Share of Positive Replies
                  </th>
                  <th className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/50 pb-3">
                    Verdict
                  </th>
                </tr>
              </thead>
              <tbody className="text-lg">
                <tr className="border-b border-white/[0.06]">
                  <td className="py-4 pr-4 text-foreground/80">Email 1</td>
                  <td className="py-4 pr-4 font-mono text-2xl font-black text-foreground">
                    67%
                  </td>
                  <td className="py-4 text-emerald-400 font-bold">Send</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-4 pr-4 text-foreground/80">Email 2</td>
                  <td className="py-4 pr-4 font-mono text-2xl font-black text-foreground">
                    22%
                  </td>
                  <td className="py-4 text-emerald-400 font-bold">Send</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-4 pr-4 text-foreground/80">Emails 3-7</td>
                  <td className="py-4 pr-4 font-mono text-2xl font-black text-foreground">
                    11%
                  </td>
                  <td className="py-4 text-red-400 font-bold">Kill</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-foreground/40 mt-4 mb-8">
            Data: 4.7 million+ emails across 10+ B2B clients over 8 months.
          </p>

          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">
            Why Emails 3-7 Actually Hurt You
          </h3>

          <ul className="space-y-2">
            <Bullet>
              Every unopened email trains Gmail that your domain sends unwanted
              mail
            </Bullet>
            <Bullet>
              Deliverability degrades progressively — your Email 1 becomes less
              effective
            </Bullet>
            <Bullet>Sender reputation drops across your entire domain</Bullet>
            <Bullet>
              You&apos;re paying to make your own future emails worse
            </Bullet>
          </ul>

          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-10 mb-4">
            The OpenClaw Approach
          </h3>

          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
            Send 2 emails. Stop. Come back in 45 days with fresh copy and fresh
            timing. Result:{" "}
            <strong className="text-primary">
              95%+ deliverability sustained over 8 months
            </strong>
            . Reply rates hold at{" "}
            <strong className="text-primary">1.5-2.5%</strong> depending on
            market.
          </p>
        </div>
      </section>

      {/* ═══════════ DAILY OPERATION ═══════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-[860px] mx-auto">
          <SectionTag>Daily Playbook</SectionTag>

          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-4">
            The Daily Operation
          </h2>

          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-8">
            OpenClaw runs autonomously on a 24-hour loop. No human intervention
            required unless a hot lead comes in.
          </p>

          <div>
            <TimelineItem time="6:00 AM" title="Build Lead List">
              Apollo + Sales Navigator enriched via Clay, validated via
              ZeroBounce, segmented and loaded into Instantly. Takes 20 minutes.
              Used to take 2-3 hours by hand.
            </TimelineItem>

            <TimelineItem time="8:00 AM" title="Copy Rotation">
              Reviews previous day&apos;s performance. Which subject lines got
              opens? Which variants got replies? Deliverability warnings?
              Auto-pauses underperformers, scales winners.
            </TimelineItem>

            <TimelineItem time="9-5 PM" title="Send on Autopilot">
              Emails go out via Instantly across 25 sending accounts at ~20
              emails/account/day. 2 emails per prospect, then stop. No
              exceptions.
            </TimelineItem>

            <TimelineItem time="6:00 PM" title="Response Processing">
              <strong className="text-foreground">Hot lead</strong> = CRM task +
              WhatsApp alert.{" "}
              <strong className="text-foreground">Soft positive</strong> =
              nurture.{" "}
              <strong className="text-foreground">Objection</strong> = logged.{" "}
              <strong className="text-foreground">Negative</strong> = instant
              unsubscribe.
            </TimelineItem>

            <TimelineItem time="10:00 PM" title="Daily Report">
              Summary on WhatsApp: emails sent, opens, replies, hot leads
              flagged, issues detected. You wake up knowing exactly what
              happened.
            </TimelineItem>
          </div>
        </div>
      </section>

      {/* ═══════════ INFRASTRUCTURE ═══════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-[860px] mx-auto">
          <SectionTag>Infrastructure Map</SectionTag>

          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-4">
            The Full Stack — $1,200/mo
          </h2>

          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-8">
            Everything you need to run 300K emails/month. No team. No office.
            One VPS.
          </p>

          <div>
            <InfraRow
              name="Sending Domains"
              detail="25 dedicated outbound domains (never your primary)"
              cost="$300/yr"
            />
            <InfraRow
              name="Google Workspace Inboxes"
              detail="75 inboxes across 25 domains (3 per domain)"
              cost="$450/mo"
            />
            <InfraRow
              name="Instantly.ai"
              detail="Sending platform — warmup, throttling, rotation"
              cost="$97/mo"
            />
            <InfraRow
              name="Apollo.io"
              detail="Lead sourcing — contact database + Sales Nav sync"
              cost="$99/mo"
            />
            <InfraRow
              name="Clay"
              detail="Enrichment — company data, technographics, signals"
              cost="$149/mo"
            />
            <InfraRow
              name="ZeroBounce"
              detail="Email validation — removes bad addresses pre-send"
              cost="~$0.008/email"
            />
            <InfraRow
              name="OpenClaw + VPS"
              detail="Agent runtime — orchestrates the entire daily loop"
              cost="$7/mo"
            />
            <InfraRow
              name="Claude API"
              detail="AI backbone — copy, reply classification, reporting"
              cost="$200-400/mo"
            />
          </div>

          {/* Total */}
          <div className="bg-card rounded-2xl border border-white/[0.06] p-6 md:p-8 mt-8 flex justify-between items-center">
            <span className="text-sm font-bold uppercase tracking-[0.15em] text-foreground/60">
              Total Monthly Cost
            </span>
            <span className="text-3xl md:text-4xl font-black text-primary stat-glow">
              ~$1,000-1,200
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
            <MetricCard value="$0.004" label="Per Email" />
            <MetricCard value="$15-25" label="Per Qualified Call" />
            <MetricCard value="60+" label="Calls / Month" />
            <MetricCard value="0" label="Humans Required" />
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT FAILED ═══════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-[860px] mx-auto">
          <SectionTag>Lessons From 4.7M Emails</SectionTag>

          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-4">
            What Failed (So You Don&apos;t Have To)
          </h2>

          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6">
            Every failure came from adding complexity that sounded smart but
            didn&apos;t move the numbers.
          </p>

          <div>
            <Step num={1} title="7-Email Sequences">
              Emails 3-7 destroyed deliverability while generating almost no
              replies. You&apos;re paying to make other emails less effective.
              Killed it. Went to 2.
            </Step>
            <Step num={2} title="Sending From Primary Domains">
              Main domain got flagged. Regular business emails started going to
              spam. Took 3 months to recover. Now: dedicated outbound domains
              you&apos;re prepared to burn.
            </Step>
            <Step num={3} title="Over-Personalization">
              Scraped LinkedIn posts, news articles, job changes. Reply rate went
              up 0.5%. System became 10x more complex and broke constantly. Now:
              personalize first line on 3-4 data points max.
            </Step>
            <Step num={4} title="Letting AI Write Everything">
              Uncanny AI smell. Too perfect, too generic, too obviously not
              human. Now: humans write the frameworks and angles. AI fills in
              personalization and handles mechanical work.
            </Step>
          </div>

          <Callout title="The Pattern">
            Coverage &gt; cleverness. Volume &gt; virtuosity. 2 emails &gt; 7.
            The winning system is simpler than what most people expect.
          </Callout>
        </div>
      </section>

      {/* ═══════════ POST-INSTALL HARDENING ═══════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-[860px] mx-auto">
          <SectionTag>Post-Install Checklist</SectionTag>

          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-4">
            Hardening Your OpenClaw Setup
          </h2>

          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-6">
            Installation is the easy part. This is the 30-60 minute hardening
            pass that turns a fresh install into something production-grade.
          </p>

          <div>
            <Step num={1} title="Identity & Memory Files">
              Configure USER.md, IDENTITY.md, SOUL.md, MEMORY.md, and daily
              memory files. Without these, output quality degrades between
              sessions and context doesn&apos;t persist.
            </Step>
            <Step num={2} title="Model Stack">
              Set primary model + fallbacks. Reliability first, cost second.
              Claude for reasoning. Kimi K2.5 (5-8x cheaper) for structured
              retrieval and monitoring. Gemini Flash for simple ops.
            </Step>
            <Step num={3} title="Secrets & Security">
              Move secrets outside workspace. Strict filesystem permissions. On
              VPS: restrict inbound access, keep gateway token auth enabled.
              Never leave API keys in the workspace folder.
            </Step>
            <Step num={4} title="Channel Controls">
              Set dmPolicy allowlist and allowFrom rules. Configure group/topic
              allowlists explicitly. Use managed browser profile by default —
              relay only for logged-in states.
            </Step>
            <Step num={5} title="Heartbeat & Cron Health">
              Add heartbeat instructions for memory maintenance and cron-health
              checks. Cron jobs silently fail. Force-run missed jobs and report
              exceptions daily.
            </Step>
            <Step num={6} title="Ops Hygiene">
              Dedicated accounts for agent environment. Install summarize skill
              early. Convert recurring successful workflows into custom skills
              for compounding efficiency.
            </Step>
          </div>
        </div>
      </section>

      {/* ═══════════ MULTI-AGENT ARCHITECTURE ═══════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-[860px] mx-auto">
          <SectionTag>Bonus: Multi-Agent Architecture</SectionTag>

          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-4">
            Scaling Beyond One Agent
          </h2>

          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-8">
            Once the outbound loop works, the next level is running multiple
            scoped agents with a shared coordination layer.
          </p>

          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3">
            Mission Control Dashboard
          </h3>
          <p className="text-lg text-foreground/70 leading-relaxed mb-6">
            Every agent reads from a shared kanban-style taskboard. Agents check
            the backlog autonomously — if there&apos;s a task in their domain,
            they pick it up. No manual assignment needed.
          </p>

          {/* Prompt template */}
          <div className="bg-primary/[0.04] border border-primary/[0.12] rounded-2xl p-6 md:p-8 my-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">
              Prompt Template
            </p>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed italic">
              You are [role]. Your domain is [specific scope]. You have access to
              [tools]. Your quality bar is [standard]. You do not work outside
              your domain — if a task falls outside your scope, flag it. Check
              the dashboard every heartbeat for tasks in your domain. Be
              proactive, not reactive.
            </p>
          </div>

          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3">
            Model-to-Task Matching
          </h3>
          <p className="text-lg text-foreground/70 leading-relaxed mb-4">
            Running Claude on every agent is how you burn through credits in a
            week. Match the model to the task:
          </p>

          <ul className="space-y-2 mb-8">
            <Bullet>
              <strong className="text-foreground">
                Creative + reasoning-heavy work:
              </strong>{" "}
              Claude
            </Bullet>
            <Bullet>
              <strong className="text-foreground">
                Structured retrieval + monitoring:
              </strong>{" "}
              Kimi K2.5 (5-8x cheaper)
            </Bullet>
            <Bullet>
              <strong className="text-foreground">Simple ops:</strong> Gemini
              Flash
            </Bullet>
          </ul>

          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3">
            Context Isolation via Telegram Topics
          </h3>
          <p className="text-lg text-foreground/70 leading-relaxed">
            One chat for everything = one giant context window where
            conversations bleed together. Use Telegram Topics: 8 topics = 8
            isolated contexts. Each topic has its own memory file. Route messages
            by topic ID, write to topic-specific memory, and let the dashboard
            extract tasks automatically.
          </p>

          <Callout title="Key Lesson">
            Constrained-domain agents are easier to debug and more reliable than
            unconstrained general agents. Give each agent a narrow scope and a
            clear quality bar.
          </Callout>
        </div>
      </section>

      {/* ═══════════ TWITTER DM ARBITRAGE ═══════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-[860px] mx-auto">
          <SectionTag>Bonus: Multi-Channel Expansion</SectionTag>

          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-4">
            The Twitter DM Arbitrage
          </h2>

          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-8">
            Cold email is the engine. But the highest-converting outbound
            channel right now might be one most people ignore.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            <MetricCard value="3-5x" label="Higher Response" />
            <MetricCard value="150" label="DMs / Day Max" />
            <MetricCard value="50+" label="LinkedIn Msgs / Day" />
            <MetricCard value="2-3" label="Twitter DMs / Day" />
          </div>

          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-8">
            Decision-makers get 50+ LinkedIn messages per day but only 2-3
            Twitter DMs. The arbitrage is real. Personalize from their last 5-7
            tweets — it takes 30 seconds per DM and the response rates are
            dramatically higher than any other channel.
          </p>

          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">
            The 3-Channel Stack
          </h3>

          <ul className="space-y-2">
            <Bullet>
              <strong className="text-foreground">
                Cold email (primary):
              </strong>{" "}
              300K/month. Covers entire TAM every 45 days. Generates the bulk of
              pipeline.
            </Bullet>
            <Bullet>
              <strong className="text-foreground">
                Twitter DMs (high-value):
              </strong>{" "}
              150/day on high-priority prospects. 3-5x response rate.
              Personalized from recent tweets.
            </Bullet>
            <Bullet>
              <strong className="text-foreground">
                LinkedIn (supplementary):
              </strong>{" "}
              Connection requests + messages for warm touches. Lower response
              rate but builds long-term trust.
            </Bullet>
          </ul>
        </div>
      </section>

      {/* ═══════════ RESULTS ═══════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-[860px] mx-auto">
          <SectionTag>Proven Results</SectionTag>

          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-8">
            The Numbers After 8 Months
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
            <MetricCard value="300K+" label="Emails / Month" />
            <MetricCard value="95%+" label="Deliverability" />
            <MetricCard value="1.5-2.5%" label="Reply Rate" />
            <MetricCard value="60+" label="Calls / Month" />
          </div>

          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">
            Unit Economics
          </h3>

          <div>
            <InfraRow
              name="Total monthly cost"
              detail=""
              cost="$1,000-1,200"
            />
            <InfraRow name="Cost per email sent" detail="" cost="$0.004" />
            <InfraRow
              name="Cost per qualified call"
              detail=""
              cost="$15-25"
            />
            <InfraRow name="Human hours per day" detail="" cost="0" />
            <InfraRow name="TAM coverage cycle" detail="" cost="45 days" />
          </div>

          <p className="text-sm text-foreground/40 mt-6">
            All metrics from Liam Sheridan&apos;s public data across 10+ B2B
            clients. Twitter DM data from Levi Munneke. Multi-agent architecture
            from Sandra Leow.
          </p>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-20 md:py-32 px-6 md:px-12 border-t border-white/[0.06] text-center">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-5">
            Want This Built For Your Business?
          </h2>

          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-8">
            We help B2B companies deploy autonomous outbound systems — from
            infrastructure setup to daily operation. If you&apos;re running
            manual outbound and want the same output at a fraction of the cost,
            let&apos;s talk.
          </p>

          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-background text-base font-black uppercase tracking-[0.1em] hover:opacity-90 transition-opacity"
          >
            Book a Call
          </a>

          <p className="text-sm text-foreground/40 mt-4">
            Or connect on{" "}
            <a
              href="https://www.linkedin.com/in/ghiles-moussaoui-b36218250/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </section>

      <NewsletterInline tags={["source:resource", "resource:openclaw-outbound"]} />
      <Footer />
    </>
  );
}
