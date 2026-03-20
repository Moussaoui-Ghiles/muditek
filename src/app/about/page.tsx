import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "About Muditek | AI Systems That Eliminate Operational Waste",
  description: "We diagnose where companies lose money to manual operations. Then we build the AI systems that fix it. 35+ systems deployed. $3M+ in revenue generated and saved.",
};

const PROOF_METRICS = [
  { label: "Proposal drafting", before: "4 hrs", after: "12 min" },
  { label: "Knowledge lookup", before: "30+ min", after: "10 sec" },
  { label: "Weekly status report", before: "3 hrs", after: "Automated" },
  { label: "Competitor monitoring", before: "Manual", after: "Daily, 7am" },
  { label: "Sales outreach", before: "Inconsistent", after: "Daily, auto" },
];

const TRACK_RECORD = [
  { value: "35+", label: "Systems Deployed" },
  { value: "$3M+", label: "Revenue Generated & Saved" },
  { value: "26", label: "Modules (Merchant Bank Platform)" },
  { value: "3 mo", label: "Build Time (Full Platform)" },
];

export default function AboutPage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      <Navbar />

      {/* ══════ HERO ══════ */}
      <section className="pt-32 md:pt-44 pb-24 md:pb-32 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <Image src="/icon.svg" alt="Muditek" width={32} height={32} />
              <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary/50" />
                About Muditek
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-12 text-balance max-w-4xl">
              We diagnose where companies lose money. Then we build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 opacity-90">systems that fix it.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-2xl">
              Muditek builds custom AI systems that eliminate operational waste for telecom operators, B2B SaaS companies, and investment firms. Every engagement starts with a diagnostic that quantifies the problem in euros. If we can&apos;t find the waste, you don&apos;t pay.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ APPROACH — Diagnose, Build, Own ══════ */}
      <section className="py-32 md:py-40 w-full flex justify-center relative border-t border-white/[0.02]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              How We Work
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16">
              Diagnose. Build. <span className="text-primary italic font-medium">Own.</span>
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Diagnose",
                body: "We pull your data, map your workflows, and quantify every hour of waste. In euros, with the formulas. You see exactly where the money goes before any system is built. If we can't find meaningful waste, the diagnostic is free.",
              },
              {
                num: "02",
                title: "Build",
                body: "We build the AI system that eliminates what the diagnostic found. Custom-built for your operations, on your infrastructure. You own the code, the data, and the system. No SaaS fees, no vendor lock-in.",
              },
              {
                num: "03",
                title: "Own",
                body: "You own everything we build. Complete source code, your database, your infrastructure. We offer an optional retainer for optimization and scaling, but the system runs whether you keep us or not.",
              },
            ].map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 100}>
                <div className="group relative h-full border border-white/[0.05] bg-card/[0.2] hover:bg-card/[0.5] backdrop-blur-md p-10 flex flex-col overflow-hidden transition-all duration-700 card-lift">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-[1.2s]" />
                  <span className="text-5xl font-black text-foreground/[0.06] block mb-6">{step.num}</span>
                  <h4 className="text-xl font-black tracking-[0.05em] text-foreground mb-4">{step.title}</h4>
                  <p className="text-base text-foreground/70 font-light leading-relaxed">{step.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ WE RUN IT — Proof metrics ══════ */}
      <section className="py-32 md:py-40 w-full flex justify-center relative overflow-hidden bg-card/[0.15]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <div className="w-12 h-[1px] bg-primary mb-10" />
            <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-6">
              We built this for ourselves.<br /><span className="text-primary italic font-medium">Then clients asked.</span>
            </h2>
            <p className="text-base text-foreground/70 font-light leading-relaxed mb-16 max-w-xl">
              Every number below comes from our own operations. We built mudiAgent to run Muditek. When clients saw the results, they asked us to deploy it for them.
            </p>
          </ScrollReveal>

          <div className="border border-white/[0.05] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl">
            <div className="grid grid-cols-4 px-8 py-6 border-b border-white/[0.05] text-xs font-black uppercase tracking-[0.2em] text-foreground/60 bg-white/[0.01]">
              <div className="col-span-2">Task</div>
              <div>Before</div>
              <div className="text-primary">After mudiAgent</div>
            </div>
            {PROOF_METRICS.map((row, i) => (
              <ScrollReveal key={row.label} delay={i * 60}>
                <div className={`group grid grid-cols-4 px-8 py-7 items-center stat-row cursor-default ${i < PROOF_METRICS.length - 1 ? "border-b border-white/[0.02]" : ""}`}>
                  <div className="col-span-2 text-sm font-bold tracking-[0.1em] uppercase text-foreground/70 group-hover:text-foreground transition-colors">{row.label}</div>
                  <div className="text-xs font-mono text-foreground/50 line-through tracking-wider">{row.before}</div>
                  <div className="text-xs font-mono font-black tracking-wider text-primary/90 group-hover:text-primary">{row.after}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TRACK RECORD — Numbers ══════ */}
      <section className="py-32 md:py-40 w-full flex justify-center relative">
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Track Record
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16">
              The numbers <span className="text-primary italic font-medium">speak.</span>
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRACK_RECORD.map((m, i) => (
              <ScrollReveal key={m.label} delay={i * 80}>
                <div className="border border-white/[0.05] bg-card/[0.2] p-8 text-center rounded-[4px] card-lift">
                  <span className="text-3xl md:text-4xl font-black text-foreground block mb-2 tracking-tight">{m.value}</span>
                  <span className="text-xs font-mono text-foreground/60 tracking-wider uppercase">{m.label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400}>
            <div className="mt-12 border border-white/[0.05] bg-card/[0.2] p-8 rounded-[4px]">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/60 mb-4">Differentiators</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70 font-light leading-relaxed">
                <p><span className="text-foreground/80 font-medium">Diagnose first, build second.</span> Every engagement starts with a diagnostic that quantifies waste in euros. No guesswork.</p>
                <p><span className="text-foreground/80 font-medium">Client owns everything.</span> No SaaS fees, no vendor lock-in, no data in someone else&apos;s cloud. You own the code.</p>
                <p><span className="text-foreground/80 font-medium">Weeks, not months.</span> We don&apos;t reuse the code. We reuse the knowledge. That&apos;s why we deliver in weeks what traditionally takes a year.</p>
                <p><span className="text-foreground/80 font-medium">Guarantee on every offer.</span> If we can&apos;t find the waste, you don&apos;t pay. That&apos;s not aspirational. It&apos;s contractual.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ FOUNDER ══════ */}
      <section className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-foreground/60 mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-foreground/20" />
              Founder
            </h2>
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <Image src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/user/profile_picture/80b30549-1dbe-4e9f-8701-6a15f0d95db3/thumb_WhatsApp_Image_2025-05-23_at_00.49.13_a69bd58a.jpg" alt="Ghiles Moussaoui" width={96} height={96} className="rounded-full border-2 border-white/[0.1]" unoptimized />
              <div>
                <h3 className="text-2xl font-black text-foreground mb-3">Ghiles Moussaoui</h3>
                <p className="text-sm text-foreground/70 font-light leading-relaxed max-w-xl mb-4">
                  I build AI systems that run business operations. 35+ systems in production across telecom, financial services, and B2B SaaS. $3M+ in revenue generated and saved for clients. I built mudiAgent to run my own company first. When clients saw the results, they asked me to deploy it for them. 35,000+ professionals follow what I build on LinkedIn. Every system I ship gets documented in the B2B Agents newsletter (5,300+ subscribers, 40.7% open rate).
                </p>
                <div className="flex items-center gap-4">
                  <a href="https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-primary/80 tracking-wider hover:text-primary transition-colors">ghiles@muditek.com</a>
                  <a href="https://www.linkedin.com/in/ghiles-moussaoui-b36218250/" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-foreground/60 tracking-wider hover:text-foreground transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="py-32 min-h-[40vh] w-full flex items-center justify-center relative overflow-hidden bg-background">
        <div className="max-w-[1000px] w-full px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.9] mb-10 text-balance">
              Stop paying people to do work <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/40 italic font-medium pr-2">a machine</span> should handle.
            </h2>
            <p className="text-lg text-foreground/60 font-light max-w-2xl mx-auto mb-14 leading-relaxed">
              30-minute call. No pitch. We&apos;ll tell you if we can help, and how much you&apos;re losing by waiting.
            </p>
            <a href="https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink" target="_blank" rel="noopener noreferrer" className="btn-press group relative inline-flex items-center justify-center px-14 py-6 bg-foreground text-background text-sm font-black uppercase tracking-[0.2em] overflow-hidden rounded-[2px] transition-transform hover:scale-[1.03] duration-500">
              <span className="relative z-10 flex items-center gap-4">
                Book a Call
                <div className="w-1.5 h-1.5 rounded-[1px] bg-background/50 group-hover:bg-primary transition-colors" />
              </span>
            </a>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
