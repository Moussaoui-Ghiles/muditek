import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { MudikitCta } from "@/components/mudikit-cta";
import { FaqBlock } from "@/components/faq-block";
import { NewsletterInline } from "@/components/newsletter-inline";
import { BOOK_PATH } from "@/lib/booking";

export const metadata: Metadata = {
  title: "AI Transformation Partner | Workflow Audit, Build, Adoption | Muditek",
  description:
    "Muditek audits how your work happens, packages what your team knows into files AI can execute, builds the systems on top, and trains your people to run them.",
  alternates: { canonical: "https://muditek.com/ai-transformation" },
  openGraph: {
    title: "AI Transformation Partner | Muditek",
    description:
      "Workflow audit, the three folders that make your business AI-executable, the automations built and live, and a team trained to keep them running.",
    url: "https://muditek.com/ai-transformation",
    type: "website",
  },
};

const FOLDERS = [
  {
    name: "business-context/",
    files: ["who-we-are.md", "how-we-talk.md", "who-we-serve.md", "what-good-looks-like.md"],
    what: "The system prompt for the whole company. Who you are, how you talk, who you serve, what good looks like.",
  },
  {
    name: "workflows/",
    files: ["proposal-drafting.md", "renewal-handling.md", "lead-research.md", "weekly-report.md"],
    what: "Every recurring task written as an instruction a model can follow. Stored in one place, versioned.",
  },
  {
    name: "past-work/",
    files: ["proposals/", "calls/", "onboarding/", "emails-that-closed/"],
    what: "Your history, exported and organised. The reason the output sounds like you instead of like a chatbot.",
  },
];

const OFFERS = [
  {
    id: "audit",
    title: "Audit and roadmap",
    tag: "Buy the advice",
    body: "We sit with the people doing the work and map how it happens. Every activity gets tagged: automate now, augment with AI, keep human. You leave with a ranked roadmap your own team or any vendor can execute. If the audit finds nothing worth building, you do not pay for it.",
    items: ["Workflow audit with the people doing the work", "Automate, augment, or keep human tagging", "Ranked roadmap and build specification", "Executive session to align on priorities"],
  },
  {
    id: "build",
    title: "Systems built for you",
    tag: "Buy the build",
    body: "The three folders, then agents and automations built on top of them inside the tools your team already uses. Lead research, reply handling, reporting, proposal drafting, content pipelines. Tested on real work and handed over as files you own. A monthly retainer keeps it evolving if you want us to stay.",
    items: ["Business context, workflow repository, past work", "The highest-impact automations built and live", "Agents that run on a schedule", "Everything in your accounts, in your name"],
  },
  {
    id: "coaching",
    title: "Coaching for your team",
    tag: "Buy the training",
    body: "For companies that want their own people to run it. Working sessions on your real workflows: how to write instructions a model can follow, how to keep the folders current, how to extend the automations. A playbook for keeping it running, and a monthly review if you want one.",
    items: ["Working sessions on your actual workflows", "The keep-it-running playbook", "Monthly review and new workflows, optional", "For founders, operators, and the people doing the work"],
  },
];

const PHASES = [
  { n: "1", title: "Identify", body: "A time study across the team. Every role broken into activities, every activity tagged and ranked. You see the map before anything gets built." },
  { n: "2", title: "Build", body: "The three folders first, then the automations that rank highest, inside your stack. Built on your context." },
  { n: "3", title: "Adopt", body: "Training, the playbook, and an optional retainer with a monthly report of what ran and what it replaced. A system nobody maintains dies within a quarter, so maintenance is part of the handover." },
];

const FAQ = [
  { q: "We already use ChatGPT and Claude every day.", a: "Good, that is where this starts. Without your context, your workflows, and your past work packaged for it, every tool produces generic output and needs a human to fix it. The three folders are what turn the tools you already pay for into work you can ship." },
  { q: "Our team will not adopt it.", a: "Adoption is a phase of the engagement with its own deliverables: training, a playbook, and a retainer if you want it. The systems are built inside the tools your team already opens every morning." },
  { q: "Why not hire someone in-house?", a: "You can, and a good hire is worth it later. The audit and the three folders are what that person would need on day one anyway. Most companies do this engagement first, then decide whether a hire is needed." },
  { q: "What if it does not work?", a: "Each phase has defined deliverables. If a deliverable is not met, you do not pay for that phase. The audit itself is free if it finds nothing worth building." },
  { q: "Who is this not for?", a: "Solo founders with no team, companies that want a strategy deck and no implementation, and anyone who wants a chatbot bolted on. There has to be real work happening in the company and a willingness to share how it happens." },
];

