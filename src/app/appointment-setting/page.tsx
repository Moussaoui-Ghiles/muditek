import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, CircleDollarSign, Filter, Mail, MessagesSquare } from "lucide-react";
import { AcquisitionPageView, TrackedBookingLink } from "@/components/acquisition-tracking";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "B2B Appointment Setting | Pay Per Qualified Meeting Held | Muditek",
  description: "Muditek builds and runs outbound for sales-led B2B companies. Pay a €500-900 monthly infrastructure fee and €250-350 per qualified meeting held.",
  alternates: { canonical: "https://muditek.com/appointment-setting" },
  openGraph: {
    title: "B2B Appointment Setting | Muditek",
    description: "Done-for-you outbound for sales-led B2B companies. Pay for qualified meetings that actually happen.",
    url: "https://muditek.com/appointment-setting",
    type: "website",
  },
};

const GATES = [
  ["B2B and sales-led", "You sell through sales conversations, not a self-serve checkout."],
  ["$10K+ first-year deal value", "One new client must be worth at least $10,000 in year one."],
  ["15,000+ reachable contacts", "The target market must be large enough to test and improve without exhausting it."],
  ["A closer with calendar capacity", "Someone on your team owns discovery, proposals, and closing."],
];

const PROCESS = [
  ["01", "Define the market", "We agree on the ICP, exclusions, buyer roles, and the written definition of a qualified meeting."],
  ["02", "Build the engine", "Muditek sets up dedicated sending infrastructure, verifies decision-makers, and prepares the messages and reply paths."],
  ["03", "Run and improve", "We launch controlled campaign batches, handle replies, and adjust targeting and messages from real response data."],
  ["04", "Qualify and book", "We screen interested prospects against the written rules before they reach your calendar."],
  ["05", "Pay for held meetings", "A no-show is not billable. The variable fee applies only when a qualified meeting happens."],
];

