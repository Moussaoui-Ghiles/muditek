import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "mudiAgent vs ChatGPT Enterprise | On-Premises AI Comparison | Muditek",
  description: "Compare mudiAgent and ChatGPT Enterprise for enterprise operations. On-premises AI with workflow automation vs cloud chatbox. No per-user fees. Full data sovereignty.",
  openGraph: {
    title: "mudiAgent vs ChatGPT Enterprise | On-Premises AI Comparison",
    description: "ChatGPT is a conversation tool. mudiAgent is a digital employee that automates real work. Compare data security, workflow automation, cost at scale, and deployment.",
  },
};

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink";

const COMPARISON = [
  { category: "Data security", chatgpt: "Data processed on third-party servers. You don't control where it's stored or who accesses it.", mudiagent: "Runs on a device in your office. Your data never touches the internet. Full audit trail." },
  { category: "Workflow automation", chatgpt: "Responds to typed prompts. Cannot operate external systems, send emails, fill CRMs, or run on a schedule.", mudiagent: "Reads WhatsApp, sends emails, fills forms, operates CRM/ERP/ticketing, runs on a schedule. Fully autonomous." },
  { category: "Cost at scale", chatgpt: "Per-user pricing that scales with headcount. 50 users = significant recurring spend with no workflow automation.", mudiagent: "One device. Everyone uses it. No per-user fees. One-time deployment from €15,000." },
  { category: "Memory & context", chatgpt: "Each conversation starts fresh. Doesn't retain your templates, procedures, or institutional knowledge between sessions.", mudiagent: "Trained on your documents. Builds institutional knowledge that compounds over time. Never forgets." },
  { category: "Concurrent users", chatgpt: "Individual conversations. No shared workflows. Each user operates in their own silo.", mudiagent: "20-50 concurrent users. Company-wide intelligence. Shared workflows across departments." },
  { category: "Integrations", chatgpt: "Limited plugin ecosystem. No deep system integration. No scheduled triggers or autonomous operation.", mudiagent: "CRM, ERP, NMS, OSS/BSS, ticketing (ServiceNow, Jira), file servers, vendor portals, email, messaging, databases." },
  { category: "Scheduling", chatgpt: "None. Requires a human to open the interface and type a prompt every time.", mudiagent: "Daily reports at 6 am. Weekly summaries on Friday. Monitoring 24/7. Set once, runs forever." },
  { category: "Compliance", chatgpt: "Data processed on third-party servers. Regulatory and data residency requirements may be difficult to meet.", mudiagent: "On-premises. No third-party data processing. Meets data residency requirements for regulated industries." },
];

const FAQ = [
  { q: "When does ChatGPT make more sense?", a: "For quick one-off questions, brainstorming, and individual productivity. If one person needs help writing or summarizing, ChatGPT works. When you need a system that does the work autonomously across your organization, that's mudiAgent." },
  { q: "Can't I just build automations around ChatGPT's API?", a: "You can, and it will cost more than mudiAgent. You'll need developers, hosting, security review, compliance approval, and ongoing maintenance. And your data still leaves your building. mudiAgent arrives pre-configured with all integrations built in." },
  { q: "What about Microsoft Copilot?", a: "Same model. Cloud-based, per-user pricing, can't operate systems autonomously, can't run on a schedule. It's a productivity layer inside Office. mudiAgent is a digital employee that executes real work on your infrastructure." },
];

