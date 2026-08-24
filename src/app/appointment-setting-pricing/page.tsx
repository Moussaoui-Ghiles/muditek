import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import { AppointmentSettingPricingIndex } from "@/components/appointment-setting-pricing-index";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { APPOINTMENT_SETTING_PROVIDERS } from "@/lib/appointment-setting-providers";

export const metadata: Metadata = {
  title: "Appointment Setting Pricing Index | 30 Providers",
  description: "Compare sourced appointment-setting pricing, billing units, no-show terms, contracts, channels, and qualification definitions across 30 providers.",
  alternates: { canonical: "https://muditek.com/appointment-setting-pricing" },
};

export default function AppointmentSettingPricingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <AcquisitionPageView asset="appointment-setting-pricing" />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: "Appointment Setting Pricing Index",
        description: "Provider-specific public pricing, billing units, no-show terms, contract terms, outreach channels, qualification definitions, source links, and last-checked dates for 30 appointment-setting providers.",
        url: "https://muditek.com/appointment-setting-pricing",
        creator: { "@id": "https://muditek.com/#organization" },
        dateModified: "2026-08-24",
        isAccessibleForFree: true,
      }} />
      <Navbar />

      <main id="main-content">
        <section className="border-b border-white/8 px-6 pb-20 pt-36 md:px-12 md:pb-24 md:pt-44">
          <div className="mx-auto max-w-[1450px]">
            <p className="text-base font-semibold text-primary">Public pricing index</p>
            <h1 className="mt-5 max-w-[1100px] text-balance text-[clamp(3rem,7vw,6rem)] font-black leading-[0.94] tracking-[-0.035em]">Compare the billing rule before the price.</h1>
            <p className="mt-8 max-w-[800px] text-pretty text-lg leading-8 text-foreground/72 md:text-xl md:leading-9">A booking, a held meeting, and a qualified meeting held are different products. This index keeps the public price next to the unit, no-show rule, contract, channels, qualification language, source, and check date.</p>
          </div>
        </section>

        <section className="border-b border-white/8 bg-[#071017] px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto grid max-w-[1450px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <h2 className="max-w-[15ch] text-balance text-3xl font-black leading-tight tracking-[-0.025em] md:text-5xl">What the index does and does not claim.</h2>
            </div>
            <div className="border-t border-white/16">
              <p className="border-b border-white/16 py-5 leading-7 text-foreground/70">Only provider-specific statements from the linked official source are recorded. Generic industry ranges are excluded.</p>
              <p className="border-b border-white/16 py-5 leading-7 text-foreground/70">&quot;Not publicly stated&quot; means the fact was not found on the checked source. It does not claim the term is absent from a private proposal.</p>
              <p className="border-b border-white/16 py-5 leading-7 text-foreground/70">Providers are alphabetical. This is not a ranking or an endorsement.</p>
              <p className="py-5 text-sm leading-6 text-foreground/58">Muditek publishes this index. Its standard operating cost is €500–€900 monthly, paid upfront and non-refundable. The delivery fee is €250–€350 per qualified meeting held. No-shows do not bill as meetings.</p>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 md:px-12 md:py-20">
          <div className="mx-auto max-w-[1700px]">
            <AppointmentSettingPricingIndex providers={APPOINTMENT_SETTING_PROVIDERS} />
          </div>
        </section>

        <section className="border-t border-white/8 bg-[#081721] px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <h2 className="max-w-[13ch] text-balance text-3xl font-black leading-tight tracking-[-0.025em] md:text-5xl">Turn a public price into your unit economics.</h2>
            <div>
              <p className="max-w-[700px] leading-7 text-foreground/68">Use the setup cost, monthly fee, billing unit, show rate, qualification rate, close rate, deal value, and margin from your own deal.</p>
              <Link href="/tools/appointment-setting-quote-calculator" className="mt-7 inline-flex min-h-12 items-center gap-3 border-b border-primary text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                Run the quote calculator <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
