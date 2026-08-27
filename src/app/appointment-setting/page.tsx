import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  MessagesSquare,
  Radar,
  ShieldCheck,
  Target,
} from "lucide-react";
import { AcquisitionPageView, TrackedBookingLink } from "@/components/acquisition-tracking";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "B2B Appointment Setting | Pay Per Qualified Meeting Held | Muditek",
  description:
    "Fund the outbound operation, then pay the meeting fee after a qualified prospect attends. Muditek runs targeting, outreach, replies, screening, and booking.",
  alternates: { canonical: "https://muditek.com/appointment-setting" },
  openGraph: {
    title: "B2B Appointment Setting | Muditek",
    description: "A fixed operating fee and a meeting fee paid after a qualified prospect attends.",
    url: "https://muditek.com/appointment-setting",
    type: "website",
  },
};

const FIT_GATES = [
  ["Sales-led B2B", "A sales conversation is required before a customer buys."],
  ["$10K+ first-year client revenue", "One new client produces at least $10,000 during year one."],
  ["Enough reachable buyers", "The standard market has at least 15,000 reachable contacts. M&A uses a separate lane-capacity test."],
  ["A closer with capacity", "Your team owns discovery, proposals, and closing."],
] as const;

const PROCESS = [
  ["01", "Set the rules", "Agree on the market, buyer roles, exclusions, and billable-meeting definition."],
  ["02", "Build the operation", "Set up domains, inboxes, data, verification, messages, and reporting."],
  ["03", "Contact in priority order", "Rank accounts with market-specific public evidence, then launch approved messages."],
  ["04", "Handle and qualify replies", "Run follow-up, screen interest against the written rules, and book the meeting."],
  ["05", "Bill after attendance", "Apply the meeting fee only after a qualified prospect attends."],
] as const;

const MARKET_LANES = [
  {
    market: "M&A",
    buyer: "Business brokers, M&A advisors, search funds, and small PE firms.",
    evidence:
      "Owner tenure, company age, succession signals, leadership changes, and public comments about retirement, valuation, or the future of the business.",
    billable:
      "Both sides define the required owner confirmation and time horizon before launch. The meeting bills only when the owner confirms both and attends.",
  },
  {
    market: "Healthcare staffing",
    buyer: "Agencies building direct relationships with hospitals, care facilities, and clinics.",
    evidence:
      "Live roles in the agency's specialty and geography, repeated hiring activity, and relevant facility or specialty expansion.",
    billable:
      "The attendee matches the approved facility, geography, specialty, and hiring role, has a live role the desk covers, and attends for at least 15 minutes.",
  },
  {
    market: "Freight and logistics",
    buyer: "Freight brokers and 3PLs with defined modes, lanes, geographies, and capacity.",
    evidence:
      "New facilities, new lanes, logistics hiring, and public evidence that a shipper is expanding or reviewing freight operations.",
    billable:
      "The attendee is a decision-maker at a shipper with freight in a lane the broker serves, attends for at least 15 minutes, and is not an existing account.",
  },
] as const;

const BILLABLE_RULES = [
  "Approved company, geography, and buyer role",
  "Relevance confirmed before booking or during the meeting",
  "At least 15 minutes attended",
  "No customer, active opportunity, vendor, or recent duplicate",
] as const;

