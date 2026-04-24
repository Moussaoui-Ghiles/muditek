"use client";

import { useState } from "react";
import { Logo } from "@/components/logo/logo";
import Link from "next/link";

export default function BuyPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function go() {
    setLoading(true);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined }),
      });
      const d = await r.json();
      if (d.url) window.location.href = d.url;
    } catch { setLoading(false); }
  }

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0c] text-[#e8e8ec]">

      {/* ── HERO ── */}
      <section className="px-6 sm:px-10 pt-24 sm:pt-40 pb-32 max-w-[900px] mx-auto">
        <p className="text-sm font-[family-name:var(--font-geist-mono)] tracking-wider text-[#a0a0a6] mb-6 anim-up">
          ghiles moussaoui / muditek
        </p>

        <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-bold tracking-[-0.045em] leading-[1.04] mb-8 anim-up d1">
          The system behind $3M+&nbsp;
          <br className="hidden sm:block" />
          in B2B revenue.
        </h1>

        <p className="text-xl text-[#a0a0a6] leading-relaxed max-w-[600px] mb-12 anim-up d2">
          15 Claude Code skills, 6 playbooks, the vault template that
          runs my business. Updated monthly. $47/mo. Cancel anytime.
        </p>

        <div className="flex flex-wrap gap-3 items-center anim-up d3">
          <button
            onClick={go}
            disabled={loading}
            className="px-8 py-4 bg-[#e8e8ec] text-[#0a0a0c] font-bold text-base rounded-lg hover:bg-white active:scale-[0.98] transition-all duration-150 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Loading..." : "Unlock the kit"}
          </button>
          <span className="text-sm text-[#a0a0a6] pl-1">$47/month &middot; cancel anytime</span>
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[900px] mx-auto px-6 sm:px-10 py-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <N v="35K+" l="Followers" />
          <N v="35+" l="Systems deployed" />
          <N v="$3M+" l="Revenue generated" />
          <N v="15M+" l="Impressions" />
        </div>
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[900px] mx-auto px-6 sm:px-10 py-24">
          <h2 className="text-3xl font-bold tracking-tight mb-4">What&apos;s inside</h2>
          <p className="text-[#a0a0a6] mb-14 max-w-[500px]">Everything I use to run outreach, content, and lead gen. Nothing held back.</p>

          <div className="space-y-0 border-t border-white/[0.06]">
            <Row n="01" title="Operator Skills" detail="15+" desc="Outreach, cold email, content writing, lead gen, inbox SDR, offer creation, scraping." />
            <Row n="02" title="Playbooks" detail="6" desc="Google Maps outbound. OpenClaw. Agentic SDR. Claude Code tips. Step by step." />
            <Row n="03" title="Vault Template" detail="1" desc="Folder structure, CLAUDE.md files, decision frameworks, pipeline tracker." />
            <Row n="04" title="Outreach Templates" detail="20+" desc="DM and email with A/B variants. PE, SaaS, founder segments." />
            <Row n="05" title="Monthly Drops" detail="\u221E" desc="New skills, updated playbooks, templates. Every month." />
            <Row n="06" title="Lead Capture System" detail="OSS" desc="Comment CTA to email. Apify scraping. Deploy yourself." />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[900px] mx-auto px-6 sm:px-10 py-24">
          <h2 className="text-3xl font-bold tracking-tight mb-14">How it works</h2>

          <div className="grid sm:grid-cols-3 gap-12">
            <div>
              <div className="text-sm font-[family-name:var(--font-geist-mono)] text-[#a0a0a6] mb-3">01</div>
              <h3 className="text-lg font-bold mb-2">Subscribe</h3>
              <p className="text-[15px] text-[#a0a0a6] leading-relaxed">$47/month. Stripe checkout. No platform account. Cancel whenever.</p>
            </div>
            <div>
              <div className="text-sm font-[family-name:var(--font-geist-mono)] text-[#a0a0a6] mb-3">02</div>
              <h3 className="text-lg font-bold mb-2">Access portal</h3>
              <p className="text-[15px] text-[#a0a0a6] leading-relaxed">Log in with your email. Browse skills, playbooks, templates by category.</p>
            </div>
            <div>
              <div className="text-sm font-[family-name:var(--font-geist-mono)] text-[#a0a0a6] mb-3">03</div>
              <h3 className="text-lg font-bold mb-2">Get drops</h3>
              <p className="text-[15px] text-[#a0a0a6] leading-relaxed">New content every month. Email notification. Download and install.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR / NOT FOR ── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[900px] mx-auto px-6 sm:px-10 py-24 grid sm:grid-cols-2 gap-16">
          <div>
            <h3 className="text-lg font-bold mb-6">For you if</h3>
            <ul className="space-y-3 text-[15px] text-[#a0a0a6]">
              <li className="flex gap-3"><span className="text-[#e8e8ec] shrink-0">+</span> You use Claude Code or want to start</li>
              <li className="flex gap-3"><span className="text-[#e8e8ec] shrink-0">+</span> You run a B2B business or freelance</li>
              <li className="flex gap-3"><span className="text-[#e8e8ec] shrink-0">+</span> You want lead gen that runs without you</li>
              <li className="flex gap-3"><span className="text-[#e8e8ec] shrink-0">+</span> You prefer skills over courses</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#a0a0a6]">Not for you if</h3>
            <ul className="space-y-3 text-[15px] text-[#636366]">
              <li className="flex gap-3"><span className="shrink-0">&ndash;</span> Never used a terminal</li>
              <li className="flex gap-3"><span className="shrink-0">&ndash;</span> Want no-code drag and drop</li>
              <li className="flex gap-3"><span className="shrink-0">&ndash;</span> Looking for coaching or community</li>
              <li className="flex gap-3"><span className="shrink-0">&ndash;</span> Need done-for-you service</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[900px] mx-auto px-6 sm:px-10 py-24">
          <div className="max-w-[480px]">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-bold font-[family-name:var(--font-geist-mono)] tracking-tighter">$47</span>
              <span className="text-xl text-[#a0a0a6]">/mo</span>
            </div>
            <p className="text-[#a0a0a6] mb-10">Everything. Monthly updates. Cancel anytime.</p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3.5 bg-[#151517] border border-white/[0.06] rounded-lg text-[#e8e8ec] placeholder:text-[#636366] focus:outline-none focus:border-[#e8e8ec] transition-colors"
              />
              <button
                onClick={go}
                disabled={loading}
                className="px-8 py-3.5 bg-[#e8e8ec] text-[#0a0a0c] font-bold rounded-lg hover:bg-white active:scale-[0.98] transition-all duration-150 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </div>
            <p className="text-sm text-[#636366]">Secured by Stripe. Instant portal access.</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-8 px-6 sm:px-10">
        <div className="max-w-[900px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-[#636366]">
          <Link href="/" aria-label="Muditek home" className="opacity-70 hover:opacity-100 transition-opacity">
            <Logo variant="mark+text" size={22} textClassName="text-[11px] font-black tracking-[0.2em] uppercase text-[#a0a0a6]" />
          </Link>
          <div className="flex gap-6">
            <a href="https://www.linkedin.com/in/ghiles-moussaoui-b36218250/" target="_blank" rel="noopener noreferrer" className="hover:text-[#e8e8ec] transition-colors">LinkedIn</a>
            <span>ghiles@muditek.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function N({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <div className="text-2xl font-bold font-[family-name:var(--font-geist-mono)] tracking-tight">{v}</div>
      <div className="text-sm text-[#a0a0a6] mt-1">{l}</div>
    </div>
  );
}

function Row({ n, title, detail, desc }: { n: string; title: string; detail: string; desc: string }) {
  return (
    <div className="grid grid-cols-[40px_1fr_60px] sm:grid-cols-[50px_200px_80px_1fr] items-baseline gap-x-4 py-5 border-b border-white/[0.06]">
      <span className="text-sm font-[family-name:var(--font-geist-mono)] text-[#636366]">{n}</span>
      <span className="font-semibold">{title}</span>
      <span className="text-sm font-[family-name:var(--font-geist-mono)] text-[#a0a0a6] hidden sm:block">{detail}</span>
      <span className="text-[15px] text-[#a0a0a6] col-span-2 sm:col-span-1 mt-1 sm:mt-0">{desc}</span>
    </div>
  );
}
