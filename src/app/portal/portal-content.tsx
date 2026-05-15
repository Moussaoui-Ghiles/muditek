"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
    accent: "from-amber-400/[0.08]",
    title: "PE & finance operations",
    desc: "Investor portals, KYC, fund ops. €50K platform shipped for a merchant bank.",
    href: "/pe-ops",
  },
  {
    accent: "from-emerald-400/[0.07]",
    title: "Revenue leak audit",
    desc: "5-day diagnostic, €2K. Find €80–180K in annual leakage or pay nothing.",
    href: "/revenue-leak-audit",
  },
  {
    accent: "from-sky-400/[0.06]",
    title: "EU AI Act compliance",
    desc: "Risk classification, documentation, monitoring for AI-deploying companies.",
    href: "/ai-act",
  },
];

function categoryHref(item: ContentItem): string {
  if (item.category === SKILL_CATEGORY) return `/portal/skills/${encodeURIComponent(item.slug)}`;
  if (item.category === TOOL_CATEGORY) return `/portal/tools/${encodeURIComponent(item.slug)}`;
  if (PLAYBOOK_GUIDE.has(item.category)) return `/portal/playbooks/${encodeURIComponent(item.slug)}`;
  return `/portal?view=resource&slug=${encodeURIComponent(item.slug)}`;
}

function categoryLabel(item: ContentItem): string {
  if (item.category === SKILL_CATEGORY) return "Skill";
  if (item.category === "guide") return "Guide";
  if (item.category === "playbook") return "Playbook";
  if (item.category === TOOL_CATEGORY) return "Tool";
  return item.category.charAt(0).toUpperCase() + item.category.slice(1);
}

