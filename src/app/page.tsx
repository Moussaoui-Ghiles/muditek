import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { AcquisitionPageView, TrackedBookingLink } from "@/components/acquisition-tracking";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Qualified B2B Sales Meetings Without an Agency Retainer | Muditek",
  description:
    "Muditek runs signal-based outbound. You cover the operating stack, then pay the delivery fee only for qualified meetings held.",
  alternates: { canonical: "https://muditek.com" },
  openGraph: {
    title: "Qualified sales meetings. No agency retainer.",
    description:
      "You pay the operating stack upfront. The delivery fee is invoiced Net 7 for each qualified meeting held.",
    url: "https://muditek.com",
    type: "website",
  },
};

const SIGNALS = [
  {
    market: "M&A",
    detail: "Owner tenure, company age, published leadership structure, and public language about retirement or succession.",
    href: "/appointment-setting/ma",
  },
  {
    market: "Healthcare staffing",
    detail: "Live roles, repeated hiring, facility expansion, and published staffing data in the agency's specialty and geography.",
    href: "/appointment-setting/healthcare-staffing",
  },
  {
    market: "Freight",
    detail: "New facilities, logistics hiring, lane expansion, and public evidence that a shipper is reviewing freight operations.",
    href: "/appointment-setting/freight",
  },
] as const;

