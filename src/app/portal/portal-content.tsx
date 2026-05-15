"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { PORTAL_TOOLS } from "./tools-catalog";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";

interface NewsletterIssue {
  slug: string;
  subject: string;
  sent_at: Date | string | null;
}

export interface UpcomingItem {
  date: string;
  type: string;
  title: string;
}

interface HomeContentProps {
  displayName: string;
  email: string;
  access: PortalAccess;
  freeItems: ContentItem[];
  paidItems: ContentItem[];
  playbookGuideItems: ContentItem[];
  issues: NewsletterIssue[];
  thisWeek: string;
  upcoming: UpcomingItem[];
}

const SKILL_CATEGORY = "skill";
const PLAYBOOK_GUIDE = new Set(["playbook", "guide"]);
const TOOL_CATEGORY = "tool";

const OFFERS = [
  {
    eyebrow: "PE & Finance",
    title: "Investor portals built in weeks.",
    desc: "Onboarding, KYC, fund operations. €50K platform shipped for a merchant bank.",
    href: "/pe-ops",
  },
  {
    eyebrow: "B2B SaaS",
    title: "Find €80–180K in revenue leaks.",
    desc: "5-day diagnostic, €2K. If I don't find €50K+ in annual leakage, you pay nothing.",
    href: "/revenue-leak-audit",
  },
  {
    eyebrow: "Compliance",
    title: "EU AI Act, automated.",
    desc: "Risk classification, documentation, monitoring for AI-deploying companies in the EU.",
    href: "/ai-act",
  },
];

function categoryHref(item: ContentItem): string {
  if (item.category === SKILL_CATEGORY) return `/portal/skills/${encodeURIComponent(item.slug)}`;
  if (item.category === TOOL_CATEGORY) return `/portal/tools/${encodeURIComponent(item.slug)}`;
  if (PLAYBOOK_GUIDE.has(item.category)) return `/portal/playbooks/${encodeURIComponent(item.slug)}`;
  return `/portal?view=resource&slug=${encodeURIComponent(item.slug)}`;
}

function categoryEyebrow(item: ContentItem): string {
  if (item.category === SKILL_CATEGORY) return "Skill";
  if (item.category === "guide") return "Guide";
  if (item.category === "playbook") return "Playbook";
  if (item.category === TOOL_CATEGORY) return "Tool";
  return item.category.charAt(0).toUpperCase() + item.category.slice(1);
}

