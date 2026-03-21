import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Muditek vs Juniper Square | Custom Private Equity Operations Platform | Muditek",
  description: "Compare custom-built operational infrastructure for private equity and investment banking vs Juniper Square. Own vs rent: €40-80K one-time vs $700K+/year subscription.",
  openGraph: {
    title: "Muditek vs Juniper Square | Custom Private Equity Operations",
    description: "Own vs rent. Pay once and own your operational infrastructure forever, or pay $700K+/year to rent Juniper Square. Side-by-side comparison.",
  },
};

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink";

const COMPARISON = [
  { category: "LP onboarding", juniper: "SaaS template. You configure within their framework.", muditek: "Self-service portal. Jurisdiction-aware document requirements. 3-5 day onboarding." },
  { category: "KYC & compliance", juniper: "Built-in compliance workflows. Standard across all clients.", muditek: "Custom compliance workflows per jurisdiction. Automated expiry alerts. Single review queue." },
  { category: "Document generation", juniper: "Template-based document generation within their platform.", muditek: "One-click generation from live data. Fully custom templates. Subscription agreements, position statements, K-1s." },
  { category: "E-signatures", juniper: "E-signature integration included. Per-envelope costs may apply.", muditek: "Built-in e-signatures. Multi-party staged signing. No per-envelope fees." },
  { category: "Fee computation", juniper: "Standard fee calculations within their system.", muditek: "Automatic computation from your fund terms. Hurdle rates, waterfalls, clawbacks. Your rules, not theirs." },
  { category: "Bank reconciliation", juniper: "Reconciliation features within their platform.", muditek: "Automated matching every 6 hours. Discrepancies flagged automatically." },
  { category: "Customization", juniper: "SaaS product. You configure what they expose. Can't modify underlying system.", muditek: "Complete source code. Modify anything. Extend independently. Your developers can build on it." },
  { category: "Data ownership", juniper: "Their servers. Their database. Their terms. You're a tenant.", muditek: "Your infrastructure. Your database. Your source code. Full ownership." },
  { category: "Pricing model", juniper: "Annual subscription. Recurring cost that compounds year over year.", muditek: "One-time build fee. Optional retainer. You own the system after." },
];

const FAQ = [
  { q: "When does Juniper Square make more sense?", a: "If you need a platform live tomorrow with no development, Juniper Square gives you a working SaaS product out of the box. If your fund structures are simple and you don't mind the ongoing cost, it works. The tradeoff is: you never own it, you can't customize beyond what they allow, and the cost compounds forever." },
  { q: "Can you really build this in 4-8 weeks?", a: "We already built it. The hard problems — multi-entity structures, multi-jurisdiction compliance, document generation, e-signatures, fee computation with hurdle rates — have been solved. We don't reuse the code. We reuse the knowledge. That's why we deliver in weeks what traditionally takes 12-18 months." },
  { q: "What about ongoing maintenance?", a: "Optional retainer at €5-10K/month. Every new fund launch, jurisdiction, or regulatory change gets handled. Without it, your internal team maintains the system. You have the source code." },
  { q: "How does the cost compare over 3 years?", a: "Juniper Square: $700K/year × 3 = $2.1M. Muditek: €40-80K build + optional €5-10K/month retainer = €220-440K total. You own the system after. They still charge next year." },
];

