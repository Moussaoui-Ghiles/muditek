import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FaqBlock } from "@/components/faq-block";
import { MudikitCta } from "@/components/mudikit-cta";
import { NewsletterInline } from "@/components/newsletter-inline";
import { BOOK_PATH } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Muditek | AI Transformation Partner and Outbound Systems for B2B",
  description:
    "Muditek audits how your work happens, builds the AI systems that run it, and trains your team to keep them running. Outbound engines built and operated for you.",
  alternates: {
    canonical: "https://muditek.com",
    types: { "text/markdown": "https://muditek.com/index.md" },
  },
  openGraph: {
    title: "Muditek | AI Transformation Partner and Outbound Systems for B2B",
    description:
      "We audit how your work happens, build the AI systems that run it, and train your team to keep them running. Outbound engines built and operated for you.",
    url: "https://muditek.com",
    type: "website",
  },
};

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260309_042944_4a2205b7-b061-490a-852b-92d9e9955ce9.mp4";

const OFFERS = [
  {
    name: "AI transformation",
    href: "/ai-transformation",
    lead: "Your team uses AI every day and it still sounds like AI, forgets your business, and needs someone to babysit it. We audit how the work happens, write the business down so a machine can read it, build the systems on top, and train your people to run them.",
    items: [
      { label: "Audit and roadmap", note: "Map the work, rank what is worth building", href: "/ai-transformation#audit" },
      { label: "Systems built for you", note: "Agents and automations inside your tools", href: "/ai-transformation#build" },
      { label: "Coaching for your team", note: "Your people learn to run and extend it", href: "/ai-transformation#coaching" },
    ],
    footer: "Starts with a workflow audit. If it finds nothing worth building, you do not pay for it.",
    cta: "How it works",
  },
  {
    name: "Outbound",
    href: "/outbound",
    lead: "A signal-based outbound channel, built and run for sales-led B2B companies. Cold email and LinkedIn, buyers reached when they are likely to need you, replies answered in minutes, qualified meetings on your closer's calendar.",
    items: [
      { label: "Built and run for you", note: "A tech fee, then a fee per qualified meeting held", href: "/outbound#done-for-you" },
      { label: "Coaching for in-house teams", note: "The same system installed into your people", href: "/outbound#coaching" },
      { label: "M&A origination", note: "Owner meetings for advisors and buyers, its own engine", href: "/ma-origination" },
    ],
    footer: "No success fee. No-shows never bill. Pricing is public at meetingsheld.com.",
    cta: "How outbound works",
  },
];

const PROOF_ROWS = [
  { label: "Proposal drafting", before: "By hand, every time", after: "Drafted by an agent, reviewed by me" },
  { label: "Lead research", before: "Manual, one at a time", after: "Owner names and emails, source cited" },
  { label: "Reply handling", before: "Whenever I got to it", after: "Classified and answered in minutes" },
  { label: "Weekly reporting", before: "Rebuilt every Friday", after: "Generated from the data, on schedule" },
  { label: "Content", before: "Written from scratch", after: "Drafted from my sources, in my voice" },
];

const HOME_FAQ = [
  {
    q: "What does Muditek do?",
    a: "Two lines of work. As an AI transformation partner, we audit how work happens in your company, package what your people know into files AI can read and execute, build the systems on top, and train your team to run them. On the outbound side, we build and operate the whole engine that books qualified meetings, or coach your in-house team to run it.",
  },
  {
    q: "Is this consulting or building?",
    a: "Both, in that order. Every engagement starts with a workflow audit so nothing gets built on a guess. Then we build. Then we train. The consulting ends in a working system you own.",
  },
  {
    q: "Who is this for?",
    a: "B2B companies with a real team and a founder or operator who already uses AI and is tired of babysitting it. On outbound: companies with a closer, a deal size that makes each meeting obviously worth paying for, and a market big enough to work.",
  },
  {
    q: "What does an AI-executable business mean?",
    a: "Three folders. A business context document that tells any model who you are and how you talk. A repository of your workflows written as executable instructions. Your past work, exported and organised so the output sounds like you instead of like a chatbot. Once those exist, every AI tool you already pay for starts producing work you can ship.",
  },
  {
    q: "How is outbound priced?",
    a: "A monthly fee for the infrastructure and a fee per qualified meeting that happens. No success fee. No-shows never bill. The current numbers are published at meetingsheld.com.",
  },
  {
    q: "Do we own what you build?",
    a: "Yes. Source files, prompts, workflows, domains, inboxes, lists, and accounts sit in your name. If you stop working with us, everything keeps running.",
  },
];

