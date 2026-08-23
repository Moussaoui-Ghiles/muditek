import type { Metadata } from "next";
import Link from "next/link";
import { AcquisitionPageView, TrackedBookingLink } from "@/components/acquisition-tracking";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "AI Implementation | Muditek",
  description: "Practical AI implementation around real workflows, data boundaries, controls, and human review.",
  alternates: { canonical: "https://muditek.com/ai-implementation" },
  openGraph: {
    title: "AI Implementation | Muditek",
    description: "Practical AI implementation around real workflows, data boundaries, controls, and human review.",
    url: "https://muditek.com/ai-implementation",
    type: "website",
  },
};

const DELIVERY_STEPS = [
  ["01", "Define the operating problem", "Fix the owner, source data, current handoffs, failure conditions, and decision the system must support."],
  ["02", "Build the smallest useful system", "Connect only the required data and tools. Keep permissions, logs, review points, and fallbacks explicit."],
  ["03", "Operate and improve it", "Measure the workflow outcome. Correct the system from observed failures instead of adding speculative features."],
] as const;

const APPLICATIONS = [
  { id: "operations", title: "Operational workflows", text: "Intake, document, data, review, and reporting systems with explicit state and ownership." },
  { id: "mudiagent", title: "Local and controlled agents", text: "Agent workflows that respect data boundaries, use approved tools, and expose human review points." },
  { id: "content", title: "Content systems", text: "Source capture, drafting, quality review, approval, and publishing workflows that preserve source truth." },
  { id: "governance", title: "Governance and control", text: "Permissions, audit trails, exception handling, and completion rules around systems that can take action." },
] as const;

export default function AiImplementationPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView asset="ai-implementation" lane="ai-implementation" event="commercial_offer_viewed" placement="service-page" />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: "AI Implementation",
        description: "Practical AI implementation around real workflows, data boundaries, controls, and human review.",
        provider: { "@id": "https://muditek.com/#organization" },
        url: "https://muditek.com/ai-implementation",
      }} />

      <main id="main-content">
        <header className="relative overflow-hidden border-b border-white/[0.06] pb-20 pt-40 md:pb-28 md:pt-52">
          <div className="absolute right-[8%] top-32 h-80 w-80 rounded-full bg-primary/[0.07] blur-[120px]" aria-hidden="true" />
          <div className="mx-auto grid w-full max-w-[1500px] gap-14 px-6 md:px-12 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="relative">
              <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.24em] text-primary"><span className="h-px w-8 bg-primary" /> Back-end capability</p>
              <h1 className="mt-7 max-w-[1000px] text-5xl font-black leading-[0.92] tracking-[-0.04em] sm:text-6xl md:text-[84px]">Build the system around the <span className="font-medium italic text-primary">work.</span></h1>
              <p className="mt-8 max-w-[720px] text-base leading-8 text-foreground/75 md:text-lg">
                AI implementation starts from the workflow, data, controls, and people involved. It does not start from a model demo or a list of features.
              </p>
            </div>
            <aside className="border-y border-white/[0.12] py-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Commercial structure</p>
              <p className="mt-4 text-sm leading-6 text-foreground/70">Appointment setting remains the current front-end offer. AI implementation is available when a defined operating problem needs a deeper build.</p>
            </aside>
          </div>
        </header>

        <section className="border-b border-white/[0.06] py-24 md:py-32">
          <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
            <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Delivery approach</p>
                <h2 className="mt-5 text-4xl font-black leading-none tracking-[-0.035em] md:text-5xl">Three controlled stages.</h2>
              </div>
              <ol className="border-t border-white/[0.1]">
                {DELIVERY_STEPS.map(([number, title, text]) => (
                  <li key={number} className="grid gap-4 border-b border-white/[0.1] py-7 sm:grid-cols-[55px_210px_1fr]">
                    <span className="font-mono text-xs text-primary">{number}</span>
                    <h3 className="font-black text-foreground">{title}</h3>
                    <p className="text-sm leading-6 text-foreground/65">{text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="applications" className="border-b border-white/[0.06] py-24 md:py-32">
          <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
            <div className="max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Applications, not case studies</p>
              <h2 className="mt-5 text-4xl font-black leading-none tracking-[-0.035em] md:text-6xl">Where the capability can be applied.</h2>
              <p className="mt-6 text-base leading-7 text-foreground/70">These are implementation areas. They are not presented as verified client results.</p>
            </div>
            <div className="mt-14 grid border-t border-white/[0.1] md:grid-cols-2">
              {APPLICATIONS.map((application) => (
                <article id={application.id} key={application.id} className="scroll-mt-28 border-b border-white/[0.1] py-8 md:odd:border-r md:odd:pr-10 md:even:pl-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Application</p>
                  <h3 className="mt-4 text-2xl font-black tracking-[-0.025em]">{application.title}</h3>
                  <p className="mt-4 max-w-[58ch] text-sm leading-6 text-foreground/65">{application.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 md:grid-cols-[1fr_auto] md:items-end md:px-12">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Before a call</p>
              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-none tracking-[-0.035em] md:text-6xl">Bring one real workflow, not an AI wish list.</h2>
              <p className="mt-6 max-w-[680px] text-base leading-7 text-foreground/70">A useful first discussion needs the current process, its owner, available data, constraints, and the decision a system should improve.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <TrackedBookingLink asset="ai-implementation" lane="ai-implementation" placement="final-cta" className="inline-flex min-h-14 items-center justify-center rounded-[2px] bg-primary px-7 text-center text-xs font-black uppercase tracking-[0.17em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
                Discuss an implementation
              </TrackedBookingLink>
              <Link href="/library?lane=ai-implementation" className="inline-flex min-h-12 items-center justify-center text-center text-xs font-black uppercase tracking-[0.17em] text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Read technical material</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
