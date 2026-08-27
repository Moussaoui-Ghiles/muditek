import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  FileCheck2,
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
    "Fund the outbound operation, then pay the delivery fee after an agreed-fit buyer attends. No-shows and meetings outside the written rules do not earn a delivery fee.",
  alternates: { canonical: "https://muditek.com/appointment-setting" },
  openGraph: {
    title: "B2B Appointment Setting | Muditek",
    description: "A fixed operating fee and a delivery fee paid after an agreed-fit buyer attends.",
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
  ["05", "Bill after attendance", "Apply the delivery fee only after an agreed-fit prospect attends."],
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

const PROCESS_TEMPLATES = [
  {
    title: "Qualification appendix",
    description: "Written buyer roles, exclusions, qualifying evidence, attendance rule, and dispute window.",
    sample: "Billable: approved role + agreed need + 15 minutes attended",
  },
  {
    title: "Target brief",
    description: "Approved market, account profile, geographies, reachable buyer roles, and suppression list.",
    sample: "Include: ICP A / Exclude: customers, open opportunities, recent contacts",
  },
  {
    title: "Deliverability checklist",
    description: "Domain, inbox, authentication, ramp, verification, and send-limit checks before launch.",
    sample: "SPF · DKIM · DMARC · inbox health · list verification",
  },
  {
    title: "Weekly report",
    description: "Prospects contacted, reply state, qualified conversations, bookings, attendance, and next actions.",
    sample: "Contacted → positive replies → qualified → booked → held",
  },
] as const;

export default function AppointmentSettingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/25">
      <AcquisitionPageView asset="appointment-setting" event="commercial_offer_viewed" placement="service-page" />
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
        <section className="border-b border-white/[0.07] px-6 pb-16 pt-32 md:px-12 md:pb-20 md:pt-40">
          <div className="mx-auto grid max-w-[1450px] gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <ScrollReveal>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm">B2B appointment setting</p>
              <h1 className="mt-6 max-w-5xl text-balance text-5xl font-black leading-[0.94] tracking-[-0.04em] sm:text-6xl lg:text-[72px]">
                Qualified B2B meetings. Pay the delivery fee after an agreed-fit buyer attends.
              </h1>
              <p className="mt-7 max-w-3xl text-pretty text-lg leading-relaxed text-foreground/75 md:text-xl">
                Muditek runs targeting, list building, infrastructure, messaging, outreach, replies, qualification, booking, and attendance follow-up. You pay the operating stack upfront. No-shows and meetings outside the written rules earn no delivery fee.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <TrackedBookingLink asset="appointment-setting" placement="hero" className="btn-press inline-flex min-h-14 items-center justify-center gap-3 bg-primary px-7 text-center text-sm font-black uppercase tracking-[0.1em] text-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                  Book a 30-minute fit review <ArrowRight className="h-4 w-4" />
                </TrackedBookingLink>
                <Link href="/tools/appointment-setting-quote-calculator" className="btn-press inline-flex min-h-14 items-center justify-center gap-3 border border-white/[0.18] px-7 text-sm font-black uppercase tracking-[0.1em] text-foreground/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary">
                  Model the quote <CircleDollarSign className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <aside className="border border-white/[0.12] bg-card/55 p-6 md:p-8" aria-label="How commercial risk is split">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">Outcome and risk split</p>
                <dl className="mt-5 divide-y divide-white/[0.1] border-y border-white/[0.1]">
                  <div className="py-5"><dt className="font-black text-foreground">You fund the operation</dt><dd className="mt-2 text-sm leading-relaxed text-foreground/68">Domains, inboxes, software, data, verification, and outbound operations are paid upfront.</dd></div>
                  <div className="py-5"><dt className="font-black text-foreground">Muditek earns the delivery fee after attendance</dt><dd className="mt-2 text-sm leading-relaxed text-foreground/68">The buyer must match the written rules and attend. A no-show or an out-of-scope meeting does not earn the fee.</dd></div>
                  <div className="py-5"><dt className="font-black text-foreground">Your team owns the sale</dt><dd className="mt-2 text-sm leading-relaxed text-foreground/68">Your closer runs discovery, proposals, negotiation, and closing.</dd></div>
                </dl>
              </aside>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-white/[0.07] bg-card/[0.22] px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <div className="grid gap-6 lg:grid-cols-2">
                <article className="border border-white/[0.12] bg-background/55 p-6 md:p-8">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">Standard B2B · EUR</p>
                  <h2 className="mt-4 text-3xl font-black tracking-[-0.03em]">€500–900 per month</h2>
                  <p className="mt-2 text-2xl font-black text-primary">+ €250–350 per qualified meeting held</p>
                  <p className="mt-5 text-sm leading-relaxed text-foreground/68">The monthly amount covers the operating stack. Meeting fees are net 7 after attendance.</p>
                </article>
                <article className="border border-white/[0.12] bg-background/55 p-6 md:p-8">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">M&amp;A lane · USD</p>
                  <h2 className="mt-4 text-3xl font-black tracking-[-0.03em]">$900 per month</h2>
                  <p className="mt-2 text-2xl font-black text-primary">+ $500 per qualified meeting held</p>
                  <p className="mt-5 text-sm leading-relaxed text-foreground/68">M&amp;A uses a separate USD contract and lane-capacity test. Owner confirmation and timing are defined before launch.</p>
                </article>
              </div>
              <div className="mt-5 flex flex-col items-start justify-between gap-4 border-t border-white/[0.1] pt-5 sm:flex-row sm:items-center">
                <p className="max-w-3xl text-sm leading-relaxed text-foreground/68">No-shows and meetings outside the written qualification rules earn no delivery fee.</p>
                <Link href="/appointment-setting-pricing" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-foreground underline decoration-primary/60 underline-offset-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary">Compare provider pricing <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <nav aria-label="Appointment-setting page sections" className="min-w-0 overflow-hidden border-b border-white/[0.07] px-6 py-4 md:px-12">
          <div className="mx-auto flex w-full min-w-0 max-w-[1300px] gap-2 overflow-x-auto pb-1">
            {[
              ["Eligibility", "#eligibility"],
              ["Delivery", "#delivery"],
              ["Process evidence", "#process-evidence"],
              ["Fit review", "#fit-review"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="inline-flex min-h-11 shrink-0 items-center border border-white/[0.12] px-4 text-xs font-black uppercase tracking-[0.1em] text-foreground/72 hover:border-primary/55 hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary">
                {label}
              </a>
            ))}
          </div>
        </nav>

        <section id="eligibility" className="scroll-mt-24 border-b border-white/[0.07] px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto grid max-w-[1300px] gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <ScrollReveal>
              <div className="lg:sticky lg:top-28">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">General eligibility</p>
                <h2 className="mt-4 max-w-xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-5xl">Check the market and economics first.</h2>
                <p className="mt-5 max-w-xl leading-relaxed text-foreground/70">These gates apply across eligible sales-led B2B markets. The worked examples below show how qualification changes by market; they are not the only markets accepted.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <ul className="border-t border-white/[0.12]">
                {FIT_GATES.map(([title, body]) => (
                  <li key={title} className="grid gap-3 border-b border-white/[0.12] py-5 sm:grid-cols-[220px_1fr] sm:gap-8">
                    <div className="flex items-start gap-3 font-black text-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{title}</div>
                    <p className="leading-relaxed text-foreground/68">{body}</p>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        <section id="delivery" className="scroll-mt-24 border-b border-white/[0.07] bg-card/[0.22] px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">Delivery ownership</p>
              <h2 className="mt-4 max-w-4xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-5xl">One operator owns the route to a held meeting.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <ol className="mt-9 border-y border-white/[0.12]">
                {PROCESS.map(([number, title, body]) => (
                  <li key={number} className="grid gap-3 border-b border-white/[0.1] py-5 last:border-b-0 sm:grid-cols-[48px_220px_1fr] sm:items-baseline sm:gap-6">
                    <span className="font-mono text-sm font-black text-primary">{number}</span><h3 className="text-lg font-black">{title}</h3><p className="text-sm leading-relaxed text-foreground/68">{body}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8 grid border-y border-white/[0.12] lg:grid-cols-2 lg:divide-x lg:divide-white/[0.12]">
                <article className="py-6 lg:pr-10"><Target className="h-5 w-5 text-primary" /><h3 className="mt-4 text-xl font-black">Muditek owns acquisition</h3><p className="mt-3 leading-relaxed text-foreground/68">Targeting, list building, infrastructure, messages, reply handling, screening, booking, attendance follow-up, and weekly reporting.</p></article>
                <article className="border-t border-white/[0.12] py-6 lg:border-t-0 lg:pl-10"><MessagesSquare className="h-5 w-5 text-primary" /><h3 className="mt-4 text-xl font-black">Your team owns sales</h3><p className="mt-3 leading-relaxed text-foreground/68">Approve the market and messages, provide exclusions, attend meetings, run discovery, send proposals, and close.</p></article>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="process-evidence" className="scroll-mt-24 border-b border-white/[0.07] px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
                <div><p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">Inspectable process evidence</p><h2 className="mt-4 max-w-3xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-5xl">Review the operating documents, not invented results.</h2></div>
                <p className="max-w-2xl leading-relaxed text-foreground/70 lg:justify-self-end">These privacy-safe excerpts show the templates used to control delivery. They are not client work, client proof, or performance claims.</p>
              </div>
              <div className="mt-9 grid min-w-0 gap-4 md:grid-cols-2">
                {PROCESS_TEMPLATES.map((item) => (
                  <details key={item.title} className="group min-w-0 max-w-full border border-white/[0.12] bg-card/30 px-6">
                    <summary className="flex min-h-16 min-w-0 cursor-pointer list-none items-center justify-between gap-4 py-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                      <span className="flex min-w-0 items-center gap-3"><FileCheck2 className="h-5 w-5 shrink-0 text-primary" /><span className="min-w-0 break-words text-lg font-black">{item.title}</span></span>
                      <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-primary group-open:hidden">Review</span><span className="hidden font-mono text-xs font-bold uppercase tracking-[0.12em] text-primary group-open:block">Close</span>
                    </summary>
                    <div className="border-t border-white/[0.1] pb-6 pt-4">
                      <p className="text-sm leading-relaxed text-foreground/68">{item.description}</p>
                      <p className="mt-4 border-l-2 border-primary/45 pl-4 font-mono text-xs leading-relaxed text-foreground/75">{item.sample}</p>
                    </div>
                  </details>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="mt-12">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">Worked qualification examples</p>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/68">M&amp;A, healthcare staffing, and freight show how public evidence and billing rules adapt. Other eligible B2B markets are assessed against the same general gates.</p>
                <div className="mt-5 border-y border-white/[0.12]">
                  {MARKET_LANES.map((lane) => (
                    <details key={lane.market} className="group border-b border-white/[0.1] last:border-b-0">
                      <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 py-5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                        <span><span className="block text-xl font-black tracking-[-0.02em] text-foreground">{lane.market}</span><span className="mt-1 block max-w-3xl text-sm leading-relaxed text-foreground/66">{lane.buyer}</span></span>
                        <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-primary group-open:hidden">Review</span><span className="hidden font-mono text-xs font-bold uppercase tracking-[0.12em] text-primary group-open:block">Close</span>
                      </summary>
                      <div className="grid gap-6 pb-7 md:grid-cols-2">
                        <div><p className="flex items-center gap-2 font-bold text-foreground"><Radar className="h-4 w-4 text-primary" /> Evidence used to rank accounts</p><p className="mt-3 leading-relaxed text-foreground/68">{lane.evidence}</p></div>
                        <div><p className="flex items-center gap-2 font-bold text-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> Meeting bills when</p><p className="mt-3 leading-relaxed text-foreground/68">{lane.billable}</p></div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <details className="group mt-9 border border-white/[0.12] bg-card/20 p-5 md:p-6">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-black focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                  Detailed standard billing rule
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary group-open:hidden">Open</span><span className="hidden font-mono text-xs uppercase tracking-[0.12em] text-primary group-open:block">Close</span>
                </summary>
                <ul className="mt-5 grid gap-x-8 border-t border-white/[0.1] pt-3 sm:grid-cols-2">
                  {BILLABLE_RULES.map((rule) => <li key={rule} className="flex gap-3 border-b border-white/[0.1] py-4 text-sm leading-relaxed text-foreground/74"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{rule}</li>)}
                </ul>
              </details>
            </ScrollReveal>
          </div>
        </section>

        <section id="fit-review" className="scroll-mt-24 px-6 py-16 md:px-12 md:py-24">
          <ScrollReveal>
            <div className="mx-auto grid max-w-[1150px] gap-8 bg-primary p-8 text-background md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
              <div><h2 className="max-w-3xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-5xl">Bring the market and the numbers. Get a clear fit decision.</h2><p className="mt-5 max-w-2xl leading-relaxed text-background/78">We will check market size, buyer access, first-year client value, closing capacity, and the written rules that would make a meeting billable.</p></div>
              <div className="flex flex-col gap-3">
                <TrackedBookingLink asset="appointment-setting" placement="bottom-cta" className="btn-press inline-flex min-h-14 items-center justify-center gap-3 bg-background px-7 text-center text-sm font-black uppercase tracking-[0.1em] text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary">Book a 30-minute fit review <ArrowRight className="h-4 w-4" /></TrackedBookingLink>
                <Link href="/appointment-setting-pricing" className="inline-flex min-h-12 items-center justify-center gap-2 border border-background/35 px-6 text-xs font-black uppercase tracking-[0.1em] text-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-background">Compare provider pricing</Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
