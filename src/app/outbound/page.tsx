import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { MudikitCta } from "@/components/mudikit-cta";
import { FaqBlock } from "@/components/faq-block";
import { NewsletterInline } from "@/components/newsletter-inline";
import { BOOK_PATH } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Signal-Based Outbound, Built and Run for You | Muditek",
  description:
    "Cold email and LinkedIn outbound for sales-led B2B companies. Buyers reached on signals, replies answered in minutes, qualified meetings booked on your closer's calendar. A tech fee plus a fee per meeting held. No success fee.",
  alternates: { canonical: "https://muditek.com/outbound" },
  openGraph: {
    title: "Outbound | Muditek",
    description:
      "Signal-based cold email and LinkedIn outbound, built and operated for you. You pay a tech fee and a fee per qualified meeting held.",
    url: "https://muditek.com/outbound",
    type: "website",
  },
};

const THREAD = [
  { when: "signal", who: "public", line: "New head of sales announced. Two open SDR roles. Posted last week." },
  { when: "day 0", who: "email 1", line: "Under eighty words. Plain text. One question, tied to the signal." },
  { when: "day 3", who: "email 2", line: "Same thread. Adds one thing the first email did not. Then the thread stops." },
  { when: "day 4", who: "prospect", line: "\"Interesting. How does this work?\"" },
  { when: "minutes", who: "muditek", line: "Answered. Screened against your written definition of qualified. Two slots proposed." },
  { when: "thursday", who: "held", line: "Fit confirmed, interest in writing, attended. The only line you pay for." },
];

const ENGINE = [
  { n: "1", title: "Signals", body: "Companies are reached when something public says they may need you now. A new hire, a funding round, a role opening, a new office, a post from last week. The message speaks to that moment instead of to a first line scraped from a profile." },
  { n: "2", title: "Lists", body: "Built from the authoritative source for your market first: registries, directories, filings. Then enriched in layers and verified before a single send. Owners and founders weighted first, because they reply." },
  { n: "3", title: "Infrastructure", body: "Separate domains and inboxes registered in your name, warmed, in a private sending pool. Plain text, no tracking pixels. Your main domain is never touched." },
  { n: "4", title: "Copy", body: "Short, plain, one question. Angles written in variants and tested like ad creative. Two emails per thread, then the thread stops. One variable changed per week, and the results decide." },
  { n: "5", title: "LinkedIn", body: "A manual precision layer on top of email. Hand-picked prospects, no automation, never the same message twice, stop on any reply." },
  { n: "6", title: "Replies and booking", body: "Every reply answered within minutes. Positive replies screened against the definition of qualified you approved, then booked on your closer's calendar with reminders and no-show recovery." },
  { n: "7", title: "Reporting", body: "A written report every week and a strategy call every month. Meetings held is the number that matters, and it is the only one you pay on." },
];

const HELD = [
  "The company fits the criteria you approved before launch",
  "The prospect confirmed interest in writing",
  "The prospect attended",
];

const NOT_BILLED = [
  "A booked meeting that did not happen",
  "A no-show, ever",
  "A meeting with the wrong person",
  "A company outside the agreed criteria",
];

const GATE = [
  { title: "B2B and sales-led", body: "Your deals close on calls with a human. If you are self-serve, this is not your channel." },
  { title: "A deal size that makes the math obvious", body: "A new client has to be worth enough that paying for a held meeting is clearly the right trade." },
  { title: "A market big enough to work", body: "Enough reachable companies to test angles and still have a list left. We check this ourselves before we say yes." },
  { title: "A closer with calendar capacity", body: "Someone named takes the meetings and answers positive replies fast. Booked meetings sitting unanswered kill the engine." },
];

const COACHING = [
  { title: "Offer review", body: "Before a single email goes out: does the offer pass a cold reader, or does it need rebuilding first." },
  { title: "Signals and lists", body: "Which signals to prioritise, where the authoritative data lives for your market, how to verify it." },
  { title: "Copy discipline", body: "How many variants, how to read the results, when to kill an angle." },
  { title: "Reply handling", body: "Scripts, the speed rule, qualification in writing." },
  { title: "Weekly review", body: "Your numbers, with the person running it, every week." },
];

