import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FaqBlock } from "@/components/faq-block";
import { MudikitCta } from "@/components/mudikit-cta";
import { NewsletterInline } from "@/components/newsletter-inline";
import { JsonLd } from "@/components/json-ld";
import { BOOK_PATH } from "@/lib/booking";

const ABOUT_FAQ = [
  {
    q: "Who runs Muditek?",
    a: "Ghiles Moussaoui, engineer turned operator. He builds and runs the AI systems behind Muditek and does every client engagement himself with a stack of agents doing the repetitive parts.",
  },
  {
    q: "Where is Muditek based, and who can work with you?",
    a: "Remote, working with clients in Europe and North America. A small number of build clients at a time so each gets full attention. Outbound engagements have wider availability.",
  },
  {
    q: "How do I get started?",
    a: "Read the skills and resources in the library to see how the systems run, or book a call to talk about your own company: AI transformation or outbound.",
  },
  {
    q: "Do you publish anything else?",
    a: "Yes. The newsletter, daily LinkedIn posts, and the public library: downloadable skills, resources, and browser tools taken from the systems we run.",
  },
];

export const metadata: Metadata = {
  title: "About Muditek | Ghiles Moussaoui, AI Transformation and Outbound",
  description:
    "Muditek is run by Ghiles Moussaoui. He audits how work happens, builds the AI systems that run it, and operates outbound engines for B2B companies.",
  alternates: {
    canonical: "https://muditek.com/about",
    types: { "text/markdown": "https://muditek.com/about.md" },
  },
  openGraph: {
    title: "About Muditek | Ghiles Moussaoui, AI Transformation and Outbound",
    description:
      "Muditek is run by Ghiles Moussaoui. AI transformation and outbound systems for B2B companies, built and operated.",
    url: "https://muditek.com/about",
    type: "website",
  },
};

const RUNS_ON = [
  { label: "Proposal drafting", before: "By hand, every time", after: "Drafted by an agent, reviewed by me" },
  { label: "Lead research", before: "Manual, one at a time", after: "Owner names and emails, source cited" },
  { label: "Reply handling", before: "Whenever I got to it", after: "Classified and answered in minutes" },
  { label: "Weekly reporting", before: "Rebuilt every Friday", after: "Generated from the data, on schedule" },
  { label: "Content", before: "Written from scratch", after: "Drafted from my sources, in my voice" },
];

const HOW = [
  { n: "1", title: "Identify", body: "We sit with the people doing the work and map every workflow. Automate, augment, or keep human, ranked by impact. You see the map before any system is built. If the audit finds nothing worth building, you do not pay for it." },
  { n: "2", title: "Build", body: "The three folders that make your business AI-executable, then the automations built on top, inside the tools your team already uses. Your context, your workflows, your past work. Nothing generic." },
  { n: "3", title: "Adopt", body: "Your team learns to update, extend, and maintain it, with a playbook for keeping it running. You own everything. An optional retainer keeps it evolving, but the system runs whether you keep us or not." },
];

const RULES = [
  { title: "Audit first, build second.", body: "Every engagement starts with a workflow audit. Nothing gets built on a guess." },
  { title: "You own everything.", body: "Code, prompts, data, domains, accounts. No SaaS fee, no lock-in, no data in someone else's cloud." },
  { title: "Run, then handed over with training.", body: "Outbound is run by us and paid per meeting held. Systems come with training and an optional retainer." },
  { title: "Everything runs Muditek first.", body: "Every system we sell runs Muditek first. Every one of them ends up as a skill or a resource in the library." },
];