const QUALIFICATION = [
  "The company, geography, and buyer role match the rules approved before launch.",
  "The prospect confirms that the service category is relevant.",
  "The prospect attends for at least 15 minutes.",
  "Existing customers, active opportunities, vendors, and recent duplicates are excluded.",
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
          description: "Signal-based B2B appointment setting and practical AI implementation.",
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
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pb-20 pt-28 text-center md:px-12">
          <Image src="/images/documents-desk.png" alt="" fill priority sizes="100vw" className="object-cover object-center" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,12,0.72)_0%,rgba(2,7,12,0.38)_42%,rgba(2,7,12,0.82)_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(2,7,12,0.12)_52%,rgba(2,7,12,0.68)_100%)]" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex max-w-[1120px] flex-col items-center">
            <p className="inline-flex min-h-11 items-center gap-3 border-y border-white/20 px-5 text-sm font-semibold text-white/90">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              Done-for-you signal-based outbound
            </p>
            <h1 className="mt-8 max-w-[1000px] text-balance text-[clamp(3rem,8vw,6rem)] font-black leading-[0.94] tracking-[-0.035em] text-white">
              Qualified sales meetings. No agency retainer.
            </h1>
            <p className="mt-7 max-w-[760px] text-pretty text-lg leading-8 text-white/82 md:text-xl md:leading-9">
              We run the data, targeting, outreach, and follow-up. You cover the operating stack. The delivery fee is charged only for qualified meetings held.
            </p>
            <div className="mt-10 flex w-full max-w-[470px] flex-col gap-3 sm:flex-row sm:justify-center">
              <TrackedBookingLink asset="homepage" placement="hero" className="inline-flex min-h-14 flex-1 items-center justify-center gap-3 rounded-[2px] bg-primary px-7 text-sm font-extrabold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white motion-reduce:transform-none">
                Book a fit call <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </TrackedBookingLink>
              <Link href="/tools/appointment-setting-quote-calculator" className="inline-flex min-h-14 flex-1 items-center justify-center rounded-[2px] border border-white/40 bg-black/20 px-7 text-sm font-bold text-white transition-colors hover:bg-black/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                Run the numbers
              </Link>
            </div>
            <p className="mt-3 text-xs font-semibold text-white/58">Microsoft Bookings opens in a new tab. Continue as guest if needed.</p>
            <dl className="mt-8 grid w-full max-w-[900px] border-y border-white/25 bg-black/20 text-left backdrop-blur-sm sm:grid-cols-3">
              <div className="border-b border-white/20 px-4 py-4 sm:border-b-0 sm:border-r">
                <dt className="text-xs font-bold text-white/62">General B2B, paid upfront</dt>
                <dd className="mt-1 text-sm font-bold text-white">€500–€900/month, paid upfront and non-refundable</dd>
              </div>
              <div className="border-b border-white/20 px-4 py-4 sm:border-b-0 sm:border-r">
                <dt className="text-xs font-bold text-white/62">General B2B, after delivery</dt>
                <dd className="mt-1 text-sm font-bold text-white">€250–€350 per qualified meeting held, invoiced Net 7</dd>
              </div>
              <div className="px-4 py-4">
                <dt className="text-xs font-bold text-white/62">Billable meeting</dt>
                <dd className="mt-1 text-sm font-bold text-white">Approved buyer, confirmed relevance, 15+ minutes. No-show: €0.</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm font-semibold text-white/72">Public signals set the research order. The prospect&apos;s reply confirms relevance.</p>
          </div>
        </section>

        <section className="border-b border-white/8 bg-[#071017] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <h2 className="max-w-[13ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">
                Your fixed exposure is the operating stack.
              </h2>
              <p className="mt-7 max-w-[590px] text-pretty text-lg leading-8 text-foreground/72">
                The monthly cost pays for domains, inboxes, data, enrichment, verification, sending software, and reporting. It is not a fee for agency hours.
              </p>
            </div>
            <dl className="border-t border-white/18">
              <div className="grid gap-3 border-b border-white/18 py-7 sm:grid-cols-[190px_1fr]">
                <dt className="text-lg font-bold text-white">€500–€900 monthly</dt>
                <dd className="text-base leading-7 text-foreground/68">Paid upfront and non-refundable. It runs the operating stack.</dd>
              </div>
              <div className="grid gap-3 border-b border-white/18 py-7 sm:grid-cols-[190px_1fr]">
                <dt className="text-lg font-bold text-white">€250–€350 each</dt>
                <dd className="text-base leading-7 text-foreground/68">Invoiced Net 7 after a qualified meeting is held. A no-show does not bill.</dd>
              </div>
              <div className="grid gap-3 border-b border-white/18 py-7 sm:grid-cols-[190px_1fr]">
                <dt className="text-lg font-bold text-white">Written before launch</dt>
                <dd className="text-base leading-7 text-foreground/68">The target market, exclusions, buyer roles, and billable-meeting rule are agreed first.</dd>
              </div>
              <div className="pt-8">
                <Link href="/appointment-setting" className="inline-flex min-h-12 items-center gap-3 border-b border-primary text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                  Read the commercial terms <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </dl>
          </div>
        </section>

        <section className="border-b border-white/8 px-6 py-24 md:px-12 md:py-36">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
              <h2 className="max-w-[11ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">
                Signals choose who gets researched first.
              </h2>
              <div>
                <p className="max-w-[720px] text-pretty text-lg leading-8 text-foreground/72">
                  A public signal can move an account up the research queue. It cannot prove buying intent. A reply is the only confirmation that a conversation is worth booking.
                </p>
                <div className="mt-10 border-t border-white/15">
                  {SIGNALS.map((signal) => (
                    <Link key={signal.market} href={signal.href} className="group grid min-h-28 gap-3 border-b border-white/15 py-6 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary md:grid-cols-[210px_1fr_auto] md:items-center">
                      <strong className="text-lg text-white">{signal.market}</strong>
                      <span className="max-w-[720px] text-base leading-7 text-foreground/65">{signal.detail}</span>
                      <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="billable-meeting" className="scroll-mt-24 border-b border-white/8 bg-white/[0.025] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
            <div>
              <h2 className="max-w-[12ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">
                Qualified is a billing rule, not a sales adjective.
              </h2>
              <p className="mt-7 max-w-[560px] text-base leading-7 text-foreground/68">
                Market-specific rules can be tighter. The general standard starts here.
              </p>
            </div>
            <ul className="border-t border-white/15">
              {QUALIFICATION.map((rule) => (
                <li key={rule} className="grid grid-cols-[28px_1fr] gap-4 border-b border-white/15 py-6 text-base leading-7 text-foreground/76">
                  <Check className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-white/8 px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-[1320px]">
            <h2 className="max-w-[900px] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">
              Inspect the method before you book.
            </h2>
            <div className="mt-12 border-t border-white/16">
              <div className="grid min-h-28 gap-3 border-b border-white/16 py-7 md:grid-cols-[minmax(230px,0.75fr)_1.25fr_auto] md:items-center">
                <strong className="text-xl text-white">Friday delivery report</strong>
                <span className="max-w-[720px] text-base leading-7 text-foreground/64">Sends, replies, positive replies, meetings booked, meetings held, and the next test. Meetings remain visible in the agreed calendar or CRM.</span>
                <span className="text-sm font-bold text-primary">Included</span>
              </div>
              {[
                ["Compare the quote", "/tools/appointment-setting-quote-calculator", "Use your own costs, show rate, qualification rate, close rate, deal value, and margin."],
                ["Check public provider pricing", "/appointment-setting-pricing", "Review sourced pricing, billing units, no-show terms, contract terms, channels, and qualification language."],
                ["Diagnose an outbound system", "/playbooks/outbound-failure-diagnostic", "Find the first unsupported or failing stage before changing volume, targeting, or copy."],
              ].map(([title, href, description]) => (
                <Link key={href} href={href} className="group grid min-h-28 gap-3 border-b border-white/16 py-7 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary md:grid-cols-[minmax(230px,0.75fr)_1.25fr_auto] md:items-center">
                  <strong className="text-xl text-white">{title}</strong>
                  <span className="max-w-[720px] text-base leading-7 text-foreground/64">{description}</span>
                  <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-white/8 bg-[#081721] px-6 py-24 md:px-12 md:py-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(245,158,11,0.10),transparent_38%)]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-24">
            <div>
              <p className="text-base font-semibold text-primary">AI implementation for internal operations</p>
              <h2 className="mt-5 max-w-[12ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">
                Build the system around work your team repeats.
              </h2>
            </div>
            <div>
              <p className="max-w-[720px] text-lg font-bold leading-8 text-white">
                Appointment setting is the front-door offer. This is the higher-scope service when the bottleneck is a repeated workflow inside your business.
              </p>
              <p className="mt-5 max-w-[720px] text-pretty text-lg leading-8 text-foreground/74">
                When the bottleneck is inside the business, Muditek maps the workflow, collects the rules and source material, then builds the software or agent that runs the repeatable part with clear review points.
              </p>
              <ol className="mt-9 grid border-y border-white/16 sm:grid-cols-4">
                {["Map the workflow", "Write the rules", "Build the system", "Keep human review"].map((step, index) => (
                  <li key={step} className="border-b border-white/12 px-4 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                    <span className="block text-sm font-bold text-primary">0{index + 1}</span>
                    <span className="mt-2 block text-sm font-bold text-white">{step}</span>
                  </li>
                ))}
              </ol>
              <dl className="mt-9 border-t border-white/16">
                <div className="grid gap-3 border-b border-white/16 py-6 sm:grid-cols-[150px_1fr]">
                  <dt className="font-bold text-white">What we build</dt>
                  <dd className="leading-7 text-foreground/66">Workflow maps, business context, prompt and SOP repositories, connected data, automations, and operator controls.</dd>
                </div>
                <div className="grid gap-3 border-b border-white/16 py-6 sm:grid-cols-[150px_1fr]">
                  <dt className="font-bold text-white">When it fits</dt>
                  <dd className="leading-7 text-foreground/66">A recurring process depends on scattered knowledge, repeated decisions, manual handoffs, or copy-and-paste work.</dd>
                </div>
                <div className="grid gap-3 border-b border-white/16 py-6 sm:grid-cols-[150px_1fr]">
                  <dt className="font-bold text-white">What changes</dt>
                  <dd className="leading-7 text-foreground/66">The system handles the stable steps. Your team keeps the approvals, exceptions, and decisions that need judgment.</dd>
                </div>
              </dl>
              <Link href="/ai-implementation" className="mt-9 inline-flex min-h-12 items-center gap-3 border-b border-primary text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                Review an AI workflow <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-6 py-28 text-center md:px-12 md:py-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.12),transparent_45%)]" aria-hidden="true" />
          <div className="relative mx-auto max-w-[900px]">
            <h2 className="text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">
              Bring the market, deal value, and qualification rule.
            </h2>
            <p className="mx-auto mt-7 max-w-[650px] text-lg leading-8 text-foreground/70">
              The fit call is for deciding whether the market and economics support this model.
            </p>
            <TrackedBookingLink asset="homepage" placement="final-cta" className="mt-10 inline-flex min-h-14 items-center justify-center gap-3 rounded-[2px] bg-primary px-8 text-sm font-extrabold text-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white">
              Book a fit call <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </TrackedBookingLink>
            <p className="mt-3 text-sm text-foreground/56">Microsoft Bookings opens in a new tab. Continue as guest if needed.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
