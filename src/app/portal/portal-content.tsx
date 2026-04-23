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
  created_at: string;
}

interface NewsletterIssue {
  slug: string;
  subject: string;
  sent_at: Date | null;
}

const PLAYBOOKS: { slug: string; title: string; tag: string }[] = [
  { slug: "clawchief-blueprint", title: "The Chief of Staff Blueprint", tag: "Blueprint" },
  { slug: "claude-code-self-evolving", title: "Claude Code: Self-Evolving System", tag: "Guide" },
  { slug: "openclaw-outbound", title: "The OpenClaw Outbound Playbook", tag: "Playbook" },
  { slug: "judgment-moat", title: "The Judgment Moat", tag: "Playbook" },
  { slug: "claude-code-tips", title: "Claude Code 45-Tip Playbook", tag: "Playbook" },
  { slug: "google-maps-outbound", title: "Google Maps Outbound Playbook", tag: "Playbook" },
  { slug: "skill-creator-blueprint", title: "The Skill Creator Blueprint", tag: "Playbook" },
  { slug: "claude-dispatch-guide", title: "Claude Dispatch Setup Guide", tag: "Guide" },
  { slug: "agentic-sdr-setup-guide", title: "Agentic SDR Setup Guide", tag: "Guide" },
  { slug: "cowork-setup-guide", title: "Cowork Setup Guide", tag: "Guide" },
  { slug: "gtm-skills-guide", title: "GTM Skills Guide", tag: "Guide" },
  { slug: "sequoia-autopilot-playbook", title: "Sequoia Autopilot Playbook", tag: "Playbook" },
  { slug: "ai-data-agent-guide", title: "AI Data Agent Guide", tag: "Guide" },
  { slug: "ai-productivity-scorecard", title: "AI Productivity Scorecard", tag: "Tool" },
];

const CALLS = [
  { title: "PE Ops Audit", desc: "For PE firms — operational infrastructure review.", href: "/pe-ops" },
  { title: "Revenue Leak Audit", desc: "For SaaS / B2B — find the $ you're losing on ops gaps.", href: "/revenue-leak-audit" },
  { title: "mudiAgent Demo", desc: "For telecom — autonomous ops agents.", href: "/mudiagent" },
];

export default function PortalContent({
  displayName,
  email,
  isPaid,
  paidItems,
  issues,
  stripeCustomerId,
}: {
  displayName: string;
  email: string;
  isPaid: boolean;
  paidItems: ContentItem[];
  issues: NewsletterIssue[];
  stripeCustomerId?: string | null;
}) {
  return (
    <div className="min-h-[100dvh] bg-[#0c0c0e] text-[#e8e8ec]">
      <header
        className="sticky top-0 z-40 backdrop-blur-xl border-b border-[#232326]"
        style={{ background: "rgba(12,12,14,0.88)" }}
      >
        <div className="max-w-[960px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-wide hover:text-white transition-colors">
            Muditek
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#636366] hidden sm:block">{email}</span>
            <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
          </div>
        </div>
      </header>

      <div className="max-w-[960px] mx-auto px-6 sm:px-10 py-12">
        <div className="mb-12">
          <h1 className="text-[28px] font-bold tracking-tight mb-1">Welcome, {displayName}.</h1>
          <p className="text-sm text-[#a0a0a6]">
            Your free account. Playbooks, newsletter archive, and book a call — anytime.
          </p>
        </div>

        {isPaid && paidItems.length > 0 && (
          <section className="mb-14">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-[18px] font-semibold">MudiKit library</h2>
              <span className="text-xs text-[#636366] font-mono uppercase tracking-wider">Paid</span>
            </div>
            <div className="border-t border-[#232326]">
              {paidItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-[#232326] group">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold group-hover:underline">{item.title}</span>
                      {item.is_new && (
                        <span className="text-[9px] px-1.5 py-px rounded bg-[#e8e8ec] text-[#0c0c0e] font-black uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#636366] font-mono">
                      <span className="capitalize">{item.category}</span>
                      <span>{item.file_type.toUpperCase()}</span>
                    </div>
                  </div>
                  <a
                    href={item.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-sm font-medium text-[#a0a0a6] hover:text-[#e8e8ec] transition-colors"
                  >
                    Download ↓
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[18px] font-semibold">Playbooks &amp; guides</h2>
            <span className="text-xs text-[#636366] font-mono uppercase tracking-wider">{PLAYBOOKS.length} free</span>
          </div>
          <div className="border-t border-[#232326]">
            {PLAYBOOKS.map((p) => (
              <Link
                key={p.slug}
                href={`/resources/${p.slug}`}
                className="flex items-center gap-4 py-3.5 border-b border-[#232326] group"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-[15px] group-hover:text-white transition-colors">
                    {p.title}
                  </span>
                </div>
                <span className="text-[11px] text-[#636366] font-mono uppercase tracking-wider">
                  {p.tag}
                </span>
                <span className="text-sm text-[#a0a0a6] group-hover:text-[#e8e8ec] transition-colors">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[18px] font-semibold">Newsletter archive</h2>
            <Link href="/newsletter" className="text-xs text-[#636366] hover:text-[#a0a0a6] font-mono uppercase tracking-wider">
              All editions →
            </Link>
          </div>
          {issues.length === 0 ? (
            <div className="py-8 border border-dashed border-[#232326] rounded-lg text-center">
              <p className="text-sm text-[#636366] mb-3">Archive rebuilding. Subscribe for the next edition.</p>
              <Link
                href="/newsletter"
                className="inline-block text-sm font-medium text-[#a0a0a6] hover:text-[#e8e8ec] transition-colors"
              >
                Browse archive →
              </Link>
            </div>
          ) : (
            <div className="border-t border-[#232326]">
              {issues.map((i) => (
                <Link
                  key={i.slug}
                  href={`/newsletter/${i.slug}`}
                  className="flex items-center gap-4 py-3.5 border-b border-[#232326] group"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-[15px] group-hover:text-white transition-colors">
                      {i.subject}
                    </span>
                  </div>
                  <span className="text-xs text-[#636366] font-mono whitespace-nowrap">
                    {i.sent_at
                      ? new Date(i.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : ""}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[18px] font-semibold">Book a call</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CALLS.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="block p-5 rounded-lg border border-[#232326] hover:border-[#3a3a3e] hover:bg-[#151517] transition-colors group"
              >
                <h3 className="font-semibold mb-1.5 group-hover:text-white">{c.title}</h3>
                <p className="text-[13px] text-[#a0a0a6] leading-relaxed">{c.desc}</p>
                <span className="inline-block mt-3 text-[11px] font-mono uppercase tracking-wider text-[#636366] group-hover:text-[#a0a0a6]">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="pt-8 border-t border-[#232326] flex items-center gap-6 text-sm text-[#636366]">
          {stripeCustomerId && (
            <Link href="/api/portal/billing" prefetch={false} className="hover:text-[#e8e8ec] transition-colors">
              Manage subscription
            </Link>
          )}
          <Link href="/newsletter" className="hover:text-[#e8e8ec] transition-colors">Newsletter</Link>
          <Link href="/resources" className="hover:text-[#e8e8ec] transition-colors">Resources</Link>
        </div>
      </div>
    </div>
  );
}
