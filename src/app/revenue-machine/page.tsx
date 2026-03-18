import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Pipeline Diagnostic — Find & Fix Revenue Leaks in B2B SaaS | Muditek",
  description: "We diagnose where your B2B SaaS pipeline loses €80-180K/year — in euros, with formulas — and build AI systems to fix it. €50K guarantee.",
};

const LEAKS = [
  { num: "01", name: "Speed-to-lead", formula: "Response time × leads × conversion decay rate", example: "You respond in 4 hours. Conversion drops 80% after 5 minutes. 100 leads/month × €10K ACV × 80% degraded = €80K/year gone." },
  { num: "02", name: "Pipeline conversion", formula: "Stage gap vs benchmark × deal size × volume", example: "Your demo-to-close is 12%. Benchmark is 20-25%. That 10-point gap × €8K average deal × 200 opportunities = €160K/year left on the table." },
  { num: "03", name: "Lead source ROI", formula: "Spend per channel vs revenue attributed", example: "You're spending €30K/year on a channel producing €10K in pipeline. Nobody ran that analysis." },
  { num: "04", name: "Churn & expansion", formula: "Excess churn rate × MRR × 12", example: "5% excess churn on €80K MRR = €48K/year walking out the door." },
  { num: "05", name: "Outbound performance", formula: "Response rate gap × meetings missed × close rate × ACV", example: "0.5% meeting rate vs 2% benchmark = 30 missed meetings/month × 20% close rate × €8K ACV = €576K/year in missed pipeline." },
];

const PHASES = [
  { num: "01", title: "Diagnostic", price: "€2,000-3,000", time: "5 days", body: "You fill out an intake form (15 min). Grant read-only access to your CRM and Stripe (10 min). We do the rest. Day 5: a prioritized leak report with euro amounts, formulas, a fix roadmap, and a competitive benchmark against published industry data.", metric: "Your total effort: ~1.5 hours" },
  { num: "02", title: "Build the Fix", price: "€5-8K per fix", time: "1-2 weeks", body: "You pick which leak to fix first. We build the system. Speed-to-lead automation, pipeline scoring, outbound rebuild — whatever the diagnostic says matters most. You own the system. No SaaS fees. Pays for itself in month 1.", metric: "Typical: 3 fixes, €18K total" },
  { num: "03", title: "Retainer", price: "€3-5K/month", time: "Ongoing", body: "Monthly Revenue Recovery Report: exactly how much the system recovered, in euros. 3-5x return every billing cycle. System monitoring, one optimization cycle per month, priority support.", metric: "Your effort: ~1 hr/month" },
];

const FAQ = [
  { q: "We can do this ourselves.", a: "You've had the CRM data for 18 months. If your team was going to fix it, they would have. The diagnostic shows you what to fix — that alone is worth €2-3K even if you build it yourself." },
  { q: "We don't have the budget.", a: "The diagnostic typically finds €80-180K in annual leakage. You're spending more by NOT doing this." },
  { q: "What if the diagnostic finds nothing?", a: "If we can't find at least €50K in annual leakage, you pay nothing. That's the guarantee." },
  { q: "What if the fix doesn't work?", a: "If you buy within 14 days of receiving the diagnostic, you get 30 days of post-build optimization included free. The system doesn't just launch — it gets tuned, adjusted, and optimized for a full month." },
  { q: "I have a developer who could build this.", a: "Great. The diagnostic shows exactly what to fix and how — that alone is worth the price. You get the architecture, the formulas, and the roadmap. Your dev builds it, we review." },
];