function Arrow() {
  return (
    <svg className="btn-icon" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AiTransformationPage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      <JsonLd
        data={[{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "AI Transformation",
          provider: { "@id": "https://muditek.com/#organization" },
          description: "Workflow audit, AI-executable business context and workflow repository, automations built inside the client's tools, and team training.",
          url: "https://muditek.com/ai-transformation",
          areaServed: "Worldwide",
        }, {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
            { "@type": "ListItem", position: 2, name: "AI Transformation", item: "https://muditek.com/ai-transformation" },
          ],
        }]}
      />
      <Navbar />

      {/* HERO */}
      <section className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-20 md:pb-28 grid gap-14 lg:grid-cols-12 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <p className="text-base font-bold text-primary mb-8">AI transformation</p>
              <h1 className="text-5xl sm:text-6xl lg:text-[84px] font-black tracking-[-0.04em] leading-[0.92] text-foreground text-balance mb-8">
                Your team uses AI all day. It still <span className="text-primary">needs you.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-xl md:text-2xl text-foreground/85 leading-[1.5] max-w-[52ch] mb-10">
                The tools are not the problem. Nobody wrote down who you are, how you talk, and how the work gets done in a form a model can execute. So every output is generic and every task still needs a human in the loop. We fix that, then build on it.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={180}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <a href={BOOK_PATH} className="btn btn-solid">Book a call<Arrow /></a>
                <Link href="#offers" className="btn btn-outline">What you can buy</Link>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={240} className="lg:col-span-5">
            <div className="panel">
              <div className="panel-bar"><span>your-company/</span><span>readable by any model</span></div>
              <div className="panel-body">
                {FOLDERS.map((f) => (
                  <div key={f.name} className="mb-4 last:mb-0">
                    <div className="panel-amber font-bold">{f.name}</div>
                    {f.files.map((file) => (
                      <div key={file} className="pl-5 flex gap-2"><span className="panel-dim">├</span><span>{file}</span></div>
                    ))}
                  </div>
                ))}
                <div className="panel-dim mt-4 border-t border-white/[0.06] pt-3">three folders. every tool you pay for reads them.</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* THE THREE FOLDERS */}
      <section className="w-full border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <ScrollReveal>
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance max-w-[24ch] mb-16">
              Three folders. After them, every tool you already pay for knows your business.
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-10 md:gap-8 border-t border-white/[0.08] pt-10">
            {FOLDERS.map((f, i) => (
              <ScrollReveal key={f.name} delay={i * 100}>
                <p className="font-mono text-sm text-primary mb-4">{f.name}</p>
                <p className="text-[17px] text-foreground/85 leading-[1.65] max-w-[38ch]">{f.what}</p>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={300}>
            <p className="mt-16 text-lg md:text-xl text-foreground/85 leading-[1.6] max-w-[62ch]">
              With those in place, drafting sounds like you. Answers about how you handle things match how you handle things. The automations built on top run on your context. And when someone leaves, what they knew stays in the folder. Muditek runs this way: the outbound engine, the research, the proposals, the content.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* WHAT YOU CAN BUY */}
      <section id="offers" className="w-full band-warm border-t border-[color:var(--surface-warm-line)] scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <ScrollReveal>
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance max-w-[22ch] mb-4">
              Three things you can buy. Each stands on its own.
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 leading-[1.6] max-w-[50ch] mb-16">Buy the advice, buy the build, or buy the training. Or all three, in that order.</p>
          </ScrollReveal>

          <div className="border-t border-white/[0.08]">
            {OFFERS.map((o, i) => (
              <ScrollReveal key={o.id} delay={i * 80}>
                <article id={o.id} className="grid gap-6 lg:grid-cols-12 lg:gap-12 py-12 md:py-14 border-b border-white/[0.08] scroll-mt-24">
                  <div className="lg:col-span-4">
                    <p className="text-sm text-primary font-bold mb-3">{o.tag}</p>
                    <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] text-foreground">{o.title}</h3>
                  </div>
                  <div className="lg:col-span-8">
                    <p className="text-lg md:text-xl text-foreground/85 leading-[1.6] max-w-[60ch] mb-8">{o.body}</p>
                    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                      {o.items.map((item) => (
                        <li key={item} className="text-base text-foreground/85 flex items-start gap-3">
                          <span className="w-1.5 h-1.5 mt-2 rounded-full bg-primary shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="w-full border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <ScrollReveal>
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance max-w-[22ch] mb-16">
              How every engagement runs.
            </h2>
          </ScrollReveal>
          <ol className="grid md:grid-cols-3 gap-10 md:gap-8">
            {PHASES.map((p, i) => (
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

      {/* WHO */}
      <section className="w-full band-warm border-t border-[color:var(--surface-warm-line)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <ScrollReveal className="lg:col-span-7">
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance max-w-[20ch] mb-6">
              A real team, real recurring work, and a founder who is done babysitting the tools.
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 leading-[1.6] max-w-[52ch]">
              B2B companies with people doing repetitive knowledge work, a decision maker on the call, and a willingness to share how the work actually happens. You do not need an internal AI team. That is the part we do.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120} className="lg:col-span-5 lg:pt-14">
            <ul className="border-t border-white/[0.08]">
              {["B2B, with a team", "Founder or COO on the call", "Already using AI every day", "Willing to show how the work happens"].map((t) => (
                <li key={t} className="py-4 border-b border-white/[0.08] text-base font-bold text-foreground">{t}</li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <FaqBlock items={FAQ} />

      <MudikitCta
        variant="inline"
        headline="See the systems before you buy them."
        body="The skills and resources in the library are the files we install. Read them, download them, run them."
      />

      <NewsletterInline source="ai-transformation" />

      {/* FINAL CTA */}
      <section id="contact" className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-28 md:py-40 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.92] text-balance mb-8 max-w-[16ch] mx-auto">
              Tell us where the work piles up.
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 max-w-[48ch] mx-auto mb-12 leading-relaxed">
              A few answers, then a slot on the calendar. On the call we tell you what is worth automating, what to leave alone, and what the audit would look like.
            </p>
            <a href={BOOK_PATH} className="btn btn-solid">Book a call<Arrow /></a>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
