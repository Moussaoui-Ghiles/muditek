"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  download_url: string;
  file_type: string;
  is_new: boolean;
  is_free: boolean;
  created_at: string;
}

interface NewsletterIssue {
  slug: string;
  subject: string;
  sent_at: Date | null;
}

const CALLS = [
  { title: "PE Ops Audit", desc: "For PE firms — operational infrastructure review.", href: "/pe-ops", label: "Private Equity" },
  { title: "Revenue Leak Audit", desc: "Find the $ you're losing in ops gaps.", href: "/revenue-leak-audit", label: "SaaS / B2B" },
  { title: "mudiAgent Demo", desc: "Autonomous ops agents for telecom.", href: "/mudiagent", label: "Telecom" },
];

function isExternalOrPdf(url: string): boolean {
  return url.startsWith("http") || url.endsWith(".pdf");
}

function categoryStyle(cat: string): string {
  const c = cat.toLowerCase();
  if (c === "playbook") return "text-emerald-300/80 bg-emerald-400/[0.06] border-emerald-300/10";
  if (c === "guide") return "text-sky-300/80 bg-sky-400/[0.06] border-sky-300/10";
  if (c === "tool") return "text-amber-300/80 bg-amber-400/[0.06] border-amber-300/10";
  if (c === "blueprint") return "text-fuchsia-300/80 bg-fuchsia-400/[0.06] border-fuchsia-300/10";
  return "text-foreground/60 bg-white/[0.04] border-white/10";
}

