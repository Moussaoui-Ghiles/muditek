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
  ["02", "Fund the infrastructure", "Set up domains, inboxes, software, data, enrichment, verification, and reporting. New infrastructure needs 14–30 days to age before live sending."],
  ["03", "Find evidence of timing", "Prioritize companies using market-specific public signals. A signal raises priority. It does not prove intent."],
  ["04", "Run the conversations", "Launch approved messages, handle replies, and screen interested prospects against the written rules."],
  ["05", "Bill after the meeting", "The meeting fee applies only after a qualified prospect attends. No-shows are not billed as meetings."],
];

const SIGNAL_EXAMPLES = [
  {
    market: "M&A",
    buyer: "Business brokers, M&A advisors, search funds, and small PE firms",
    signals: "Long owner tenure, an older company, no visible successor, a first operations hire, or public comments about slowing down, succession, retirement, valuation, or the future of the business.",
    note: "Each signal carries source evidence. A reply is still the only confirmation that the owner may discuss a transaction.",
  },
  {
    market: "Healthcare staffing",
    buyer: "Staffing agencies building direct relationships with hospitals, care facilities, and clinics",
    signals: "Live roles in the agency's specialty and geography, repeated hiring activity, and relevant facility or specialty expansion.",
    note: "A signal raises priority. A facility reply confirms whether outside staffing support is relevant. MSP-only and existing accounts can be excluded in writing.",
  },
  {
    market: "Freight and logistics",
    buyer: "Freight brokers and 3PLs looking for shipper conversations",
    signals: "New facilities, new lanes, logistics hiring, and public evidence that a shipper is reviewing or expanding freight operations.",
    note: "Each signal needs a source, an observed date when available, and a clear match to the broker's modes, lanes, and geography.",
  },
];

const BILLABLE_RULES = [
  "The attendee matches the company, geography, and buyer-role rules approved before launch.",
  "The prospect confirms relevance to the service category before booking or during the meeting.",
  "The prospect attends for at least 15 minutes.",
  "Existing customers, active opportunities, vendors, and recent duplicate meetings are excluded.",
];

