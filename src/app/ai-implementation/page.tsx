import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { AcquisitionPageView, TrackedBookingLink } from "@/components/acquisition-tracking";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "AI Implementation for B2B Operations | Muditek",
  description: "Muditek maps a repeated workflow, packages the rules and source material, then builds the software or agent that runs it with clear review points.",
  alternates: { canonical: "https://muditek.com/ai-implementation" },
  openGraph: {
    title: "AI Implementation for B2B Operations | Muditek",
    description: "Working systems for repeated business workflows, built around your rules, data, and approvals.",
    url: "https://muditek.com/ai-implementation",
    type: "website",
  },
};

const FIT = [
  "A recurring process still depends on one person's memory.",
  "The team copies information between tools or rebuilds the same output by hand.",
  "Rules exist, but they are spread across calls, documents, inboxes, and people.",
  "The stable steps can run automatically while approvals and exceptions stay with the team.",
] as const;

const BUILD = [
  ["Workflow map", "The steps, inputs, decisions, handoffs, exceptions, and owners are made explicit."],
  ["Business context", "The system gets the company language, standards, clients, rules, and constraints it needs."],
  ["Executable procedures", "The relevant SOPs and prompts are stored, versioned, and connected to the workflow."],
  ["Connected data", "Approved source material is organized so the system can retrieve the right context."],
  ["Working implementation", "The automation or agent runs the repeatable steps and exposes approvals, logs, and failure points."],
] as const;

const REPLACED_WORK = [
  "Repeated research and data assembly",
  "Copying records between tools",
  "Routine drafting from approved source material",
  "Rule-based routing and checks",
  "Recurring reports built from the same inputs",
] as const;

export default function AiImplementationPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <AcquisitionPageView asset="ai-implementation" lane="ai-implementation" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "AI Implementation",
          serviceType: "Workflow mapping, business context, connected data, and controlled AI systems",
          provider: { "@id": "https://muditek.com/#organization" },
          url: "https://muditek.com/ai-implementation",
          areaServed: "Worldwide",
        }}
      />
      <Navbar />

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/8 px-6 pb-24 pt-36 md:px-12 md:pb-32 md:pt-44">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(245,158,11,0.10),transparent_38%)]" aria-hidden="true" />
          <div className="relative mx-auto max-w-[1320px]">
            <p className="text-base font-semibold text-primary">AI implementation for internal operations</p>
            <h1 className="mt-6 max-w-[1080px] text-balance text-[clamp(3rem,7vw,6rem)] font-black leading-[0.94] tracking-[-0.035em]">
              Build the software around the work your team repeats.
            </h1>
            <p className="mt-8 max-w-[780px] text-lg font-bold leading-8 text-white md:text-xl md:leading-9">
              Appointment setting is Muditek&apos;s front-door offer. This is the higher-scope service for a repeated workflow inside your business.
            </p>
            <p className="mt-4 max-w-[780px] text-pretty text-lg leading-8 text-foreground/72 md:text-xl md:leading-9">
              Muditek maps one real workflow, packages the rules and source material, then builds the automation or agent that runs the repeatable part with clear review points.
            </p>
            <TrackedBookingLink asset="ai-implementation" lane="ai-implementation" placement="hero" className="mt-10 inline-flex min-h-14 items-center justify-center gap-3 rounded-[2px] bg-primary px-8 text-sm font-extrabold text-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white">
              Review an AI workflow <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </TrackedBookingLink>
            <p className="mt-3 text-sm text-foreground/58">This opens Muditek&apos;s 45-minute fit-call calendar in a new tab. Continue as guest if needed.</p>
            <ol className="mt-14 grid border-y border-white/16 sm:grid-cols-4">
              {["Map the work", "Write the rules", "Build the system", "Keep human review"].map((step, index) => (
                <li key={step} className="border-b border-white/12 px-4 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <span className="block text-sm font-bold text-primary">0{index + 1}</span>
                  <span className="mt-2 block text-sm font-bold text-white">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-white/8 bg-[#071017] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
            <div>
              <h2 className="max-w-[11ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">When this becomes relevant.</h2>
              <p className="mt-7 max-w-[560px] leading-7 text-foreground/68">This is implementation work. It is not a strategy deck, a generic chatbot, or a tool subscription.</p>
            </div>
            <ul className="border-t border-white/18">
              {FIT.map((rule) => (
                <li key={rule} className="grid grid-cols-[28px_1fr] gap-4 border-b border-white/18 py-6 text-base leading-7 text-foreground/76">
                  <Check className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-white/8 px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-[1320px]">
            <h2 className="max-w-[800px] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">What Muditek builds.</h2>
            <div className="mt-12 border-t border-white/16">
              {BUILD.map(([title, detail]) => (
                <div key={title} className="grid gap-3 border-b border-white/16 py-7 md:grid-cols-[260px_1fr]">
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <p className="max-w-[760px] leading-7 text-foreground/66">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/8 bg-white/[0.025] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
            <div>
              <h2 className="max-w-[11ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">What work it can replace.</h2>
              <p className="mt-7 max-w-[560px] leading-7 text-foreground/68">The system takes stable, repeatable steps. Your team keeps judgment, exceptions, approvals, and accountability.</p>
            </div>
            <ul className="border-t border-white/16">
              {REPLACED_WORK.map((item) => (
                <li key={item} className="border-b border-white/16 py-6 text-lg font-semibold text-white">{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-white/8 bg-[#081721] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
            <h2 className="max-w-[11ch] text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">How this relates to outbound.</h2>
            <div>
              <p className="max-w-[730px] text-lg leading-8 text-foreground/72">Appointment setting is the front-door offer. It uses the same implementation capability for research, data handling, routing, reporting, and controlled follow-up.</p>
              <p className="mt-6 max-w-[730px] text-lg leading-8 text-foreground/72">AI implementation becomes the right conversation when the valuable workflow is inside your business rather than inside the outbound campaign.</p>
            </div>
          </div>
        </section>

        <section className="px-6 py-28 text-center md:px-12 md:py-40">
          <div className="mx-auto max-w-[850px]">
            <h2 className="text-balance text-4xl font-black leading-[0.98] tracking-[-0.03em] md:text-6xl">Bring one workflow that keeps repeating.</h2>
            <p className="mx-auto mt-7 max-w-[650px] text-lg leading-8 text-foreground/70">The review call maps the steps, inputs, exceptions, systems, and approvals before any build is proposed.</p>
            <TrackedBookingLink asset="ai-implementation" lane="ai-implementation" placement="final-cta" className="mt-10 inline-flex min-h-14 items-center justify-center gap-3 rounded-[2px] bg-primary px-8 text-sm font-extrabold text-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white">
              Review an AI workflow <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </TrackedBookingLink>
            <p className="mt-3 text-sm text-foreground/56">This opens Muditek&apos;s 45-minute fit-call calendar in a new tab. Continue as guest if needed.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
