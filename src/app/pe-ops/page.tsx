import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Operational Infrastructure for Investment Firms | Muditek",
  description: "Custom operational infrastructure for private equity and investment banking firms. Investor onboarding in 3-5 days. KYC automated. You own the platform. Alternative to Juniper Square.",
};

const CASE_STUDY = [
  { before: "LP onboarding over email, weeks per LP", after: "Self-service portal, 3-5 days" },
  { before: "KYC in spreadsheets, documents expiring unnoticed", after: "Single review queue, automated expiry alerts" },
  { before: "Documents in Word templates", after: "One-click generation from live data" },
  { before: "Signatures via email PDFs", after: "Built-in e-signatures, multi-party staged signing" },
  { before: "Deal tracking across email and memory", after: "Full LP journey per deal, one view" },
  { before: "Fee calculations in spreadsheets", after: "Automatic computation from fund terms" },
  { before: "Bank reconciliation manual", after: "Automated matching every 6 hours" },
  { before: "Everyone uses email", after: "7 roles with tailored portal views" },
  { before: "Manual document distribution", after: "9 automated workflows" },
];

const FAQ = [
  { q: "We're looking at Juniper Square.", a: "They charge $700K+/year and you never own the system. We build it once, you own it forever. Same capabilities, fraction of the cost, full customization." },
  { q: "Can you really build this in 4-8 weeks?", a: "We already built it. The hard problems are solved. We don't reuse the code. We reuse the knowledge. Milestone-based, so you see working software at each checkpoint." },
  { q: "What happens after you build it?", a: "Optional retainer. Every new fund, jurisdiction, or regulatory change, handled. Without it, your team is back to manual workarounds." },
];

