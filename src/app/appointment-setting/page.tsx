import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { AcquisitionPageView, TrackedBookingLink } from "@/components/acquisition-tracking";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "B2B Appointment Setting | Pay Per Qualified Meeting Held | Muditek",
  description:
    "Muditek runs the outbound system. You fund the tools and data, then pay the delivery fee only after a qualified prospect attends.",
  alternates: { canonical: "https://muditek.com/appointment-setting" },
  openGraph: {
    title: "B2B Appointment Setting | Muditek",
    description: "A monthly operating cost and a delivery fee paid only after a qualified meeting is held.",
    url: "https://muditek.com/appointment-setting",
    type: "website",
  },
};

const FIT_RULES = [
  ["B2B and sales-led", "Your sale needs a real conversation, not a self-serve checkout."],
  ["$10K+ client ACV", "One closed client must make the meeting economics sensible."],
  ["15,000+ reachable contacts", "The general market needs enough depth to test without exhausting it."],
  ["A closer with capacity", "Someone on your team must own discovery, proposals, and closing."],
] as const;

const BILLABLE_RULES = [
  "The attendee matches the approved company, geography, and buyer-role rules.",
  "The prospect confirms that the service category is relevant.",
  "The prospect attends for at least 15 minutes.",
  "Existing customers, active opportunities, vendors, and recent duplicates are excluded.",
] as const;

const PROCESS = [
  ["Agree the rules", "Define the market, exclusions, buyer roles, and the exact billable-meeting standard."],
  ["Build the operating stack", "Set up the domains, inboxes, data, enrichment, verification, sending, and reporting."],
  ["Prioritize and contact", "Use market-specific public signals to order the account list, then run approved outreach and follow-up."],
  ["Screen, book, and bill", "Check replies against the written rules. The delivery fee applies only after a qualified meeting is held."],
] as const;

const MARKETS = [
  ["M&A", "/appointment-setting/ma", "Owner outreach for brokers, advisors, search funds, and small PE firms."],
  ["Healthcare staffing", "/appointment-setting/healthcare-staffing", "Facility conversations for agencies building direct client relationships."],
  ["Freight", "/appointment-setting/freight", "Shipper conversations matched to the broker's modes, lanes, and geography."],
] as const;

