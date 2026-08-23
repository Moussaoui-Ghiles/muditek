import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AcquisitionPageView, TrackedBookingLink } from "@/components/acquisition-tracking";
import { AppointmentSettingCalculator } from "@/components/appointment-setting-calculator";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Appointment Setting Quote Calculator | Cost Per Meeting and CAC",
  description: "Compare an appointment-setting quote using your own setup cost, monthly fee, show rate, qualification rate, close rate, deal value, and gross margin.",
  alternates: { canonical: "https://muditek.com/tools/appointment-setting-quote-calculator" },
  openGraph: {
    title: "Appointment Setting Quote Calculator",
    description: "Calculate cost per qualified held meeting, expected CAC, break-even close rate, and expected gross profit with your own inputs.",
    url: "https://muditek.com/tools/appointment-setting-quote-calculator",
    type: "website",
  },
};

export default function AppointmentSettingQuoteCalculatorPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/25">
      <AcquisitionPageView asset="appointment-setting-quote-calculator" />
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

      <main>
        <section className="relative overflow-hidden border-b border-white/[0.06] px-6 pb-20 pt-36 md:px-12 md:pb-24 md:pt-44">
          <div className="hero-aurora absolute inset-0 opacity-50" />
          <div className="relative z-10 mx-auto max-w-[1250px]">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">Free buyer tool</p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.045em] sm:text-7xl lg:text-[84px]">Is this appointment-setting quote actually profitable?</h1>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-foreground/65">Enter the exact quote and your actual funnel economics. The calculator uses no industry defaults and sends none of your financial inputs to Muditek.</p>
          </div>
        </section>

        <section className="px-6 py-12 md:px-12 md:py-20">
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
                  ["Cost per qualified held meeting", "Setup cost plus one monthly fee, divided by the meetings that both happen and meet your rules."],
                  ["Expected CAC", "Setup cost plus one monthly fee, divided by the expected clients from those qualified held meetings."],
                  ["Break-even close rate", "The share of qualified held meetings that must close for gross profit to cover the provider cost."],
                  ["Expected gross profit", "Expected client revenue multiplied by your gross margin, minus the provider cost for the month."],
                ].map(([term, definition]) => (
                  <div key={term} className="border-l border-primary/35 pl-5">
                    <dt className="font-bold text-foreground">{term}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-foreground/55">{definition}</dd>
                  </div>
                ))}
              </dl>
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
              <h2 className="text-3xl font-black tracking-[-0.03em]">The numbers work?</h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/58">Muditek can check your market size, qualification rules, and delivery fit before you commit.</p>
            </div>
            <TrackedBookingLink asset="appointment-setting-quote-calculator" placement="bottom-cta" className="btn-press inline-flex shrink-0 items-center justify-center gap-3 bg-primary px-7 py-4 text-sm font-black uppercase tracking-[0.17em] text-background">
              Check delivery fit <ArrowRight className="h-4 w-4" />
            </TrackedBookingLink>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

