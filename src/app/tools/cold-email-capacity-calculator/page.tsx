import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { ColdEmailCapacityCalculator } from "@/components/cold-email-capacity-calculator";
import { BOOKING_URL } from "@/lib/booking";

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
        <header className="border-b border-white/[0.06] pb-14 pt-36 md:pb-20 md:pt-48">
          <div className="mx-auto w-full max-w-[1080px] px-6 md:px-12">
            <Link href="/library" className="text-sm font-bold uppercase tracking-[0.18em] text-foreground/55 hover:text-primary">← Public library</Link>
            <p className="mt-10 text-sm font-black uppercase tracking-[0.2em] text-primary">Runs in your browser</p>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl">Cold Email Capacity Calculator</h1>
            <p className="mt-7 max-w-[68ch] text-lg leading-8 text-foreground/70">
              Calculate mailboxes, domains, monthly contact supply, funnel projections, and only the costs you enter. The output is a plan, not a performance claim.
            </p>
          </div>
        </header>
        <section className="py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1120px] px-6 md:px-12">
            <ColdEmailCapacityCalculator />
          </div>
        </section>
        <section className="border-t border-white/[0.06] py-16 text-center">
          <h2 className="text-3xl font-black tracking-[-0.03em]">Want Muditek to run the appointment-setting work?</h2>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[2px] bg-primary px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-background">Book a call</a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
