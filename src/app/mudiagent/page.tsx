import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { NewsletterInline } from "@/components/newsletter-inline";
import { LeadMagnetGate } from "@/components/lead-magnet-gate";

export const metadata: Metadata = {
  title: "mudiAgent | Digital Employees for Telecom & Enterprise | Muditek",
  description: "On-premises AI that automates SLA reporting, knowledge search, follow-ups, and software operation. Free discovery audit. 40-hour guarantee.",
  openGraph: {
    title: "mudiAgent | Digital Employees for Telecom & Enterprise",
    description: "On-premises AI that automates SLA reporting, knowledge search, follow-ups, and software operation. No cloud. No per-user fees. 40-hour guarantee.",
  },
};

const BEFORE_AFTER = [
  { label: "Weekly SLA report", before: "2-3 days", after: "Under 1 hr" },
  { label: "Knowledge search", before: "45 min", after: "10 sec" },
  { label: "Field report formatting", before: "90 min", after: "Automatic" },
  { label: "Follow-ups", before: "Falling through cracks", after: "24/7, automatic" },
  { label: "Proposal drafting", before: "4 hrs", after: "12 min" },
  { label: "Competitor monitoring", before: "Manual, sporadic", after: "Daily, 7am" },
];

const CHATGPT_COMPARISON = [
  { category: "Your data", chatgpt: "Uploaded to US/EU servers. Zero control over access.", mudiagent: "Stays in your office. Full audit trail. Your infrastructure." },
  { category: "Workflow automation", chatgpt: "Can't read WhatsApp. Can't send emails. Can't fill your CRM. Can't run at 6 am.", mudiagent: "Reads WhatsApp, sends emails, fills forms, operates CRM/ERP, runs on a timer." },
  { category: "Cost at scale", chatgpt: "Per-user pricing. 100 people = significant recurring cost, scaling with every hire.", mudiagent: "One device. Everyone uses it. No per-user fees." },
  { category: "Memory", chatgpt: "Forgets every conversation. Doesn't know your templates or procedures.", mudiagent: "Trained on your documents. Builds institutional knowledge that compounds." },
  { category: "Concurrent users", chatgpt: "One person at a time. No shared workflows.", mudiagent: "20-50 concurrent users. Company-wide intelligence." },
];

const FAQ = [
  { q: "We can build this ourselves with ChatGPT.", a: "ChatGPT can't read your WhatsApp, send emails, fill your CRM, or run at 6 am. It's a conversation tool. You type, it responds, and it forgets everything. mudiAgent is a digital employee that executes real work on your infrastructure, autonomously, on schedule, and remembers everything." },
  { q: "What about data security?", a: "Everything runs on a device in your office. Your data never touches the internet. 82% of data breaches involve cloud-stored data (IBM 2024). mudiAgent eliminates that risk entirely. Full audit trail. Complete data sovereignty." },
  { q: "What if it doesn't work?", a: "If mudiAgent doesn't save your team at least 40 hours in the first 90 days, we reconfigure until it does, at no additional cost. Most deployments recover 40+ hours in the first month. We guarantee a fraction of the expected result." },
  { q: "How long does deployment take?", a: "Week 1: free discovery audit to map your workflows. Week 2-4: configure and deploy. First agents go live doing real work within the first month. No multi-year implementation projects." },
  { q: "What systems does it connect to?", a: "CRM, ERP, ticketing systems (ServiceNow, Jira), NMS, OSS/BSS, Google Workspace, SharePoint, email, WhatsApp, Telegram, Slack, databases, vendor portals, browsers. If a human can use it at a desk, mudiAgent can operate it." },
];

