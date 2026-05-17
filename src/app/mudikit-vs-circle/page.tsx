import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { FaqBlock } from "@/components/faq-block";

export const metadata: Metadata = {
  title: "MudiKit vs Circle in 2026 | AI Skills Library vs Community Software | Muditek",
  description:
    "MudiKit vs Circle in 2026: $47/mo Claude Code skills library you install and run vs a tiered, white-label-capable community platform.",
  alternates: { canonical: "https://muditek.com/mudikit-vs-circle" },
  openGraph: {
    title: "MudiKit vs Circle in 2026 | Skills Library vs Community Software",
    description:
      "MudiKit vs Circle in 2026: $47/mo Claude Code skills library vs tiered community platform with spaces, events, and white-label apps.",
    url: "https://muditek.com/mudikit-vs-circle",
    type: "article",
  },
};

const COMPARISON = [
  { category: "Product type", mudikit: "Working skills library you install. Production-grade Claude Code skills, prompts, and configs you clone and run.", circle: "Tiered community software platform. Owners build hosted communities with spaces, events, courses, and member directories." },
  { category: "What you buy", mudikit: "A subscription to one curated library: 15+ skills, 6 playbooks, vault template, 20+ outreach templates, open-source lead capture system.", circle: "A subscription to a single host's Circle community. Content depth, courses, and live events vary by host. Some are open; many are paid." },
  { category: "Time to first deploy", mudikit: "Minutes. Each skill is a working system. Clone, configure, ship. Most subscribers ship something within their first weekend.", circle: "Hours to days. You browse spaces, watch lessons, take notes, then build. Implementation is on you." },
  { category: "Update cadence", mudikit: "New skill or playbook every month, plus updates to existing ones as Claude Code evolves. Subscribers notified by email.", circle: "Depends on the host. Active communities ship weekly content; many go quiet after the launch period." },
  { category: "Pricing model", mudikit: "Flat $47/month. Cancel anytime via Stripe portal. No tiers, no setup fees, no annual lock-in.", circle: "Members pay whatever the host sets. Circle itself sells tiered admin plans (Basic, Plus, Premium, Business) that scale with features and member count." },
  { category: "Community layer", mudikit: "None inside the product. Public discussion is the B2B Agents newsletter (5,000+ operators) and LinkedIn (35K).", circle: "Built-in. Spaces, threads, direct messages, events, member directory, and live calls. Community is the core feature." },
  { category: "White-label / branding", mudikit: "Not applicable — you receive code and configs, not a hosted experience.", circle: "Strong. Custom domain on most tiers; native white-label mobile apps available on higher tiers." },
  { category: "Mobile app", mudikit: "Web only. The product is files you deploy on a workstation or server.", circle: "Native iOS + Android apps for community members. White-label apps available on higher tiers." },
  { category: "Format", mudikit: "Code, configs, prompts, .md skill files. Designed to be cloned into a working Claude Code project and executed.", circle: "Hosted spaces with posts, threads, videos, events, paid memberships, and structured course modules." },
  { category: "Source code & ownership", mudikit: "Yes. You get the actual code I run in my own business. MIT-licensed where applicable. Your deployments are yours.", circle: "No source. Content lives on Circle's infrastructure. If the community owner moves or shuts down, your access goes with it." },
  { category: "Best for", mudikit: "Solo operators, AI builders, founders, and consultants who already use Claude Code and want curated production systems.", circle: "Community owners building branded paid memberships, and members who want structured, white-labeled community experiences." },
  { category: "Technical bar", mudikit: "Comfortable with a terminal. Have used Claude Code at least once. Can read and edit a config file.", circle: "Anyone with a browser or phone. Built for non-technical members and creators." },
];

const FAQ = [
  {
    q: "When does Circle make more sense than MudiKit?",
    a: "When you want a hosted community experience — branded spaces, live events, courses, and a mobile app to keep you engaged. Circle is also the better fit if you're a creator who wants to build your own community on someone else's infrastructure. MudiKit isn't a community platform.",
  },
  {
    q: "Can I host MudiKit content inside a Circle community?",
    a: "MudiKit is licensed for your own use. You can deploy the skills inside your own business and reference what you've shipped in any community you're part of, but you can't redistribute the library to your own paying members. The exception is the open-source lead capture system, which is permissively licensed.",
  },
  {
    q: "How is MudiKit different from a Circle community that ships AI playbooks?",
    a: "MudiKit ships working code and configs you install — not lessons describing how to install. There are no live calls, no threads, no homework. The deliverable is a deployable system, not an educational experience. If you want both, subscribe to MudiKit and join one good Circle community.",
  },
  {
    q: "Do I need to be technical to use MudiKit?",
    a: "You need to be comfortable with a terminal and have used Claude Code at least once. If you've never opened a terminal, start with the newsletter and a community with strong implementation support; come back to MudiKit when you can clone and run a skill.",
  },
  {
    q: "How does pricing actually compare?",
    a: "MudiKit is $47/month flat with no upsell. Paid Circle communities focused on AI/automation operators usually run $50-200/month for members, set by the host. Circle itself charges admins tiered plans (Basic, Plus, Premium, Business) that scale with features and members.",
  },
];