export default function MudiAgentVsChatGPTPage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "mudiAgent vs ChatGPT Enterprise",
          description: "Detailed comparison between mudiAgent on-premises AI and ChatGPT Enterprise for enterprise operations.",
          url: "https://muditek.com/mudiagent-vs-chatgpt",
        }}
      />

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-24 md:pb-32 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <Image src="/icon.svg" alt="Muditek" width={32} height={32} />
              <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary/50" />
                Muditek / Comparison
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-12 text-balance">
              mudiAgent vs ChatGPT <span className="text-primary italic font-medium">Enterprise</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-3xl mb-14">
              ChatGPT is a conversation tool — you type, it responds, it forgets. mudiAgent is a digital employee — it operates your systems autonomously, runs on a schedule, and lives inside your office. No cloud. No per-user fees.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center px-10 py-5 bg-foreground text-background font-black text-sm uppercase tracking-[0.2em] overflow-hidden rounded-[2px] hover:scale-[1.02] transition-transform duration-300 btn-press"
            >
              <span className="relative z-10 flex items-center gap-3">
                Book a Free Discovery Audit
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div className="absolute inset-0 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-in-out z-0" />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-32 md:py-48 w-full flex justify-center relative overflow-hidden border-t border-white/[0.02] bg-card/[0.15]">
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Side-by-Side
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16 max-w-3xl">
              What matters when you&apos;re choosing AI for <span className="text-primary italic font-medium">operations.</span>
            </h3>
          </ScrollReveal>

          <div className="border border-white/[0.05] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl">
            <div className="grid grid-cols-3 px-8 py-6 border-b border-white/[0.05] text-sm font-black uppercase tracking-[0.15em] text-foreground/60 bg-white/[0.01]">
              <div>What Matters</div>
              <div className="text-red-400/70">ChatGPT Enterprise</div>
              <div className="text-primary">mudiAgent</div>
            </div>
            {COMPARISON.map((row, i) => (
              <ScrollReveal key={row.category} delay={i * 50}>
                <div className={`group grid grid-cols-3 px-8 py-7 items-start stat-row cursor-default ${i < COMPARISON.length - 1 ? "border-b border-white/[0.02]" : ""}`}>
                  <div className="text-sm font-bold tracking-[0.1em] uppercase text-foreground/60">{row.category}</div>
                  <div className="text-sm text-foreground/60 leading-relaxed pr-4">{row.chatgpt}</div>
                  <div className="text-sm text-foreground/80 font-medium leading-relaxed">{row.mudiagent}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* When ChatGPT Makes Sense / When You Need mudiAgent */}
      <section className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal>
              <div className="border border-white/[0.05] bg-card/[0.2] p-10 rounded-[4px] h-full">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/50 mb-6">When ChatGPT Makes Sense</h3>
                <ul className="space-y-4 text-base text-foreground/70 font-light leading-relaxed">
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />Quick one-off questions and brainstorming</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />Individual writing, summarizing, and analysis</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />Prototyping and code assistance</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />Small teams without complex automation needs</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="border border-primary/[0.15] bg-primary/[0.03] p-10 rounded-[4px] h-full">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">When You Need mudiAgent</h3>
                <ul className="space-y-4 text-base text-foreground/70 font-light leading-relaxed">
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />Workflow automation across multiple systems</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />Scheduled tasks without human intervention</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />Data-sensitive industries needing on-premises processing</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />20-50+ concurrent users without per-seat costs</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />Autonomous reporting, monitoring, and follow-ups</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02] bg-card/[0.15]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Pricing Comparison
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16">
              The math on <span className="text-primary italic font-medium">50 users.</span>
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal>
              <div className="border border-red-500/[0.1] bg-red-500/[0.02] p-10 rounded-[4px]">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-red-400/70 mb-6">ChatGPT Enterprise</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-2xl font-black text-foreground/80 font-mono">$36,000+</span>
                    <span className="text-sm text-foreground/50 font-light">/year</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">Per-user pricing × 50 users × 12 months. Custom pricing, not published.</p>
                  </div>
                  <div className="pt-4 border-t border-red-500/[0.05]">
                    <p className="text-sm text-foreground/50 font-light">No workflow automation included. Data processed on third-party servers. Cost scales with every new employee.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="border border-primary/[0.15] bg-primary/[0.03] p-10 rounded-[4px]">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">mudiAgent</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-2xl font-black text-foreground font-mono">€15,000</span>
                    <span className="text-sm text-foreground/50 font-light"> one-time</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">Pilot deployment. One agent, one workflow. Live in 4 weeks.</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-foreground font-mono">€3,000</span>
                    <span className="text-sm text-foreground/50 font-light">/month retainer</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">Optional. Monitoring, optimization, support, scaling.</p>
                  </div>
                  <div className="pt-4 border-t border-primary/[0.1]">
                    <p className="text-sm text-foreground/50 font-light">No per-user fees. No cloud costs. You own the system. 40-hour guarantee.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02]">
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

      {/* Final CTA */}
      <section className="py-48 min-h-[50vh] w-full flex items-center justify-center relative overflow-hidden bg-background">
        <div className="max-w-[1000px] w-full px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.9] mb-10 text-balance">
              Stop paying per user for a <span className="text-primary italic font-medium">chatbox.</span>
            </h2>
            <p className="text-lg text-foreground/60 font-light max-w-2xl mx-auto mb-14 leading-relaxed">
              In 30 minutes, we&apos;ll identify your top 3 automation targets and estimate the hours you&apos;d recover. No pitch. No commitment.
            </p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-press group relative inline-flex items-center justify-center px-14 py-6 bg-foreground text-background text-sm font-black uppercase tracking-[0.2em] overflow-hidden rounded-[2px] transition-transform hover:scale-[1.03] duration-500">
              <span className="relative z-10 flex items-center gap-4">
                Book a Free Discovery Audit
                <div className="w-1.5 h-1.5 rounded-[1px] bg-background/50 group-hover:bg-primary transition-colors" />
              </span>
            </a>
          </ScrollReveal>
        </div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-[20vw] font-black tracking-[-0.05em] text-white/[0.015] pointer-events-none whitespace-nowrap z-0 select-none">
          MUDIAGENT
        </div>
      </section>

      <Footer />
    </div>
  );
}