function formatShortDate(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return typeof date === "string" ? date : "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
      .slice(0, 7);
  }, [resources, skills]);

  const latestIssue = issues[0];

  return (
    <main className="relative">
      <div className="mx-auto w-full max-w-[1340px] px-6 pb-24 pt-10 md:px-10 md:pt-12 lg:px-14">
        {/* Header strip */}
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.06] pb-7">
          <div>
            <h1 className="text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[44px]">
              Hey, {displayName}.
            </h1>
            <p className="mt-2 text-[14px] text-white/45">
              Your room inside Muditek — what shipped, what&apos;s coming, and the systems behind it.
            </p>
          </div>
        </header>

        {/* HERO REGION — 3:1 split */}
        <section className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] lg:gap-7">
          {/* Featured */}
          {featured ? (
            <Link
              href={categoryHref(featured)}
              className="group relative isolate flex flex-col gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-7 transition-all duration-300 hover:from-white/[0.06] md:p-8"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full bg-amber-400/[0.08] blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-1/2 h-full bg-gradient-to-t from-amber-500/[0.05] via-transparent to-transparent"
              />
              <div className="relative">
                <p className="text-[12.5px] uppercase tracking-[0.18em] text-amber-300/70">
                  Latest {categoryLabel(featured).toLowerCase()}
                </p>
                <h2 className="mt-3 max-w-[20ch] text-[30px] font-semibold leading-[1.08] tracking-[-0.022em] text-white md:text-[38px]">
                  {featured.title}
                </h2>
                {featured.description && (
                  <p className="mt-3 max-w-[55ch] text-[14.5px] leading-[1.6] text-white/60">
                    {featured.description}
                  </p>
                )}
              </div>
              <span className="relative inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#0a0a0c] transition-all duration-200 group-hover:gap-3 group-hover:bg-amber-50">
                Open
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ) : (
            <div className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-white/[0.02] p-7 md:p-9">
              <h2 className="max-w-[20ch] text-[30px] font-semibold leading-[1.08] tracking-[-0.022em] text-white md:text-[38px]">
                The portal opens here.
              </h2>
              <p className="max-w-[55ch] text-[14.5px] leading-[1.6] text-white/55">
                First playbooks, skills, and tools land in this spot as they ship.
              </p>
            </div>
          )}

          {/* Side panel */}
          <aside className="flex flex-col gap-7 rounded-2xl bg-white/[0.018] p-7">
            <div>
              <h3 className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/40">
                This week
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-white/85">
                {thisWeek || "Heads down on the next drop."}
              </p>
              <a
                href="mailto:biz@ghiless.com?subject=Muditek%20portal%20%E2%80%94%20what%20I%27m%20solving"
                className="group mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-amber-300/85 transition-colors hover:text-amber-200"
              >
                Sounds like your business? Get in touch
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>

            {upcoming.length > 0 && (
              <div className="border-t border-white/[0.06] pt-6">
                <h3 className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/40">
                  Coming next
                </h3>
                <ul className="mt-4 space-y-4">
                  {upcoming.slice(0, 4).map((item, i) => (
                    <li key={`${item.date}-${i}`}>
                      <p className="text-[14px] font-medium leading-snug text-white/85">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[12px] text-white/40">
                        {formatShortDate(item.date)} · {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </section>

        {/* OFFERS — what I build */}
        <section className="mt-14">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-white">
              What I build
            </h2>
            <p className="text-[13px] text-white/40">3 productized offers</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {OFFERS.map((offer) => (
              <Link
                key={offer.href}
                href={offer.href}
                className="group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br p-6 transition-all duration-300 hover:bg-white/[0.03] md:p-7"
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-gradient-to-br ${offer.accent} to-transparent blur-3xl`}
                />
                <div className="relative">
                  <h3 className="text-[20px] font-semibold leading-[1.2] tracking-[-0.015em] text-white">
                    {offer.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.55] text-white/55">{offer.desc}</p>
                </div>
                <span className="relative mt-7 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/80 transition-colors group-hover:text-amber-300/85">
                  See the work
                  <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* RECENT + BROWSE — 2-col split */}
        <section className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-10">
          {/* Recent */}
          <div>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-white">Recent</h2>
              <Link
                href="/portal/playbooks"
                className="group inline-flex items-center gap-1 text-[13px] text-white/50 transition-colors hover:text-white"
              >
                Browse all
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            {recentItems.length > 0 ? (
              <ul className="divide-y divide-white/[0.05]">
                {recentItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={categoryHref(item)}
                      className="group flex items-center justify-between gap-6 py-4 transition-colors hover:bg-white/[0.018]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-medium leading-snug text-white transition-colors group-hover:text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[12.5px] text-white/40">
                          {categoryLabel(item)} · {formatShortDate(item.created_at)}
                        </p>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-white/25 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-amber-300/85" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13.5px] text-white/45">Library opens with the first drop.</p>
            )}
          </div>

          {/* Browse cluster */}
          <aside className="self-start rounded-2xl bg-white/[0.018] p-7">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-white">Browse</h2>
            <p className="mt-1 text-[13px] text-white/40">Everything in the portal.</p>
            <ul className="mt-5 space-y-1">
              {[
                {
                  href: "/portal/tools",
                  title: "Tools",
                  meta: tools.length === 1 ? "1 tool" : `${tools.length} tools`,
                },
                {
                  href: "/portal/skills",
                  title: "Skills",
                  meta:
                    skills.length === 0
                      ? "Soon"
                      : `${skills.length} ${skills.length === 1 ? "skill" : "skills"}`,
                },
                {
                  href: "/portal/playbooks",
                  title: "Playbooks & guides",
                  meta:
                    resources.length === 0
                      ? "Soon"
                      : `${resources.length} ${resources.length === 1 ? "piece" : "pieces"}`,
                },
                {
                  href: "/portal/newsletter",
                  title: "Newsletter",
                  meta: latestIssue ? "Latest issue" : "Soon",
                },
                {
                  href: "/portal/mudikit",
                  title: "MudiKit",
                  meta: access.isMudikit ? "Active" : "Locked",
                },
              ].map((row) => (
                <li key={row.href}>
                  <Link
                    href={row.href}
                    className="group -mx-3 flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="text-[14.5px] font-medium text-white/90 transition-colors group-hover:text-white">
                      {row.title}
                    </span>
                    <span className="flex items-center gap-2 text-[12px] text-white/40">
                      {row.meta}
                      <ArrowRight className="size-3.5 text-white/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-amber-300/85" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
