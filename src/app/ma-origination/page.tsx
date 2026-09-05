import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { MudikitCta } from "@/components/mudikit-cta";
import { FaqBlock } from "@/components/faq-block";
import { NewsletterInline } from "@/components/newsletter-inline";
import { BOOK_PATH } from "@/lib/booking";

export const metadata: Metadata = {
  title: "M&A Origination | Owner Meetings for Advisors and Buyers | Muditek",
  description:
    "Sell-side mandate origination for M&A advisors and brokers. Direct buy-side target origination for PE firms, family offices, searchers, sponsors, and strategic acquirers. Owner meetings held, evidence attached, no success fee.",
  alternates: { canonical: "https://muditek.com/ma-origination" },
  openGraph: {
    title: "M&A Origination | Muditek",
    description:
      "Owner meetings for the people who hire us. Flat tech fee plus a fee per qualified meeting held. No success fee, no brokerage.",
    url: "https://muditek.com/ma-origination",
    type: "website",
  },
};

const EVIDENCE = [
  { k: "company", v: "Regional industrial services firm, founder owned" },
  { k: "tenure", v: "Same owner has led it for over fifteen years" },
  { k: "succession", v: "No second in command visible on the team page" },
  { k: "signal", v: "First general manager role posted this year" },
  { k: "source", v: "Company site, state registry, job posting. Dated." },
  { k: "reply", v: "\"Open to a conversation about the future of the business.\"" },
];

const PRODUCTS = [
  {
    id: "sell-side",
    title: "Sell-side mandate origination",
    pays: "M&A advisors, boutique investment banks, business brokers, exit advisory firms.",
    sourced: "Owners who fit your deal criteria, are open to discussing a transaction, and may need an advisor.",
    line: "We book meetings with owners who fit your criteria, are open to a transaction, and may hire you to run it.",
    fits: ["Individual brokers inside large networks who must generate their own listings", "Boutique advisors with a clear industry or geography", "Firms that can handle several new owner conversations a month"],
  },
  {
    id: "buy-side",
    title: "Direct buy-side target origination",
    pays: "Lower-middle-market PE firms, PE-backed portfolio companies, family offices, funded searchers, independent sponsors, strategic acquirers.",
    sourced: "Owners whose companies fit one live buy box and who are open to discussing an acquisition.",
    line: "You give us one live buy box. We find the privately held companies inside it and book the owners who are open to a conversation.",
    fits: ["One written buy box, with exclusions", "A named person who takes the meetings", "Capital or a credible path to it, and the ability to pay the tech fee independently of any deal"],
  },
];

const SIGNALS = [
  { s: "Long owner tenure", w: "Same owner for fifteen years or more" },
  { s: "Succession gap", w: "No visible second generation, COO, or general manager" },
  { s: "First delegation hire", w: "A first GM, COO, or president after years of owner control" },
  { s: "Owner steps back", w: "A title change, a president appointed, reduced day-to-day involvement" },
  { s: "Succession language", w: "Public mention of transition, next chapter, or the company's future" },
  { s: "Recapitalization language", w: "Liquidity, growth partner, minority investment, de-risking" },
];

const HELD = [
  "The company fits the written industry, geography, size, and ownership criteria",
  "The attendee is the owner, controlling shareholder, founder, or an approved equivalent",
  "The owner confirmed in writing that they are open to discussing the transaction",
  "The owner knows who the meeting is with before the call",
  "The owner attended",
  "The company is not an existing client, active prospect, duplicate, or written exclusion",
];

const NOT_PROVEN = ["Verified revenue or EBITDA", "Acceptable valuation expectations", "Clean financials", "Readiness to sign an LOI", "Exclusivity or likelihood of close"];

const RULES = [
  "A flat monthly tech fee plus a fee per qualified meeting held. Nothing on the deal.",
  "No success fee, no transaction percentage, no brokerage, no advisory work.",
  "No-show meetings are never billed.",
  "You approve the lane, the exclusions, the message, and the written definition of qualified before launch.",
  "List building, cold email, LinkedIn outreach, replies, written qualification, booking, reminders, and attendance follow-up are ours.",
  "Phone prospecting and phone qualification are not included.",
  "A sample list is offered once, only after you have given a written lane, with an evidence line on every name.",
];