function formatMonthDay(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return typeof date === "string" ? date : "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export default function PortalHomeContent({
  displayName,
  access,
  freeItems,
  paidItems,
  playbookGuideItems,
  issues,
  thisWeek,
  upcoming,
}: HomeContentProps) {
  const isFreeOnly = !access.isMudikit && !access.isAdmin;
  const tools = PORTAL_TOOLS;

  const skills = useMemo(
    () => freeItems.filter((i) => i.category === SKILL_CATEGORY),
    [freeItems]
  );

  const resources = useMemo(
    () => (isFreeOnly ? playbookGuideItems.filter((i) => i.is_free) : playbookGuideItems),
    [playbookGuideItems, isFreeOnly]
  );

  const featured: ContentItem | null = useMemo(() => {
    if (access.isMudikit && paidItems[0]) return paidItems[0];
    return freeItems[0] ?? null;
  }, [access.isMudikit, paidItems, freeItems]);

  const recentItems = useMemo(() => {
    const merged: ContentItem[] = [...resources, ...skills];
    const seen = new Set<string>();
    return merged
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);
  }, [resources, skills]);

  const latestIssue = issues[0];

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();

  const departments: Array<{
    eyebrow: string;
    title: string;
    desc: string;
    href: string;
    isOffer?: boolean;
  }> = [
    ...OFFERS.map((o) => ({ ...o, isOffer: true })),
    {
      eyebrow: "Tools",
      title: tools.length === 1 ? "1 tool · ready to use." : `${tools.length} tools · ready to use.`,
      desc: "Calculators, workbenches, and operator utilities.",
      href: "/portal/tools",
    },
    {
      eyebrow: "Skills",
      title:
        skills.length === 0
          ? "Skills · first one ships next week."
          : `${skills.length} ${skills.length === 1 ? "skill" : "skills"} · Claude Code modules.`,
      desc: "Reusable instruction sets for Claude Code agents.",
      href: "/portal/skills",
    },
    {
      eyebrow: "Library",
      title:
        resources.length === 0
          ? "Library · the archive opens soon."
          : `${resources.length} ${resources.length === 1 ? "piece" : "pieces"} · playbooks & guides.`,
      desc: "Step-by-step operating documents and field notes.",
      href: "/portal/playbooks",
    },
  ];

  return (
    <main className="relative">
      {/* fine paper texture behind everything */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.018] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="mx-auto w-full max-w-[1180px] px-6 pb-32 pt-12 lg:px-12 lg:pt-16">
        {/* ──── MASTHEAD ──── */}
        <header className="flex flex-col gap-5 border-b border-white/[0.09] pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 md:tracking-[0.32em]">
              {today} · Vol. I
            </p>
            <p className="mt-3 font-[var(--font-serif-display)] text-[22px] italic leading-none tracking-[-0.01em] text-white/95">
              The Muditek Portal
            </p>
          </div>
          <div className="font-mono text-[10px] uppercase leading-[1.7] tracking-[0.2em] text-white/40 md:tracking-[0.26em] md:text-right">
            <p>In this edition</p>
            <p className="text-white/55">
              One feature · {departments.length} departments ·{" "}
              {recentItems.length} in the library
            </p>
          </div>
        </header>

        {/* ──── GREETING (eyebrow, not H1) ──── */}
        <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.32em] text-amber-300/70">
          Welcome back, {displayName}.
        </p>

        {/* ──── FEATURED ──── full-bleed typography ──── */}
        {featured ? (
          <section className="mt-5">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
                No. 01
              </span>
              <span className="h-px flex-1 bg-white/[0.09]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">
                Newest {categoryEyebrow(featured)}
              </span>
            </div>
            <Link href={categoryHref(featured)} className="group block">
              <h1 className="font-[var(--font-serif-display)] mt-7 max-w-[18ch] text-balance text-[44px] italic leading-[0.94] tracking-[-0.03em] text-white transition-colors md:text-[78px] lg:text-[92px] group-hover:text-amber-50">
                {featured.title}
              </h1>
              {featured.description && (
                <p className="mt-7 max-w-[56ch] text-[15px] leading-[1.65] text-white/60 md:text-[16px]">
                  {featured.description}
                </p>
              )}
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-white transition-colors group-hover:text-amber-300/85">
                Open {categoryEyebrow(featured).toLowerCase()}
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </section>
        ) : latestIssue ? (
          <section className="mt-5">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
                No. 01
              </span>
              <span className="h-px flex-1 bg-white/[0.09]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">
                Newest Issue
              </span>
            </div>
            <Link href={`/portal/newsletter/${latestIssue.slug}`} className="group block">
              <h1 className="font-[var(--font-serif-display)] mt-7 max-w-[18ch] text-balance text-[44px] italic leading-[0.94] tracking-[-0.03em] text-white transition-colors md:text-[78px] lg:text-[92px] group-hover:text-amber-50">
                {latestIssue.subject}
              </h1>
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-white transition-colors group-hover:text-amber-300/85">
                Read issue
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </section>
        ) : (
          <section className="mt-5">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
                No. 01
              </span>
              <span className="h-px flex-1 bg-white/[0.09]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">
                Opening Issue
              </span>
            </div>
            <h1 className="font-[var(--font-serif-display)] mt-7 max-w-[20ch] text-balance text-[44px] italic leading-[0.94] tracking-[-0.03em] text-white md:text-[78px] lg:text-[92px]">
              The portal opens.
            </h1>
            <p className="mt-7 max-w-[56ch] text-[15px] leading-[1.65] text-white/60 md:text-[16px]">
              First playbooks, skills and tools land here as I ship them. Check back, or read the
              note below.
            </p>
          </section>
        )}

        {/* ──── NOTE FROM THE OPERATOR ──── */}
        <section className="mt-28 border-t border-white/[0.09] pt-10">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
              No. 02
            </span>
            <span className="h-px flex-1 bg-white/[0.09]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">
              Note from the operator
            </span>
          </div>
          <div className="mt-9 grid gap-12 md:grid-cols-[1fr_280px]">
            <div className="relative">
              <span
                aria-hidden
                className="absolute -left-1 -top-6 font-[var(--font-serif-display)] text-[64px] italic leading-none text-amber-300/30 md:text-[88px]"
              >
                “
              </span>
              <p className="relative font-[var(--font-serif-display)] text-[22px] italic leading-[1.4] tracking-[-0.01em] text-white/92 md:text-[28px]">
                {thisWeek || "Quiet week. Heads down on the next drop."}
              </p>
              <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
                — Ghiles
              </p>
            </div>
            <aside className="border-t border-white/[0.08] pt-7 md:border-l md:border-t-0 md:pl-12 md:pt-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">
                Sounds like
                <br />
                your business?
              </p>
              <p className="mt-3 text-[13.5px] leading-[1.55] text-white/55">
                Tell me what you&apos;re solving. I&apos;ll send back what I&apos;d build.
              </p>
              <a
                href="mailto:biz@ghiless.com?subject=Muditek%20portal%20%E2%80%94%20what%20I%27m%20solving"
                className="group mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-amber-300/85 transition-colors hover:text-amber-200"
              >
                Get in touch
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </aside>
          </div>
        </section>

        {/* ──── DEPARTMENTS — numbered editorial list ──── */}
        <section className="mt-28">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
              No. 03
            </span>
            <span className="h-px flex-1 bg-white/[0.09]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">
              Departments
            </span>
          </div>
          <ul className="mt-9 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {departments.map((dept, i) => (
              <li key={dept.href}>
                <Link
                  href={dept.href}
                  className="group block py-6 transition-colors hover:bg-white/[0.018] md:py-7"
                >
                  <div className="flex items-baseline gap-4 md:gap-7">
                    <span className="w-7 shrink-0 font-mono text-[11px] tracking-[0.26em] text-white/35 transition-colors group-hover:text-amber-300/85 md:w-10">
                      {pad2(i + 1)}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300/70 md:w-36">
                      {dept.eyebrow}
                    </span>
                    <div className="hidden min-w-0 flex-1 md:block">
                      <h3 className="font-[var(--font-serif-display)] text-[26px] italic leading-[1.15] tracking-[-0.015em] text-white transition-colors group-hover:text-amber-50">
                        {dept.title}
                      </h3>
                      <p className="mt-1.5 max-w-[60ch] text-[13px] leading-[1.55] text-white/55">
                        {dept.desc}
                      </p>
                    </div>
                    <ArrowUpRight className="ml-auto size-4 shrink-0 self-center text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-amber-300/85" />
                  </div>
                  <div className="mt-3 md:hidden">
                    <h3 className="font-[var(--font-serif-display)] text-[22px] italic leading-[1.18] tracking-[-0.015em] text-white">
                      {dept.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-[1.55] text-white/55">
                      {dept.desc}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ──── FROM THE LIBRARY ──── */}
        {recentItems.length > 0 && (
          <section className="mt-28">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
                No. 04
              </span>
              <span className="h-px flex-1 bg-white/[0.09]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">
                From the library
              </span>
            </div>
            <ul className="mt-9 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {recentItems.map((item, i) => (
                <li key={item.id}>
                  <Link
                    href={categoryHref(item)}
                    className="group block py-5 transition-colors hover:bg-white/[0.018]"
                  >
                    <div className="flex items-baseline gap-3 md:gap-6">
                      <span className="w-7 shrink-0 font-mono text-[11px] tracking-[0.26em] text-white/35 transition-colors group-hover:text-amber-300/85 md:w-10">
                        {pad2(i + 1)}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 md:w-20">
                        {formatMonthDay(item.created_at) || "—"}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.28em] text-amber-300/65 md:w-24">
                        {categoryEyebrow(item)}
                      </span>
                      <span className="hidden min-w-0 flex-1 text-[16px] leading-[1.45] text-white/85 transition-colors group-hover:text-white md:block">
                        {item.title}
                      </span>
                      <ArrowUpRight className="ml-auto hidden size-3.5 shrink-0 self-center text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-amber-300/85 md:block" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-3 md:hidden">
                      <span className="flex-1 text-[15px] leading-[1.4] text-white/85">
                        {item.title}
                      </span>
                      <ArrowUpRight className="size-3.5 shrink-0 text-white/25" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/portal/playbooks"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.28em] text-white/50 transition-colors hover:text-white"
            >
              Browse the archive
              <ArrowUpRight className="size-3.5" />
            </Link>
          </section>
        )}

        {/* ──── COMING NEXT ──── */}
        {upcoming.length > 0 && (
          <section className="mt-28">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
                No. {pad2(recentItems.length > 0 ? 5 : 4)}
              </span>
              <span className="h-px flex-1 bg-white/[0.09]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">
                Coming next
              </span>
            </div>
            <ul className="mt-9 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {upcoming.map((item, i) => (
                <li key={`${item.date}-${i}`} className="block py-5">
                  <div className="flex items-baseline gap-3 md:gap-6">
                    <span className="w-7 shrink-0 font-mono text-[11px] tracking-[0.26em] text-white/35 md:w-10">
                      {pad2(i + 1)}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 md:w-20">
                      {formatMonthDay(item.date)}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.28em] text-amber-300/65 md:w-24">
                      {item.type}
                    </span>
                    <span className="hidden min-w-0 flex-1 text-[16px] leading-[1.45] text-white/80 md:block">
                      {item.title}
                    </span>
                  </div>
                  <div className="mt-2 md:hidden">
                    <span className="text-[15px] leading-[1.4] text-white/80">{item.title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ──── COLOPHON ──── */}
        <footer className="mt-32 border-t border-white/[0.09] pt-7">
          <div className="flex flex-col gap-2 font-mono text-[10px] uppercase leading-[1.8] tracking-[0.28em] text-white/35 md:flex-row md:items-center md:justify-between md:gap-4">
            <p>Muditek · Operating systems for B2B</p>
            <p className="text-white/30">Run by Ghiles Moussaoui</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