export default function AppointmentSettingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/25">
      <AcquisitionPageView asset="appointment-setting" />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "B2B Appointment Setting",
            serviceType: "Done-for-you B2B outbound and appointment setting",
            provider: { "@id": "https://muditek.com/#organization" },
            url: "https://muditek.com/appointment-setting",
            areaServed: "Worldwide",
            audience: { "@type": "BusinessAudience", audienceType: "Sales-led B2B companies" },
            offers: [
              { "@type": "Offer", name: "Monthly infrastructure", lowPrice: "500", highPrice: "900", priceCurrency: "EUR" },
              { "@type": "Offer", name: "Qualified meeting held", lowPrice: "250", highPrice: "350", priceCurrency: "EUR" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
              { "@type": "ListItem", position: 2, name: "Appointment Setting", item: "https://muditek.com/appointment-setting" },
            ],
          },
        ]}
      />
      <Navbar />

      <main id="main-content">
        <section className="relative flex min-h-[680px] items-center overflow-hidden border-b border-white/[0.06] px-6 pb-16 pt-32 md:px-12 md:pt-36">
          <div className="hero-aurora absolute inset-0 opacity-70" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
          <div className="relative z-10 mx-auto grid w-full max-w-[1450px] gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <ScrollReveal>
                <p className="mb-6 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm">
                  <span className="h-px w-10 bg-primary/60" />
                  B2B appointment setting
                </p>
                <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-[76px]">
                  Pay for the operation. Pay meeting fees <span className="font-medium italic text-primary">after attendance.</span>
                </h1>
                <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/75 md:text-xl">
                  Muditek builds the list, runs the outreach, handles replies, screens interest, and books the meeting. The variable fee applies after a prospect matches the written rules and attends.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <TrackedBookingLink
                    asset="appointment-setting"
                    placement="hero"
                    className="btn-press inline-flex min-h-14 items-center justify-center gap-3 bg-primary px-8 text-sm font-black uppercase tracking-[0.12em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Check your market <ArrowRight className="h-4 w-4" />
                  </TrackedBookingLink>
                  <Link
                    href="/tools/appointment-setting-quote-calculator"
                    className="btn-press inline-flex min-h-14 items-center justify-center gap-3 border border-white/[0.18] px-8 text-sm font-black uppercase tracking-[0.12em] text-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Model the quote <CircleDollarSign className="h-4 w-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={180}>
              <aside className="border border-white/[0.12] bg-card/75 p-6 md:p-8" aria-label="Appointment-setting pricing">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">Commercial model</p>
                <div className="mt-5 divide-y divide-white/[0.1] border-y border-white/[0.1]">
                  <div className="py-5">
                    <p className="font-mono text-2xl font-black text-primary">€500–900 / month</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/68">Domains, inboxes, software, data, verification, and outbound operations.</p>
                  </div>
                  <div className="py-5">
                    <p className="font-mono text-2xl font-black text-primary">€250–350 / held meeting</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/68">Net 7 after attendance. No-shows and meetings outside the written rules do not bill.</p>
                  </div>
                  <div className="py-5">
                    <p className="font-mono text-xl font-black text-primary">M&amp;A: $900 / month + $500 / held meeting</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/68">M&amp;A uses a separate USD contract and lane-capacity model.</p>
                  </div>
                </div>
                <Link href="/appointment-setting-pricing" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-foreground underline decoration-primary/60 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  Compare provider pricing <ArrowRight className="h-4 w-4" />
                </Link>
              </aside>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-white/[0.07] px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <ScrollReveal>
              <div className="lg:sticky lg:top-28">
                <h2 className="max-w-xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-5xl">Check the economics before the campaign.</h2>
                <p className="mt-5 max-w-xl leading-relaxed text-foreground/70">Expected meeting value equals first-year client revenue multiplied by your close rate. A meeting fee above 20% of that value is usually a poor fit.</p>
                <Link href="/tools/appointment-setting-quote-calculator" className="mt-7 inline-flex min-h-12 items-center gap-2 bg-primary px-6 text-xs font-black uppercase tracking-[0.12em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
                  Check the economics <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <ul className="border-t border-white/[0.12]">
                {FIT_GATES.map(([title, body]) => (
                  <li key={title} className="grid gap-3 border-b border-white/[0.12] py-6 sm:grid-cols-[220px_1fr] sm:gap-8">
                    <div className="flex items-start gap-3 font-black text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {title}
                    </div>
                    <p className="leading-relaxed text-foreground/68">{body}</p>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-white/[0.07] bg-card/[0.24] px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
                <h2 className="max-w-3xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-5xl">The same path. Different evidence by market.</h2>
                <p className="max-w-2xl leading-relaxed text-foreground/70 lg:justify-self-end">Public signals decide who goes first. Replies establish whether the timing is real. Open a market below to see the evidence and billing rule.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="mt-10 border-y border-white/[0.12]">
                {MARKET_LANES.map((lane) => (
                  <details key={lane.market} className="group border-b border-white/[0.1] last:border-b-0">
                    <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                      <span>
                        <span className="block text-2xl font-black tracking-[-0.025em] text-primary">{lane.market}</span>
                        <span className="mt-1 block max-w-3xl text-sm leading-relaxed text-foreground/66">{lane.buyer}</span>
                      </span>
                      <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-foreground/65 group-open:hidden">Open</span>
                      <span className="hidden font-mono text-xs font-bold uppercase tracking-[0.12em] text-primary group-open:block">Close</span>
                    </summary>
                    <div className="grid gap-6 pb-7 md:grid-cols-2">
                      <div>
                        <p className="flex items-center gap-2 font-bold text-foreground"><Radar className="h-4 w-4 text-primary" /> Evidence used to rank accounts</p>
                        <p className="mt-3 leading-relaxed text-foreground/68">{lane.evidence}</p>
                      </div>
                      <div>
                        <p className="flex items-center gap-2 font-bold text-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> Meeting bills when</p>
                        <p className="mt-3 leading-relaxed text-foreground/68">{lane.billable}</p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="qualify" className="scroll-mt-24 border-b border-white/[0.07] px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
                <div>
                  <h2 className="max-w-xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-5xl">Define the invoice before outreach starts.</h2>
                  <p className="mt-5 max-w-xl leading-relaxed text-foreground/70">The qualification appendix records the market, buyer roles, exclusions, evidence, and attendance rule. Every meeting is judged against the same document.</p>
                </div>
                <ul className="grid gap-x-8 sm:grid-cols-2">
                  {BILLABLE_RULES.map((rule) => (
                    <li key={rule} className="flex gap-3 border-t border-white/[0.12] py-5 text-sm leading-relaxed text-foreground/74">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-white/[0.07] bg-card/[0.24] px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <h2 className="max-w-4xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-5xl">One operator owns the route to a held meeting.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <ol className="mt-10 border-y border-white/[0.12]">
                {PROCESS.map(([number, title, body]) => (
                  <li key={number} className="grid gap-3 border-b border-white/[0.1] py-5 last:border-b-0 sm:grid-cols-[48px_220px_1fr] sm:items-baseline sm:gap-6">
                    <span className="font-mono text-sm font-black text-primary">{number}</span>
                    <h3 className="text-lg font-black">{title}</h3>
                    <p className="text-sm leading-relaxed text-foreground/68">{body}</p>
                  </li>
                ))}
              </ol>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="mt-10 grid border-y border-white/[0.12] lg:grid-cols-2 lg:divide-x lg:divide-white/[0.12]">
                <article className="py-7 lg:pr-10">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 text-xl font-black">Muditek owns acquisition</h3>
                  <p className="mt-3 leading-relaxed text-foreground/68">Targeting, list building, infrastructure, messages, reply handling, screening, booking, and weekly reporting.</p>
                </article>
                <article className="border-t border-white/[0.12] py-7 lg:border-t-0 lg:pl-10">
                  <MessagesSquare className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 text-xl font-black">Your team owns sales</h3>
                  <p className="mt-3 leading-relaxed text-foreground/68">Approve the market and messages, provide exclusions, attend meetings, run discovery, send proposals, and close.</p>
                </article>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="fit-review" className="scroll-mt-24 px-6 py-16 md:px-12 md:py-24">
          <ScrollReveal>
            <div className="mx-auto grid max-w-[1150px] gap-8 bg-primary p-8 text-background md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="max-w-3xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-5xl">Bring the market and the numbers. Get a clear answer.</h2>
                <p className="mt-5 max-w-2xl leading-relaxed text-background/78">We will check market size, buyer access, first-year client value, closing capacity, and the rules that would make a meeting billable.</p>
              </div>
              <div className="flex flex-col gap-3">
                <TrackedBookingLink
                  asset="appointment-setting"
                  placement="bottom-cta"
                  className="btn-press inline-flex min-h-14 items-center justify-center gap-3 bg-background px-7 text-sm font-black uppercase tracking-[0.12em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  Check my market <ArrowRight className="h-4 w-4" />
                </TrackedBookingLink>
                <Link href="/appointment-setting-pricing" className="inline-flex min-h-12 items-center justify-center gap-2 border border-background/35 px-6 text-xs font-black uppercase tracking-[0.12em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background">
                  Compare provider pricing
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
