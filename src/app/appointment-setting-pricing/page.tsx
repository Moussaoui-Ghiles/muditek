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
  title: "Appointment Setting Pricing Index | 30 Providers Compared",
  description: "Compare public appointment-setting pricing, models, contract terms, channels, and qualification definitions from 30 official provider sources. No rankings or invented ranges.",
  alternates: { canonical: "https://muditek.com/appointment-setting-pricing" },
  openGraph: {
    title: "Appointment Setting Pricing Index",
    description: "A source-linked, alphabetic comparison of 30 appointment-setting providers.",
    url: "https://muditek.com/appointment-setting-pricing",
    type: "website",
  },
};

export default function AppointmentSettingPricingPage() {
  const publicPriceCount = APPOINTMENT_SETTING_PROVIDERS.filter((provider) => provider.hasPublicPrice).length;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/25">
      <AcquisitionPageView asset="appointment-setting-pricing-index" />
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Appointment Setting Pricing Index",
          description: "Provider-specific public pricing, pricing models, contract terms, outreach channels, qualification definitions, source links, and last-checked dates for 30 appointment-setting providers.",
          url: "https://muditek.com/appointment-setting-pricing",
          creator: { "@id": "https://muditek.com/#organization" },
          dateModified: "2026-08-23",
          isAccessibleForFree: true,
          distribution: { "@type": "DataDownload", encodingFormat: "text/html", contentUrl: "https://muditek.com/appointment-setting-pricing" },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
            { "@type": "ListItem", position: 2, name: "Appointment Setting Pricing", item: "https://muditek.com/appointment-setting-pricing" },
          ],
        },
      ]} />
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-white/[0.06] px-6 pb-20 pt-36 md:px-12 md:pb-24 md:pt-44">
          <div className="hero-aurora absolute inset-0 opacity-45" />
          <div className="relative z-10 mx-auto max-w-[1450px]">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">Public provider data</p>
            <h1 className="mt-6 max-w-6xl text-5xl font-black leading-[0.9] tracking-[-0.045em] sm:text-7xl lg:text-[84px]">Appointment-setting pricing, without the fake ranking.</h1>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-foreground/65">Thirty providers, sorted alphabetically. Every row points to an official source. Missing facts stay missing.</p>
            <div className="mt-10 grid max-w-3xl grid-cols-3 gap-px border border-white/[0.08] bg-white/[0.08]">
              {[
                [String(APPOINTMENT_SETTING_PROVIDERS.length), "Providers checked"],
                [String(publicPriceCount), "Publish a price"],
                ["2026-08-23", "Last checked"],
              ].map(([value, label]) => (
                <div key={label} className="bg-background/85 p-4 sm:p-6">
                  <p className="font-mono text-lg font-black text-primary sm:text-2xl">{value}</p>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground/45 sm:text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] px-6 py-8 md:px-12">
          <div className="mx-auto grid max-w-[1450px] gap-6 text-sm leading-relaxed text-foreground/55 md:grid-cols-3">
            <p><strong className="text-foreground/80">Provider-specific facts only.</strong> Generic industry ranges published in provider blogs are not treated as that provider&apos;s price.</p>
            <p><strong className="text-foreground/80">Not publicly stated.</strong> The fact was not found on the checked official source. This does not prove it is absent from every page or private proposal.</p>
            <p><strong className="text-foreground/80">No ranking.</strong> Alphabetical order prevents an unsupported “best agency” claim. Buyers still need to validate delivery and contract terms.</p>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 md:px-12 md:py-16">
          <div className="mx-auto max-w-[1600px]">
            <AppointmentSettingPricingIndex providers={APPOINTMENT_SETTING_PROVIDERS} />
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-card/[0.18] px-6 py-20 md:px-12">
          <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-2">
            <Link href="/tools/appointment-setting-quote-calculator" className="group border border-white/[0.08] bg-background/60 p-7 transition-colors hover:border-primary/35 md:p-9">
              <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-primary">Run your quote</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em]">Convert the vendor fee into CAC and break-even math.</h2>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em] text-primary">Open calculator <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
            <Link href="/appointment-setting" className="group border border-white/[0.08] bg-background/60 p-7 transition-colors hover:border-primary/35 md:p-9">
              <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-primary">Muditek model</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em]">See the exact gates, process, and held-meeting pricing.</h2>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em] text-primary">View the service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
