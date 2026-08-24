import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import { AppointmentSettingCalculator } from "@/components/appointment-setting-calculator";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Appointment Setting Quote Calculator | Muditek",
  description: "Calculate first-month cost, cost per qualified held meeting, break-even close rate, and expected gross profit from your own inputs.",
  alternates: { canonical: "https://muditek.com/tools/appointment-setting-quote-calculator" },
};

export default function AppointmentSettingQuoteCalculatorPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <AcquisitionPageView asset="appointment-setting-quote-calculator" event="library_item_viewed" placement="tool-page" />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Appointment Setting Quote Calculator",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://muditek.com/tools/appointment-setting-quote-calculator",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        description: "Calculates appointment-setting economics from buyer-supplied inputs without industry defaults.",
      }} />
      <Navbar />

      <main id="main-content">
        <section className="px-6 pb-10 pt-32 md:px-12 md:pb-12 md:pt-36">
          <div className="mx-auto max-w-[1320px]">
            <p className="text-base font-semibold text-primary">Free quote calculator</p>
            <h1 className="mt-4 max-w-[950px] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">What does the quote cost after no-shows and bad-fit meetings?</h1>
            <p className="mt-5 max-w-[760px] text-base leading-7 text-foreground/70 md:text-lg md:leading-8">Enter the provider&apos;s quote and the rates you can support. The calculator adds no defaults.</p>
          </div>
        </section>

        <section className="px-6 pb-20 md:px-12 md:pb-28">
          <div className="mx-auto max-w-[1320px]">
            <AppointmentSettingCalculator />
          </div>
        </section>

        <section className="border-t border-white/8 bg-[#071017] px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <h2 className="max-w-[13ch] text-balance text-3xl font-black leading-tight tracking-[-0.025em] md:text-5xl">Check the terms behind the numbers.</h2>
            <div>
              <p className="max-w-[700px] leading-7 text-foreground/68">A low rate can still be expensive when the provider bills booked meetings, no-shows, or loosely defined prospects. The pricing index records the public terms next to the price.</p>
              <Link href="/appointment-setting-pricing" className="mt-7 inline-flex min-h-12 items-center gap-3 border-b border-primary text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                Open the pricing index <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