export default function AppointmentSettingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <AcquisitionPageView asset="appointment-setting" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "B2B Appointment Setting",
          serviceType: "Done-for-you signal-based B2B outbound and appointment setting",
          provider: { "@id": "https://muditek.com/#organization" },
          url: "https://muditek.com/appointment-setting",
          areaServed: "Worldwide",
          offers: [
            { "@type": "Offer", name: "Monthly operating stack", lowPrice: "500", highPrice: "900", priceCurrency: "EUR" },
            { "@type": "Offer", name: "Qualified meeting held", lowPrice: "250", highPrice: "350", priceCurrency: "EUR" },
          ],
        }}
      />
      <Navbar />

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/8 px-6 pb-24 pt-36 md:px-12 md:pb-32 md:pt-44">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(245,158,11,0.08),transparent_35%)]" aria-hidden="true" />
          <div className="relative mx-auto max-w-[1320px]">
            <p className="text-base font-semibold text-primary">Done-for-you signal-based outbound</p>
            <h1 className="mt-6 max-w-[1050px] text-balance text-[clamp(3rem,7vw,6rem)] font-black leading-[0.94] tracking-[-0.035em]">
              Pay the operating costs upfront. Pay delivery after a qualified meeting is held.
            </h1>
            <p className="mt-8 max-w-[760px] text-pretty text-lg leading-8 text-foreground/72 md:text-xl md:leading-9">
              Muditek runs the data, targeting, outreach, replies, screening, and booking. You keep the sales call and the close.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <TrackedBookingLink asset="appointment-setting" placement="hero" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[2px] bg-primary px-8 text-sm font-extrabold text-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white">
                Book a fit call <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </TrackedBookingLink>
              <Link href="/tools/appointment-setting-quote-calculator" className="inline-flex min-h-14 items-center justify-center rounded-[2px] border border-white/25 px-8 text-sm font-bold text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                Run the numbers
              </Link>
            </div>
            <p className="mt-3 text-sm text-foreground/58">Microsoft Bookings opens in a new tab. Continue as guest if needed.</p>
          </div>
        </section>

        <section className="border-b border-white/8 bg-[#071017] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <div>
              <h2 className="max-w-[12ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">The risk split is simple.</h2>
              <p className="mt-7 max-w-[580px] text-lg leading-8 text-foreground/70">
                You fund the infrastructure needed to run the campaign. Muditek carries the delivery work between setup and a held meeting.
              </p>
            </div>
            <dl className="border-t border-white/18">
              <div className="border-b border-white/18 py-8">
                <dt className="text-3xl font-black tracking-[-0.025em] text-white md:text-4xl">€500–€900 per month</dt>
                <dd className="mt-3 max-w-[680px] text-base leading-7 text-foreground/68">Paid upfront and non-refundable. It covers domains, inboxes, data, enrichment, verification, sending software, and reporting.</dd>
              </div>
              <div className="border-b border-white/18 py-8">
                <dt className="text-3xl font-black tracking-[-0.025em] text-white md:text-4xl">€250–€350 per qualified meeting held</dt>
                <dd className="mt-3 max-w-[680px] text-base leading-7 text-foreground/68">Billed after the meeting happens and clears the written rule. No-show meetings do not bill.</dd>
              </div>
              <div className="pt-8">
                <Link href="/appointment-setting-pricing" className="inline-flex min-h-12 items-center gap-3 border-b border-primary text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                  Compare public provider pricing <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </dl>
          </div>
        </section>

        <section className="border-b border-white/8 px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
              <div>
                <h2 className="max-w-[12ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">This model needs enough room to work.</h2>
                <p className="mt-7 max-w-[500px] leading-7 text-foreground/68">Muditek uses these rules for the standard general-B2B service.</p>
              </div>
              <div className="border-t border-white/16">
                {FIT_RULES.map(([title, detail]) => (
                  <div key={title} className="grid gap-2 border-b border-white/16 py-6 sm:grid-cols-[220px_1fr]">
                    <h3 className="font-bold text-white">{title}</h3>
                    <p className="leading-7 text-foreground/66">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/8 bg-white/[0.025] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <div>
              <h2 className="max-w-[12ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">What counts as billable.</h2>
              <p className="mt-7 max-w-[560px] leading-7 text-foreground/68">The standard is written before outreach. A niche can add tighter conditions, but it cannot remove these basics without agreement.</p>
            </div>
            <ul className="border-t border-white/16">
              {BILLABLE_RULES.map((rule) => (
                <li key={rule} className="grid grid-cols-[28px_1fr] gap-4 border-b border-white/16 py-6 text-base leading-7 text-foreground/76">
                  <Check className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-white/8 px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
              <div>
                <h2 className="max-w-[12ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">How the work moves.</h2>
                <p className="mt-7 max-w-[500px] leading-7 text-foreground/68">Work starts in the first week. The exact launch sequence depends on the approved market and available infrastructure.</p>
              </div>
              <ol className="border-t border-white/16">
                {PROCESS.map(([title, detail], index) => (
                  <li key={title} className="grid gap-3 border-b border-white/16 py-7 sm:grid-cols-[44px_190px_1fr]">
                    <span className="font-semibold text-primary">{index + 1}</span>
                    <strong className="text-white">{title}</strong>
                    <span className="leading-7 text-foreground/66">{detail}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-b border-white/8 bg-[#081721] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-[1320px]">
            <h2 className="max-w-[780px] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">The signal changes with the market.</h2>
            <p className="mt-7 max-w-[720px] text-lg leading-8 text-foreground/70">Each page below states the buyer, usable public signals, qualification rule, and price. A signal raises priority. It never proves intent.</p>
            <div className="mt-12 border-t border-white/16">
              {MARKETS.map(([title, href, detail]) => (
                <Link key={href} href={href} className="group grid min-h-28 gap-3 border-b border-white/16 py-7 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary md:grid-cols-[220px_1fr_auto] md:items-center">
                  <strong className="text-xl text-white">{title}</strong>
                  <span className="max-w-[700px] leading-7 text-foreground/66">{detail}</span>
                  <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-28 text-center md:px-12 md:py-40">
          <div className="mx-auto max-w-[850px]">
            <h2 className="text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">Check the market before funding the stack.</h2>
            <p className="mx-auto mt-7 max-w-[650px] text-lg leading-8 text-foreground/70">Bring the offer, reachable market, deal value, closer capacity, and the rule you would accept for a billable meeting.</p>
            <TrackedBookingLink asset="appointment-setting" placement="final-cta" className="mt-10 inline-flex min-h-14 items-center justify-center gap-3 rounded-[2px] bg-primary px-8 text-sm font-extrabold text-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white">
              Book a fit call <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </TrackedBookingLink>
            <p className="mt-3 text-sm text-foreground/56">Microsoft Bookings opens in a new tab. Continue as guest if needed.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
