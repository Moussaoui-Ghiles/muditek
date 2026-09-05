import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { ColdEmailCapacityCalculator } from "@/components/cold-email-capacity-calculator";
import { NewsletterInline } from "@/components/newsletter-inline";
import { BOOK_PATH } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Cold Email Capacity Calculator | Muditek",
  description:
    "Calculate cold email mailboxes, domains, monthly contact supply, funnel projections, and only the costs you enter.",
  alternates: { canonical: "https://muditek.com/tools/cold-email-capacity-calculator" },
};

export default function ColdEmailCapacityCalculatorPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Cold Email Capacity Calculator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web browser",
          url: "https://muditek.com/tools/cold-email-capacity-calculator",
          description: metadata.description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <main id="main-content">
        <header className="w-full">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12 pt-36 md:pt-48 pb-16 md:pb-20">
            <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-foreground transition-colors mb-8">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M9.5 6H2.5M5 3.5L2.5 6L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              All tools
            </Link>
            <p className="text-base font-bold text-primary mb-6">Tool · Runs in your browser</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.92] tracking-[-0.04em] text-balance max-w-[14ch]">Cold Email Capacity Calculator</h1>
            <p className="mt-7 max-w-[62ch] text-lg md:text-xl leading-relaxed text-foreground/75">
              Mailboxes, domains, monthly contact supply, funnel projections, and only the costs you enter. The output is a plan, not a performance claim.
            </p>
          </div>
        </header>
        <section className="border-t border-white/[0.08] py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1120px] px-6 md:px-12">
            <ColdEmailCapacityCalculator />
          </div>
        </section>
        <NewsletterInline source="tool:cold-email-capacity-calculator" headline="Get the next system before it is published." />
        <section className="w-full">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12 py-20 md:py-28 text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-balance max-w-[18ch] mx-auto">Want Muditek to build and run the engine?</h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-base md:text-lg leading-relaxed text-foreground/70">Built in your name, operated by us, paid per qualified meeting held.</p>
            <a href={BOOK_PATH} className="btn btn-solid mt-10">Book a call</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
