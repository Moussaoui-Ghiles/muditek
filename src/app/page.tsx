import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { LogoIcon } from "@/components/logo-icon";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260309_042944_4a2205b7-b061-490a-852b-92d9e9955ce9.mp4";

const TOOL_STACK = [
  { name: "Claude", icon: "anthropic" },
  { name: "n8n", icon: "n8n" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "Vercel", icon: "vercel" },
  { name: "AWS", icon: null },
  { name: "Supabase", icon: "supabase" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Python", icon: "python" },
  { name: "HubSpot", icon: "hubspot" },
  { name: "Salesforce", icon: null },
  { name: "WhatsApp", icon: "whatsapp" },
  { name: "Telegram", icon: "telegram" },
  { name: "Slack", icon: null },
  { name: "Google Workspace", icon: "google" },
];

const PROOF_METRICS = [
  { label: "Proposal drafting", before: "4 hrs", after: "12 min" },
  { label: "Knowledge lookup", before: "30+ min", after: "10 sec" },
  { label: "Weekly status report", before: "3 hrs", after: "Automated" },
  { label: "Competitive intelligence", before: "Manual", after: "Daily, 7 am" },
  { label: "Sales outreach", before: "Inconsistent", after: "Daily, auto" },
];

export default function Home() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      {/* ══════════════════════════════════════════
          HERO — AVANT-GARDE 
          ══════════════════════════════════════════ */}
      <div className="relative w-full h-[100dvh] min-h-[800px] overflow-hidden flex flex-col justify-between items-center">
        {/* VIDEO BACKGROUND */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0" 
          aria-hidden="true"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        
        {/* DEEP OVERLAY GRADIENT */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/90 via-background/40 to-background" aria-hidden="true" />

        {/* TOP NAV LUXE */}
        <nav className="relative z-20 flex justify-between items-center px-6 md:px-12 py-8 w-full max-w-[1800px]" role="navigation">
          <Link href="/" className="group flex items-center gap-3 liquid-glass px-4 py-2 rounded-[4px] hover:bg-white/[0.05] transition-colors" aria-label="Muditek homepage">
             <LogoIcon size={22} />
             <span className="text-[12px] font-black tracking-[0.2em] text-foreground uppercase pt-[1px]">MUDITEK</span>
          </Link>
          <div className="hidden md:flex items-center gap-12">
             <div className="relative group">
                <button className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors font-bold">Solutions</button>
             </div>
             <Link href="#proof" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors font-bold">About</Link>
          </div>
          <Link href="#contact" className="hidden md:flex px-6 py-2.5 rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] bg-foreground text-background hover:scale-[1.03] transition-transform btn-press">
            Book a Call
          </Link>
        </nav>

        {/* HERO TYPOGRAPHY & CTA */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl w-full">
           <div className="mb-10 liquid-glass border border-white/[0.05] px-5 py-2 rounded-full flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/70">Diagnose · Build · Own</span>
           </div>
           
           <h1 className="text-5xl sm:text-7xl lg:text-[100px] font-black tracking-[-0.04em] leading-[0.9] text-foreground text-balance drop-shadow-2xl">
              Redefining the Future of Business with Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 opacity-90">AI Systems.</span>
           </h1>
           <p className="mt-8 text-lg md:text-xl font-light text-hero-sub max-w-2xl leading-relaxed">
             Your best people are stuck doing work a machine should handle. We find where you&apos;re bleeding money — and build the systems that fix it.
           </p>
           
           <div className="mt-14 flex flex-col sm:flex-row items-center gap-5">
              <Link href="#solutions" className="group relative px-10 py-5 bg-foreground text-background font-black text-[11px] uppercase tracking-[0.2em] overflow-hidden rounded-[2px] hover:scale-[1.02] transition-transform duration-300 btn-press">
                <span className="relative z-10 flex items-center gap-3">
                  See Which Solution Fits
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div className="absolute inset-0 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-in-out z-0" />
              </Link>
              <Link href="#contact" className="group px-8 py-5 border border-white/[0.1] text-foreground text-[11px] font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-white/[0.02] transition-colors btn-press">
                 Book a Call
              </Link>
           </div>
        </div>

        {/* TICKER TAPE / MARQUEE */}
        <div className="relative z-20 w-full border-t border-white/[0.05] bg-background/50 backdrop-blur-md overflow-hidden flex h-16 items-center">
           <div className="absolute left-0 md:left-6 text-[9px] font-black uppercase tracking-[0.25em] text-foreground/40 z-10 bg-background/90 px-6 py-2 backdrop-blur-sm border-r border-white/[0.05]">
             Integrations
           </div>
           <div className="flex animate-marquee w-max pl-48" style={{ animationDuration: '40s' }}>
              {[...TOOL_STACK, ...TOOL_STACK, ...TOOL_STACK].map((tool, i) => (
                <div key={i} className="flex items-center gap-3 mx-8 opacity-40 hover:opacity-100 transition-opacity">
                  {tool.icon ? (
                    <Image
                      src={`https://cdn.simpleicons.org/${tool.icon}/white`}
                      alt={tool.name}
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain opacity-70"
                      unoptimized
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-[2px] border border-white/20 flex items-center justify-center text-[7px] font-black text-foreground/40">
                      {tool.name[0]}
                    </div>
                  )}
                  <span className="text-[10px] font-bold tracking-[0.15em] text-foreground uppercase whitespace-nowrap">{tool.name}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SOLUTIONS — ARCHITECTURAL CARDS
          ══════════════════════════════════════════ */}
      <section id="solutions" className="py-32 md:py-48 relative border-b border-white/[0.02] w-full flex flex-col items-center">
        {/* Subdued blueprint grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] mesh-subtle" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        
        <div className="max-w-[1500px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
             <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-24 gap-8">
                <div>
                   <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-primary/70 mb-6 flex items-center gap-3">
                     <span className="w-8 h-[1px] bg-primary/50" />
                     What We Build
                   </h2>
                   <h3 className="text-4xl md:text-6xl font-black tracking-[-0.03em] leading-[0.9] text-foreground max-w-3xl text-balance">
                      Which of these sounds like <span className="text-foreground/40 italic font-medium">your office?</span>
                   </h3>
                </div>
                <div className="hidden md:block w-[1px] h-24 bg-white/[0.08]" />
             </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* mudiAgent Card */}
            <ScrollReveal delay={100}>
              <div className="group relative h-[520px] border border-white/[0.05] bg-card/[0.2] hover:bg-card/[0.5] backdrop-blur-md p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 card-lift">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-[1.2s]" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors" />
                
                <div className="relative z-10">
                   <div className="text-[10px] font-mono text-primary/50 mb-8 tracking-widest uppercase">For Telecom & Enterprise</div>
                   <h4 className="text-2xl font-black tracking-[0.02em] text-foreground mb-4 uppercase group-hover:text-primary transition-colors">mudiAgent</h4>
                   <p className="text-sm text-foreground/50 leading-relaxed font-light mb-6">
                     Every Monday, someone on your team spends 6 hours pulling the same report from 5 systems. Every day, someone searches shared drives for 45 minutes to find one document. mudiAgent handles all of it — on a device in your office. No cloud.
                   </p>
                </div>
                
                <div className="relative z-10 pt-6 border-t border-white/[0.05]">
                   <div className="flex justify-between items-center text-xs font-mono mb-8">
                     <span className="text-foreground/40 tracking-wider">SLA Reports:</span>
                     <span className="text-primary font-bold">2-3 days → 1 hr</span>
                   </div>
                   <Link href="/mudiagent" className="btn-press inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground group-hover:text-primary transition-colors">
                      Free Discovery Audit <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                   </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Revenue Machine Card */}
            <ScrollReveal delay={200}>
               <div className="group relative h-[520px] border border-white/[0.05] bg-card/[0.2] hover:bg-card/[0.5] backdrop-blur-md p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 card-lift">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/70 transition-all duration-[1.2s]" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] group-hover:bg-emerald-500/10 transition-colors" />
                
                <div className="relative z-10">
                   <div className="text-[10px] font-mono text-emerald-500/50 mb-8 tracking-widest uppercase">For B2B SaaS</div>
                   <h4 className="text-2xl font-black tracking-[0.02em] text-foreground mb-4 uppercase group-hover:text-emerald-400 transition-colors">Pipeline Diagnostic</h4>
                   <p className="text-sm text-foreground/50 leading-relaxed font-light mb-6">
                     A lead fills out your demo request at 2 pm. Your team responds 18 hours later. The competitor responded in 4 minutes. That lead cost €200 to generate. The deal was worth €10K. Gone. We find every leak like this — and quantify it.
                   </p>
                </div>
                
                <div className="relative z-10 pt-6 border-t border-white/[0.05]">
                   <div className="flex justify-between items-center text-xs font-mono mb-8">
                     <span className="text-foreground/40 tracking-wider">Recovered:</span>
                     <span className="text-emerald-400 font-bold">€80-180K/yr</span>
                   </div>
                   <Link href="/revenue-machine" className="btn-press inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground group-hover:text-emerald-400 transition-colors">
                      Book Your Diagnostic <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                   </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* PE Ops Card */}
            <ScrollReveal delay={300}>
               <div className="group relative h-[520px] border border-white/[0.05] bg-card/[0.2] hover:bg-card/[0.5] backdrop-blur-md p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 card-lift">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/70 transition-all duration-[1.2s]" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] group-hover:bg-amber-500/10 transition-colors" />
                
                <div className="relative z-10">
                   <div className="text-[10px] font-mono text-amber-500/50 mb-8 tracking-widest uppercase">For Investment Firms</div>
                   <h4 className="text-2xl font-black tracking-[0.02em] text-foreground mb-4 uppercase group-hover:text-amber-400 transition-colors">Operational Infrastructure</h4>
                   <p className="text-sm text-foreground/50 leading-relaxed font-light mb-6">
                     Your compliance person tracks 40 LPs in a spreadsheet. Your ops team generates agreements in Word. Forty investors, forty documents, forty chances for error. We built the system that replaces all of it — in production for a merchant bank.
                   </p>
                </div>
                
                <div className="relative z-10 pt-6 border-t border-white/[0.05]">
                   <div className="flex justify-between items-center text-xs font-mono mb-8">
                     <span className="text-foreground/40 tracking-wider">Onboarding:</span>
                     <span className="text-amber-400 font-bold">Weeks → 3-5 Days</span>
                   </div>
                   <Link href="/pe-ops" className="btn-press inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground group-hover:text-amber-400 transition-colors">
                      See the Demo <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                   </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROOF — METRICS GRID
          ══════════════════════════════════════════ */}
      <section id="proof" className="py-32 md:py-48 relative overflow-hidden bg-background w-full flex justify-center">
         {/* Center radial glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />
         
         <div className="max-w-[1500px] w-full px-6 md:px-12 relative z-10 flex flex-col xl:flex-row gap-20">
            <div className="xl:w-1/3 xl:pt-12">
               <ScrollReveal>
                  <div className="w-12 h-[1px] bg-primary mb-10" />
                  <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-6 uppercase">
                     We built this<br />for ourselves.<br /><span className="text-primary italic font-medium">Then clients asked.</span>
                  </h2>
                  <p className="text-base text-foreground/50 font-light leading-relaxed mb-10 max-w-[400px]">
                     Every number below comes from our own operations. We built mudiAgent to run Muditek. When clients saw the results, they asked us to deploy it for them.
                  </p>
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/[0.05] rounded-[2px] text-[10px] font-mono uppercase tracking-widest text-primary/70">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    Limited Engagements per Quarter
                  </div>
               </ScrollReveal>
            </div>

            <div className="xl:w-2/3">
               <div className="border border-white/[0.05] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl">
                 <div className="grid grid-cols-4 px-8 py-6 border-b border-white/[0.05] text-[10px] font-black uppercase tracking-[0.25em] text-foreground/40 bg-white/[0.01]">
                   <div className="col-span-2">Task</div>
                   <div>Before</div>
                   <div className="text-primary">After mudiAgent</div>
                 </div>
                 
                 {PROOF_METRICS.map((row, i) => (
                    <ScrollReveal key={row.label} delay={i * 60}>
                       <div className="group grid grid-cols-4 px-8 py-8 border-b border-white/[0.02] hover:bg-white/[0.02] transition-all duration-300 items-center stat-row cursor-default">
                          <div className="col-span-2 text-[13px] font-bold tracking-[0.1em] uppercase text-foreground/70 group-hover:text-foreground transition-colors">
                            {row.label}
                          </div>
                          <div className="text-[11px] font-mono text-foreground/30 line-through tracking-wider">
                            {row.before}
                          </div>
                          <div className="text-[12px] font-mono font-black tracking-widest text-primary/90 group-hover:text-primary drop-shadow-[0_0_12px_rgba(90,159,204,0.4)]">
                            {row.after}
                          </div>
                       </div>
                    </ScrollReveal>
                 ))}
               </div>
            </div>
         </div>
      </section>

      {/* ══════════════════════════════════════════
          GUARANTEE VAULT
          ══════════════════════════════════════════ */}
      <section className="py-32 w-full relative border-t border-b border-white/[0.02] bg-card/[0.2] flex justify-center mesh-subtle">
         <div className="max-w-[1000px] w-full px-6 text-center">
            <ScrollReveal>
               <div className="doppelrand mx-auto mb-16 inline-block">
                 <div className="doppelrand-inner px-8 py-3 flex items-center gap-4 bg-background">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary pt-[1px]">Zero-Risk Guarantee</span>
                 </div>
               </div>
               
               <h2 className="text-3xl md:text-5xl lg:text-5xl font-black tracking-[-0.03em] leading-[1.05] mb-8 text-balance max-w-3xl mx-auto uppercase">
                 Every engagement starts with a diagnostic. If we can&apos;t quantify the waste, <span className="text-primary italic font-medium">you don&apos;t pay.</span>
               </h2>
               
               <p className="text-base md:text-lg text-foreground/50 max-w-2xl mx-auto leading-relaxed font-light mb-16">
                 We pull your data, run the analysis, and show you exactly where the money goes — in euros, with the formulas. If we can&apos;t find meaningful waste, you pay nothing.
               </p>
               
               <Link href="#contact" className="btn-press relative inline-flex items-center justify-center border border-primary hover:bg-primary hover:text-background text-primary px-12 py-5 text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 rounded-[2px] group">
                 <span className="relative z-10 flex items-center gap-3">
                   Book a Call
                   <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform stroke-current"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                 </span>
               </Link>
            </ScrollReveal>
         </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA MONOLITH
          ══════════════════════════════════════════ */}
      <section id="contact" className="py-48 min-h-[60vh] w-full flex items-center justify-center relative overflow-hidden bg-background">
         <div className="max-w-[1000px] w-full px-6 text-center relative z-10">
            <ScrollReveal>
               <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.9] mb-10 text-balance uppercase drop-shadow-2xl">
                  Stop paying people to do work <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/40 italic font-medium pr-2">a machine</span> should handle.
               </h2>
               <p className="text-lg md:text-xl text-foreground/40 font-light max-w-2xl mx-auto mb-14 leading-relaxed">
                  30-minute call. No pitch. We&apos;ll tell you if we can help — and how much you&apos;re losing by waiting.
               </p>
               
               <a href="mailto:ghiles@muditek.com" className="btn-press group relative inline-flex items-center justify-center px-14 py-6 bg-foreground text-background text-[13px] font-black uppercase tracking-[0.2em] overflow-hidden rounded-[2px] transition-transform hover:scale-[1.03] duration-500 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                  <span className="relative z-10 flex items-center gap-4">
                     Book a Call
                     <div className="w-1.5 h-1.5 rounded-[1px] bg-background/50 group-hover:bg-primary transition-colors" />
                  </span>
               </a>
            </ScrollReveal>
         </div>
         
         {/* Massive typographic watermark behind text */}
         <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-[25vw] font-black tracking-[-0.05em] text-white/[0.01] pointer-events-none whitespace-nowrap z-0 select-none">
            MUDITEK
         </div>
      </section>

      <Footer />
    </div>
  );
}
