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
  title: "Appointment Setting Pricing Index | Compare 30 Providers",
  description: "Shortlist and compare public appointment-setting prices, billing models, contract terms, channels, and qualification rules from 30 official provider sources.",
  alternates: { canonical: "https://muditek.com/appointment-setting-pricing" },
  openGraph: {
    title: "Appointment Setting Pricing Index",
    description: "A source-linked comparison of 30 appointment-setting providers.",
    url: "https://muditek.com/appointment-setting-pricing",
    type: "website",
  },
};

export default function AppointmentSettingPricingPage() {
  const publicPriceCount = APPOINTMENT_SETTING_PROVIDERS.filter((provider) => provider.hasPublicPrice).length;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/25">
      <AcquisitionPageView asset="appointment-setting-pricing" />
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

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/[0.06] px-6 pb-20 pt-36 md:px-12 md:pb-24 md:pt-44">
          <div className="hero-aurora absolute inset-0 opacity-45" />
          <div className="relative z-10 mx-auto max-w-[1450px]">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">Public provider data</p>
            <h1 className="mt-6 max-w-6xl text-balance text-5xl font-black leading-[0.9] tracking-[-0.04em] sm:text-7xl lg:text-[84px]">Know what the fee actually buys.</h1>
            <p className="mt-8 max-w-3xl text-pretty text-lg leading-relaxed text-foreground/70">Use the checked price, billing model, contract, channels, and qualification rules to build a shortlist. Every provider links to the source we checked.</p>
            <div className="mt-10 grid max-w-3xl grid-cols-1 gap-px border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
              {[
                [String(APPOINTMENT_SETTING_PROVIDERS.length), "Providers checked"],
                [String(publicPriceCount), "Publish a price"],
                ["2026-08-23", "Last checked"],
              ].map(([value, label]) => (
                <div key={label} className="bg-background/85 p-4 sm:p-6">
                  <p className="font-mono text-lg font-black text-primary sm:text-2xl">{value}</p>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground/65 sm:text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] bg-card/[0.18] px-6 py-10 md:px-12 md:py-12">
          <div className="mx-auto grid max-w-[1450px] gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border border-white/[0.08] bg-background p-6 md:p-8">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">Before you compare</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em]">Define what makes a meeting billable.</h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-foreground/70">Check the no-show rule, fixed fee, contract term, included channels, qualification definition, and dispute process. Then compare the fee.</p>
              <Link href="/tools/appointment-setting-quote-calculator" className="mt-7 inline-flex min-h-12 items-center gap-2 border border-primary/35 px-6 text-xs font-black uppercase tracking-[0.16em] text-primary hover:bg-primary/10">
                Model a provider quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="border border-primary/25 bg-primary/[0.05] p-6 md:p-8">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">Publisher disclosure</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em]">Muditek sells appointment setting.</h2>
              <p className="mt-4 leading-relaxed text-foreground/70">We publish this index. Our standard model is €500–900 per month for infrastructure and €250–350 per qualified meeting held. No-shows are not billed as meetings. Muditek is not included in the provider directory.</p>
              <Link href="/appointment-setting" className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
                See Muditek&apos;s full model <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] px-6 py-8 md:px-12">
          <div className="mx-auto grid max-w-[1450px] gap-6 text-sm leading-relaxed text-foreground/68 md:grid-cols-3">
            <p><strong className="text-foreground/80">Provider-specific facts only.</strong> Generic industry ranges published in provider blogs are not treated as that provider&apos;s price.</p>
            <p><strong className="text-foreground/80">Not publicly stated.</strong> The fact was not found on the checked official source. This does not prove it is absent from every page or private proposal.</p>
            <p><strong className="text-foreground">No score or winner.</strong> Sorting only reorders stated facts. Buyers still need to validate delivery and contract terms.</p>
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
              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em]">Convert the vendor fee into cost per qualified meeting and break-even math.</h2>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em] text-primary">Open calculator <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
            <Link href="/appointment-setting" className="group border border-white/[0.08] bg-background/60 p-7 transition-colors hover:border-primary/35 md:p-9">
              <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-primary">Muditek model</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em]">See the risk split, qualification rules, signals, and held-meeting pricing.</h2>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em] text-primary">View the service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