export default function MudiAgentPage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "mudiAgent",
          provider: { "@type": "Organization", name: "Muditek", url: "https://muditek.com" },
          description: "On-premises AI digital employees for telecom and enterprise. Automates SLA reporting, knowledge search, follow-ups, and software operation.",
          url: "https://muditek.com/mudiagent",
          areaServed: "Worldwide",
          offers: [
            { "@type": "Offer", name: "Free Discovery Audit", price: "0", priceCurrency: "EUR", description: "Written automation roadmap in 1 week." },
            { "@type": "Offer", name: "Pilot Deployment", price: "15000", priceCurrency: "EUR", description: "One agent, one workflow. Live in 4 weeks." },
            { "@type": "Offer", name: "Monthly Retainer", price: "3000", priceCurrency: "EUR", description: "Monitoring, optimization, support, scaling." },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <Navbar />

      {/* ══════ HERO — NARRATIVE PROBLEM (PAS: Problem) ══════ */}
      <section className="pt-32 md:pt-44 pb-24 md:pb-32 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />

        {/* Image placeholder — replace with generated hero image */}
        <div className="absolute inset-0 z-0 opacity-[0.04]" aria-hidden="true">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        </div>

        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <Image src="/icon.svg" alt="Muditek" width={32} height={32} />
              <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary/50" />
                Muditek / mudiAgent
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-7xl lg:text-[88px] font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-12 text-balance">
              Your best engineers are compiling <span className="text-primary italic font-medium">reports.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <div className="max-w-3xl space-y-6 text-base md:text-lg text-foreground/70 font-light leading-relaxed mb-6">
              <p>Your NOC engineer opens 4 systems every Monday morning. Six hours later, they email a report that follows the exact same structure every single week. Down the hall, someone spends 45 minutes searching a shared drive for a procedure document they saw last month. Your field team gets back from site and someone spends 90 minutes formatting their notes into a report.</p>
              <p>Every person in your operations — from the NOC engineer running alarm correlation to the project manager chasing subcontractor updates — is spending a third of their week on work that follows the same pattern every time. The same sources, the same format, the same steps.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={220}>
            <p className="text-sm text-foreground/50 italic max-w-2xl mb-14">
              It&apos;s not that your people aren&apos;t good. It&apos;s that the work isn&apos;t worthy of them.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Link href="#contact" className="group relative px-10 py-5 bg-foreground text-background font-black text-sm uppercase tracking-[0.2em] overflow-hidden rounded-[2px] hover:scale-[1.02] transition-transform duration-300 btn-press">
                <span className="relative z-10 flex items-center gap-3">
                  Book a Free Discovery Audit
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div className="absolute inset-0 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-in-out z-0" />
              </Link>
              <Link href="#transformation" className="px-8 py-5 border border-white/[0.1] text-foreground text-sm font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-white/[0.02] transition-colors btn-press">
                See What Changes
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ IMAGE BREAK ══════ */}
      <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden">
        <Image src="/images/noc-center.png" alt="" fill className="object-cover" style={{ filter: 'sepia(0.4) saturate(1.6) hue-rotate(-10deg) brightness(0.6)' }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      {/* ══════ WHAT CHANGES (PAS: Solution) ══════ */}
      <section id="transformation" className="py-32 md:py-48 w-full flex justify-center relative border-t border-white/[0.02]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              What Changes
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-8 max-w-3xl">
              Not a chatbot. A digital <span className="text-primary italic font-medium">employee.</span>
            </h3>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div className="max-w-3xl space-y-4 text-base text-foreground/70 font-light leading-relaxed mb-16">
              <p>mudiAgent sits inside your communication channels: WhatsApp, Telegram, Slack, email. You message it like a colleague. It messages back completed work. No new interface. No training. No workflow changes.</p>
              <p>If a human can use it at a desk, mudiAgent can operate it. CRM, ERP, ticketing, file servers, vendor portals. All connected.</p>
              <p>It runs without being asked. Daily reports at 6 am. Weekly summaries on Friday. Follow-ups when they&apos;re due. Monitoring around the clock. Set once, runs forever.</p>
              <p>And everything stays inside your building. The device sits in your office. Your documents, your customer data, your network topology. Processed locally. No cloud. No third-party servers. No per-user fees.</p>
            </div>
          </ScrollReveal>

          {/* Before/After Table — CRO: specific proof of transformation */}
          <div className="border border-white/[0.05] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl">
            <div className="grid grid-cols-4 px-8 py-6 border-b border-white/[0.05] text-sm font-black uppercase tracking-[0.15em] text-foreground/60 bg-white/[0.01]">
              <div className="col-span-2">Workflow</div>
              <div>Before</div>
              <div className="text-primary">After mudiAgent</div>
            </div>
            {BEFORE_AFTER.map((row, i) => (
              <ScrollReveal key={row.label} delay={i * 60}>
                <div className={`group grid grid-cols-4 px-8 py-8 items-center stat-row cursor-default ${i < BEFORE_AFTER.length - 1 ? "border-b border-white/[0.02]" : ""}`}>
                  <div className="col-span-2 text-sm font-bold tracking-[0.1em] uppercase text-foreground/70 group-hover:text-foreground transition-colors">{row.label}</div>
                  <div className="text-sm font-mono text-foreground/50 line-through tracking-wider">{row.before}</div>
                  <div className="text-base font-mono font-black tracking-wider text-primary/90 group-hover:text-primary drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">{row.after}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ NEWSLETTER ══════ */}
      <NewsletterInline tags={["source:mudiagent", "segment:telecom"]} />

      {/* ══════ CHATGPT COMPARISON — Marketing Psychology: contrast effect + loss aversion ══════ */}
      <section className="py-32 md:py-48 w-full flex justify-center relative overflow-hidden border-t border-white/[0.02] bg-card/[0.15]">
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Why Not ChatGPT
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-6 max-w-3xl">
              Cloud AI costs 3-5x more at scale <span className="text-primary italic font-medium">(a16z)</span> and still can&apos;t do the work.
            </h3>
            <p className="text-base text-foreground/60 font-light max-w-2xl mb-16">
              ChatGPT can&apos;t read your WhatsApp, send your emails, fill your CRM, or run at 6 am. It&apos;s a chatbox. You type, it responds, and it forgets everything. mudiAgent is a digital employee that does the work.
            </p>
          </ScrollReveal>

          <div className="border border-white/[0.05] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl">
            <div className="grid grid-cols-3 px-8 py-6 border-b border-white/[0.05] text-sm font-black uppercase tracking-[0.15em] text-foreground/60 bg-white/[0.01]">
              <div>What Matters</div>
              <div className="text-red-400/70">ChatGPT / Copilot</div>
              <div className="text-primary">mudiAgent</div>
            </div>
            {CHATGPT_COMPARISON.map((row, i) => (
              <ScrollReveal key={row.category} delay={i * 60}>
                <div className={`group grid grid-cols-3 px-8 py-7 items-start stat-row cursor-default ${i < CHATGPT_COMPARISON.length - 1 ? "border-b border-white/[0.02]" : ""}`}>
                  <div className="text-sm font-bold tracking-[0.1em] uppercase text-foreground/60">{row.category}</div>
                  <div className="text-sm text-foreground/60 leading-relaxed pr-4">{row.chatgpt}</div>
                  <div className="text-sm text-foreground/80 font-medium leading-relaxed">{row.mudiagent}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PROCESS — 3 PHASES — CRO: reduce perceived complexity ══════ */}
      <section className="py-32 md:py-48 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Process
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16">
              From audit to deployment in <span className="text-primary italic font-medium">4 weeks.</span>
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Free Discovery Audit", time: "Week 1", body: "We map the workflows that eat your team's time. Identify the top 3 highest-impact automation targets. Estimate the hours and cost you'd recover. You get a written automation roadmap, even if you go no further.", metric: "Your effort: 30 minutes", highlight: "Free. 30 minutes of your time" },
              { num: "02", title: "Configure & Deploy", time: "Week 2-4", body: "mudiAgent arrives pre-configured. Connected to your email, WhatsApp, CRM, ticketing system, file servers. Trained on your documents and templates. First agents go live doing real work. Not demos, not proofs of concept.", metric: "Starting at €15,000", highlight: "No per-user fees" },
              { num: "03", title: "Prove & Scale", time: "Month 2-3", body: "We measure everything. Hours saved. Reports produced. Response times cut. You see the numbers. Then we scale. More workflows, more departments, more sites.", metric: "Retainer from €3,000/mo", highlight: "Pays for itself in month 1" },
            ].map((phase, i) => (
              <ScrollReveal key={phase.num} delay={i * 100}>
                <div className="group relative h-full border border-white/[0.05] bg-card/[0.2] hover:bg-card/[0.5] backdrop-blur-md p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 card-lift">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-[1.2s]" />
                  <div>
                    <span className="text-5xl font-black text-foreground/[0.06] block mb-6">{phase.num}</span>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-black tracking-[0.05em] text-foreground">{phase.title}</h4>
                      <span className="text-sm font-mono text-primary/60 tracking-wider uppercase">{phase.time}</span>
                    </div>
                    <p className="text-sm font-mono text-primary/80 tracking-wider uppercase mb-5">{phase.highlight}</p>
                    <p className="text-base text-foreground/70 font-light leading-relaxed">{phase.body}</p>
                  </div>
                  <div className="pt-6 mt-8 border-t border-white/[0.05]">
                    <span className="text-sm font-mono text-foreground/60 tracking-wider uppercase">{phase.metric}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ LEAD MAGNET ══════ */}
      <LeadMagnetGate
        title="3 Workflows Every Telecom Can Automate This Quarter"
        description="A free guide to the highest-ROI automation targets for telecom and enterprise operations — with time savings estimates and implementation complexity ratings."
        tags={["source:mudiagent", "segment:telecom", "lead-magnet:telecom-workflows"]}
        accentColor="primary"
      />

      {/* ══════ PRICING — Anchoring + Mental Accounting + Loss Aversion ══════ */}
      <section className="py-32 md:py-48 w-full flex justify-center relative border-t border-white/[0.02]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              The Cost of Waiting
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-6 max-w-3xl">
              The math on doing <span className="text-primary italic font-medium">nothing.</span>
            </h3>
            <p className="text-base text-foreground/60 font-light max-w-2xl mb-16">
              Your team spends 30-40% of their week on repetitive work. For a mid-size operation, that&apos;s 3,000+ hours and €200K+ per year, on work that follows the same pattern every time.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Cost of doing nothing — Loss Aversion framing */}
            <ScrollReveal delay={80}>
              <div className="border border-red-500/[0.1] bg-red-500/[0.02] p-10 rounded-[4px]">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-red-400/70 mb-6 block">What you lose by waiting</span>
                <div className="space-y-5">
                  <div>
                    <span className="text-2xl font-black text-foreground/80 font-mono">832 hrs/year</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">20 hrs/week manual reporting × 52 weeks × 80% automatable</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-foreground/80 font-mono">2,500+ hrs/year</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">20 people × 5 searches/day × 30 min each. mudiAgent: 10 seconds.</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-foreground/80 font-mono">€200K+/year</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">That&apos;s 2-3 engineers&apos; salaries, spent on work a machine should do</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Muditek pricing — Anchoring against waste cost */}
            <ScrollReveal delay={160}>
              <div className="border border-primary/[0.15] bg-primary/[0.03] p-10 rounded-[4px]">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6 block">What mudiAgent costs</span>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-foreground font-mono">€0</span>
                      <span className="text-sm font-mono text-primary/60 tracking-wider">Discovery Audit</span>
                    </div>
                    <p className="text-sm text-foreground/60 font-light mt-1">Free. Written roadmap in 1 week. No commitment.</p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-foreground font-mono">€15K</span>
                      <span className="text-sm font-mono text-primary/60 tracking-wider">Pilot deployment</span>
                    </div>
                    <p className="text-sm text-foreground/60 font-light mt-1">One agent, one workflow. Live in 4 weeks. You own it.</p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-foreground font-mono">€3K</span>
                      <span className="text-sm font-mono text-primary/60 tracking-wider">/month retainer</span>
                    </div>
                    <p className="text-sm text-foreground/60 font-light mt-1">Monitoring. Optimization. Support. Scale when ready.</p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-primary/[0.1]">
                  <p className="text-sm text-foreground/50 font-mono tracking-wider">No per-user fees. No cloud costs. No subscription. The system is yours.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Pricing context — Anchoring against alternatives */}
          <ScrollReveal delay={240}>
            <div className="border border-white/[0.05] bg-card/[0.2] p-8 rounded-[4px]">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground/50 mb-4 block">For context</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="text-foreground/60 font-medium block mb-1">ChatGPT Enterprise</span>
                  <span className="text-foreground/50 font-light">Per-user pricing × 50 users = significant annual cost. Still can&apos;t automate one workflow.</span>
                </div>
                <div>
                  <span className="text-foreground/60 font-medium block mb-1">Traditional automation project</span>
                  <span className="text-foreground/50 font-light">€100-300K budget. 6-12 months. External consulting firm.</span>
                </div>
                <div>
                  <span className="text-foreground/60 font-medium block mb-1">Hiring another employee</span>
                  <span className="text-foreground/50 font-light">€60-90K/year loaded cost. Still does the same work manually.</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ URGENCY — Loss Aversion + Scarcity ══════ */}
      <section className="py-32 w-full relative border-t border-b border-white/[0.02] bg-card/[0.2] flex justify-center mesh-subtle">
        <div className="max-w-[1000px] w-full px-6 text-center">
          <ScrollReveal>
            <div className="doppelrand mx-auto mb-16 inline-block">
              <div className="doppelrand-inner px-8 py-3 flex items-center gap-4 bg-background">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-black uppercase tracking-[0.3em] text-primary pt-[1px]">40-Hour Guarantee</span>
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] mb-8 text-balance max-w-3xl mx-auto">
              Every quarter you wait, your competitors get further <span className="text-primary italic font-medium">ahead.</span>
            </h2>

            <p className="text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed font-light mb-8">
              The 88% of telcos that haven&apos;t moved yet are all looking at the same data you&apos;re reading right now. The question isn&apos;t whether to automate. It&apos;s whether you&apos;ll be the one who did it first.
            </p>

            <p className="text-lg md:text-xl font-black text-foreground/80 max-w-2xl mx-auto mb-12">
              If mudiAgent doesn&apos;t save your team at least 40 hours in 90 days, we reconfigure until it does, at no additional cost.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-mono uppercase tracking-wider text-foreground/60 mb-16">
              <span className="px-4 py-2 border border-white/[0.05] rounded-[2px]">Telecom Operators</span>
              <span className="px-4 py-2 border border-white/[0.05] rounded-[2px]">Traders & Integrators</span>
              <span className="px-4 py-2 border border-white/[0.05] rounded-[2px]">50+ Employees</span>
              <span className="px-4 py-2 border border-white/[0.05] rounded-[2px]">OSS/BSS + CRM</span>
              <span className="px-4 py-2 border border-white/[0.05] rounded-[2px]">Data Sensitive</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ FAQ — Objection Handling ══════ */}
      <section className="py-24 md:py-32 w-full flex justify-center">
        <div className="max-w-[900px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-foreground/60 mb-12 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-foreground/20" />
              Common Questions
            </h2>
          </ScrollReveal>
          {FAQ.map((item, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className={`py-8 pl-5 border-l-2 border-primary/20 hover:border-primary/50 hover:bg-white/[0.01] hover:pl-6 transition-all duration-300 ${i < FAQ.length - 1 ? "border-b border-b-white/[0.03]" : ""}`}>
                <h3 className="text-base font-bold text-foreground/80 mb-3">&quot;{item.q}&quot;</h3>
                <p className="text-base text-foreground/70 font-light leading-relaxed max-w-2xl">{item.a}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════ FINAL CTA — Commitment/Consistency + Scarcity ══════ */}
      <section id="contact" className="py-48 min-h-[50vh] w-full flex items-center justify-center relative overflow-hidden bg-background">
        <div className="max-w-[1000px] w-full px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.9] mb-10 text-balance">
              Tell us what eats your team&apos;s <span className="text-primary italic font-medium">time.</span>
            </h2>
            <p className="text-lg text-foreground/60 font-light max-w-2xl mx-auto mb-6 leading-relaxed">
              In 30 minutes, we&apos;ll identify your top 3 automation targets and estimate the hours you&apos;d recover. No pitch. No commitment. Just a clear picture of what&apos;s possible.
            </p>
            <p className="text-sm font-mono text-foreground/50 tracking-wider uppercase mb-14">
              We take a limited number of deployments per quarter to ensure configuration quality
            </p>
            <a href="https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink" target="_blank" rel="noopener noreferrer" className="btn-press group relative inline-flex items-center justify-center px-14 py-6 bg-foreground text-background text-sm font-black uppercase tracking-[0.2em] overflow-hidden rounded-[2px] transition-transform hover:scale-[1.03] duration-500">
              <span className="relative z-10 flex items-center gap-4">
                Book a Free Discovery Audit
                <div className="w-1.5 h-1.5 rounded-[1px] bg-background/50 group-hover:bg-primary transition-colors" />
              </span>
            </a>
          </ScrollReveal>
        </div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-[25vw] font-black tracking-[-0.05em] text-white/[0.015] pointer-events-none whitespace-nowrap z-0 select-none">
          MUDIAGENT
        </div>

      </section>

      <Footer />
    </div>
  );
}
