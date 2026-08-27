import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { getLibraryItem } from "@/lib/library-manifest";

export const metadata: Metadata = {
  title: "Muditek | Appointment Setting and AI Implementation",
  description: "Muditek runs B2B appointment setting and builds practical AI systems around real operating workflows.",
  alternates: { canonical: "https://muditek.com" },
  openGraph: {
    title: "Muditek | Appointment Setting and AI Implementation",
    description: "B2B appointment setting, practical AI implementation, and a public operating library.",
    url: "https://muditek.com",
    type: "website",
  },
};

const FEATURED_ASSETS = [
  getLibraryItem("playbook", "outbound-failure-diagnostic"),
  getLibraryItem("skill", "cold-offer-review"),
  getLibraryItem("tool", "outbound-funnel-economics-calculator"),
].filter((item) => item?.status === "published");

const APPLICATIONS = [
  ["Revenue operations", "Connect research, qualification, routing, reporting, and review."],
  ["Operational workflows", "Move intake, documents, data, and decisions through a clear process."],
  ["Content systems", "Keep sources, drafts, approvals, and publishing in one controlled workflow."],
  ["Agent systems", "Give agents approved tools, clear state, and defined review points."],
] as const;

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView asset="homepage" lane="outbound" event="commercial_offer_viewed" placement="homepage" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Muditek",
          url: "https://muditek.com",
          description: "Appointment-setting systems and practical AI implementation.",
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
        <section className="relative flex min-h-[92dvh] items-end overflow-hidden border-b border-white/[0.06] pb-16 pt-36 md:pb-24 md:pt-44">
          <Image src="/images/documents-desk.png" alt="" fill priority className="object-cover object-center opacity-25" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,15,0.98)_0%,rgba(5,10,15,0.82)_52%,rgba(5,10,15,0.45)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
          <div className="relative mx-auto grid w-full max-w-[1500px] gap-16 px-6 md:px-12 lg:grid-cols-[minmax(0,1fr)_370px] lg:items-end">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.24em] text-primary">
                <span className="h-px w-8 bg-primary" /> Appointment setting and AI implementation
              </p>
              <h1 className="mt-7 max-w-[980px] text-[44px] font-black leading-[0.94] tracking-[-0.04em] sm:text-6xl md:text-[84px]">
                Turn outbound into <span className="font-medium italic text-primary">qualified meetings.</span> Fix the systems behind it.
              </h1>
              <p className="mt-8 max-w-[680px] text-base leading-7 text-foreground/75 md:text-lg md:leading-8">
                Muditek runs targeting, research, outreach, qualification, and booking for sales-led B2B teams. When the bottleneck sits inside the operation, we build the AI workflow around it.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/appointment-setting" className="inline-flex min-h-14 items-center justify-center rounded-[2px] bg-primary px-7 text-xs font-black uppercase tracking-[0.18em] text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground motion-reduce:transform-none">
                  See appointment setting
                </Link>
                <Link href="/library" className="inline-flex min-h-14 items-center justify-center rounded-[2px] border border-white/20 bg-background/40 px-7 text-xs font-black uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  Use the public library
                </Link>
              </div>
            </div>

            <aside className="border-y border-white/15 bg-background/40 py-6 backdrop-blur-sm" aria-label="Muditek commercial path">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">How to evaluate the fit</p>
              <ol className="mt-5">
                {[
                  ["01", "Use the diagnostic or calculator"],
                  ["02", "Review the delivery and billing rules"],
                  ["03", "Book a fit review if the numbers work"],
                ].map(([number, label]) => (
                  <li key={number} className="grid grid-cols-[42px_1fr] gap-3 border-t border-white/[0.08] py-4 first:border-t-0">
                    <span className="font-mono text-xs text-primary">{number}</span>
                    <span className="text-sm leading-6 text-foreground/75">{label}</span>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section className="border-b border-white/[0.06] py-24 md:py-32">
          <div className="mx-auto grid w-full max-w-[1500px] gap-14 px-6 md:px-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">Appointment setting</p>
              <h2 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-6xl">From target account to qualified meeting held.</h2>
            </div>
            <div className="lg:pt-2">
              <p className="max-w-[680px] text-lg leading-8 text-foreground/75">
                Muditek handles the work from offer review and targeting through research, messaging, reply handling, qualification, and booking. The pricing index and calculators let you check the economics before a call.
              </p>
              <div className="mt-10 border-t border-white/[0.1]">
                {[
                  ["Service", "/appointment-setting", "Delivery, qualification, responsibilities, and billing rules"],
                  ["Pricing index", "/appointment-setting-pricing", "A sourced comparison of provider models"],
                  ["Quote calculator", "/tools/appointment-setting-quote-calculator", "Compare cost per held and qualified meeting"],
                ].map(([label, href, description]) => (
                  <Link key={href} href={href} className="group grid min-h-24 gap-2 border-b border-white/[0.1] py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:grid-cols-[170px_1fr_auto] sm:items-center">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-primary">{label}</span>
                    <span className="text-sm leading-6 text-foreground/65">{description}</span>
                    <span aria-hidden="true" className="text-xl text-foreground/40 transition-transform group-hover:translate-x-1 motion-reduce:transform-none">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-white/[0.06] py-24 md:py-36">
          <div className="absolute right-0 top-0 h-full w-2/5 bg-[linear-gradient(135deg,transparent,rgba(245,158,11,0.045))]" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-[1500px] px-6 md:px-12">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">AI implementation</p>
                <h2 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-6xl">Build AI into the workflow your team already runs.</h2>
                <p className="mt-7 max-w-[560px] text-base leading-7 text-foreground/70">
                  Start with one operating problem, the data it depends on, the people who own it, and the controls it needs. Then build the smallest system that improves that work.
                </p>
                <Link href="/ai-implementation" className="mt-9 inline-flex min-h-12 items-center border-b border-primary text-xs font-black uppercase tracking-[0.17em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  See the implementation approach →
                </Link>
              </div>
              <div className="border-t border-white/[0.1]">
                {APPLICATIONS.map(([title, description], index) => (
                  <div key={title} className="grid gap-3 border-b border-white/[0.1] py-7 sm:grid-cols-[48px_190px_1fr] sm:items-start">
                    <span className="font-mono text-xs text-primary">0{index + 1}</span>
                    <h3 className="text-base font-black text-foreground">{title}</h3>
                    <p className="text-sm leading-6 text-foreground/65">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] py-24 md:py-32">
          <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
            <div className="flex flex-col gap-7 border-b border-white/[0.1] pb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">Public library</p>
                <h2 className="mt-6 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.035em] md:text-6xl">Use the methods before you hire us.</h2>
              </div>
              <Link href="/library" className="text-xs font-black uppercase tracking-[0.17em] text-foreground/75 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Browse all assets →</Link>
            </div>
            <div>
              {FEATURED_ASSETS.map((item, index) => item ? (
                <Link key={item.slug} href={`/${item.kind}s/${item.slug}`} className="group grid gap-3 border-b border-white/[0.1] py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:grid-cols-[70px_210px_1fr_auto] md:items-center">
                  <span className="font-mono text-xs text-primary">0{index + 1}</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.16em] text-foreground/55">{item.kind} · {item.topic.replaceAll("-", " ")}</span>
                  <span>
                    <strong className="block text-lg text-foreground">{item.title}</strong>
                    <span className="mt-1 block text-sm leading-6 text-foreground/60">{item.summary}</span>
                  </span>
                  <span aria-hidden="true" className="text-xl text-foreground/40 transition-transform group-hover:translate-x-1 motion-reduce:transform-none">→</span>
                </Link>
              ) : null)}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-28 md:py-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.09),transparent_50%)]" aria-hidden="true" />
          <div className="relative mx-auto max-w-[980px] px-6 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">Appointment setting</p>
            <h2 className="mt-7 text-4xl font-black leading-[0.96] tracking-[-0.04em] md:text-7xl">Need qualified meetings? Check the fit.</h2>
            <p className="mx-auto mt-7 max-w-[620px] text-base leading-7 text-foreground/70">Review the market gates, pricing, and billable-meeting rules before you choose a time.</p>
            <Link href="/appointment-setting#fit-review" className="mt-10 inline-flex min-h-14 items-center justify-center rounded-[2px] bg-primary px-8 text-xs font-black uppercase tracking-[0.18em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
              See if your market fits
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