export default function AppointmentSettingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/25">
      <AcquisitionPageView asset="appointment-setting-service" />
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

      <main>
        <section className="relative flex min-h-[850px] items-center overflow-hidden border-b border-white/[0.06] px-6 pb-24 pt-36 md:px-12 md:pt-44">
          <div className="hero-aurora absolute inset-0 opacity-70" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
          <div className="relative z-10 mx-auto grid w-full max-w-[1450px] gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <div>
              <ScrollReveal>
                <div className="mb-8 flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  <span className="h-px w-10 bg-primary/60" />
                  Done-for-you outbound
                </div>
                <h1 className="max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.045em] sm:text-7xl lg:text-[92px]">
                  Qualified sales meetings. <span className="font-medium italic text-primary">You pay when they show.</span>
                </h1>
                <p className="mt-9 max-w-2xl text-lg leading-relaxed text-foreground/68 md:text-xl">
                  Muditek builds and runs the outbound engine for sales-led B2B companies. Your team takes the meetings and closes the deals.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <TrackedBookingLink asset="appointment-setting-service" placement="hero" className="btn-press inline-flex items-center justify-center gap-3 bg-primary px-8 py-5 text-sm font-black uppercase tracking-[0.18em] text-background">
                    Check if you qualify <ArrowRight className="h-4 w-4" />
                  </TrackedBookingLink>
                  <Link href="/tools/appointment-setting-quote-calculator" className="btn-press inline-flex items-center justify-center gap-3 border border-white/[0.12] px-8 py-5 text-sm font-black uppercase tracking-[0.18em] text-foreground/80">
                    Run the quote math <CircleDollarSign className="h-4 w-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={180}>
              <div className="border border-white/[0.09] bg-card/55 p-6 backdrop-blur-xl md:p-8">
                <p className="font-mono text-sm uppercase tracking-[0.18em] text-foreground/45">Commercial structure</p>
                <div className="mt-6 space-y-3">
                  <div className="border border-white/[0.07] bg-background/60 p-5">
                    <p className="text-sm text-foreground/45">Infrastructure</p>
                    <p className="mt-2 font-mono text-3xl font-black text-primary">€500-900<span className="text-base text-foreground/45"> / month</span></p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/55">Invoiced upfront. Non-refundable.</p>
                  </div>
                  <div className="border border-primary/20 bg-primary/[0.045] p-5">
                    <p className="text-sm text-foreground/45">Qualified meeting held</p>
                    <p className="mt-2 font-mono text-3xl font-black text-primary">€250-350<span className="text-base text-foreground/45"> / meeting</span></p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/55">Net 7. No-shows are not billed.</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-foreground/45">The exact rate depends on your deal economics and qualification rules. No performance result is claimed on this page.</p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-white/[0.06] px-6 py-28 md:px-12 md:py-36">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">Qualification</p>
              <div className="mt-5 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
                <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.035em] md:text-6xl">Four gates. A no on any gate means do not buy.</h2>
                <p className="max-w-2xl text-lg leading-relaxed text-foreground/60 lg:justify-self-end">The service only works when the market, economics, and sales capacity can support it.</p>
              </div>
            </ScrollReveal>

            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {GATES.map(([title, body], index) => (
                <ScrollReveal key={title} delay={index * 70}>
                  <article className="group flex h-full gap-5 border border-white/[0.07] bg-card/25 p-6 transition-colors hover:border-primary/30 md:p-8">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-primary"><Check className="h-4 w-4" /></span>
                    <div>
                      <h3 className="text-lg font-black tracking-[-0.01em]">{title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-foreground/58">{body}</p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] bg-card/[0.18] px-6 py-28 md:px-12 md:py-36">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">The delivery system</p>
              <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.035em] md:text-6xl">One owner from target list to held meeting.</h2>
            </ScrollReveal>
            <div className="mt-16 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] lg:grid-cols-5">
              {PROCESS.map(([number, title, body], index) => (
                <ScrollReveal key={number} delay={index * 70}>
                  <article className="h-full min-h-[300px] bg-background p-7">
                    <span className="font-mono text-4xl font-black text-primary/25">{number}</span>
                    <h3 className="mt-10 text-xl font-black">{title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-foreground/58">{body}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] px-6 py-28 md:px-12 md:py-36">
          <div className="mx-auto grid max-w-[1300px] gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <ScrollReveal>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">What you buy</p>
              <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.035em] md:text-6xl">The outcome is a held meeting. The machinery is included.</h2>
            </ScrollReveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [Filter, "Market and list", "ICP rules, exclusions, verified decision-makers, and suppression lists."],
                [Mail, "Sending infrastructure", "Dedicated domains and inboxes configured for the approved market."],
                [MessagesSquare, "Messages and replies", "Campaign messages, controlled tests, reply handling, and qualification."],
                [CircleDollarSign, "Commercial accountability", "Held meetings, qualification disputes, proposals, clients, and revenue are the measures that matter."],
              ].map(([Icon, title, body], index) => {
                const IconComponent = Icon as typeof Filter;
                return (
                  <ScrollReveal key={title as string} delay={index * 70}>
                    <article className="h-full border border-white/[0.07] bg-card/25 p-7">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <h3 className="mt-7 text-lg font-black">{title as string}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/58">{body as string}</p>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-28 md:px-12 md:py-36">
          <div className="mx-auto max-w-[1100px] border border-primary/25 bg-primary/[0.045] p-8 md:p-14">
            <ScrollReveal>
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">Before a sales call</p>
                  <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.035em] md:text-5xl">Check whether the economics work.</h2>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/60">Use your own fees, show rate, qualification rate, close rate, deal value, and gross margin. The calculator has no hidden defaults.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Link href="/tools/appointment-setting-quote-calculator" className="btn-press inline-flex items-center justify-center gap-3 bg-primary px-7 py-4 text-sm font-black uppercase tracking-[0.17em] text-background">
                    Open calculator <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/appointment-setting-pricing" className="btn-press inline-flex items-center justify-center border border-white/[0.12] px-7 py-4 text-sm font-black uppercase tracking-[0.17em] text-foreground/75">
                    Compare 30 providers
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

