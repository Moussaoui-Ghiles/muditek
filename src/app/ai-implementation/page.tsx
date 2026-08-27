import type { Metadata } from "next";
import Link from "next/link";
import { AcquisitionPageView, TrackedBookingLink } from "@/components/acquisition-tracking";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "AI Implementation for Owned Workflows | Muditek",
  description: "Scope and build one AI workflow with explicit data, permissions, review points, fallbacks, and operating controls.",
  alternates: { canonical: "https://muditek.com/ai-implementation" },
  openGraph: {
    title: "AI Implementation for Owned Workflows | Muditek",
    description: "Scope and build one AI workflow with explicit data, permissions, review points, fallbacks, and operating controls.",
    url: "https://muditek.com/ai-implementation",
    type: "website",
  },
};

const INITIAL_SCOPE = [
  ["Workflow definition", "Current steps, owner, inputs, handoffs, failure conditions, and the decision the system must support."],
  ["Working implementation", "Only the data and tools required for the agreed workflow."],
  ["Operating controls", "Permissions, logs, human review points, fallbacks, and completion rules."],
  ["Handover", "Operating notes, test cases, and a queue of observed failures to correct."],
] as const;

const DELIVERY_STEPS = [
  ["01", "Define the operating problem", "Fix the owner, source data, current handoffs, failure conditions, and decision the system must support."],
  ["02", "Build the smallest useful system", "Connect the required data and tools. Set permissions, logs, review points, and fallbacks before wider use."],
  ["03", "Operate and correct it", "Measure the workflow outcome. Fix observed failures before adding features."],
] as const;

const APPLICATIONS = [
  { id: "operations", title: "Operational workflows", text: "Intake, document, data, review, and reporting systems with explicit state and ownership." },
  { id: "mudiagent", title: "Local knowledge systems", text: "Local agent workflows with defined data boundaries, approved tools, and human review points." },
  { id: "content", title: "Content operations", text: "Source capture, drafting, quality review, approval, and publishing in one controlled workflow." },
  { id: "governance", title: "Controlled action systems", text: "Permissions, audit trails, exception handling, and completion rules for systems that can take action." },
] as const;