function Arrow() {
  return (
    <svg className="btn-icon" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
              <Link href="#offers" className="group relative px-10 py-5 bg-foreground text-background font-black text-sm uppercase tracking-[0.2em] overflow-hidden rounded-[2px] hover:scale-[1.02] transition-transform duration-300 btn-press">
                <span className="relative z-10 flex items-center gap-3">
                  See What We Do
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div className="absolute inset-0 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-in-out z-0" />
              </Link>
              <a href={BOOK_PATH} className="group px-8 py-5 border border-white/[0.15] text-foreground text-sm font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-white/[0.05] transition-colors btn-press">
                 Book a Call
              </a>
           </div>
        </div>
      </div>

      {/* OFFERS */}
      <section id="offers" className="w-full scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-14 md:pb-20">
          <ScrollReveal>
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] leading-[0.95] text-foreground max-w-[22ch] text-balance">
              Two things we do. Both run on the systems we run ourselves.
            </h2>
          </ScrollReveal>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 pb-20 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-6">
            {OFFERS.map((offer, i) => (
              <ScrollReveal key={offer.name} delay={i * 120} className="flex">
                <article className={`flex flex-col w-full rounded-[4px] p-8 md:p-12 ${i === 0 ? "border border-white/[0.1] bg-card" : "band-warm border border-[color:var(--surface-warm-line)]"}`}>
                  <h3 className="text-4xl md:text-5xl font-black tracking-[-0.035em] leading-[0.95] text-foreground mb-6">{offer.name}</h3>
                  <p className="text-lg md:text-xl text-foreground/85 leading-[1.6] max-w-[46ch] mb-10">{offer.lead}</p>

                  <ul className="border-t border-white/[0.1] mb-10">
                    {offer.items.map((item) => (
                      <li key={item.label} className="border-b border-white/[0.1]">
                        <Link href={item.href} className="group flex items-center justify-between gap-6 py-5 transition-colors">
                          <span>
                            <span className="block text-xl font-black tracking-[-0.01em] text-foreground group-hover:text-primary transition-colors">{item.label}</span>
                            <span className="block mt-1 text-base text-foreground/70">{item.note}</span>
                          </span>
                          <svg className="btn-icon shrink-0 text-foreground/50 group-hover:text-primary" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <p className="text-base text-foreground/75 leading-relaxed max-w-[48ch] mb-8 mt-auto">{offer.footer}</p>
                  <Link href={offer.href} className="btn btn-solid self-start">
                    {offer.cta}
                    <Arrow />
                  </Link>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* RUNS MUDITEK FIRST */}
      <section id="proof" className="w-full border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <ScrollReveal>
              <span className="rule" aria-hidden />
              <h2 className="text-3xl md:text-[44px] font-black tracking-[-0.035em] leading-[0.98] text-foreground text-balance mb-6">
                Everything we sell runs Muditek first.
              </h2>
              <p className="text-[17px] text-foreground/80 leading-[1.65] max-w-[42ch]">
                Every line here is a job that used to sit on my desk and now runs on an agent I review. It is the same system we install for clients.
              </p>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7">
            <ScrollReveal delay={120}>
              <div className="panel">
                <div className="panel-bar">
                  <span>Muditek operations</span>
                  <span>running</span>
                </div>
                <div className="panel-body">
                  <div className="grid grid-cols-[1.2fr_1fr_1.4fr] gap-4 pb-3 text-[11px] uppercase tracking-[0.12em] panel-dim">
                    <span>Task</span><span>Before</span><span className="panel-amber">Now</span>
                  </div>
                  {PROOF_ROWS.map((row) => (
                    <div key={row.label} className="panel-row grid grid-cols-[1.2fr_1fr_1.4fr] gap-4 items-start">
                      <span className="text-foreground font-semibold font-sans text-sm">{row.label}</span>
                      <span className="panel-dim">{row.before}</span>
                      <span className="text-foreground">{row.after}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* AUDIT FIRST */}
      <section className="w-full band-warm border-t border-[color:var(--surface-warm-line)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16 items-end">
          <ScrollReveal className="lg:col-span-8">
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance mb-6 max-w-[24ch]">
              Every engagement starts with a workflow audit. If it finds nothing worth building, you don&apos;t pay for it.
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 leading-[1.6] max-w-[56ch]">
              We sit with the people doing the work, map every workflow, and mark what to automate, what to augment, and what stays human. You see the map and the priorities before any system is built.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120} className="lg:col-span-4 lg:text-right">
            <a href={BOOK_PATH} className="btn btn-solid">
              Book a call
              <Arrow />
            </a>
          </ScrollReveal>
        </div>
      </section>

      <FaqBlock items={HOME_FAQ} />

      <MudikitCta />

      <NewsletterInline source="home" />

      {/* FINAL CTA */}
      <section id="contact" className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-28 md:py-40 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.92] text-balance mb-8 max-w-[18ch] mx-auto">
              Stop paying people to do work a machine should handle.
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 max-w-[46ch] mx-auto mb-12 leading-relaxed">
              A few answers, then a slot on the calendar. On the call we tell you whether it is worth building, and what it would take.
            </p>
            <a href={BOOK_PATH} className="btn btn-solid">
              Book a call
              <Arrow />
            </a>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
