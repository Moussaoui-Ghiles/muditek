import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { FaqBlock } from "@/components/faq-block";

export const metadata: Metadata = {
  title: "MudiKit vs Skool in 2026 | AI Skills Library vs Community Platform | Muditek",
  description: "MudiKit vs Skool in 2026: a $47/mo Claude Code skills library you install and run vs a community platform with courses, threads, and gamification. Honest side-by-side.",
  alternates: { canonical: "https://muditek.com/mudikit-vs-skool" },
  openGraph: {
    title: "MudiKit vs Skool in 2026 | Skills Library vs Community Platform",
    description: "MudiKit vs Skool in 2026: $47/mo Claude Code skills library you deploy vs community + courses platform. Where each one wins.",
    url: "https://muditek.com/mudikit-vs-skool",
    type: "article",
  },
};

const COMPARISON = [
  { category: "Product type", mudikit: "Working skills library you install. Production-grade Claude Code skills, prompts, and configs you clone and run.", skool: "Hosted community platform with courses, discussion feed, calendar, and gamification. Owner posts content; members consume and chat." },
  { category: "What you get", mudikit: "15+ Claude Code skills (outreach, lead gen, content writing, scraping, inbox SDR), 6 implementation playbooks, vault template, 20+ outreach templates, open-source lead capture system.", skool: "Access to a single creator's community: courses, group threads, weekly calls, and a points/levels system. Content depth depends on the host." },
  { category: "Time to first deploy", mudikit: "Minutes. Each skill is a working system. Clone, configure, ship. Most subscribers ship something within their first weekend.", skool: "Hours to days. You watch lessons, take notes, and then build. Implementation is on you." },
  { category: "Maintenance & updates", mudikit: "New skill or playbook every month. Existing items updated as Claude Code evolves. Subscribers notified when something drops.", skool: "Depends entirely on the community owner. Some are actively updated, many go dormant after the launch cohort." },
  { category: "Pricing model", mudikit: "Flat $47/month. Cancel anytime via Stripe customer portal. No setup fees, no annual commitment.", skool: "Members pay whatever the community owner sets (often $50-200/month for AI/automation communities). Skool itself charges owners $99/month flat." },
  { category: "Live calls & community", mudikit: "None. No live calls, no Discord, no homework. Async by design. The newsletter and LinkedIn feed are the public discussion layer.", skool: "Built-in: weekly calls, group threads, member-to-member messaging, mobile app notifications. Community is the product." },
  { category: "Mobile app", mudikit: "Web only. The product is files you deploy on a workstation or server.", skool: "Native iOS + Android app. Browse threads, watch lessons, get push notifications on the go." },
  { category: "Format", mudikit: "Code, configs, prompts, .md skill files. Designed to be cloned into a working Claude Code project and executed.", skool: "Video courses, written posts, threads, comments. Designed to be watched, read, and discussed." },
  { category: "Source code & ownership", mudikit: "Yes. You get the actual code I run in my own business. MIT-licensed where applicable. Your deployments are yours.", skool: "No source. Content lives on the host's Skool group. If the owner closes the community, your access goes with it." },
  { category: "Best for", mudikit: "Solo operators, AI builders, founders, and consultants who already use Claude Code and want production-grade systems they can deploy this week.", skool: "Learners who want peer accountability, structured courses, and a community to ask questions in. Especially good for cohort-style learning." },
  { category: "Technical bar", mudikit: "Comfortable with a terminal. Have used Claude Code at least once. Can read and edit a config file.", skool: "Anyone with a browser or phone. Designed to be approachable to non-technical learners." },
  { category: "What scales over time", mudikit: "Your library of deployable systems grows monthly. Old skills compound; you accumulate working assets.", skool: "Your network and accountability circle. The content library is owner-dependent." },
];

