import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260309_042944_4a2205b7-b061-490a-852b-92d9e9955ce9.mp4";

const TOOL_STACK = [
  { name: "Claude", icon: "anthropic" },
  { name: "n8n", icon: "n8n" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "Vercel", icon: "vercel" },
  { name: "Supabase", icon: "supabase" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Python", icon: "python" },
  { name: "HubSpot", icon: "hubspot" },
  { name: "WhatsApp", icon: "whatsapp" },
  { name: "Telegram", icon: "telegram" },
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
      <Navbar />

      {/* HERO */}
      <div className="relative w-full h-[100dvh] min-h-[800px] overflow-hidden flex flex-col items-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/documents-desk.png"
          className="absolute inset-0 w-full h-full object-cover z-0"
          aria-hidden="true"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/90 via-background/40 to-background" aria-hidden="true" />

        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl w-full pt-24">
           <h1 className="text-5xl sm:text-7xl lg:text-[100px] font-black tracking-[-0.04em] leading-[0.9] text-foreground text-balance drop-shadow-2xl">
              Your best people are stuck doing work that doesn&apos;t <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 opacity-90">need them.</span>
           </h1>
           <p className="mt-8 text-lg md:text-xl text-foreground/80 max-w-2xl leading-relaxed">
             We find where you&apos;re bleeding money, then build the AI systems that fix it.
           </p>

           <div className="mt-14 flex flex-col sm:flex-row items-center gap-5">
              <Link href="#solutions" className="group relative px-10 py-5 bg-foreground text-background font-black text-sm uppercase tracking-[0.2em] overflow-hidden rounded-[2px] hover:scale-[1.02] transition-transform duration-300 btn-press">
                <span className="relative z-10 flex items-center gap-3">
                  See Which Solution Fits
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div className="absolute inset-0 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-in-out z-0" />
              </Link>
              <Link href="#contact" className="group px-8 py-5 border border-white/[0.15] text-foreground text-sm font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-white/[0.05] transition-colors btn-press">
                 Book a Call
              </Link>
           </div>
        </div>

        {/* INTEGRATIONS BAR */}
        <div className="relative z-20 w-full border-t border-white/[0.08] bg-background/70 backdrop-blur-md overflow-hidden flex h-20 items-center">
           <div className="flex animate-marquee w-max" style={{ animationDuration: '45s' }}>
              {[...TOOL_STACK, ...TOOL_STACK, ...TOOL_STACK].map((tool, i) => (
                <div key={i} className="flex items-center gap-3 mx-10 opacity-80 hover:opacity-100 transition-opacity">
                  <Image
                    src={`https://cdn.simpleicons.org/${tool.icon}/white`}
                    alt={tool.name}
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                    unoptimized
                  />
                  <span className="text-sm font-semibold tracking-wide text-foreground/80 uppercase whitespace-nowrap">{tool.name}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* SOLUTIONS */}
      <section id="solutions" className="py-32 md:py-48 relative border-b border-white/[0.02] w-full flex flex-col items-center">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025] mesh-subtle" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

        <div className="max-w-[1500px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
             <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-24 gap-8">
                <div>
                   <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
                     <span className="w-8 h-[1px] bg-primary/50" />
                     Solutions
                   </h2>
                   <p className="text-sm text-foreground/60 mt-4 mb-8">Systems in production for telecom operators, B2B SaaS companies, and merchant banks across 3 continents.</p>
                   <h3 className="text-4xl md:text-6xl font-black tracking-[-0.03em] leading-[0.9] text-foreground max-w-3xl text-balance">
                      The waste looks different in every industry. The approach <span className="text-primary italic font-medium">doesn&apos;t.</span>
                   </h3>
                </div>
                <div className="hidden md:block w-[1px] h-24 bg-white/[0.08]" />
             </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* mudiAgent Card */}
            <ScrollReveal delay={100}>
              <div className="group relative h-[560px] border border-white/[0.08] bg-card/[0.4] hover:bg-card/[0.6] backdrop-blur-md p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 card-lift">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-[1.2s]" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors" />

                <div className="relative z-10">
                   <div className="text-sm font-semibold text-primary mb-6 tracking-wider uppercase">For Telecom & Enterprise</div>
                   <h4 className="text-3xl font-black tracking-[0.02em] text-foreground mb-5 group-hover:text-primary transition-colors">mudiAgent</h4>
                   <p className="text-base text-foreground/80 leading-relaxed">
                     Your NOC team pulls the same SLA report from 5 systems every Monday. Six hours, same structure, every week. Your engineers search shared drives for 45 minutes to find one document. mudiAgent handles all of it on a device in your office. No cloud. No per-user fees.
                   </p>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/[0.08]">
                   <div className="flex justify-between items-center mb-8">
                     <span className="text-sm text-foreground/70 tracking-wider">Time saved weekly:</span>
                     <span className="text-primary text-lg font-black">40+ hours</span>
                   </div>
                   <p className="text-sm text-primary/80 mb-4">40-hour guarantee or we reconfigure free</p>
                   <Link href="/mudiagent" className="btn-press inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.15em] text-foreground group-hover:text-primary transition-colors">
                      Free Discovery Audit <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                   </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Revenue Leak Audit Card */}
            <ScrollReveal delay={200}>
               <div className="group relative h-[560px] border border-white/[0.08] bg-card/[0.4] hover:bg-card/[0.6] backdrop-blur-md p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 card-lift">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/70 transition-all duration-[1.2s]" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] group-hover:bg-emerald-500/10 transition-colors" />

                <div className="relative z-10">
                   <div className="text-sm font-semibold text-emerald-400 mb-6 tracking-wider uppercase">For B2B SaaS</div>
                   <h4 className="text-3xl font-black tracking-[0.02em] text-foreground mb-5 group-hover:text-emerald-400 transition-colors">Revenue Leak Audit</h4>
                   <p className="text-base text-foreground/80 leading-relaxed">
                     Average inbound response time in B2B SaaS is 42 hours. 30% of leads never get contacted at all. Your demo-to-close is 12% when the benchmark is 20%. We find every leak in your pipeline, quantify it in euros with the formulas, and build the systems that fix it.
                   </p>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/[0.08]">
                   <div className="flex justify-between items-center mb-8">
                     <span className="text-sm text-foreground/70 tracking-wider">Recovered annually:</span>
                     <span className="text-emerald-400 text-lg font-black">&euro;80-180K</span>
                   </div>
                   <p className="text-sm text-emerald-400/80 mb-4">&euro;50K in leaks found or you pay nothing</p>
                   <Link href="/revenue-leak-audit" className="btn-press inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.15em] text-foreground group-hover:text-emerald-400 transition-colors">
                      Book Your Diagnostic <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                   </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* PE Ops Card */}
            <ScrollReveal delay={300}>
               <div className="group relative h-[560px] border border-white/[0.08] bg-card/[0.4] hover:bg-card/[0.6] backdrop-blur-md p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 card-lift">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/0 to-transparent group-hover:via-sky-500/70 transition-all duration-[1.2s]" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-sky-500/5 rounded-full blur-[80px] group-hover:bg-sky-500/10 transition-colors" />

                <div className="relative z-10">
                   <div className="text-sm font-semibold text-sky-400 mb-6 tracking-wider uppercase">For Investment Firms</div>
                   <h4 className="text-3xl font-black tracking-[0.02em] text-foreground mb-5 group-hover:text-sky-400 transition-colors">Operational Infrastructure</h4>
                   <p className="text-base text-foreground/80 leading-relaxed">
                     Your ops team spends 30+ hours a week on manual investor administration — KYC tracking in spreadsheets, documents generated by hand, signatures chased over email. We built the system that replaces all of it. Investor onboarding, compliance, document generation, e-signatures, fee computation — in production for a merchant banking firm.
                   </p>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/[0.08]">
                   <div className="flex justify-between items-center mb-8">
                     <span className="text-sm text-foreground/70 tracking-wider">LP onboarding:</span>
                     <span className="text-sky-400 text-lg font-black">weeks → 3-5 days</span>
                   </div>
                   <p className="text-sm text-sky-400/80 mb-4">&euro;150K in waste found or the discovery is free</p>
                   <Link href="/pe-ops" className="btn-press inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.15em] text-foreground group-hover:text-sky-400 transition-colors">
                      See the Demo <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                   </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CINEMATIC BREAK */}
      <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden">
        <Image src="/images/documents-desk.png" alt="" fill className="object-cover object-center" style={{ filter: 'sepia(0.25) saturate(1.3) hue-rotate(-10deg) brightness(0.4)' }} aria-hidden="true" />
        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background to-transparent" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
        {/* Side vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_85%)]" />
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
          <div className="w-24 h-[1px] bg-primary/50 mb-10" />
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.03em] leading-[0.9] text-foreground/60 text-center text-balance">
            Systems in production across <span className="text-primary/70">3 continents.</span>
          </h2>
          <div className="w-24 h-[1px] bg-primary/50 mt-10" />
        </div>
      </div>

      {/* PROOF */}
      <section id="proof" className="py-32 md:py-48 relative overflow-hidden bg-background w-full flex justify-center">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

         <div className="max-w-[1500px] w-full px-6 md:px-12 relative z-10 flex flex-col xl:flex-row gap-20">
            <div className="xl:w-1/3 xl:pt-12">
               <ScrollReveal>
                  <div className="w-12 h-[1px] bg-primary mb-10" />
                  <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-6">
                     We built this<br />for ourselves.<br /><span className="text-primary italic font-medium">Then clients asked.</span>
                  </h2>
                  <p className="text-base text-foreground/70 leading-relaxed max-w-[400px]">
                     Every number below comes from our own operations. We built mudiAgent to run Muditek. When clients saw the results, they asked us to deploy it for them.
                  </p>
               </ScrollReveal>
            </div>

            <div className="xl:w-2/3">
               <div className="border border-white/[0.08] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl">
                 <div className="grid grid-cols-4 px-8 py-6 border-b border-white/[0.08] text-sm font-black uppercase tracking-[0.15em] text-foreground/60 bg-white/[0.02]">
                   <div className="col-span-2">Task</div>
                   <div>Before</div>
                   <div className="text-primary">After mudiAgent</div>
                 </div>

                 {PROOF_METRICS.map((row, i) => (
                    <ScrollReveal key={row.label} delay={i * 60}>
                       <div className="group grid grid-cols-4 px-8 py-8 border-b border-white/[0.04] hover:bg-white/[0.02] transition-all duration-300 items-center stat-row cursor-default">
                          <div className="col-span-2 text-sm font-bold tracking-wide uppercase text-foreground/80 group-hover:text-foreground transition-colors">
                            {row.label}
                          </div>
                          <div className="text-sm font-mono text-foreground/50 line-through tracking-wider">
                            {row.before}
                          </div>
                          <div className="text-base font-mono font-black tracking-wider text-primary group-hover:text-primary drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                            {row.after}
                          </div>
                       </div>
                    </ScrollReveal>
                 ))}
               </div>
            </div>
         </div>
      </section>

      {/* GUARANTEE */}
      <section className="py-32 w-full relative border-t border-b border-white/[0.04] bg-card/[0.2] flex justify-center mesh-subtle">
         <div className="max-w-[1000px] w-full px-6 text-center">
            <ScrollReveal>
               <div className="doppelrand mx-auto mb-16 inline-block">
                 <div className="doppelrand-inner px-8 py-3 flex items-center gap-4 bg-background">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-primary pt-[1px]">Zero-Risk Guarantee</span>
                 </div>
               </div>

               <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] mb-8 text-balance max-w-3xl mx-auto">
                 Every engagement starts with a diagnostic. If we can&apos;t quantify the waste, <span className="text-primary italic font-medium">you don&apos;t pay.</span>
               </h2>

               <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed mb-16">
                 We pull your data, run the analysis, and show you exactly where the money goes. In euros. With the formulas. If we can&apos;t find meaningful waste, you pay nothing.
               </p>

               <Link href="#contact" className="btn-press relative inline-flex items-center justify-center border border-primary hover:bg-primary hover:text-background text-primary px-12 py-5 text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-[2px] group">
                 <span className="relative z-10 flex items-center gap-3">
                   Book a Call
                   <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform stroke-current"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                 </span>
               </Link>
            </ScrollReveal>
         </div>
      </section>

      {/* FINAL CTA */}
      <section id="contact" className="py-48 min-h-[60vh] w-full flex items-center justify-center relative overflow-hidden bg-background">
         <div className="max-w-[1000px] w-full px-6 text-center relative z-10">
            <ScrollReveal>
               <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.9] mb-10 text-balance drop-shadow-2xl">
                  Stop paying people to do work <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/40 italic font-medium pr-2">a machine</span> should handle.
               </h2>
               <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-14 leading-relaxed">
                  30-minute call. No pitch. We&apos;ll tell you if we can help, and how much you&apos;re losing by waiting.
               </p>

               <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-press group relative inline-flex items-center justify-center px-14 py-6 bg-foreground text-background text-sm font-black uppercase tracking-[0.2em] overflow-hidden rounded-[2px] transition-transform hover:scale-[1.03] duration-500 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                  <span className="relative z-10 flex items-center gap-4">
                     Book a Call
                     <div className="w-1.5 h-1.5 rounded-[1px] bg-background/50 group-hover:bg-primary transition-colors" />
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