const FAQ = [
  { q: "Is this a success fee model?", a: "No. A flat monthly fee for the tech, then a fee per owner meeting that happens. Nothing on the deal. That keeps us out of brokerage and keeps the incentive on meetings that take place." },
  { q: "What proves an owner wants to sell?", a: "Only the owner's written reply. Public signals decide who we contact first. They never make a meeting qualified. Every name we bring carries the signal, the fact, the source, and the date." },
  { q: "Do you verify revenue or EBITDA?", a: "No. Private financials are usually unavailable or estimated. Before launch we agree on one standard: public proxies the buyer verifies later, an owner-confirmed range in writing, or a private source you supply. We never say verified when it is not." },
  { q: "Which side are you on?", a: "The side is decided by who hires and pays us, never by who receives the outreach. We do not represent both parties in one transaction." },
  { q: "Can we see a sample first?", a: "Yes, once, after you give a written lane: industry, size, geography. Ten names at most, each with its evidence line. Never for a vague lane, never reused." },
  { q: "Do you call owners?", a: "No. Email and LinkedIn only. Phone prospecting and phone qualification are outside the scope." },
  { q: "Who have you done this for?", a: "None in M&A yet. You would be the first, and we say so on the call rather than name a client from another market." },
];

function Arrow() {
  return (
    <svg className="btn-icon" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MaOriginationPage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      <JsonLd
        data={[{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "M&A origination",
          provider: { "@id": "https://muditek.com/#organization" },
          description: "Qualified owner meetings for M&A advisors, brokers, private equity firms, family offices, searchers, sponsors, and strategic acquirers. Flat tech fee plus a fee per meeting held. No success fee.",
          url: "https://muditek.com/ma-origination",
          areaServed: "Worldwide",
        }, {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
            { "@type": "ListItem", position: 2, name: "Outbound", item: "https://muditek.com/outbound" },
            { "@type": "ListItem", position: 3, name: "M&A origination", item: "https://muditek.com/ma-origination" },
          ],
        }]}
      />
      <Navbar />

      {/* HERO */}
      <section className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-20 md:pb-28 grid gap-14 lg:grid-cols-12 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <p className="text-base font-bold text-primary mb-8">M&amp;A origination</p>
              <h1 className="text-5xl sm:text-6xl lg:text-[84px] font-black tracking-[-0.04em] leading-[0.92] text-foreground text-balance mb-8">
                Owner meetings for the people who <span className="text-primary">hire us.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-xl md:text-2xl text-foreground/85 leading-[1.5] max-w-[46ch] mb-10">
                We find the owners, contact them, and put the ones open to a conversation on your calendar. Every name carries its evidence. You pay a tech fee and a fee per meeting held. Nothing on the deal.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={180}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <a href={BOOK_PATH} className="btn btn-solid">Send us your lane<Arrow /></a>
                <a href="https://meetingsheld.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">See pricing</a>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={240} className="lg:col-span-5">
            <div className="panel">
              <div className="panel-bar"><span>one owner, one evidence line</span><span>priority: high</span></div>
              <div className="panel-body">
                {EVIDENCE.map((e) => (
                  <div key={e.k} className="panel-row flex-col gap-0.5 sm:flex-row sm:gap-4">
                    <span className={`shrink-0 sm:w-24 ${e.k === "reply" ? "panel-amber font-bold" : "panel-dim"}`}>{e.k}</span>
                    <span className={e.k === "reply" ? "panel-amber" : ""}>{e.v}</span>
                  </div>
                ))}
                <p className="panel-dim mt-4 pt-3 border-t border-white/[0.06]">a signal is a reason to contact. the reply is the only proof.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* TWO PRODUCTS */}
      <section className="w-full band-warm border-t border-[color:var(--surface-warm-line)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <ScrollReveal>
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance max-w-[20ch] mb-4">
              Two products. The side is decided by who pays.
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 leading-[1.6] max-w-[54ch] mb-14">
              Never by who receives the outreach. We do not represent both parties in one transaction.
            </p>
          </ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-6">
            {PRODUCTS.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 120} className="flex">
                <article id={p.id} className="w-full border border-[color:var(--surface-warm-line)] bg-background/60 rounded-[4px] p-8 md:p-10 scroll-mt-24">
                  <h3 className="text-3xl md:text-4xl font-black tracking-[-0.03em] leading-[1] text-foreground mb-8">{p.title}</h3>
                  <dl className="space-y-6">
                    <div>
                      <dt className="text-sm font-bold text-primary mb-1">Who pays</dt>
                      <dd className="text-[17px] text-foreground/85 leading-[1.6]">{p.pays}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-bold text-primary mb-1">Who is sourced</dt>
                      <dd className="text-[17px] text-foreground/85 leading-[1.6]">{p.sourced}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-bold text-primary mb-1">In one line</dt>
                      <dd className="text-xl font-bold text-foreground leading-[1.4]">{p.line}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-bold text-primary mb-2">Best fit</dt>
                      <dd>
                        <ul className="space-y-2">
                          {p.fits.map((f) => <li key={f} className="text-base text-foreground/85 flex items-start gap-3"><span className="w-1.5 h-1.5 mt-2.5 rounded-full bg-primary shrink-0" />{f}</li>)}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNALS */}
      <section className="w-full border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <ScrollReveal>
              <span className="rule" aria-hidden />
              <h2 className="text-3xl md:text-[44px] font-black tracking-[-0.035em] leading-[0.98] text-foreground text-balance mb-6">
                How owners are found and ranked.
              </h2>
              <p className="text-[17px] text-foreground/80 leading-[1.65] max-w-[42ch]">
                The universe is built from authoritative sources first: registries, licences, filings, directories. Then every company is scored on public evidence. A signal is a reason to contact an owner. It is never proof. We do not infer age, we do not invent revenue, and we do not call a stale website an intent to sell.
              </p>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-7">
            <ScrollReveal delay={120}>
              <div className="panel">
                <div className="panel-bar"><span>owner signals</span><span>stored with fact, source, date</span></div>
                <div className="panel-body">
                  {SIGNALS.map((s) => (
                    <div key={s.s} className="panel-row grid sm:grid-cols-[220px_1fr] gap-1 sm:gap-6">
                      <span className="text-foreground font-bold font-sans">{s.s}</span>
                      <span className="text-foreground/85">{s.w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* WHAT BILLS */}
      <section className="w-full band-warm border-t border-[color:var(--surface-warm-line)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <ScrollReveal>
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance max-w-[18ch] mb-14">
              What a qualified owner meeting held means.
            </h2>
          </ScrollReveal>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <ScrollReveal className="lg:col-span-7">
              <h3 className="text-sm font-bold text-primary mb-5">Every item must be true</h3>
              <ol className="border-t border-[color:var(--surface-warm-line)]">
                {HELD.map((h, i) => (
                  <li key={h} className="flex gap-5 py-4 border-b border-[color:var(--surface-warm-line)] text-[17px] text-foreground leading-[1.5]">
                    <span className="font-mono text-sm text-primary pt-1 shrink-0">{i + 1}</span>{h}
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-base text-foreground/80">The owner does not need to sign a mandate, share financials, accept a valuation, or sign an LOI for the meeting to count.</p>
            </ScrollReveal>
            <ScrollReveal delay={120} className="lg:col-span-5">
              <h3 className="text-sm font-bold text-primary mb-5">What the meeting does not prove</h3>
              <ul className="border-t border-[color:var(--surface-warm-line)]">
                {NOT_PROVEN.map((n) => (
                  <li key={n} className="py-4 border-b border-[color:var(--surface-warm-line)] text-[17px] text-foreground/85">{n}</li>
                ))}
              </ul>
              <p className="mt-5 text-base text-foreground/80">Those need your call, an NDA, a financial review, and diligence.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="w-full border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <ScrollReveal>
              <span className="rule" aria-hidden />
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.035em] leading-[0.95] text-foreground lg:sticky lg:top-32">The rules</h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={100} className="lg:col-span-8">
            <ul className="border-t border-white/[0.08]">
              {RULES.map((r) => (
                <li key={r} className="flex items-start gap-4 py-5 border-b border-white/[0.08] text-[17px] text-foreground/90 leading-[1.5]">
                  <span className="w-1.5 h-1.5 mt-2.5 rounded-full bg-primary shrink-0" />{r}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <FaqBlock items={FAQ} />

      <MudikitCta
        variant="inline"
        headline="The owner finder is in the library."
        body="The Google Maps owner and email finder, the list builder, and the cold email system are the files this engine runs on."
      />

      <NewsletterInline source="ma-origination" />

      {/* FINAL CTA */}
      <section id="contact" className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-28 md:py-40 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.92] text-balance mb-8 max-w-[16ch] mx-auto">
              Send the lane. Industry, size, geography.
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 max-w-[48ch] mx-auto mb-12 leading-relaxed">
              We measure the reachable market before we accept it, and tell you whether we can hit it.
            </p>
            <a href={BOOK_PATH} className="btn btn-solid">Book a call<Arrow /></a>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