const FAQ = [
  {
    q: "When does Skool make more sense than MudiKit?",
    a: "When you want peer community, structured courses, and accountability. If you learn best with cohort experiences, weekly group calls, and a discussion thread to post in, Skool is the better format. MudiKit has zero community layer — it's a library of systems, not a learning environment.",
  },
  {
    q: "Can I get both?",
    a: "Yes. They're not mutually exclusive. Many MudiKit subscribers are also in one or two Skool communities for the discussion and accountability. MudiKit gives you the systems to deploy; a Skool community gives you peers to talk to about it.",
  },
  {
    q: "Is MudiKit a community at all?",
    a: "Not a community platform. The public layer is the B2B Agents newsletter (5,000+ operators) and LinkedIn (35K). Subscribers get the library and update emails. There are no live calls, no Discord, no homework. Async by design.",
  },
  {
    q: "What if I'm not technical enough for MudiKit?",
    a: "Then start with the free newsletter and a Skool community where the host walks through implementation in calls. MudiKit assumes you can clone a repo, edit a config, and run a skill in Claude Code. If you're not there yet, the gap is small but real.",
  },
  {
    q: "How does pricing actually compare?",
    a: "MudiKit is $47/month flat with no upsell. Most paid Skool communities for AI/automation operators run $50-200/month, and prices vary by host. If you're choosing one tool, compare the deliverable: deployable skills you own vs community access tied to a single host.",
  },
];