const MARKET_RULES = [
  {
    market: "Healthcare staffing",
    fit: "For agencies building direct facility relationships. It does not solve a candidate shortage inside locked MSP or VMS accounts.",
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
    billable: "Firmographic fit and an exit signal are not enough. The written appendix must state what the owner confirmed about a possible transaction and the time horizon before that meeting can bill.",
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
                <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[76px]">
                  Fund the outbound operation. Pay meeting fees <span className="font-medium italic text-primary">after delivery.</span>
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-foreground/70 md:text-xl">
                  The fixed monthly fee funds named operating costs. It is not prepaid meeting inventory. Muditek bills the variable fee only after a prospect matches your written rules and attends.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <TrackedBookingLink asset="appointment-setting" placement="hero" className="btn-press inline-flex min-h-14 items-center justify-center gap-3 bg-primary px-8 text-sm font-black uppercase tracking-[0.18em] text-background">
                    Check if your market qualifies <ArrowRight className="h-4 w-4" />
                  </TrackedBookingLink>
                  <Link href="/tools/appointment-setting-quote-calculator" className="btn-press inline-flex min-h-14 items-center justify-center gap-3 border border-white/[0.14] px-8 text-sm font-black uppercase tracking-[0.18em] text-foreground/85">
                    Model the quote <CircleDollarSign className="h-4 w-4" />
                  </Link>
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/52">Upfront: €500–900/month for the operation. After delivery: €250–350 per qualified meeting held.</p>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={180}>
              <div className="border border-white/[0.1] bg-card/60 p-6 backdrop-blur-xl md:p-8">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">Standard B2B pricing</p>
                <div className="mt-5 space-y-3">
                  <div className="border border-white/[0.08] bg-background/65 p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="font-bold text-foreground">Infrastructure</p>
                      <p className="font-mono text-2xl font-black text-primary">€500–900 / month</p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/58">Paid upfront. Funds domains, inboxes, software, data, enrichment, verification, and outbound operations.</p>
                  </div>
                  <div className="border border-primary/25 bg-primary/[0.06] p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="font-bold text-foreground">Qualified meeting held</p>
                      <p className="font-mono text-2xl font-black text-primary">€250–350 / meeting</p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/58">Billed Net 7 after the meeting. No-shows and meetings outside the written rules are not billed.</p>
                  </div>
                </div>
                <div className="mt-3 border border-white/[0.08] bg-background/45 p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className="font-bold text-foreground">M&amp;A model</p>
                    <p className="font-mono text-xl font-black text-primary">$900 / month + $500 / held meeting</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/58">The $900 is the maximum fixed monthly exposure. The $500 fee applies only after a qualified owner meeting is held.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-white/[0.06] px-6 py-24 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">The risk split</p>
              <div className="mt-5 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.035em] md:text-6xl">You cover named operating costs. Muditek earns meeting fees after delivery.</h2>
                <p className="max-w-2xl text-lg leading-relaxed text-foreground/60 lg:justify-self-end">The upfront fee pays for the outbound operation, not a promise of meeting volume. The variable fee is tied to a qualified meeting that happened.</p>
              </div>
            </ScrollReveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              <ScrollReveal>
                <article className="h-full border border-white/[0.08] bg-card/30 p-7 md:p-9">
                  <Database className="h-6 w-6 text-primary" />
                  <p className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.18em] text-foreground/40">Paid upfront</p>
                  <h3 className="mt-3 text-2xl font-black tracking-[-0.025em]">Infrastructure that must exist before outreach can run.</h3>
                  <p className="mt-4 leading-relaxed text-foreground/58">Domains, inboxes, software, prospect data, enrichment, verification, suppression, and sending operations.</p>
                </article>
              </ScrollReveal>
              <ScrollReveal delay={80}>
                <article className="h-full border border-primary/25 bg-primary/[0.045] p-7 md:p-9">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <p className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.18em] text-foreground/40">Paid after delivery</p>
                  <h3 className="mt-3 text-2xl font-black tracking-[-0.025em]">A prospect who matches your written rules and attends.</h3>
                  <p className="mt-4 leading-relaxed text-foreground/58">A booking alone is not billable. A no-show is not billable. A meeting outside the approved rules is not billable.</p>
                </article>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={120}>
              <div className="mt-5 border border-white/[0.09] bg-background p-6 md:p-8">
                <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">Pricing rule</p>
                    <h3 className="mt-3 text-2xl font-black tracking-[-0.025em]">If the meeting economics fail, do not launch.</h3>
                    <p className="mt-3 max-w-3xl leading-relaxed text-foreground/58">Expected meeting value equals first-year deal value multiplied by your qualified-call close rate. The meeting fee must stay at or below 15–20% of that value.</p>
                  </div>
                  <Link href="/tools/appointment-setting-quote-calculator" className="inline-flex min-h-12 items-center justify-center gap-2 border border-primary/35 px-6 text-xs font-black uppercase tracking-[0.16em] text-primary hover:bg-primary/10">
                    Check the math <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-white/[0.06] bg-card/[0.18] px-6 py-24 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">Signal-based targeting</p>
              <h2 className="mt-5 max-w-5xl text-4xl font-black leading-[0.95] tracking-[-0.035em] md:text-6xl">Start with evidence that timing may matter.</h2>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/60">Firmographics tell us who fits. Market-specific signals tell us who deserves attention now. A useful signal has source evidence, a date when available, and a clear reason it matters to that market. Signals raise probability. A reply and qualification confirm interest.</p>
            </ScrollReveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {SIGNAL_EXAMPLES.map((example, index) => (
                <ScrollReveal key={example.market} delay={index * 80}>
                  <article className="h-full border border-white/[0.08] bg-background p-7">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-black tracking-[-0.02em]">{example.market}</h3>
                      <Radar className="h-5 w-5 shrink-0 text-primary" />
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-relaxed text-foreground/72">{example.buyer}</p>
                    <p className="mt-6 text-sm leading-relaxed text-foreground/58">{example.signals}</p>
                    <p className="mt-5 border-t border-white/[0.07] pt-5 text-sm leading-relaxed text-foreground/42">{example.note}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={140}>
              <div className="mt-5 grid gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3 lg:grid-cols-6">
                {["Firmographic fit", "Public signal", "Verified contact", "Reply", "Written qualification", "Held meeting"].map((step) => (
                  <div key={step} className="flex min-h-20 items-center bg-background px-4 py-4 text-center text-xs font-black uppercase tracking-[0.12em] text-foreground/65 sm:justify-center">
                    {step}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-white/[0.06] px-6 py-24 md:px-12 md:py-28">
          <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <ScrollReveal>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">The billable unit</p>
              <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.035em] md:text-6xl">A booking is not enough.</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/60">The qualification appendix is written before launch. Invoices are judged against that document.</p>
            </ScrollReveal>
            <div className="space-y-3">
              {BILLABLE_RULES.map((rule, index) => (
                <ScrollReveal key={rule} delay={index * 60}>
                  <div className="flex gap-5 border border-white/[0.08] bg-card/25 p-5 md:p-6">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 font-mono text-xs font-black text-primary">{index + 1}</span>
                    <p className="leading-relaxed text-foreground/66">{rule}</p>
                  </div>
                </ScrollReveal>
              ))}
              <p className="pt-3 text-sm leading-relaxed text-foreground/42">Any market-specific rule, exclusion, dispute window, and acceptance process must be written into the agreement before sending starts.</p>
            </div>
          </div>
        </section>

        <section id="qualify" className="scroll-mt-24 border-b border-white/[0.06] bg-card/[0.18] px-6 py-24 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">Qualification</p>
              <div className="mt-5 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
                <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.035em] md:text-6xl">Three markets. Three billable definitions.</h2>
                <p className="max-w-2xl text-lg leading-relaxed text-foreground/60 lg:justify-self-end">The generic phrase “qualified meeting” is not enough. The market, timing evidence, attendee, and exclusions must be explicit.</p>
              </div>
            </ScrollReveal>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {MARKET_RULES.map((rule, index) => (
                <ScrollReveal key={rule.market} delay={index * 70}>
                  <article className="h-full border border-white/[0.08] bg-background p-6 md:p-8">
                    <h3 className="text-xl font-black tracking-[-0.02em] text-primary">{rule.market}</h3>
                    <p className="mt-5 text-sm font-semibold leading-relaxed text-foreground/70">{rule.fit}</p>
                    <p className="mt-5 border-t border-white/[0.07] pt-5 text-sm leading-relaxed text-foreground/52"><strong className="text-foreground/78">Billable only when:</strong> {rule.billable}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={120}>
              <div className="mt-12">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">Standard B2B gates</p>
                <h3 className="mt-3 text-3xl font-black tracking-[-0.03em]">Do not buy the standard model unless all four pass.</h3>
              </div>
            </ScrollReveal>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {STANDARD_GATES.map(([title, body], index) => (
                <ScrollReveal key={title} delay={index * 70}>
                  <article className="group flex h-full gap-5 border border-white/[0.08] bg-background p-6 transition-colors hover:border-primary/30 md:p-8">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-primary"><Check className="h-4 w-4" /></span>
                    <div>
                      <h3 className="text-lg font-black tracking-[-0.01em]">{title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-foreground/58">{body}</p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-foreground/45">For freight, first-year client revenue means the brokerage&apos;s expected revenue from one new shipper account, not the shipper&apos;s total freight spend.</p>
          </div>
        </section>

        <section className="border-b border-white/[0.06] px-6 py-24 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">Delivery</p>
              <h2 className="mt-5 max-w-5xl text-4xl font-black leading-[0.95] tracking-[-0.035em] md:text-6xl">One accountable operator from market definition to held meeting.</h2>
            </ScrollReveal>
            <div className="mt-12 grid gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] lg:grid-cols-5">
              {PROCESS.map(([number, title, body], index) => (
                <ScrollReveal key={number} delay={index * 70}>
                  <article className="h-full min-h-[310px] bg-background p-7">
                    <span className="font-mono text-4xl font-black text-primary/25">{number}</span>
                    <h3 className="mt-9 text-xl font-black">{title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-foreground/58">{body}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] bg-card/[0.18] px-6 py-24 md:px-12 md:py-28">
          <div className="mx-auto grid max-w-[1300px] gap-10 lg:grid-cols-2">
            <ScrollReveal>
              <article className="h-full border border-white/[0.08] bg-background p-7 md:p-9">
                <Target className="h-6 w-6 text-primary" />
                <h2 className="mt-8 text-3xl font-black tracking-[-0.03em]">Muditek owns the work before the sales call.</h2>
                <p className="mt-5 leading-relaxed text-foreground/60">Targeting, list building, sending infrastructure, campaign messages, reply handling, screening, booking, and weekly reporting.</p>
              </article>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <article className="h-full border border-white/[0.08] bg-background p-7 md:p-9">
                <MessagesSquare className="h-6 w-6 text-primary" />
                <h2 className="mt-8 text-3xl font-black tracking-[-0.03em]">Your team owns the sale after the meeting starts.</h2>
                <p className="mt-5 leading-relaxed text-foreground/60">Approve the market and messages, provide exclusions, keep the calendar open, attend meetings, run discovery, send proposals, and close.</p>
              </article>
            </ScrollReveal>
          </div>
        </section>

        <section id="fit-review" className="scroll-mt-24 px-6 py-24 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1150px] border border-primary/25 bg-primary/[0.05] p-8 md:p-12">
            <ScrollReveal>
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">Fit review</p>
                  <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.035em] md:text-5xl">Bring your lane and the numbers. Leave with a yes or no.</h2>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/60">For M&amp;A, bring the acquisition lane. For healthcare staffing, bring the specialties, states, facility types, and direct-versus-MSP model. For freight, bring the modes, lanes, geographies, and shipper profile.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <TrackedBookingLink asset="appointment-setting" placement="bottom-cta" className="btn-press inline-flex min-h-14 items-center justify-center gap-3 bg-primary px-7 text-sm font-black uppercase tracking-[0.17em] text-background">
                    Check my lane <ArrowRight className="h-4 w-4" />
                  </TrackedBookingLink>
                  <Link href="/appointment-setting-pricing" className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/[0.14] px-6 text-xs font-black uppercase tracking-[0.16em] text-foreground/70">
                    Compare provider models
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