export default function PEOpsPage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-sky-500/20 flex flex-col items-center">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Operational Infrastructure for Investment Firms",
          provider: { "@type": "Organization", name: "Muditek", url: "https://muditek.com" },
          description: "Custom operational infrastructure for private equity and investment banking firms. Investor onboarding, KYC automation, document generation, e-signatures, fee computation. Alternative to Juniper Square.",
          url: "https://muditek.com/pe-ops",
          areaServed: "Worldwide",
          offers: [
            { "@type": "Offer", name: "Discovery", price: "8000", priceCurrency: "EUR", description: "Complete specification with clear ROI. 2-4 weeks." },
            { "@type": "Offer", name: "Build", price: "40000", priceCurrency: "EUR", description: "Custom-built operational infrastructure. 4-8 weeks." },
            { "@type": "Offer", name: "Monthly Retainer", price: "5000", priceCurrency: "EUR", description: "New funds, jurisdictions, regulatory changes. Ongoing support." },
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

      {/* ══════ HERO — FULL NARRATIVE FROM PE PDF ══════ */}
      <section className="pt-32 md:pt-44 pb-24 md:pb-32 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-sky-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <Image src="/icon.svg" alt="Muditek" width={32} height={32} />
              <h2 className="text-sm font-black tracking-[0.3em] uppercase text-sky-400 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-sky-400/50" />
                Muditek / Operational Infrastructure
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-12 text-balance max-w-5xl">
              Your team spends more time managing investor administration than managing <span className="text-sky-400 italic font-medium">investments.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <div className="max-w-3xl space-y-6 text-base md:text-lg text-foreground/70 font-light leading-relaxed mb-8">
              <p>Your compliance person opens their spreadsheet. Forty LPs across four jurisdictions. Each jurisdiction requires different documents with different validity periods. Column F tracks expiry dates, except someone forgot to update three of them last quarter. One LP&apos;s proof of address expired two months ago and nobody caught it. The annual audit is in six weeks.</p>
              <p>Your ops team is generating subscription agreements in Word. Copy-pasting investor details, formatting, exporting to PDF, emailing for signature. For every LP, for every document. Forty investors, forty reports, forty chances for a copy-paste error.</p>
              <p>A new deal comes in. Your team creates a term sheet, identifies which LPs might be interested, and starts sending emails. Two weeks later, someone asks: &quot;where does LP X stand on this deal?&quot; The answer requires checking three email threads, a spreadsheet, and asking the associate who spoke to them last Thursday.</p>
              <p>Your CEO is reviewing account approvals from email threads instead of a system. Your arrangers are chasing signatures. Your introducers are calling to ask what their commission is. Your investors are messaging on WhatsApp asking about an opportunity they expressed interest in three weeks ago.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <p className="text-sm text-foreground/50 italic max-w-3xl mb-14">
              Every person who touches the fund, from the managing partner signing off on term sheets to the LP waiting on their position statement, is spending time on work that should take a few clicks. And it&apos;s not just slower. It&apos;s riskier.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Link href="#contact" className="group relative px-10 py-5 bg-sky-500 text-background font-black text-sm uppercase tracking-[0.2em] overflow-hidden rounded-[2px] hover:scale-[1.02] transition-transform duration-300 btn-press">
                <span className="relative z-10 flex items-center gap-3">
                  See the Demo
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </Link>
              <Link href="#case-study" className="px-8 py-5 border border-white/[0.1] text-foreground text-sm font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-white/[0.02] transition-colors btn-press">
                View Case Study
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ WHAT CHANGES ══════ */}
      <section className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02] bg-card/[0.2]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-sky-400 mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-sky-400/50" />
              The Transformation
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-8 max-w-3xl">
              Every process that takes hours now takes <span className="text-sky-400 italic font-medium">a few clicks.</span>
            </h3>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="max-w-3xl space-y-4 text-base text-foreground/70 font-light leading-relaxed">
              <p>Your LP commits capital and onboards themselves through a portal that shows exactly what their jurisdiction requires. Your compliance person reviews from a single queue, not a spreadsheet. Documents that used to take hours generate from live data with one click.</p>
              <p>Signatures happen inside the system. No DocuSign, no per-envelope costs. When a document is signed, downstream events trigger automatically: data room access, fee calculations, commission records. Fees compute from your fund terms. Reconciliation catches discrepancies in hours, not weeks.</p>
              <p>Every stakeholder (LPs, management, introducers, legal) sees their own view. Nobody emails your team for information they can look up themselves.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ IMAGE BREAK ══════ */}
      <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden">
        <Image src="/images/pe-office.png" alt="" fill className="object-cover" style={{ filter: 'sepia(0.3) saturate(1.3) brightness(0.65)' }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      {/* ══════ CASE STUDY ══════ */}
      <section id="case-study" className="py-32 md:py-48 w-full flex justify-center relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-sky-400 mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-sky-400/50" />
              Case Study
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-6 max-w-3xl">
              How we built this for a <span className="text-sky-400 italic font-medium">merchant banking firm.</span>
            </h3>
            <p className="text-base text-foreground/70 font-light leading-relaxed mb-16 max-w-2xl">
              We built everything described above for a regulated merchant banking firm managing private equity, venture capital, and real estate investments across multiple jurisdictions. Their team was spending 30+ hours per week on manual investor operations, and the workload grew with every new LP.
            </p>
          </ScrollReveal>

          {/* Before/After Table */}
          <div className="border border-white/[0.05] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl mb-10">
            <div className="grid grid-cols-2 px-8 py-6 border-b border-white/[0.05] text-sm font-black uppercase tracking-[0.15em] text-foreground/60 bg-white/[0.01]">
              <div>Before</div>
              <div className="text-sky-400">After</div>
            </div>
            {CASE_STUDY.map((row, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <div className={`group grid grid-cols-2 px-8 py-7 items-center stat-row cursor-default ${i < CASE_STUDY.length - 1 ? "border-b border-white/[0.02]" : ""}`}>
                  <div className="text-sm text-foreground/60 pr-6 font-light">{row.before}</div>
                  <div className="text-sm text-foreground/80 font-medium group-hover:text-sky-400 transition-colors">{row.after}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Key Metrics */}
          <ScrollReveal delay={200}>
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

          <ScrollReveal delay={300}>
            <p className="text-sm text-foreground/50 italic mt-10 max-w-3xl">
              Every detail above was built for this firm&apos;s specific situation. Your system would be different. Designed the same way but built for how your firm actually operates.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ HOW WE WORK ══════ */}
      <section className="py-32 md:py-48 w-full flex justify-center relative overflow-hidden border-t border-white/[0.02]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-sky-400 mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-sky-400/50" />
              Process
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16">
              How we work with your <span className="text-sky-400 italic font-medium">firm.</span>
            </h3>
          </ScrollReveal>

          <div className="space-y-6">
            {[
              { title: "Discovery", price: "€8-15K", time: "2-4 weeks", body: "We sit with your ops team, your compliance person, and your leadership. We map every workflow end-to-end. We quantify the manual effort and design the architecture. You get a complete specification with clear ROI before any code is written.", guarantee: "If we can't find €150K+ in annual operational waste, you pay nothing." },
              { title: "Build", price: "€40-80K", time: "4-8 weeks", body: "Custom-built for your fund structures and workflows. The hard problems (multi-entity structures, multi-jurisdiction compliance, document generation, e-signatures, fee computation with hurdle rates) have already been solved. We don't reuse the code. We reuse the knowledge. That's why we deliver in weeks what traditionally takes 12-18 months. Milestone-based. You see working software at each checkpoint." },
              { title: "Grow", price: "€5-10K/month", time: "Ongoing", body: "Every new fund launch, every new jurisdiction, every regulatory change requires the system to evolve. Without ongoing support, your team is back to manual workarounds every time something changes." },
            ].map((phase, i) => (
              <ScrollReveal key={phase.title} delay={i * 100}>
                <div className="group border border-white/[0.05] bg-card/[0.2] hover:bg-card/[0.4] backdrop-blur-md p-10 md:p-12 rounded-[4px] transition-all duration-500 card-lift">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/0 to-transparent group-hover:via-sky-500/50 transition-all duration-[1.2s]" />
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <h4 className="text-xl font-black tracking-[0.05em] text-foreground">{phase.title}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-sky-400 tracking-wider">{phase.price}</span>
                      <span className="text-sm font-mono text-foreground/50 tracking-wider">· {phase.time}</span>
                    </div>
                  </div>
                  <p className="text-base text-foreground/70 font-light leading-relaxed max-w-3xl">{phase.body}</p>
                  {phase.guarantee && (
                    <p className="text-sm text-sky-400 mt-6 italic font-mono tracking-wider">{phase.guarantee}</p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* What You Own */}
          <ScrollReveal delay={300}>
            <div className="border border-white/[0.05] bg-card/[0.2] p-10 mt-6 rounded-[4px]">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/60 mb-6">What You Own</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["Complete source code", "Your database, your infrastructure", "No subscription fees", "No per-seat licensing", "No vendor lock-in", "Extend or modify independently"].map((item) => (
                  <span key={item} className="text-sm text-foreground/70 font-light flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-sky-400 shrink-0" />{item}
                  </span>
                ))}
              </div>
              <p className="text-sm text-foreground/50 mt-8 font-mono tracking-wider">
                Juniper Square: $700K+/year, subscription, you never own it. Traditional dev shop: €100-200K, 12+ months. Muditek: pay once, own it forever, delivered in 4-8 weeks.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
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

      {/* ══════ FINAL CTA ══════ */}
      <section id="contact" className="py-48 min-h-[50vh] w-full flex items-center justify-center relative overflow-hidden bg-background">
        <div className="max-w-[1000px] w-full px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.9] mb-8 text-balance">
              Find out what your firm is losing to <span className="text-sky-400 italic font-medium">manual operations.</span>
            </h2>
            <p className="text-lg text-foreground/60 font-light max-w-2xl mx-auto mb-6 leading-relaxed">
              Book a 30-minute call. We&apos;ll walk through your current workflows, identify where your team is spending the most time on work that isn&apos;t generating returns, and show you the working system we built.
            </p>
            <p className="text-sm font-mono text-foreground/50 tracking-wider uppercase mb-14">
              I take 1-2 build clients at a time. Each engagement gets my full attention.
            </p>
            <a href="https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink" target="_blank" rel="noopener noreferrer" className="btn-press group relative inline-flex items-center justify-center px-14 py-6 bg-sky-500 text-background text-sm font-black uppercase tracking-[0.2em] overflow-hidden rounded-[2px] transition-transform hover:scale-[1.03] duration-500">
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