export default function MudikitVsSkoolPage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "MudiKit vs Skool in 2026",
            description: "Detailed comparison between MudiKit Claude Code skills library and Skool community platform for AI/automation operators.",
            url: "https://muditek.com/mudikit-vs-skool",
            isPartOf: { "@id": "https://muditek.com/#website" },
            datePublished: "2026-05-03",
            dateModified: "2026-05-03",
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Capability comparison: MudiKit vs Skool",
            description: "Side-by-side comparison of MudiKit and Skool across 12 capabilities including format, pricing, community, and ownership.",
            itemListOrder: "https://schema.org/ItemListUnordered",
            numberOfItems: COMPARISON.length,
            itemListElement: COMPARISON.map((row, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "PropertyValue",
                name: row.category,
                value: `MudiKit: ${row.mudikit} | Skool: ${row.skool}`,
              },
            })),
          },
        ]}
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
                MudiKit / Comparison
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-12 text-balance">
              MudiKit vs <span className="text-primary italic font-medium">Skool</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-3xl mb-14">
              MudiKit is a $47/month skills library you install and run — production-grade Claude Code skills, prompts, and configs you deploy this weekend. Skool is a community platform where someone hosts a group and posts courses, calls, and threads. Different categories. Different jobs. Here&apos;s how they actually compare in 2026, and where each one wins.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Link
                href="/buy"
                className="group relative inline-flex items-center px-10 py-5 bg-foreground text-background font-black text-sm uppercase tracking-[0.2em] overflow-hidden rounded-[2px] hover:scale-[1.02] transition-transform duration-300 btn-press"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Get MudiKit — $47/mo
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div className="absolute inset-0 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-in-out z-0" />
              </Link>
              <Link
                href="/newsletter"
                className="px-8 py-5 border border-white/[0.1] text-foreground text-sm font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-white/[0.02] transition-colors btn-press"
              >
                Read the Newsletter First
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick verdict */}
      <section className="py-20 w-full flex justify-center border-t border-b border-white/[0.02] bg-card/[0.2]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h3 className="text-xl font-black tracking-[0.05em] text-foreground mb-4">Library vs Community</h3>
            <p className="text-base text-foreground/70 font-light leading-relaxed max-w-3xl">
              Skool is the place you go to be in a community. MudiKit is the place you go to get systems. If you&apos;re choosing one in 2026, ask: do I need peers and structure, or do I need code I can deploy by Sunday? They solve different problems and the right answer is sometimes both.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-32 md:py-48 w-full flex justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Side-by-Side
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16 max-w-3xl">
              Twelve dimensions. Different <span className="text-primary italic font-medium">jobs.</span>
            </h3>
          </ScrollReveal>

          <div className="border border-white/[0.05] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl">
            <div className="grid grid-cols-3 px-8 py-6 border-b border-white/[0.05] text-sm font-black uppercase tracking-[0.15em] text-foreground/60 bg-white/[0.01]">
              <div>What Matters</div>
              <div className="text-primary">MudiKit</div>
              <div className="text-foreground/70">Skool</div>
            </div>
            {COMPARISON.map((row, i) => (
              <ScrollReveal key={row.category} delay={i * 40}>
                <div className={`group grid grid-cols-3 px-8 py-7 items-start stat-row cursor-default ${i < COMPARISON.length - 1 ? "border-b border-white/[0.02]" : ""}`}>
                  <div className="text-sm font-bold tracking-[0.1em] uppercase text-foreground/60">{row.category}</div>
                  <div className="text-sm text-foreground/80 font-medium leading-relaxed pr-4">{row.mudikit}</div>
                  <div className="text-sm text-foreground/60 leading-relaxed">{row.skool}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* When Skool wins */}
      <section className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02] bg-card/[0.15]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Honest Take
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-12">
              When does Skool make more <span className="text-primary italic font-medium">sense?</span>
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal>
              <div className="border border-white/[0.05] bg-card/[0.2] p-10 rounded-[4px] h-full">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/50 mb-6">Pick Skool When</h3>
                <ul className="space-y-4 text-base text-foreground/70 font-light leading-relaxed">
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />You learn best in cohorts with weekly accountability calls.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />You want a peer group to ask questions and share progress with.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />Structured courses are how you absorb new material.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />You need mobile-first access and push notifications to stay engaged.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />You&apos;re not yet ready to read code or open a terminal.</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="border border-primary/[0.15] bg-primary/[0.03] p-10 rounded-[4px] h-full">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">Pick MudiKit When</h3>
                <ul className="space-y-4 text-base text-foreground/70 font-light leading-relaxed">
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />You want production-grade systems you can deploy this week.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />You already use Claude Code and want a curated skill library.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />You prefer async — read, deploy, move on, no calls to attend.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />You want code, prompts, and configs you keep — not lectures.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />You want a single voice with skin in the game, not a forum.</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pricing comparison */}
      <section className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Pricing
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16">
              The 12-month <span className="text-primary italic font-medium">cost.</span>
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal>
              <div className="border border-primary/[0.15] bg-primary/[0.03] p-10 rounded-[4px]">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">MudiKit</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-2xl font-black text-foreground font-mono">$47</span>
                    <span className="text-sm text-foreground/50 font-light">/month flat</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">Same price for everyone. No tiers, no upsell, no annual lock-in.</p>
                  </div>
                  <div className="pt-4 border-t border-primary/[0.1]">
                    <span className="text-lg font-black text-foreground font-mono">$564</span>
                    <span className="text-sm text-foreground/50 font-light"> / 12 months</span>
                    <p className="text-sm text-foreground/50 font-light mt-1">15+ skills, 6 playbooks, vault template, 20+ outreach templates, monthly drops. Cancel anytime.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="border border-white/[0.05] bg-card/[0.2] p-10 rounded-[4px]">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/60 mb-6">Skool (typical paid AI/automation community)</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-2xl font-black text-foreground/80 font-mono">$50–200</span>
                    <span className="text-sm text-foreground/50 font-light">/month</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">Set by the community owner. Free communities exist; paid ones in this niche typically fall in this range.</p>
                  </div>
                  <div className="pt-4 border-t border-white/[0.05]">
                    <span className="text-lg font-black text-foreground/80 font-mono">$600–2,400</span>
                    <span className="text-sm text-foreground/50 font-light"> / 12 months</span>
                    <p className="text-sm text-foreground/50 font-light mt-1">What you get depends entirely on the host. Skool itself charges owners $99/month flat for the platform.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqBlock items={FAQ} accentColor="primary" />

      {/* Final CTA */}
      <section className="py-48 min-h-[50vh] w-full flex items-center justify-center relative overflow-hidden bg-background">
        <div className="max-w-[1000px] w-full px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.9] mb-10 text-balance">
              Stop watching lectures. Ship a <span className="text-primary italic font-medium">system.</span>
            </h2>
            <p className="text-lg text-foreground/60 font-light max-w-2xl mx-auto mb-14 leading-relaxed">
              MudiKit is what I run my own business on. Subscribe, install, deploy something this weekend. $47/month. Cancel anytime.
            </p>
            <Link href="/buy" className="btn-press group relative inline-flex items-center justify-center px-14 py-6 bg-foreground text-background text-sm font-black uppercase tracking-[0.2em] overflow-hidden rounded-[2px] transition-transform hover:scale-[1.03] duration-500">
              <span className="relative z-10 flex items-center gap-4">
                Get MudiKit
                <div className="w-1.5 h-1.5 rounded-[1px] bg-background/50 group-hover:bg-primary transition-colors" />
              </span>
            </Link>
          </ScrollReveal>
        </div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-[20vw] font-black tracking-[-0.05em] text-white/[0.015] pointer-events-none whitespace-nowrap z-0 select-none">
          MUDIKIT
        </div>
      </section>

      <Footer />
    </div>
  );
}
