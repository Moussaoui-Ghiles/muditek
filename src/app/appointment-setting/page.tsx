import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, CircleDollarSign, Database, MessagesSquare, Radar, ShieldCheck, Target } from "lucide-react";
import { AcquisitionPageView, TrackedBookingLink } from "@/components/acquisition-tracking";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "B2B Appointment Setting | Pay Per Qualified Meeting Held | Muditek",
  description: "Fund the outbound infrastructure, then pay the meeting fee only after a qualified prospect attends. Muditek runs targeting, outreach, replies, screening, and booking.",
  alternates: { canonical: "https://muditek.com/appointment-setting" },
  openGraph: {
    title: "B2B Appointment Setting | Muditek",
    description: "A fixed infrastructure fee and a meeting fee paid only after a qualified prospect attends.",
    url: "https://muditek.com/appointment-setting",
    type: "website",
  },
};

const STANDARD_GATES = [
  ["B2B and sales-led", "You sell through sales conversations, not a self-serve checkout."],
  ["$10K+ first-year client revenue", "One new client must produce at least $10,000 in revenue during year one."],
  ["15,000+ reachable contacts", "The standard B2B market must be large enough to test without exhausting it. M&A uses a separate lane-capacity test."],
  ["A closer with calendar capacity", "Someone on your team owns discovery, proposals, and closing."],
];

const PROCESS = [
  ["01", "Write the rules", "Agree on the market, exclusions, buyer roles, and billable-meeting definition."],
  ["02", "Start in the first week", "Set up domains, inboxes, software, data, enrichment, verification, and reporting. Delivery work begins within the first week."],
  ["03", "Rank by evidence", "Prioritize companies using market-specific public signals. Replies confirm whether the timing is real."],
  ["04", "Run the conversations", "Launch approved messages, handle replies, and screen interested prospects against the written rules."],
  ["05", "Bill after attendance", "The meeting fee applies only after a qualified prospect attends. No-shows do not bill."],
];

const SIGNAL_EXAMPLES = [
  {
    market: "M&A",
    buyer: "Business brokers, M&A advisors, search funds, and small PE firms",
    signals: "Long owner tenure, an older company, no visible successor, a first operations hire, or public comments about slowing down, succession, retirement, valuation, or the future of the business.",
    note: "Every signal carries source evidence. The owner's reply confirms whether a transaction is worth discussing.",
  },
  {
    market: "Healthcare staffing",
    buyer: "Staffing agencies building direct relationships with hospitals, care facilities, and clinics",
    signals: "Live roles in the agency's specialty and geography, repeated hiring activity, and relevant facility or specialty expansion.",
    note: "The facility's reply confirms whether outside staffing support is relevant. Written exclusions remove MSP-only and existing accounts.",
  },
  {
    market: "Freight and logistics",
    buyer: "Freight brokers and 3PLs looking for shipper conversations",
    signals: "New facilities, new lanes, logistics hiring, and public evidence that a shipper is reviewing or expanding freight operations.",
    note: "Each signal needs a source, an observed date when available, and a clear match to the broker's modes, lanes, and geography.",
  },
];

const BILLABLE_RULES = [
  "Approved company, geography, and buyer role",
  "Confirmed relevance before booking or during the meeting",
  "At least 15 minutes attended",
  "No customer, active opportunity, vendor, or recent duplicate",
];

const MARKET_RULES = [
  {
    market: "Healthcare staffing",
    fit: "For agencies building direct facility relationships. Agencies constrained by candidates inside locked MSP or VMS accounts need a different service.",
    billable: "The attendee matches the approved facility type, geography, specialty, and hiring role, has a live role the desk covers, attends for 15+ minutes, and is not an existing relationship.",
  },
  {
    market: "Freight and logistics",
    fit: "For brokers with defined modes, lanes, geographies, and capacity to serve a new shipper.",
    billable: "The attendee is a decision-maker at a shipper with real freight in a lane the broker serves, attends for 15+ minutes, and is not an existing account.",
  },
  {
    market: "M&A",
    fit: "M&A uses a separate lane-capacity test. The current delivery model starts with a defined 1,000–5,000-company universe and scores roughly 300–800 companies. The general 15,000-contact gate does not apply.",
    billable: "Before launch, both sides agree on the owner confirmation and time horizon required for billing. The meeting does not bill unless the owner confirms both.",
  },
];