const TECHNICAL_EVIDENCE = [
  {
    title: "Loop Design",
    description: "Define agent state, review points, and completion boundaries.",
    href: "/playbooks/loop-design-playbook",
  },
  {
    title: "AI Data Agent Guide",
    description: "Define sources, transformations, and review for a data workflow.",
    href: "/playbooks/ai-data-agent-guide",
  },
  {
    title: "Local AI Build Guide",
    description: "Plan a local system around data boundaries, hardware, and operations.",
    href: "/playbooks/local-ai-build-guide",
  },
  {
    title: "Judgment Moat",
    description: "Keep human judgment explicit and reviewable inside an agent system.",
    href: "/playbooks/judgment-moat",
  },
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
        description: "Scope and build one AI workflow with explicit data, permissions, review points, fallbacks, and operating controls.",
        provider: { "@id": "https://muditek.com/#organization" },
        url: "https://muditek.com/ai-implementation",
      }} />

      <main id="main-content">
        <header className="relative overflow-hidden border-b border-white/[0.06] pb-16 pt-36 md:pb-20 md:pt-44">
          <div className="absolute right-[8%] top-28 h-80 w-80 rounded-full bg-primary/[0.07] blur-[120px]" aria-hidden="true" />
          <div className="relative mx-auto grid w-full max-w-[1500px] gap-12 px-6 md:px-12 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.22em] text-primary"><span className="h-px w-8 bg-primary" /> AI implementation</p>
              <h1 className="mt-7 max-w-[900px] text-5xl font-black leading-[0.93] tracking-[-0.04em] sm:text-6xl md:text-[76px]">
                Turn one owned workflow into a <span className="font-medium italic text-primary">working AI system.</span>
              </h1>
              <p className="mt-7 max-w-[720px] text-base leading-8 text-foreground/75 md:text-lg">
                Muditek scopes and builds AI around an existing process, its owner, source data, permissions, review points, and failure conditions.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <TrackedBookingLink asset="ai-implementation" lane="ai-implementation" placement="hero-primary" className="inline-flex min-h-14 items-center justify-center rounded-[2px] bg-primary px-7 text-center text-xs font-black uppercase tracking-[0.16em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background">
                  Book a workflow scoping call
                </TrackedBookingLink>
                <Link href="/library?lane=ai-implementation" className="inline-flex min-h-14 items-center justify-center rounded-[2px] border border-white/[0.16] px-7 text-center text-xs font-black uppercase tracking-[0.16em] text-foreground hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background">
                  Review technical material
                </Link>
              </div>
              <div className="mt-8 max-w-[760px] border-t border-white/[0.12] pt-5">
                <p className="text-sm leading-6 text-foreground/68"><strong className="text-foreground">A good first project:</strong> a recurring workflow that is slow, fragmented, or error-prone. One person owns it and can show how it works today.</p>
              </div>
            </div>

            <aside aria-labelledby="initial-scope-heading" className="border-y border-white/[0.14] bg-card/30 px-1 py-6 sm:px-6 lg:mt-1">
              <h2 id="initial-scope-heading" className="text-2xl font-black tracking-[-0.025em] text-foreground">What the first implementation includes</h2>
              <dl className="mt-5 border-t border-white/[0.1]">
                {INITIAL_SCOPE.map(([term, detail]) => (
                  <div key={term} className="border-b border-white/[0.08] py-4">
                    <dt className="text-sm font-black text-foreground">{term}</dt>
                    <dd className="mt-1 text-xs leading-5 text-foreground/65">{detail}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 border border-primary/25 bg-primary/[0.05] p-4">
                <p className="text-xs leading-5 text-foreground/72"><strong className="text-primary">Working boundary.</strong> One workflow. Approved sources and tools. Named human review. No speculative feature list.</p>
              </div>
            </aside>
          </div>
        </header>

        <section className="border-b border-white/[0.06] py-20 md:py-28">
          <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
            <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
              <div>
                <h2 className="text-4xl font-black leading-none tracking-[-0.035em] md:text-5xl">Define it. Build it. Operate it.</h2>
                <p className="mt-5 max-w-[48ch] text-base leading-7 text-foreground/68">The sequence is deliberately narrow. Each step has a named output before the next one begins.</p>
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

        <section id="applications" className="border-b border-white/[0.06] py-20 md:py-28">
          <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
            <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr]">
              <div>
                <h2 className="max-w-xl text-4xl font-black leading-none tracking-[-0.035em] md:text-6xl">Workflows we can scope.</h2>
                <p className="mt-6 max-w-[52ch] text-base leading-7 text-foreground/70">These are examples of the work. They are not client results.</p>
              </div>
              <div className="border-y border-white/[0.12]">
              {APPLICATIONS.map((application) => (
                <article id={application.id} key={application.id} className="scroll-mt-28 grid gap-3 border-b border-white/[0.1] py-6 last:border-b-0 sm:grid-cols-[220px_1fr] sm:gap-8">
                  <h3 className="text-xl font-black tracking-[-0.02em] text-primary">{application.title}</h3>
                  <p className="max-w-[62ch] text-sm leading-6 text-foreground/68">{application.text}</p>
                </article>
              ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] py-20 md:py-28">
          <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 md:px-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <h2 className="text-4xl font-black leading-none tracking-[-0.035em] md:text-5xl">Inspect the operating approach.</h2>
              <p className="mt-6 max-w-[54ch] text-base leading-7 text-foreground/70">Read how the system handles state, data, review, local operation, and human judgment before you book.</p>
              <Link href="/library?lane=ai-implementation" className="mt-7 inline-flex min-h-12 items-center text-xs font-black uppercase tracking-[0.16em] text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">View all AI material →</Link>
            </div>
            <div className="border-t border-white/[0.1]">
              {TECHNICAL_EVIDENCE.map((item, index) => (
                <Link key={item.href} href={item.href} className="group grid gap-3 border-b border-white/[0.1] py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:grid-cols-[38px_180px_1fr_auto] sm:items-center">
                  <span className="font-mono text-[11px] text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="font-black text-foreground group-hover:text-primary">{item.title}</h3>
                  <p className="text-sm leading-6 text-foreground/65">{item.description}</p>
                  <span aria-hidden="true" className="text-foreground/45 transition-transform group-hover:translate-x-1 group-hover:text-primary">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="build-review" className="scroll-mt-24 py-20 md:py-28">
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 md:grid-cols-[1fr_auto] md:items-end md:px-12">
            <div>
              <h2 className="max-w-3xl text-4xl font-black leading-none tracking-[-0.035em] md:text-6xl">Bring the workflow as it runs today.</h2>
              <p className="mt-6 max-w-[680px] text-base leading-7 text-foreground/70">Bring the current steps, owner, available data, constraints, failure points, and the decision the workflow should improve.</p>
            </div>
            <TrackedBookingLink asset="ai-implementation" lane="ai-implementation" placement="final-cta" className="inline-flex min-h-14 items-center justify-center rounded-[2px] bg-primary px-7 text-center text-xs font-black uppercase tracking-[0.16em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background">
              Book a workflow scoping call
            </TrackedBookingLink>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
