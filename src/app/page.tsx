import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PlanetHeroMedia } from "@/components/planet-hero-media";

export const metadata: Metadata = {
  title: "Muditek | Done-for-you B2B appointment setting",
  description: "Muditek runs AI-native outbound around one commercial outcome: qualified B2B meetings held.",
  alternates: { canonical: "https://muditek.com" },
  openGraph: {
    title: "Muditek | Done-for-you B2B appointment setting",
    description: "Done-for-you outbound built around qualified B2B meetings held, with deeper AI implementation when the operating system needs work.",
    url: "https://muditek.com",
    type: "website",
  },
};

const DELIVERY_PATH = [
  "Targeting",
  "List building",
  "Infrastructure",
  "Messaging",
  "Outreach",
  "Replies",
  "Qualification",
  "Attendance follow-up",
] as const;

const EVALUATION_PATHS = [
  {
    label: "The offer",
    title: "Review delivery, qualification, and billing rules.",
    href: "/appointment-setting",
    action: "Review the offer",
  },
  {
    label: "Provider pricing",
    title: "Compare public appointment-setting prices and models.",
    href: "/appointment-setting-pricing",
    action: "Use the pricing index",
  },
  {
    label: "Quote calculator",
    title: "Compare cost per held and qualified meeting locally.",
    href: "/tools/appointment-setting-quote-calculator",
    action: "Run the calculator",
  },
  {
    label: "Failure diagnostic",
    title: "Find the constraint before adding more outbound volume.",
    href: "/playbooks/outbound-failure-diagnostic",
    action: "Run the diagnostic",
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <Navbar />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Muditek",
          url: "https://muditek.com",
          description: "Done-for-you B2B appointment setting and practical AI implementation.",
          areaServed: "Remote",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Muditek services",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Appointment Setting", url: "https://muditek.com/appointment-setting" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Implementation", url: "https://muditek.com/ai-implementation" } },
            ],
          },
        }}
      />

      <main id="main-content">
        <section className="relative flex min-h-[92dvh] items-end overflow-hidden border-b border-white/[0.08] pb-14 pt-32 md:pb-20 md:pt-44">
          <PlanetHeroMedia />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,15,0.6)_0%,rgba(5,10,15,0.72)_48%,rgba(5,10,15,0.98)_100%)] sm:bg-[linear-gradient(90deg,rgba(5,10,15,0.98)_0%,rgba(5,10,15,0.88)_48%,rgba(5,10,15,0.34)_100%)]" />
          <div className="relative mx-auto w-full max-w-[1500px] px-6 md:px-12">
            <div className="max-w-[900px]">
              <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                <span className="h-px w-8 bg-primary" /> Appointment setting for sales-led B2B teams
              </p>
              <h1 className="mt-7 text-[43px] font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl md:text-[78px] lg:text-[88px]">
                Done-for-you outbound. Built around qualified meetings held.
              </h1>
              <p className="mt-8 max-w-[760px] text-base leading-7 text-white/80 md:text-lg md:leading-8">
                Muditek handles targeting, list building, infrastructure, messaging, outreach, replies, qualification, booking, and attendance follow-up. You pay the operating stack upfront. The delivery fee applies only after a qualified meeting is held.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/appointment-setting" className="inline-flex min-h-14 items-center justify-center rounded-[2px] bg-primary px-7 text-xs font-black uppercase tracking-[0.18em] text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white motion-reduce:transform-none">
                  Review the offer
                </Link>
                <Link href="/library" className="inline-flex min-h-14 items-center justify-center rounded-[2px] border border-white/25 bg-background/45 px-7 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary">
                  Use the public library
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] py-16 md:py-20" aria-labelledby="delivery-heading">
          <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
            <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">End-to-end delivery</p>
                <h2 id="delivery-heading" className="mt-4 text-2xl font-black leading-tight tracking-[-0.025em] text-foreground">One accountable outbound operation.</h2>
              </div>
              <ol className="grid border-t border-white/[0.1] sm:grid-cols-2 lg:grid-cols-4">
                {DELIVERY_PATH.map((step, index) => (
                  <li key={step} className="flex min-h-20 items-center gap-3 border-b border-white/[0.1] py-4 sm:px-4 sm:odd:border-r lg:border-r lg:odd:border-r">
                    <span className="font-mono text-[11px] text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-bold text-foreground/78">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] py-24 md:py-32" aria-labelledby="evaluate-heading">
          <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">Evaluate before a call</p>
                <h2 id="evaluate-heading" className="mt-6 max-w-xl text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-6xl">Inspect the offer from four angles.</h2>
                <p className="mt-7 max-w-[520px] text-base leading-7 text-foreground/70">Check the delivery model, outside prices, your economics, and the constraint in your current funnel.</p>
              </div>
              <div className="border-t border-white/[0.1]">
                {EVALUATION_PATHS.map((path) => (
                  <Link key={path.href} href={path.href} className="group grid min-h-28 gap-3 border-b border-white/[0.1] py-6 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary sm:grid-cols-[155px_1fr_auto] sm:items-center">
                    <span className="text-[11px] font-black uppercase tracking-[0.17em] text-primary">{path.label}</span>
                    <span className="text-base font-bold leading-6 text-foreground">{path.title}</span>
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-foreground/60 transition-colors group-hover:text-primary">{path.action} →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] py-20 md:py-24" aria-labelledby="ai-heading">
          <div className="mx-auto grid w-full max-w-[1500px] gap-8 px-6 md:px-12 lg:grid-cols-[260px_1fr_auto] lg:items-center">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">Deeper capability</p>
            <div>
              <h2 id="ai-heading" className="text-3xl font-black leading-tight tracking-[-0.03em] md:text-4xl">AI implementation for the operating system behind the work.</h2>
              <p className="mt-4 max-w-[760px] text-base leading-7 text-foreground/70">When the constraint is inside research, routing, content, documents, data, or review, Muditek builds the controlled workflow around it. These are applications of the deeper capability, not separate offers.</p>
            </div>
            <Link href="/ai-implementation" className="inline-flex min-h-12 items-center border-b border-primary text-xs font-black uppercase tracking-[0.17em] text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary">
              Review AI implementation →
            </Link>
          </div>
        </section>

        <section className="py-24 md:py-32" aria-labelledby="qualification-heading">
          <div className="mx-auto grid w-full max-w-[1500px] gap-10 px-6 md:px-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">Fit review</p>
              <h2 id="qualification-heading" className="mt-6 max-w-[920px] text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-7xl">Check the market, economics, and qualification rules first.</h2>
              <p className="mt-7 max-w-[680px] text-base leading-7 text-foreground/70">The offer page shows the eligibility gates and the exact conditions for a billable qualified meeting.</p>
            </div>
            <Link href="/appointment-setting#fit-review" className="inline-flex min-h-14 items-center justify-center rounded-[2px] bg-primary px-8 text-xs font-black uppercase tracking-[0.18em] text-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-foreground">
              Check if you qualify
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
