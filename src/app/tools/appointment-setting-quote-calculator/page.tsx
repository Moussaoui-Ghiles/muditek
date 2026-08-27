import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AcquisitionPageView, TrackedBookingLink } from "@/components/acquisition-tracking";
import { AppointmentSettingCalculator } from "@/components/appointment-setting-calculator";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Appointment Setting Quote Calculator | Cost Per Qualified Meeting",
  description: "Calculate provider cost per qualified meeting held, provider cost per expected client, break-even close rate, and contribution after provider cost using your own inputs.",
  alternates: { canonical: "https://muditek.com/tools/appointment-setting-quote-calculator" },
  openGraph: {
    title: "Appointment Setting Quote Calculator",
    description: "Calculate provider cost per qualified meeting held, provider cost per expected client, break-even close rate, and contribution after provider cost.",
    url: "https://muditek.com/tools/appointment-setting-quote-calculator",
    type: "website",
  },
};

export default function AppointmentSettingQuoteCalculatorPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/25">
      <AcquisitionPageView asset="appointment-setting-quote-calculator" event="library_item_viewed" placement="tool-page" />
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Appointment Setting Quote Calculator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: "https://muditek.com/tools/appointment-setting-quote-calculator",
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          description: "Calculates appointment-setting unit economics from buyer-supplied inputs without industry defaults.",
          dateModified: "2026-08-23",
          author: { "@type": "Person", name: "Ghiles Moussaoui", url: "https://muditek.com/about" },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
            { "@type": "ListItem", position: 2, name: "Appointment Setting", item: "https://muditek.com/appointment-setting" },
            { "@type": "ListItem", position: 3, name: "Quote Calculator", item: "https://muditek.com/tools/appointment-setting-quote-calculator" },
          ],
        },
      ]} />
      <Navbar />

      <main id="main-content">
        <section className="border-b border-white/[0.06] px-6 pb-8 pt-28 md:px-12 md:pb-12 md:pt-36">
          <div className="mx-auto max-w-[1250px]">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">Free buyer tool</p>
            <h1 className="mt-4 max-w-5xl text-balance text-4xl font-black leading-[0.96] tracking-[-0.04em] sm:text-5xl lg:text-6xl">What does this quote cost after no-shows and bad-fit meetings?</h1>
            <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-foreground/70 md:text-lg">Use the provider&apos;s written fees and assumptions. The calculator uses only the values you enter.</p>
            <p className="mt-4 text-xs text-foreground/65">By Ghiles Moussaoui · Updated 2026-08-23 · <Link href="/appointment-setting-pricing" className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary">Pricing source index</Link></p>
          </div>
        </section>

        <section className="px-4 py-6 sm:px-6 md:px-12 md:py-12">
          <div className="mx-auto max-w-[1250px]">
            <AppointmentSettingCalculator />
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-card/[0.18] px-6 py-20 md:px-12">
          <div className="mx-auto grid max-w-[1250px] gap-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-primary">What the outputs mean</p>
              <dl className="mt-7 space-y-6">
                {[
                  ["Total provider cost for the month", "Setup cost plus the monthly fee plus the held-meeting fees produced by your volume, show-rate, and qualification inputs."],
                  ["Provider cost per qualified meeting held", "Total provider cost divided by the meetings that happen and meet your rules."],
                  ["Provider cost per expected client", "Total provider cost divided by the expected clients from those qualified meetings."],
                  ["Break-even close rate", "The share of qualified held meetings that must close for gross profit to cover the provider cost."],
                  ["Estimated contribution after provider cost", "Expected client revenue multiplied by gross margin, minus the provider cost entered for the month."],
                ].map(([term, definition]) => (
                  <div key={term} className="border-l border-primary/35 pl-5">
                    <dt className="font-bold text-foreground">{term}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-foreground/68">{definition}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 border border-white/[0.1] bg-background/60 p-5 text-sm leading-relaxed text-foreground/68"><strong className="text-foreground">M&amp;A buyers:</strong> this calculator models revenue from new clients. It does not model acquisition returns. Compare fixed exposure and the exact owner-interest threshold separately.</p>
            </div>
            <div className="border border-white/[0.08] bg-background/60 p-7 md:p-9">
              <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-primary">Next comparison</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em]">Check what providers publish before you take a sales call.</h2>
              <p className="mt-5 text-base leading-relaxed text-foreground/58">The pricing index records public provider-specific prices, models, terms, channels, qualification definitions, source links, and last-checked dates. It does not rank agencies.</p>
              <Link href="/appointment-setting-pricing" className="btn-press mt-8 inline-flex items-center gap-3 bg-primary px-7 py-4 text-sm font-black uppercase tracking-[0.17em] text-background">
                Open the pricing index <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto flex max-w-[1050px] flex-col gap-8 border border-primary/20 bg-primary/[0.04] p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="text-3xl font-black tracking-[-0.03em]">The calculation uses your assumptions. Can the market support them?</h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/58">Muditek checks reachable market size, qualification rules, deal economics, and closer capacity before recommending a launch.</p>
            </div>
            <TrackedBookingLink asset="appointment-setting-quote-calculator" placement="bottom-cta" className="btn-press inline-flex min-h-14 shrink-0 items-center justify-center gap-3 bg-primary px-7 py-4 text-center text-sm font-black uppercase tracking-[0.1em] text-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-foreground">
              Book a 30-minute fit review <ArrowRight className="h-4 w-4" />
            </TrackedBookingLink>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
