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

  const latestFirst = useMemo(() => {
    const merged: ContentItem[] = [
      ...(access.isMudikit ? paidItems : []),
      ...resources,
      ...skills,
    ];
    const seen = new Set<string>();
    return merged
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [resources, skills, paidItems, access.isMudikit]);

  const latestItem = latestFirst[0] ?? null;
  const recentList = latestFirst.slice(0, 6);
  const latestIssue = issues[0];

  const browseLinks = [
    {
      href: "/portal/tools",
      title: "Tools",
      count: tools.length === 1 ? "1 tool" : `${tools.length} tools`,
    },
    {
      href: "/portal/skills",
      title: "Skills",
      count: skills.length === 0 ? "Soon" : `${skills.length}`,
    },
    {
      href: "/portal/playbooks",
      title: "Playbooks & guides",
      count: resources.length === 0 ? "Soon" : `${resources.length}`,
    },
    {
      href: "/portal/newsletter",
      title: "Newsletter",
      count: latestIssue ? "Latest issue" : "Soon",
    },
    {
      href: "/portal/mudikit",
      title: "MudiKit",
      count: access.isMudikit ? "Active" : "Locked",
    },
  ];

  return (
    <main className="relative">
      <div className="mx-auto w-full max-w-[1340px] px-6 pb-24 pt-10 md:px-10 md:pt-12 lg:px-14">
        {/* Header */}
        <header className="border-b border-white/[0.06] pb-7">
          <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[42px]">
            Hey, {displayName}.
          </h1>
          <p className="mt-2 text-[14px] text-white/45">
            Your room inside Muditek — what shipped, what&apos;s coming, and the systems behind it.
          </p>
        </header>

        {/* TOP REGION — 1:1 panel pair, no giant empty hero */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Operator panel */}
          <div className="rounded-2xl bg-white/[0.018] p-7 md:p-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/40">
                This week
              </h2>
              <span className="text-[11.5px] text-white/35">From Ghiles</span>
            </div>
            <p className="mt-4 text-[16px] leading-[1.6] text-white/85">
              {thisWeek || "Heads down on the next drop."}
            </p>
            <a
              href="mailto:biz@ghiless.com?subject=Muditek%20portal%20%E2%80%94%20what%20I%27m%20solving"
              className="group mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-amber-300/85 transition-colors hover:text-amber-200"
            >
              Sounds like your business? Get in touch
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>

            {upcoming.length > 0 && (
              <div className="mt-7 border-t border-white/[0.06] pt-6">
                <h3 className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/40">
                  Coming next
                </h3>
                <ul className="mt-4 divide-y divide-white/[0.05]">
                  {upcoming.slice(0, 3).map((item, i) => (
                    <li
                      key={`${item.date}-${i}`}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <span className="min-w-0 flex-1 truncate text-[14px] text-white/85">
                        {item.title}
                      </span>
                      <span className="shrink-0 text-[12px] text-white/40">
                        {formatShortDate(item.date)} ·{" "}
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Latest from the library panel */}
          <div className="rounded-2xl bg-white/[0.018] p-7 md:p-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/40">
                Latest from the library
              </h2>
              <Link
                href="/portal/playbooks"
                className="group inline-flex items-center gap-1 text-[12px] text-white/50 transition-colors hover:text-white"
              >
                Browse all
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            {recentList.length > 0 ? (
              <ul className="mt-4 divide-y divide-white/[0.05]">
                {recentList.map((item, idx) => {
                  const isLatest = idx === 0 && latestItem?.id === item.id;
                  return (
                    <li key={item.id}>
                      <Link
                        href={categoryHref(item)}
                        className="group -mx-3 flex items-center justify-between gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-white/[0.025]"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2.5">
                            <span className="truncate text-[14.5px] font-medium text-white">
                              {item.title}
                            </span>
                            {isLatest && (
                              <span className="shrink-0 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-200">
                                New
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[12px] text-white/40">
                            {categoryLabel(item)} · {formatShortDate(item.created_at)}
                          </p>
                        </div>
                        <ArrowRight className="size-4 shrink-0 text-white/25 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-amber-300/85" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-4 text-[13.5px] text-white/45">
                The library opens with the first drop.
              </p>
            )}
          </div>
        </section>

        {/* What I build — 3 offers */}
        <section className="mt-12">
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
                  <h3 className="text-[19px] font-semibold leading-[1.2] tracking-[-0.015em] text-white">
                    {offer.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.55] text-white/55">{offer.desc}</p>
                </div>
                <span className="relative mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/80 transition-colors group-hover:text-amber-300/85">
                  See the work
                  <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse strip — compact horizontal nav */}
        <section className="mt-12">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-white">Browse</h2>
            <p className="text-[13px] text-white/40">Everything in the portal</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {browseLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between gap-3 rounded-xl bg-white/[0.02] px-5 py-4 transition-colors hover:bg-white/[0.04]"
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-white">{link.title}</p>
                  <p className="mt-0.5 text-[12px] text-white/40">{link.count}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-white/25 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-amber-300/85" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