export default function RevenueMachinePage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-emerald-500/20 flex flex-col items-center">
      <Navbar />

      {/* ══════ HERO — NARRATIVE ══════ */}
      <section className="pt-32 md:pt-44 pb-24 md:pb-32 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-400/70 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-emerald-400/50" />
                Muditek / Pipeline Diagnostic
              </h2>
              <span className="px-3 py-1 border border-emerald-500/20 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/80 rounded-[2px]">€50K Guarantee</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-7xl lg:text-[88px] font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-12 uppercase text-balance">
              You&apos;re losing money you already paid to <span className="text-emerald-400 italic font-medium">generate.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <div className="max-w-3xl space-y-6 text-base md:text-lg text-foreground/50 font-light leading-relaxed mb-12">
              <p>Your marketing is working. Leads are coming in. But somewhere between the form fill and the signed contract, money disappears.</p>
              <p>An inbound lead fills out your demo request at 2 pm on Tuesday. Your SDR sees it Wednesday morning — 18 hours later. By then, the prospect booked a demo with your competitor who responded in 4 minutes. That lead cost you €200 to generate. The deal was worth €10K. Gone.</p>
              <p>Your pipeline shows 200 opportunities this quarter. Your close rate is 12%. The benchmark for B2B SaaS at your stage is 20-25%. That gap — 8 percentage points — multiplied by your average deal size, multiplied by 200 opportunities — that&apos;s not a rounding error. That&apos;s hundreds of thousands of euros.</p>
              <p>You&apos;re spending €30K/year on a paid channel. When you actually trace revenue back to source, that channel produced €10K in pipeline. But nobody ran that analysis because the data lives in three different systems and the founder doesn&apos;t have time to build the dashboard.</p>
              <p>Your monthly churn is 2% higher than benchmark. On €80K MRR, that&apos;s €48K/year walking out the door. Not because your product is bad — because nobody built the system that detects at-risk accounts and triggers re-engagement before they cancel.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={220}>
            <p className="text-sm text-foreground/30 italic max-w-2xl mb-14">These aren&apos;t separate problems. They compound. Slow response loses the lead. Bad routing sends it to the wrong rep. Poor follow-up kills the deal. Weak onboarding causes the churn. Every leak feeds the next one. The total drag is measured in hundreds of thousands — not tens.</p>
          </ScrollReveal>

          <ScrollReveal delay={280}>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Link href="#contact" className="group relative px-10 py-5 bg-emerald-500 text-background font-black text-[11px] uppercase tracking-[0.2em] overflow-hidden rounded-[2px] hover:scale-[1.02] transition-transform duration-300 btn-press">
                <span className="relative z-10 flex items-center gap-3">
                  Book Your Diagnostic — €2,000
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </Link>
              <Link href="#leaks" className="px-8 py-5 border border-white/[0.1] text-foreground text-[11px] font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-white/[0.02] transition-colors btn-press">
                See the 5 Leaks
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ WHY NOW ══════ */}
      <section className="py-20 w-full flex justify-center border-t border-b border-white/[0.02] bg-card/[0.2]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h3 className="text-xl font-black uppercase tracking-[0.05em] text-foreground mb-8">And the window is closing.</h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Profitability or Death", body: "VCs now value profitability over growth. Broken unit economics = no next round. Revenue ops is where the margin hides." },
              { title: "CAC Inversion", body: "$2 to acquire $1 of ARR. Demo-to-close conversion is down. Sales cycles are longer. You can't outspend broken ops." },
              { title: "Platform Squeeze", body: "Gmail went from warnings to permanent rejections. HubSpot costs climb with list size. Outbound is more expensive and less reliable." },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="border border-white/[0.05] bg-card/[0.2] p-8 rounded-[4px]">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-400/80 mb-3">{item.title}</h4>
                  <p className="text-sm text-foreground/50 font-light leading-relaxed">{item.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={300}>
            <p className="text-[11px] text-foreground/30 italic mt-8 font-mono tracking-wider">Your revenue operations are the only lever left. You can&apos;t buy your way out of broken unit economics.</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ THE 5 LEAKS ══════ */}
      <section id="leaks" className="py-32 md:py-48 w-full flex justify-center relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-400/70 mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-emerald-400/50" />
              The 5 Leaks
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-6 uppercase max-w-3xl">
              We find the leaks. In euros. With the <span className="text-emerald-400 italic font-medium">formulas.</span>
            </h3>
            <p className="text-base text-foreground/50 font-light leading-relaxed mb-16 max-w-2xl">
              Every leak gets a line item with the formula shown — not &quot;you&apos;re losing money here&quot; but &quot;you&apos;re losing €X here, calculated as [formula with your actual numbers].&quot;
            </p>
          </ScrollReveal>

          <div className="space-y-4">
            {LEAKS.map((leak, i) => (
              <ScrollReveal key={leak.num} delay={i * 80}>
                <div className="group border border-white/[0.05] bg-card/[0.2] hover:bg-card/[0.4] backdrop-blur-md p-8 md:p-10 rounded-[4px] transition-all duration-500 card-lift">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/50 transition-all duration-[1.2s]" />
                  <div className="flex items-start gap-6">
                    <span className="text-3xl font-black text-foreground/[0.06] shrink-0">{leak.num}</span>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-[0.05em] text-foreground mb-2 group-hover:text-emerald-400 transition-colors">{leak.name}</h4>
                      <p className="text-sm text-foreground/50 font-light leading-relaxed mb-3">{leak.example}</p>
                      <code className="text-[10px] text-emerald-400/60 font-mono tracking-wider">{leak.formula}</code>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 3 PHASES ══════ */}
      <section className="py-32 md:py-48 w-full flex justify-center relative overflow-hidden border-t border-white/[0.02]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-400/70 mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-emerald-400/50" />
              Process
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16 uppercase">
              Three phases. ROI at every <span className="text-emerald-400 italic font-medium">step.</span>
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PHASES.map((phase, i) => (
              <ScrollReveal key={phase.num} delay={i * 100}>
                <div className="group relative h-full border border-white/[0.05] bg-card/[0.2] hover:bg-card/[0.5] backdrop-blur-md p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 card-lift">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/70 transition-all duration-[1.2s]" />
                  <div>
                    <span className="text-5xl font-black text-foreground/[0.06] block mb-6">{phase.num}</span>
                    <h4 className="text-lg font-black uppercase tracking-[0.05em] text-foreground mb-1">{phase.title}</h4>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-mono text-emerald-400/80 tracking-wider">{phase.price}</span>
                      <span className="text-[10px] font-mono text-foreground/30 tracking-wider">· {phase.time}</span>
                    </div>
                    <p className="text-sm text-foreground/50 font-light leading-relaxed">{phase.body}</p>
                  </div>
                  <div className="pt-6 mt-8 border-t border-white/[0.05]">
                    <span className="text-[10px] font-mono text-emerald-400/60 tracking-wider uppercase">{phase.metric}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ GUARANTEE ══════ */}
      <section className="py-32 w-full relative border-t border-b border-white/[0.02] bg-card/[0.2] flex justify-center mesh-subtle">
        <div className="max-w-[1000px] w-full px-6 text-center">
          <ScrollReveal>
            <div className="doppelrand mx-auto mb-16 inline-block">
              <div className="doppelrand-inner px-8 py-3 flex items-center gap-4 bg-background">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 pt-[1px]">€50K Guarantee</span>
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] mb-8 text-balance max-w-3xl mx-auto uppercase">
              If we can&apos;t find €50K in annual leakage, <span className="text-emerald-400 italic font-medium">you pay nothing.</span>
            </h2>

            <p className="text-base text-foreground/50 max-w-2xl mx-auto leading-relaxed font-light mb-12">
              At €800K+ ARR with 2+ sales reps, there are always leaks. We&apos;ve never missed the €50K threshold. Every number has a formula. Every formula uses your actual numbers. Not estimates — math.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-[10px] font-mono uppercase tracking-widest text-foreground/40 mb-16">
              <span className="px-4 py-2 border border-white/[0.05] rounded-[2px]">B2B SaaS</span>
              <span className="px-4 py-2 border border-white/[0.05] rounded-[2px]">€800K-1.8M ARR</span>
              <span className="px-4 py-2 border border-white/[0.05] rounded-[2px]">2-5 Sales Reps</span>
              <span className="px-4 py-2 border border-white/[0.05] rounded-[2px]">HubSpot / Salesforce</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="py-24 md:py-32 w-full flex justify-center">
        <div className="max-w-[900px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-foreground/40 mb-12 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-foreground/20" />
              Common Questions
            </h2>
          </ScrollReveal>
          {FAQ.map((item, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className={`py-8 ${i < FAQ.length - 1 ? "border-b border-white/[0.03]" : ""}`}>
                <h3 className="text-base font-bold text-foreground/80 mb-3">&quot;{item.q}&quot;</h3>
                <p className="text-sm text-foreground/50 font-light leading-relaxed max-w-2xl">{item.a}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section id="contact" className="py-48 min-h-[50vh] w-full flex items-center justify-center relative overflow-hidden bg-background">
        <div className="max-w-[1000px] w-full px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.9] mb-10 text-balance uppercase">
              You pay €2,000. We show you where you&apos;re losing <span className="text-emerald-400 italic font-medium">€80,000-180,000.</span>
            </h2>
            <p className="text-lg text-foreground/40 font-light max-w-2xl mx-auto mb-14 leading-relaxed">
              In 5 days. If we can&apos;t find €50K, you pay nothing. Do the math on that.
            </p>
            <a href="mailto:ghiles@muditek.com" className="btn-press group relative inline-flex items-center justify-center px-14 py-6 bg-emerald-500 text-background text-[13px] font-black uppercase tracking-[0.2em] overflow-hidden rounded-[2px] transition-transform hover:scale-[1.03] duration-500">
              <span className="relative z-10 flex items-center gap-4">
                Book Your Diagnostic
                <div className="w-1.5 h-1.5 rounded-[1px] bg-background/50 group-hover:bg-foreground transition-colors" />
              </span>
            </a>
          </ScrollReveal>
        </div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-[20vw] font-black tracking-[-0.05em] text-white/[0.01] pointer-events-none whitespace-nowrap z-0 select-none">
          DIAGNOSTIC
        </div>
      </section>

      <Footer />
    </div>
  );
}