export default function MudikitVsCirclePage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "MudiKit vs Circle in 2026",
            description: "Detailed comparison between MudiKit Claude Code skills library and Circle community software for AI/automation operators and creators.",
            url: "https://muditek.com/mudikit-vs-circle",
            isPartOf: { "@id": "https://muditek.com/#website" },
            datePublished: "2026-05-03",
            dateModified: "2026-05-04",
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Capability comparison: MudiKit vs Circle",
            description: "Side-by-side comparison of MudiKit and Circle across 12 capabilities including format, pricing, white-label, and ownership.",
            itemListOrder: "https://schema.org/ItemListUnordered",
            numberOfItems: COMPARISON.length,
            itemListElement: COMPARISON.map((row, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "PropertyValue",
                name: row.category,
                value: `MudiKit: ${row.mudikit} | Circle: ${row.circle}`,
              },
            })),
          },
        ]}
      />

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-24 md:pb-32 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
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
              MudiKit vs <span className="text-primary italic font-medium">Circle</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-3xl mb-14">
              MudiKit is a $47/month skills library — production-grade Claude Code skills, prompts, and configs you install and run. Circle is community software where someone hosts a branded community with spaces, events, courses, and (on higher tiers) white-label mobile apps. They&apos;re different products solving different jobs. Here&apos;s how they actually compare in 2026 and where each one wins.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Link
                href="/mudikit"
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
            <h3 className="text-xl font-black tracking-[0.05em] text-foreground mb-4">Library vs Software</h3>
            <p className="text-base text-foreground/70 font-light leading-relaxed max-w-3xl">
              Circle is software that powers communities. MudiKit is the systems you ship. If you&apos;re building or joining a branded community, Circle is the right tool. If you want code you can deploy on Sunday afternoon, MudiKit is the right tool. Some operators subscribe to both — Circle for the people, MudiKit for the systems.
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
              <div className="text-foreground/70">Circle</div>
            </div>
            {COMPARISON.map((row, i) => (
              <ScrollReveal key={row.category} delay={i * 40}>
                <div className={`group grid grid-cols-3 px-8 py-7 items-start stat-row cursor-default ${i < COMPARISON.length - 1 ? "border-b border-white/[0.02]" : ""}`}>
                  <div className="text-sm font-bold tracking-[0.1em] uppercase text-foreground/60">{row.category}</div>
                  <div className="text-sm text-foreground/80 font-medium leading-relaxed pr-4">{row.mudikit}</div>
                  <div className="text-sm text-foreground/60 leading-relaxed">{row.circle}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* When Circle wins */}
      <section className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02] bg-card/[0.15]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Honest Take
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-12">
              When does Circle make more <span className="text-primary italic font-medium">sense?</span>
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal>
              <div className="border border-white/[0.05] bg-card/[0.2] p-10 rounded-[4px] h-full">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/50 mb-6">Pick Circle When</h3>
                <ul className="space-y-4 text-base text-foreground/70 font-light leading-relaxed">
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />You&apos;re building a paid membership and need branded community software.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />You want a custom domain, native mobile app, or white-label experience.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />Spaces, events, and structured courses are core to what you offer.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />You&apos;re a member of a community you want to keep belonging to.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0" />You want a hosted, mobile-first experience with built-in moderation.</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="border border-primary/[0.15] bg-primary/[0.03] p-10 rounded-[4px] h-full">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">Pick MudiKit When</h3>
                <ul className="space-y-4 text-base text-foreground/70 font-light leading-relaxed">
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />You want production-grade systems you can deploy this week.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />You already use Claude Code and want a curated skill library.</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />You prefer async — read, deploy, move on, no calls or threads.</li>
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
              Single price vs <span className="text-primary italic font-medium">tiered.</span>
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
                    <p className="text-sm text-foreground/60 font-light mt-1">One price. Everyone gets the full library. No tier upgrades to unlock features.</p>
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
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/60 mb-6">Circle (member side)</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-2xl font-black text-foreground/80 font-mono">$50–200</span>
                    <span className="text-sm text-foreground/50 font-light">/month (typical)</span>
                    <p className="text-sm text-foreground/60 font-light mt-1">Set by the host. Open communities exist. Paid AI/automation communities typically fall in this range.</p>
                  </div>
                  <div className="pt-4 border-t border-white/[0.05]">
                    <span className="text-sm text-foreground/70 font-light">Hosts pay Circle a tiered admin subscription (Basic, Plus, Premium, Business) that scales with features, members, and white-label needs.</span>
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
              Skip the platform. Get the <span className="text-primary italic font-medium">systems.</span>
            </h2>
            <p className="text-lg text-foreground/60 font-light max-w-2xl mx-auto mb-14 leading-relaxed">
              MudiKit is what I run my own business on. Subscribe, install, deploy something this weekend. $47/month. Cancel anytime.
            </p>
            <Link href="/mudikit" className="btn-press group relative inline-flex items-center justify-center px-14 py-6 bg-foreground text-background text-sm font-black uppercase tracking-[0.2em] overflow-hidden rounded-[2px] transition-transform hover:scale-[1.03] duration-500">
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