export default function AppointmentSettingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/25">
      <AcquisitionPageView asset="appointment-setting" />
      <JsonLd data={[
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
      ]} />
      <Navbar />

      <main id="main-content">
        <section className="relative flex min-h-[720px] items-center overflow-hidden border-b border-white/[0.06] px-6 pb-16 pt-32 md:px-12 md:pt-36">
          <div className="hero-aurora absolute inset-0 opacity-70" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
          <div className="relative z-10 mx-auto grid w-full max-w-[1450px] gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <ScrollReveal>
                <div className="mb-6 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
                  <span className="h-px w-10 bg-primary/60" />
                  Risk-aligned B2B appointment setting
                </div>
                <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-[76px]">
                  Fund the outbound operation. Pay meeting fees <span className="font-medium italic text-primary">after delivery.</span>
                </h1>
                <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/75 md:text-xl">
                  The fixed monthly fee funds the operating stack. Meeting fees are billed only when a prospect matches your written rules and attends.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <TrackedBookingLink asset="appointment-setting" placement="hero" className="btn-press inline-flex min-h-14 items-center justify-center gap-3 bg-primary px-8 text-sm font-black uppercase tracking-[0.14em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                    Check if your market qualifies <ArrowRight className="h-4 w-4" />
                  </TrackedBookingLink>
                  <Link href="/tools/appointment-setting-quote-calculator" className="btn-press inline-flex min-h-14 items-center justify-center gap-3 border border-white/[0.18] px-8 text-sm font-black uppercase tracking-[0.14em] text-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    Model the quote <CircleDollarSign className="h-4 w-4" />
                  </Link>
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/65">Upfront: €500–900/month for the operation. After delivery: €250–350 per qualified meeting held.</p>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={180}>
              <aside className="border border-white/[0.12] bg-card/75 p-6 md:p-8" aria-label="Appointment-setting pricing">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-primary">Standard and M&amp;A pricing</p>
                <div className="mt-5 divide-y divide-white/[0.1] border-y border-white/[0.1]">
                  <div className="py-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="font-bold text-foreground">Infrastructure</p>
                      <p className="font-mono text-2xl font-black text-primary">€500–900 / month</p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/58">Paid upfront. Funds domains, inboxes, software, data, enrichment, verification, and outbound operations.</p>
                  </div>
                  <div className="py-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="font-bold text-foreground">Qualified meeting held</p>
                      <p className="font-mono text-2xl font-black text-primary">€250–350 / meeting</p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/58">Billed Net 7 after the meeting. No-shows and meetings outside the written rules are not billed.</p>
                  </div>
                  <div className="py-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="font-bold text-foreground">M&amp;A model</p>
                      <p className="font-mono text-xl font-black text-primary">$900 / month + $500 / held meeting</p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/65">Maximum fixed monthly exposure: $900. The $500 fee applies after a qualified owner meeting is held.</p>
                  </div>
                </div>
              </aside>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-white/[0.07] px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                <h2 className="max-w-3xl text-balance text-4xl font-black leading-[0.96] tracking-[-0.035em] md:text-6xl">The monthly fee funds the work. The meeting fee follows a held, qualified conversation.</h2>
                <p className="max-w-2xl text-pretty text-lg leading-relaxed text-foreground/70 lg:justify-self-end">The fixed fee pays for domains, inboxes, data, verification, software, and outbound operations. The variable fee is tied to the result both sides define before outreach begins.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="mt-12 grid border-y border-white/[0.12] lg:grid-cols-2 lg:divide-x lg:divide-white/[0.12]">
                <article className="py-8 lg:pr-10">
                  <Database className="h-6 w-6 text-primary" />
                  <h3 className="mt-6 text-2xl font-black tracking-[-0.025em]">Paid upfront</h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-foreground/68">The operating stack and the work required to run it.</p>
                </article>
                <article className="border-t border-white/[0.12] py-8 lg:border-t-0 lg:pl-10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <h3 className="mt-6 text-2xl font-black tracking-[-0.025em]">Paid after attendance</h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-foreground/68">A prospect who matches the written rules and attends. Bookings, no-shows, and out-of-scope meetings do not bill.</p>
                </article>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="mt-8 grid gap-8 bg-primary px-6 py-7 text-background md:px-9 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <h3 className="text-2xl font-black tracking-[-0.025em]">Your numbers decide whether the model works.</h3>
                  <p className="mt-2 max-w-3xl leading-relaxed text-background/75">Expected meeting value equals first-year client revenue multiplied by your close rate. The meeting fee must stay at or below 15–20% of that value.</p>
                </div>
                <Link href="/tools/appointment-setting-quote-calculator" className="inline-flex min-h-12 items-center justify-center gap-2 border border-background/35 bg-background px-6 text-xs font-black uppercase tracking-[0.14em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
                  Model the quote <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-white/[0.07] bg-card/[0.24] px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <h2 className="max-w-4xl text-balance text-4xl font-black leading-[0.96] tracking-[-0.035em] md:text-6xl">Fit finds the market. Public evidence decides who goes first.</h2>
              <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-foreground/70">Every signal needs a source, a date when available, and a reason it matters to that market. Signals rank accounts. Replies confirm interest.</p>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="mt-12 divide-y divide-white/[0.12] border-y border-white/[0.12]">
                {SIGNAL_EXAMPLES.map((example) => (
                  <article key={example.market} className="grid gap-5 py-8 lg:grid-cols-[0.7fr_1.15fr_1.65fr] lg:gap-10">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-black tracking-[-0.025em] text-primary">{example.market}</h3>
                      <Radar className="h-5 w-5 shrink-0 text-primary lg:hidden" />
                    </div>
                    <p className="font-semibold leading-relaxed text-foreground/80">{example.buyer}</p>
                    <div className="space-y-3">
                      <p className="leading-relaxed text-foreground/68">{example.signals}</p>
                      <p className="text-sm leading-relaxed text-foreground/60">{example.note}</p>
                    </div>
                  </article>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <ol className="mt-8 grid border border-white/[0.12] sm:grid-cols-3 lg:grid-cols-6" aria-label="Path from market fit to a held meeting">
                {["Firmographic fit", "Public signal", "Verified contact", "Reply", "Written qualification", "Held meeting"].map((step, index) => (
                  <li key={step} className="flex min-h-20 items-center gap-3 border-b border-white/[0.1] px-4 py-4 text-sm font-bold text-foreground/75 last:border-b-0 sm:border-r lg:border-b-0">
                    <span className="font-mono text-xs text-primary">{index + 1}</span>{step}
                  </li>
                ))}
              </ol>
            </ScrollReveal>
          </div>
        </section>

        <section id="qualify" className="scroll-mt-24 border-b border-white/[0.07] px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                <h2 className="max-w-3xl text-balance text-4xl font-black leading-[0.96] tracking-[-0.035em] md:text-6xl">Define the invoice before outreach starts.</h2>
                <p className="max-w-2xl text-pretty text-lg leading-relaxed text-foreground/70 lg:justify-self-end">The qualification appendix names the market, buyer roles, evidence, exclusions, and attendance rule. Every invoice is judged against it.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={60}>
              <ul className="mt-10 grid border-y border-white/[0.12] sm:grid-cols-2 lg:grid-cols-4">
                {BILLABLE_RULES.map((rule) => (
                  <li key={rule} className="flex gap-3 border-b border-white/[0.1] px-4 py-5 text-sm leading-relaxed text-foreground/72 last:border-b-0 sm:border-r lg:border-b-0">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {rule}
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="mt-12 divide-y divide-white/[0.12] border-y border-white/[0.12]">
                {MARKET_RULES.map((rule) => (
                  <article key={rule.market} className="grid gap-5 py-8 lg:grid-cols-[0.55fr_1fr_1.45fr] lg:gap-10">
                    <h3 className="text-2xl font-black tracking-[-0.025em] text-primary">{rule.market}</h3>
                    <p className="leading-relaxed text-foreground/70">{rule.fit}</p>
                    <p className="leading-relaxed text-foreground/70"><strong className="text-foreground">Meeting bills when: </strong>{rule.billable}</p>
                  </article>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={140}>
              <div className="mt-14 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
                <div>
                  <h3 className="text-balance text-3xl font-black tracking-[-0.03em] md:text-4xl">Before you buy, four conditions have to be true.</h3>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/62">For freight, first-year client revenue means brokerage revenue from one new shipper account, not the shipper&apos;s freight spend.</p>
                </div>
                <ul className="grid gap-x-8 md:grid-cols-2">
                  {STANDARD_GATES.map(([title, body]) => (
                    <li key={title} className="flex gap-4 border-t border-white/[0.12] py-5">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <h4 className="font-black">{title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/65">{body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-white/[0.07] bg-card/[0.24] px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <h2 className="max-w-5xl text-balance text-4xl font-black leading-[0.96] tracking-[-0.035em] md:text-6xl">One operator owns the path from market definition to held meeting.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <ol className="mt-12 grid border-y border-white/[0.12] md:grid-cols-2 lg:grid-cols-5">
                {PROCESS.map(([number, title, body]) => (
                  <li key={number} className="min-h-60 border-b border-white/[0.1] p-6 last:border-b-0 md:border-r lg:border-b-0">
                    <span className="font-mono text-sm font-black text-primary">{number}</span>
                    <h3 className="mt-8 text-xl font-black">{title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-foreground/65">{body}</p>
                  </li>
                ))}
              </ol>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-white/[0.07] px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <h2 className="max-w-4xl text-balance text-4xl font-black leading-[0.96] tracking-[-0.035em] md:text-5xl">Muditek runs acquisition. Your team runs sales.</h2>
              <div className="mt-10 grid border-y border-white/[0.12] lg:grid-cols-2 lg:divide-x lg:divide-white/[0.12]">
                <article className="py-8 lg:pr-10">
                  <Target className="h-6 w-6 text-primary" />
                  <h3 className="mt-6 text-2xl font-black">Muditek</h3>
                  <p className="mt-3 leading-relaxed text-foreground/68">Targeting, list building, infrastructure, messages, reply handling, screening, booking, and weekly reporting.</p>
                </article>
                <article className="border-t border-white/[0.12] py-8 lg:border-t-0 lg:pl-10">
                  <MessagesSquare className="h-6 w-6 text-primary" />
                  <h3 className="mt-6 text-2xl font-black">Your sales team</h3>
                  <p className="mt-3 leading-relaxed text-foreground/68">Approve the market and messages, provide exclusions, keep the calendar open, attend meetings, run discovery, send proposals, and close.</p>
                </article>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="fit-review" className="scroll-mt-24 px-6 py-20 md:px-12 md:py-28">
          <ScrollReveal>
            <div className="mx-auto grid max-w-[1150px] gap-10 bg-primary p-8 text-background md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="max-w-3xl text-balance text-4xl font-black leading-[0.96] tracking-[-0.035em] md:text-5xl">Bring your lane and the numbers. Get a yes or no.</h2>
                <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-background/75">M&amp;A buyers bring the acquisition lane. Healthcare staffing firms bring specialties, states, facility types, and the direct-versus-MSP model. Freight brokers bring modes, lanes, geographies, and the shipper profile.</p>
              </div>
              <div className="flex flex-col gap-3">
                <TrackedBookingLink asset="appointment-setting" placement="bottom-cta" className="btn-press inline-flex min-h-14 items-center justify-center gap-3 bg-background px-7 text-sm font-black uppercase tracking-[0.14em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
                  Check my lane <ArrowRight className="h-4 w-4" />
                </TrackedBookingLink>
                <Link href="/appointment-setting-pricing" className="inline-flex min-h-12 items-center justify-center gap-2 border border-background/35 px-6 text-xs font-black uppercase tracking-[0.14em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background">
                  Compare provider models
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
