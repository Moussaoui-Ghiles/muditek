import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AcquisitionPageView, TrackedBookingLink } from "@/components/acquisition-tracking";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export type AppointmentSettingIndustryPageProps = {
  slug: string;
  market: string;
  headline: string;
  intro: string;
  buyer: string;
  target: string;
  signals: readonly string[];
  qualification: readonly string[];
  operatingCost: string;
  meetingFee: string;
  pricingNote: string;
};

export function AppointmentSettingIndustryPage(props: AppointmentSettingIndustryPageProps) {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <AcquisitionPageView asset={`appointment-setting-${props.slug}`} />
      <Navbar />

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/8 px-6 pb-24 pt-32 md:px-12 md:pb-32 md:pt-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_15%,rgba(245,158,11,0.08),transparent_36%)]" aria-hidden="true" />
          <div className="relative mx-auto max-w-[1320px]">
            <Link href="/appointment-setting" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground/65 hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Appointment setting
            </Link>
            <p className="mt-10 text-base font-semibold text-primary">{props.market}</p>
            <h1 className="mt-5 max-w-[1050px] text-balance text-[clamp(3rem,7vw,6rem)] font-black leading-[0.94] tracking-[-0.035em]">{props.headline}</h1>
            <p className="mt-8 max-w-[760px] text-pretty text-lg leading-8 text-foreground/72 md:text-xl md:leading-9">{props.intro}</p>
            <TrackedBookingLink asset={`appointment-setting-${props.slug}`} placement="hero" className="mt-10 inline-flex min-h-14 items-center justify-center gap-3 rounded-[2px] bg-primary px-8 text-sm font-extrabold text-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white">
              Book a fit call <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </TrackedBookingLink>
            <p className="mt-3 text-sm text-foreground/58">Microsoft Bookings opens in a new tab. Continue as guest if needed.</p>
          </div>
        </section>

        <section className="border-b border-white/8 bg-[#071017] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <h2 className="max-w-[11ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">Who this is for.</h2>
            <dl className="border-t border-white/18">
              <div className="grid gap-3 border-b border-white/18 py-7 sm:grid-cols-[150px_1fr]">
                <dt className="font-bold text-white">The buyer</dt>
                <dd className="max-w-[720px] leading-7 text-foreground/68">{props.buyer}</dd>
              </div>
              <div className="grid gap-3 border-b border-white/18 py-7 sm:grid-cols-[150px_1fr]">
                <dt className="font-bold text-white">The target</dt>
                <dd className="max-w-[720px] leading-7 text-foreground/68">{props.target}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="border-b border-white/8 px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
            <div>
              <h2 className="max-w-[11ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">What moves an account up the list.</h2>
              <p className="mt-7 max-w-[560px] leading-7 text-foreground/68">These are public research signals. They guide priority. They do not prove that anyone wants to buy.</p>
            </div>
            <ul className="border-t border-white/16">
              {props.signals.map((signal) => (
                <li key={signal} className="grid grid-cols-[12px_1fr] gap-5 border-b border-white/16 py-6 text-base leading-7 text-foreground/74">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-white/8 bg-white/[0.025] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
            <div>
              <h2 className="max-w-[12ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">What makes the meeting billable.</h2>
              <p className="mt-7 max-w-[560px] leading-7 text-foreground/68">The written standard is agreed before outreach. A no-show does not bill.</p>
            </div>
            <ul className="border-t border-white/16">
              {props.qualification.map((rule) => (
                <li key={rule} className="grid grid-cols-[28px_1fr] gap-4 border-b border-white/16 py-6 text-base leading-7 text-foreground/76">
                  <Check className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-white/8 bg-[#081721] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
            <div>
              <h2 className="max-w-[10ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">What you pay.</h2>
            </div>
            <dl className="border-t border-white/18">
              <div className="border-b border-white/18 py-8">
                <dt className="text-3xl font-black tracking-[-0.025em] text-white md:text-4xl">{props.operatingCost}</dt>
                <dd className="mt-3 leading-7 text-foreground/68">Paid upfront and non-refundable. It runs the domains, inboxes, data, enrichment, verification, sending, and reporting.</dd>
              </div>
              <div className="border-b border-white/18 py-8">
                <dt className="text-3xl font-black tracking-[-0.025em] text-white md:text-4xl">{props.meetingFee}</dt>
                <dd className="mt-3 leading-7 text-foreground/68">Charged only after the qualified meeting is held.</dd>
              </div>
              <p className="pt-7 text-sm leading-6 text-foreground/58">{props.pricingNote}</p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                <Link href="/tools/appointment-setting-quote-calculator" className="inline-flex min-h-11 items-center gap-2 border-b border-primary text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                  Run the economics <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/appointment-setting" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-foreground/68 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                  Review general terms <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </dl>
          </div>
        </section>

        <section className="px-6 py-28 text-center md:px-12 md:py-40">
          <div className="mx-auto max-w-[850px]">
            <h2 className="text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">Bring the target and the rule you would accept.</h2>
            <p className="mx-auto mt-7 max-w-[650px] text-lg leading-8 text-foreground/70">The fit call decides whether the public signal, reachable market, and deal economics support this campaign.</p>
            <TrackedBookingLink asset={`appointment-setting-${props.slug}`} placement="final-cta" className="mt-10 inline-flex min-h-14 items-center justify-center gap-3 rounded-[2px] bg-primary px-8 text-sm font-extrabold text-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white">
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