function Arrow() {
  return (
    <svg className="btn-icon" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": "https://muditek.com/about#profilepage",
          url: "https://muditek.com/about",
          dateModified: "2026-09-05",
          mainEntity: { "@id": "https://muditek.com/#ghiles" },
        }}
      />
      <Navbar />

      {/* HERO */}
      <section className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-20 md:pb-28 grid gap-14 lg:grid-cols-12 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <ScrollReveal>
              <p className="text-base font-bold text-primary mb-8">About Muditek</p>
              <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.92] text-foreground text-balance mb-8 max-w-[14ch]">
                We make businesses readable by machines. Then we build the systems that <span className="text-primary">run them.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-xl md:text-2xl text-foreground/85 leading-[1.5] max-w-[54ch]">
                Muditek is an AI transformation partner for B2B companies and the operator behind their outbound. One person, a stack of agents, and everything written down so a machine can read it.
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={200} className="lg:col-span-4">
            <figure className="max-w-[320px]">
              <Image src="/images/ghiles.jpg" alt="Ghiles Moussaoui, founder of Muditek" width={640} height={640} className="w-full aspect-square object-cover rounded-[4px] border border-white/[0.08]" priority />
              <figcaption className="mt-4 text-sm text-foreground/70">
                <span className="block font-bold text-foreground">Ghiles Moussaoui</span>
                Founder. Builds the systems, runs the engagements.
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="w-full border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <ScrollReveal>
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance max-w-[22ch] mb-16">
              How every engagement runs.
            </h2>
          </ScrollReveal>
          <ol className="grid md:grid-cols-3 gap-10 md:gap-8">
            {HOW.map((p, i) => (
              <li key={p.n} className="border-t border-white/[0.08] pt-6">
                <ScrollReveal delay={i * 100}>
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="font-mono text-sm text-primary">{p.n}</span>
                    <h3 className="text-2xl font-black tracking-[-0.02em] text-foreground">{p.title}</h3>
                  </div>
                  <p className="text-[17px] text-foreground/85 leading-[1.65] max-w-[38ch]">{p.body}</p>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* RUNS MUDITEK FIRST */}
      <section className="w-full band-warm border-t border-[color:var(--surface-warm-line)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <ScrollReveal>
              <span className="rule" aria-hidden />
              <h2 className="text-3xl md:text-[44px] font-black tracking-[-0.035em] leading-[0.98] text-foreground text-balance mb-6">
                We built this for ourselves. Then clients asked.
              </h2>
              <p className="text-[17px] text-foreground/80 leading-[1.65] max-w-[40ch]">
                Every line here is a job that used to sit on my desk and now runs on an agent I review. It is the same system we install for clients.
              </p>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-7">
            <ScrollReveal delay={120}>
              <div className="panel">
                <div className="panel-bar"><span>Muditek operations</span><span>running</span></div>
                <div className="panel-body">
                  <div className="grid grid-cols-[1.2fr_1fr_1.4fr] gap-4 pb-3 text-[11px] uppercase tracking-[0.12em] panel-dim">
                    <span>Task</span><span>Before</span><span className="panel-amber">Now</span>
                  </div>
                  {RUNS_ON.map((row) => (
                    <div key={row.label} className="panel-row grid grid-cols-[1.2fr_1fr_1.4fr] gap-4 items-start">
                      <span className="text-foreground font-semibold font-sans text-sm">{row.label}</span>
                      <span className="panel-dim">{row.before}</span>
                      <span className="text-foreground">{row.after}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="w-full border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <ScrollReveal>
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance max-w-[22ch] mb-16">
              Four rules we do not bend.
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10 border-t border-white/[0.08] pt-10">
            {RULES.map((r, i) => (
              <ScrollReveal key={r.title} delay={i * 80}>
                <h3 className="text-xl font-black tracking-[-0.01em] text-foreground mb-3">{r.title}</h3>
                <p className="text-[17px] text-foreground/85 leading-[1.65] max-w-[44ch]">{r.body}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="w-full band-warm border-t border-[color:var(--surface-warm-line)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <ScrollReveal>
              <span className="rule" aria-hidden />
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.035em] leading-[0.95] text-foreground">Ghiles Moussaoui</h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={100} className="lg:col-span-8">
            <p className="text-lg md:text-xl text-foreground/85 leading-[1.6] max-w-[60ch] mb-8">
              I build AI systems that run business operations, and I run them. Muditek works the way I tell clients to work: the business written down so a machine can read it, agents doing the repetitive parts, me reviewing. Every system I ship ends up as a skill or a resource in the library, and the newsletter is where I write up how it went.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <a href="mailto:ghiles@muditek.com" className="text-base font-bold text-foreground underline underline-offset-4 decoration-primary/60 hover:text-primary transition-colors">ghiles@muditek.com</a>
              <a href="https://www.linkedin.com/in/ghiles-moussaoui-b36218250/" target="_blank" rel="noopener noreferrer" className="text-base font-bold text-foreground/70 hover:text-foreground transition-colors">LinkedIn</a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <FaqBlock items={ABOUT_FAQ} />

      <MudikitCta
        headline="Or skip the call. Start with the library."
        body="Skills, resources, and browser tools taken from the systems we run. Free with a portal account."
      />

      <NewsletterInline source="about" />

      {/* CTA */}
      <section className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-28 md:py-40 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.92] text-balance mb-8 max-w-[18ch] mx-auto">
              Stop paying people to do work a machine should handle.
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 max-w-[46ch] mx-auto mb-12 leading-relaxed">
              A few answers, then a slot on the calendar. On the call we tell you whether it is worth building, and what it would take.
            </p>
            <a href={BOOK_PATH} className="btn btn-solid">Book a call<Arrow /></a>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