const FAQ = [
  { q: "How is it priced?", a: "A monthly tech fee for the domains, inboxes, data, and software, invoiced in advance. Then a fee per qualified meeting that happens. No success fee, no percentage of anything. No-shows never bill. A reschedule that is held within the agreed window bills once. Current numbers are published at meetingsheld.com." },
  { q: "What counts as a qualified meeting held?", a: "Three things, all true: the company fits the criteria you approved before launch, the prospect confirmed interest in writing, and the prospect attended. You approve the lane, the exclusions, and the wording of what qualified means. Nothing else bills." },
  { q: "What do you mean by signal-based?", a: "We reach a company when something public says it may need you now: a new hire, a funding round, an open role, a new office, a post from last week. The message speaks to that moment. It replaces the fake first-line personalisation that every inbox has learned to ignore." },
  { q: "Who is this not for?", a: "Companies without a closer, companies whose deal size does not make a meeting obviously worth paying for, self-serve products, and markets too small to work. We say no on the first call rather than take the fee." },
  { q: "Can you work our dead leads?", a: "Yes, and it is usually the fastest route to the first held meetings. Your aged leads get worked inside the same engine, with the same reply handling and the same definition of qualified." },
  { q: "We tried cold email and it did not work.", a: "Most attempts fail on the same three things: sending from the main domain, one script instead of testing many, and lists bought raw instead of verified. If none of the three sound familiar, we will tell you outbound is not your channel." },
  { q: "We run outbound in-house. Is there anything for us?", a: "The coaching track. Same system, installed into your people instead of run by us. Offer review, signals and lists, copy discipline, reply handling, and a weekly review of the numbers." },
  { q: "Do you do M&A deal origination?", a: "Yes, as a separate engine with its own rules and a stricter definition of qualified. Owner meetings for advisors, brokers, and buyers. It has its own page." },
];