export default function PortalContent({
  displayName,
  email,
  isPaid,
  freeItems,
  paidItems,
  issues,
  stripeCustomerId,
}: {
  displayName: string;
  email: string;
  isPaid: boolean;
  freeItems: ContentItem[];
  paidItems: ContentItem[];
  issues: NewsletterIssue[];
  stripeCustomerId?: string | null;
}) {
  return (
    <div className="min-h-[100dvh] bg-[#0a0a0c] text-[#e8e8ec] relative">
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      <header
        className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/[0.05]"
        style={{ background: "rgba(10,10,12,0.85)" }}
      >
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 rounded-sm bg-[#e8e8ec] text-[#0a0a0c] text-[11px] font-black flex items-center justify-center">M</div>
            <span className="text-sm font-bold tracking-wide">Muditek</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-mono uppercase tracking-wider bg-white/[0.04] text-foreground/60 border border-white/[0.08] ml-1">Portal</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/newsletter" className="text-xs uppercase tracking-[0.18em] font-semibold text-foreground/50 hover:text-foreground transition-colors hidden sm:block">
              Newsletter
            </Link>
            <Link href="/resources" className="text-xs uppercase tracking-[0.18em] font-semibold text-foreground/50 hover:text-foreground transition-colors hidden sm:block">
              Resources
            </Link>
            <div className="w-px h-4 bg-white/[0.08] hidden sm:block" />
            <span className="text-xs text-[#636366] hidden md:block font-mono">{email}</span>
            <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-12 md:py-16 relative">
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-black bg-primary/[0.1] text-primary border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {isPaid ? "MudiKit Active" : "Free Account"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.04em] leading-[1.05] text-balance">
            Welcome back, <span className="italic font-medium text-primary">{displayName}</span>.
          </h1>
          <p className="mt-5 text-base md:text-lg text-foreground/60 leading-relaxed max-w-xl">
            Every playbook we&apos;ve shipped. Every newsletter edition. Book any of the three calls whenever you need us.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-px bg-white/[0.06] rounded-[4px] overflow-hidden border border-white/[0.06] max-w-2xl">
            <div className="bg-[#0a0a0c] p-5">
              <div className="text-2xl md:text-3xl font-black tracking-tight">{freeItems.length}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground/50 mt-1">Playbooks</div>
            </div>
            <div className="bg-[#0a0a0c] p-5">
              <div className="text-2xl md:text-3xl font-black tracking-tight">{issues.length}+</div>
              <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground/50 mt-1">Editions</div>
            </div>
            <div className="bg-[#0a0a0c] p-5">
              <div className="text-2xl md:text-3xl font-black tracking-tight">3</div>
              <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground/50 mt-1">Call Offers</div>
            </div>
          </div>
        </section>

        {isPaid && paidItems.length > 0 && (
          <section className="mb-20">
            <div className="flex items-end justify-between mb-6 border-b border-white/[0.05] pb-4">
              <div>
                <h2 className="text-xs font-black tracking-[0.3em] uppercase text-primary mb-2">MudiKit Library</h2>
                <h3 className="text-2xl md:text-3xl font-black tracking-[-0.03em]">Paid content</h3>
              </div>
              <span className="text-xs text-foreground/40 font-mono uppercase tracking-wider">{paidItems.length} items</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paidItems.map((item) => (
                <a
                  key={item.id}
                  href={item.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col p-6 rounded-[6px] border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-500"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${categoryStyle(item.category)}`}>
                      {item.category}
                    </span>
                    {item.is_new && (
                      <span className="text-[9px] px-1.5 py-px rounded bg-primary text-background font-black uppercase tracking-wider">New</span>
                    )}
                  </div>
                  <h4 className="font-bold text-[15px] leading-snug mb-2 group-hover:text-white transition-colors">{item.title}</h4>
                  {item.description && (
                    <p className="text-[13px] text-foreground/50 leading-relaxed">{item.description}</p>
                  )}
                  <div className="mt-auto pt-4 text-[11px] font-mono uppercase tracking-[0.2em] text-foreground/40 group-hover:text-primary transition-colors flex items-center gap-1.5">
                    Download {item.file_type.toUpperCase()}
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-20">
          <div className="flex items-end justify-between mb-6 border-b border-white/[0.05] pb-4">
            <div>
              <h2 className="text-xs font-black tracking-[0.3em] uppercase text-primary mb-2">Free Library</h2>
              <h3 className="text-2xl md:text-3xl font-black tracking-[-0.03em]">Playbooks &amp; guides</h3>
            </div>
            <span className="text-xs text-foreground/40 font-mono uppercase tracking-wider">{freeItems.length} items</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeItems.map((p) => {
              const external = isExternalOrPdf(p.download_url);
              const href = external ? `/resources/${p.slug}` : p.download_url;
              return (
                <Link
                  key={p.id}
                  href={href}
                  className="group relative flex flex-col p-6 rounded-[6px] border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-500"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${categoryStyle(p.category)}`}>
                      {p.category}
                    </span>
                    {p.is_new && (
                      <span className="text-[9px] px-1.5 py-px rounded bg-primary text-background font-black uppercase tracking-wider">New</span>
                    )}
                  </div>
                  <h4 className="font-bold text-[15px] leading-snug mb-2 group-hover:text-white transition-colors text-balance">{p.title}</h4>
                  {p.description && (
                    <p className="text-[13px] text-foreground/50 leading-relaxed line-clamp-3">{p.description}</p>
                  )}
                  <div className="mt-auto pt-4 text-[11px] font-mono uppercase tracking-[0.2em] text-foreground/40 group-hover:text-primary transition-colors flex items-center gap-1.5">
                    Read
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mb-20">
          <div className="flex items-end justify-between mb-6 border-b border-white/[0.05] pb-4">
            <div>
              <h2 className="text-xs font-black tracking-[0.3em] uppercase text-primary mb-2">Newsletter</h2>
              <h3 className="text-2xl md:text-3xl font-black tracking-[-0.03em]">Archive</h3>
            </div>
            <Link href="/newsletter" className="text-xs text-foreground/40 hover:text-foreground font-mono uppercase tracking-wider transition-colors">
              All editions →
            </Link>
          </div>
          {issues.length === 0 ? (
            <div className="py-12 border border-dashed border-white/[0.08] rounded-[6px] text-center">
              <p className="text-sm text-foreground/50 mb-3">Archive rebuilding. Subscribe for the next edition.</p>
              <Link href="/newsletter" className="inline-block text-sm font-semibold text-primary hover:underline">Browse archive →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {issues.map((i) => (
                <Link
                  key={i.slug}
                  href={`/newsletter/${i.slug}`}
                  className="group flex items-start gap-4 p-4 rounded-[6px] border border-white/[0.04] hover:border-white/[0.12] hover:bg-white/[0.02] transition-all duration-300"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-[14px] leading-snug group-hover:text-white transition-colors mb-1.5">
                      {i.subject}
                    </h4>
                    <span className="text-[11px] text-foreground/40 font-mono uppercase tracking-wider">
                      {i.sent_at
                        ? new Date(i.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : ""}
                    </span>
                  </div>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="mt-1.5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-foreground/60"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mb-20">
          <div className="flex items-end justify-between mb-6 border-b border-white/[0.05] pb-4">
            <div>
              <h2 className="text-xs font-black tracking-[0.3em] uppercase text-primary mb-2">Get Help</h2>
              <h3 className="text-2xl md:text-3xl font-black tracking-[-0.03em]">Book a call</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CALLS.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group block p-6 rounded-[6px] border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-500"
              >
                <span className="text-[10px] uppercase tracking-[0.22em] font-black text-foreground/40 mb-3 block">
                  {c.label}
                </span>
                <h3 className="text-lg font-black tracking-[-0.02em] mb-2 group-hover:text-white transition-colors">{c.title}</h3>
                <p className="text-[13px] text-foreground/50 leading-relaxed mb-5">{c.desc}</p>
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-primary flex items-center gap-1.5 group-hover:gap-2 transition-all">
                  Learn more
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="pt-8 border-t border-white/[0.05] flex flex-wrap items-center gap-6 text-xs text-foreground/40 font-mono uppercase tracking-[0.18em]">
          {stripeCustomerId && (
            <Link href="/api/portal/billing" prefetch={false} className="hover:text-foreground transition-colors">
              Manage subscription →
            </Link>
          )}
          <Link href="/newsletter" className="hover:text-foreground transition-colors">Newsletter</Link>
          <Link href="/resources" className="hover:text-foreground transition-colors">Resources</Link>
          <span className="ml-auto text-foreground/30">{email}</span>
        </div>
      </div>
    </div>
  );
}