export default function PEOpsVsJuniperSquarePage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-sky-500/20 flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Muditek vs Juniper Square",
          description: "Detailed comparison between Muditek custom private equity operational infrastructure and Juniper Square SaaS platform.",
          url: "https://muditek.com/pe-ops-vs-juniper-square",
        }}
      />

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-24 md:pb-32 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-sky-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <Image src="/icon.svg" alt="Muditek" width={32} height={32} />
              <h2 className="text-sm font-black tracking-[0.3em] uppercase text-sky-400 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-sky-400/50" />
                Muditek / Comparison
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-12 text-balance">
              Muditek vs Juniper <span className="text-sky-400 italic font-medium">Square</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-3xl mb-14">
              Juniper Square charges a reported $700K+/year and you never own the system. We build the same capabilities — custom-fit to your fund structures — for a one-time fee of €40-80K. You own the source code, the database, the infrastructure. The build costs less than one year of the subscription.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-10 py-5 bg-sky-500 text-background font-black text-sm uppercase tracking-[0.2em] overflow-hidden rounded-[2px] hover:scale-[1.02] transition-transform duration-300 btn-press"
              >
                <span className="relative z-10 flex items-center gap-3">
                  See the Demo
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick Verdict */}
      <section className="py-20 w-full flex justify-center border-t border-b border-white/[0.02] bg-card/[0.2]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h3 className="text-xl font-black tracking-[0.05em] text-foreground mb-4">Own vs. Rent</h3>
            <p className="text-base text-foreground/70 font-light leading-relaxed max-w-3xl">
              Juniper Square is a SaaS platform you rent. Muditek builds infrastructure you own. The same investor onboarding, KYC automation, document generation, and fee computation — but custom-built for your fund structures, deployed on your infrastructure, and paid for once. The build costs less than one year of the subscription.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-32 md:py-48 w-full flex justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-sky-400 mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-sky-400/50" />
              Feature Comparison
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16 max-w-3xl">
              Same capabilities. Different <span className="text-sky-400 italic font-medium">model.</span>
            </h3>
          </ScrollReveal>

          <div className="border border-white/[0.05] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl">
            <div className="grid grid-cols-3 px-8 py-6 border-b border-white/[0.05] text-sm font-black uppercase tracking-[0.15em] text-foreground/60 bg-white/[0.01]">
              <div>Capability</div>
              <div className="text-red-400/70">Juniper Square</div>
              <div className="text-sky-400">Muditek</div>
            </div>
            {COMPARISON.map((row, i) => (
              <ScrollReveal key={row.category} delay={i * 50}>
                <div className={`group grid grid-cols-3 px-8 py-7 items-start stat-row cursor-default ${i < COMPARISON.length - 1 ? "border-b border-white/[0.02]" : ""}`}>
                  <div className="text-sm font-bold tracking-[0.1em] uppercase text-foreground/60">{row.category}</div>
                  <div className="text-sm text-foreground/60 leading-relaxed pr-4">{row.juniper}</div>
                  <div className="text-sm text-foreground/80 font-medium leading-relaxed">{row.muditek}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02] bg-card/[0.15]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-sky-400 mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-sky-400/50" />
              Pricing
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16">
              The 3-year <span className="text-sky-400 italic font-medium">cost.</span>
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal>
              <div className="border border-red-500/[0.1] bg-red-500/[0.02] p-10 rounded-[4px]">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-red-400/70 mb-6">Juniper Square</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-2xl font-black text-foreground/80 font-mono">$700K+</span>
                    <span className="text-sm text-foreground/50 font-light">/year</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">Platform subscription. Price increases over time.</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-foreground/80 font-mono">$2.1M+</span>
                    <span className="text-sm text-foreground/50 font-light"> over 3 years</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">And you still don&apos;t own anything. Cancel and everything disappears.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="border border-sky-500/[0.15] bg-sky-500/[0.03] p-10 rounded-[4px]">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-sky-400 mb-6">Muditek</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-2xl font-black text-foreground font-mono">€40-80K</span>
                    <span className="text-sm text-foreground/50 font-light"> one-time build</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">Custom-built for your fund structures. Delivered in 4-8 weeks.</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-foreground font-mono">€5-10K</span>
                    <span className="text-sm text-foreground/50 font-light">/month retainer (optional)</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">New funds, jurisdictions, regulatory changes. Or maintain it yourself.</p>
                  </div>
                  <div className="pt-4 border-t border-sky-500/[0.1]">
                    <span className="text-lg font-black text-foreground font-mono">€220-440K</span>
                    <span className="text-sm text-foreground/50 font-light"> over 3 years (with retainer)</span>
                    <p className="text-sm text-foreground/50 font-light mt-1">You own the source code, database, and infrastructure. Cancel the retainer anytime.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Case Study Reference */}
      <section className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-sky-400 mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-sky-400/50" />
              Proof
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-12">
              We already built <span className="text-sky-400 italic font-medium">this.</span>
            </h3>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <p className="text-base text-foreground/70 font-light leading-relaxed max-w-3xl mb-10">
              We built the complete operational infrastructure for a regulated merchant banking firm managing private equity, venture capital, and real estate investments across multiple jurisdictions. Their team was spending 30+ hours per week on manual investor operations.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "26", label: "Modules" },
                { value: "7", label: "Stakeholder Roles" },
                { value: "9", label: "Automated Workflows" },
                { value: "3 mo", label: "To Build" },
              ].map((m) => (
                <div key={m.label} className="border border-white/[0.05] bg-card/[0.2] p-8 text-center rounded-[4px]">
                  <span className="text-3xl font-black text-foreground block mb-1 tracking-tight">{m.value}</span>
                  <span className="text-sm font-mono text-foreground/60 tracking-wider uppercase">{m.label}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
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
              <div className={`py-8 pl-5 border-l-2 border-sky-500/20 hover:border-sky-500/50 hover:bg-white/[0.01] hover:pl-6 transition-all duration-300 ${i < FAQ.length - 1 ? "border-b border-b-white/[0.03]" : ""}`}>
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
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.9] mb-8 text-balance">
              Stop renting infrastructure you should <span className="text-sky-400 italic font-medium">own.</span>
            </h2>
            <p className="text-lg text-foreground/60 font-light max-w-2xl mx-auto mb-6 leading-relaxed">
              Book a 30-minute call. We&apos;ll walk through your current workflows and show you the working system we built.
            </p>
            <p className="text-sm font-mono text-foreground/50 tracking-wider uppercase mb-14">
              I take 1-2 build clients at a time. Each engagement gets my full attention.
            </p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-press group relative inline-flex items-center justify-center px-14 py-6 bg-sky-500 text-background text-sm font-black uppercase tracking-[0.2em] overflow-hidden rounded-[2px] transition-transform hover:scale-[1.03] duration-500">
              <span className="relative z-10 flex items-center gap-4">
                See the Demo
                <div className="w-1.5 h-1.5 rounded-[1px] bg-background/50 group-hover:bg-foreground transition-colors" />
              </span>
            </a>
          </ScrollReveal>
        </div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-[25vw] font-black tracking-[-0.05em] text-white/[0.015] pointer-events-none whitespace-nowrap z-0 select-none">
          MUDITEK
        </div>
      </section>

      <Footer />
    </div>
  );
}