function Arrow() {
  return (
    <svg className="btn-icon" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OutboundPage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      <JsonLd
        data={[{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Signal-based outbound, built and run for you",
          provider: { "@id": "https://muditek.com/#organization" },
          description: "Cold email and LinkedIn outbound infrastructure, signal-based targeting, verified lists, tested copy, reply handling, and booking, operated end to end and paid per qualified meeting held.",
          url: "https://muditek.com/outbound",
          areaServed: "Worldwide",
        }, {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
            { "@type": "ListItem", position: 2, name: "Outbound", item: "https://muditek.com/outbound" },
          ],
        }]}
      />
      <Navbar />

      {/* HERO */}
      <section className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-20 md:pb-28 grid gap-14 lg:grid-cols-12 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <p className="text-base font-bold text-primary mb-8">Outbound</p>
              <h1 className="text-5xl sm:text-6xl lg:text-[84px] font-black tracking-[-0.04em] leading-[0.92] text-foreground text-balance mb-8">
                Your pipeline runs on referrals and <span className="text-primary">hope.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-xl md:text-2xl text-foreground/85 leading-[1.5] max-w-[46ch] mb-10">
                We build and run a signal-based outbound channel for sales-led B2B companies. Cold email and LinkedIn, buyers reached when they are likely to need you, every reply answered in minutes, qualified meetings on your closer&apos;s calendar. A tech fee, then a fee per meeting held.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={180}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <a href={BOOK_PATH} className="btn btn-solid">Book a call<Arrow /></a>
                <a href="https://meetingsheld.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">See pricing</a>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={240} className="lg:col-span-5">
            <div className="panel">
              <div className="panel-bar"><span>one thread</span><span>billed: meetings held</span></div>
              <div className="panel-body">
                {THREAD.map((t) => (
                  <div key={t.when + t.who} className="panel-row flex-col gap-1 sm:flex-row sm:gap-4">
                    <span className="panel-dim shrink-0 sm:w-20">{t.when}</span>
                    <span className="min-w-0">
                      <span className={t.who === "held" ? "panel-amber font-bold" : "text-foreground font-bold"}>{t.who}</span>
                      <span className="panel-dim"> · </span>
                      <span className={t.who === "held" ? "panel-amber" : ""}>{t.line}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* THE ENGINE */}
      <section id="done-for-you" className="w-full band-warm border-t border-[color:var(--surface-warm-line)] scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <ScrollReveal>
              <span className="rule" aria-hidden />
              <h2 className="text-3xl md:text-[44px] font-black tracking-[-0.035em] leading-[0.98] text-foreground text-balance mb-6 lg:sticky lg:top-32">
                Built and run for you. Every piece of the engine, itemised.
              </h2>
              <p className="text-[17px] text-foreground/80 leading-[1.65] max-w-[40ch]">
                Built in your name, operated by us, yours if you ever stop. Everything traces back to a written intake on your offer, your buyers, their objections, and your tone.
              </p>
            </ScrollReveal>
          </div>
          <ol className="lg:col-span-7 border-t border-[color:var(--surface-warm-line)]">
            {ENGINE.map((row, i) => (
              <li key={row.n} className="border-b border-[color:var(--surface-warm-line)]">
                <ScrollReveal delay={i * 50}>
                  <div className="grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-8 py-7">
                    <h3 className="text-xl font-black text-foreground flex items-baseline gap-3"><span className="font-mono text-sm text-primary">{row.n}</span>{row.title}</h3>
                    <p className="text-[17px] text-foreground/85 leading-[1.65] max-w-[56ch]">{row.body}</p>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHAT YOU PAY FOR */}
      <section className="w-full border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <ScrollReveal>
              <span className="rule" aria-hidden />
              <h2 className="text-3xl md:text-[44px] font-black tracking-[-0.035em] leading-[0.98] text-foreground text-balance mb-6">
                You pay for meetings held. Nothing else.
              </h2>
              <p className="text-[17px] text-foreground/80 leading-[1.65] max-w-[42ch]">
                A monthly tech fee covers the domains, inboxes, data, and software. Then one fee per qualified meeting that happens. No success fee, no percentage of anything. Pricing is public at{" "}
                <a href="https://meetingsheld.com" target="_blank" rel="noopener noreferrer" className="text-foreground font-bold underline underline-offset-4 decoration-primary/60 hover:text-primary">meetingsheld.com</a>.
              </p>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            <ScrollReveal delay={100}>
              <div className="panel h-full">
                <div className="panel-bar"><span>held</span><span className="panel-amber">bills</span></div>
                <div className="panel-body">
                  <ul className="space-y-3">
                    {HELD.map((h) => <li key={h} className="flex gap-3 font-sans text-base text-foreground"><span className="panel-amber shrink-0">+</span>{h}</li>)}
                  </ul>
                  <p className="mt-6 pt-4 border-t border-white/[0.06] panel-dim font-sans text-sm">All three must be true. You approve the wording before launch.</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={180}>
              <div className="panel h-full">
                <div className="panel-bar"><span>not held</span><span>never bills</span></div>
                <div className="panel-body">
                  <ul className="space-y-3">
                    {NOT_BILLED.map((h) => <li key={h} className="flex gap-3 font-sans text-base text-foreground/85"><span className="panel-dim shrink-0">-</span>{h}</li>)}
                  </ul>
                  <p className="mt-6 pt-4 border-t border-white/[0.06] panel-dim font-sans text-sm">A reschedule that is held within the agreed window bills once.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* WHO */}
      <section className="w-full band-warm border-t border-[color:var(--surface-warm-line)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <ScrollReveal>
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance max-w-[20ch] mb-4">
              Four things have to be true before we say yes.
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 leading-[1.6] max-w-[52ch] mb-14">
              We check them on the first call and say no when they are not, rather than take the fee. Your dead leads, if you have them, get worked first: it is usually the fastest route to the first held meetings.
            </p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10 border-t border-[color:var(--surface-warm-line)] pt-10">
            {GATE.map((g, i) => (
              <ScrollReveal key={g.title} delay={i * 80}>
                <h3 className="text-xl font-black tracking-[-0.01em] text-foreground mb-3">{g.title}</h3>
                <p className="text-[17px] text-foreground/85 leading-[1.65] max-w-[46ch]">{g.body}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* COACHING */}
      <section id="coaching" className="w-full border-t border-white/[0.08] scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <ScrollReveal>
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance max-w-[20ch] mb-4">
              Coaching for in-house teams. Same system, installed into your people.
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 leading-[1.6] max-w-[56ch] mb-14">
              For companies that already have someone on outbound and want it to work. We do not send for you. We fix the offer, the signals, the lists, the copy, and the reply handling with the person running it, and review the numbers every week.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10 border-t border-white/[0.08] pt-10">
            {COACHING.map((c, i) => (
              <ScrollReveal key={c.title} delay={i * 60}>
                <h3 className="text-xl font-black text-foreground mb-3">{c.title}</h3>
                <p className="text-base text-foreground/85 leading-relaxed">{c.body}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* M&A POINTER */}
      <section id="ma" className="w-full band-warm border-t border-[color:var(--surface-warm-line)] scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16 items-end">
          <ScrollReveal className="lg:col-span-8">
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance max-w-[18ch] mb-5">
              Owner meetings for M&amp;A advisors and buyers is a separate engine.
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 leading-[1.6] max-w-[54ch]">
              Sell-side mandate origination for advisors and brokers. Direct buy-side target origination for PE firms, portfolio companies, family offices, searchers, sponsors, and strategic acquirers. Its own universe, its own signals, a stricter definition of qualified.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120} className="lg:col-span-4 lg:text-right">
            <Link href="/ma-origination" className="btn btn-amber">M&amp;A origination<Arrow /></Link>
          </ScrollReveal>
        </div>
      </section>

      <FaqBlock items={FAQ} />

      <MudikitCta
        variant="inline"
        headline="Read the playbooks behind this engine first."
        body="The cold email system, the owner finder, the list builder, the offer review. The library holds the exact files."
      />

      <NewsletterInline source="outbound" />

      {/* FINAL CTA */}
      <section id="contact" className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-28 md:py-40 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.92] text-balance mb-8 max-w-[18ch] mx-auto">
              Tell us who you sell to and what a good meeting looks like.
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 max-w-[46ch] mx-auto mb-12 leading-relaxed">
              A few answers, then a slot on the calendar. We tell you whether your market and deal size make this work, and say no if they do not.
            </p>
            <a href={BOOK_PATH} className="btn btn-solid">Book a call<Arrow /></a>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
