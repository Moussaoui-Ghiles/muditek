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
    title: "PE & finance operations",
    desc: "Investor portals, KYC, fund operations.",
    href: "/pe-ops",
  },
  {
    title: "Revenue leak audit",
    desc: "Find €80–180K in revenue leaks. 5-day diagnostic.",
    href: "/revenue-leak-audit",
  },
  {
    title: "EU AI Act compliance",
    desc: "Risk classification, documentation, monitoring.",
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

function Row({
  href,
  title,
  desc,
  meta,
  external,
}: {
  href: string;
  title: string;
  desc?: string | null;
  meta?: string;
  external?: boolean;
}) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  return (
    <Link
      href={href}
      className="group -mx-3 flex items-start gap-5 rounded-lg px-3 py-4 transition-colors hover:bg-white/[0.025] md:items-center md:py-4"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <span className="text-[15.5px] font-medium leading-snug tracking-tight text-white transition-colors group-hover:text-white">
            {title}
          </span>
          {meta && (
            <span className="hidden shrink-0 text-[12.5px] text-white/40 md:inline">{meta}</span>
          )}
        </div>
        {desc && (
          <p className="mt-1 text-[13.5px] leading-[1.55] text-white/55">{desc}</p>
        )}
        {meta && (
          <p className="mt-1 text-[12px] text-white/40 md:hidden">{meta}</p>
        )}
      </div>
      <Arrow className="mt-1 size-4 shrink-0 self-start text-white/25 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-amber-300/80 md:mt-0 md:self-center" />
    </Link>
  );
}

function StaticRow({
  title,
  meta,
}: {
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-start gap-5 px-3 py-4 md:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <span className="text-[15.5px] font-medium leading-snug tracking-tight text-white/85">
            {title}
          </span>
          {meta && (
            <span className="hidden shrink-0 text-[12.5px] text-white/40 md:inline">{meta}</span>
          )}
        </div>
        {meta && <p className="mt-1 text-[12px] text-white/40 md:hidden">{meta}</p>}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  href,
  cta,
}: {
  title: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="text-[15px] font-medium tracking-tight text-white/45">{title}</h2>
      {href && cta ? (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-[13px] text-white/50 transition-colors hover:text-white"
        >
          {cta}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
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
      .slice(0, 5);
  }, [resources, skills]);

  const latestIssue = issues[0];

  const browseRows: Array<{ title: string; desc: string; href: string }> = [
    {
      title: "Tools",
      desc: tools.length === 1 ? "1 tool" : `${tools.length} tools`,
      href: "/portal/tools",
    },
    {
      title: "Skills",
      desc:
        skills.length === 0
          ? "First one drops soon"
          : `${skills.length} ${skills.length === 1 ? "skill" : "skills"}`,
      href: "/portal/skills",
    },
    {
      title: "Playbooks & guides",
      desc:
        resources.length === 0
          ? "Library opens soon"
          : `${resources.length} ${resources.length === 1 ? "piece" : "pieces"}`,
      href: "/portal/playbooks",
    },
    {
      title: "Newsletter",
      desc: latestIssue ? "Read the latest issue" : "First issue ships soon",
      href: "/portal/newsletter",
    },
  ];

  return (
    <main className="relative">
      <div className="mx-auto w-full max-w-[820px] px-6 pb-32 pt-14 md:pt-20 lg:px-10">
        {/* Greeting */}
        <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[52px]">
          Hey, {displayName}.
        </h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-white/55">
          Your room inside Muditek. Newest drops, what I&apos;m shipping this week, and the
          systems I build.
        </p>

        {/* Featured — clean panel, no aggressive card */}
        {featured && (
          <Link
            href={categoryHref(featured)}
            className="group relative mt-10 block overflow-hidden rounded-2xl bg-white/[0.025] p-7 transition-colors hover:bg-white/[0.04] md:p-9"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-amber-400/[0.07] blur-3xl"
            />
            <div className="relative">
              <p className="text-[13px] text-white/50">Latest {categoryLabel(featured).toLowerCase()}</p>
              <h2 className="mt-2 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[34px]">
                {featured.title}
              </h2>
              {featured.description && (
                <p className="mt-3 max-w-[58ch] text-[14.5px] leading-[1.6] text-white/60">
                  {featured.description}
                </p>
              )}
              <span className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white transition-colors group-hover:text-amber-300/85">
                Open
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        )}

        {/* Working on this week */}
        {thisWeek && (
          <section className="mt-16">
            <h2 className="text-[15px] font-medium tracking-tight text-white/45">
              Working on this week
            </h2>
            <p className="mt-3 max-w-[58ch] text-[16px] leading-[1.65] text-white/85">
              {thisWeek}
            </p>
            <a
              href="mailto:biz@ghiless.com?subject=Muditek%20portal%20%E2%80%94%20what%20I%27m%20solving"
              className="group mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-amber-300/85 transition-colors hover:text-amber-200"
            >
              Sounds like your business? Get in touch
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </section>
        )}

        {/* What I build — offers */}
        <section className="mt-16 border-t border-white/[0.06] pt-10">
          <SectionHeader title="What I build" />
          <div className="-mx-3">
            {OFFERS.map((offer) => (
              <Row
                key={offer.href}
                href={offer.href}
                title={offer.title}
                desc={offer.desc}
                external
              />
            ))}
          </div>
        </section>

        {/* Browse */}
        <section className="mt-14 border-t border-white/[0.06] pt-10">
          <SectionHeader title="Browse" />
          <div className="-mx-3">
            {browseRows.map((row) => (
              <Row key={row.href} href={row.href} title={row.title} desc={row.desc} />
            ))}
          </div>
        </section>

        {/* Recent */}
        {recentItems.length > 0 && (
          <section className="mt-14 border-t border-white/[0.06] pt-10">
            <SectionHeader title="Recent" href="/portal/playbooks" cta="Browse all" />
            <div className="-mx-3">
              {recentItems.map((item) => (
                <Row
                  key={item.id}
                  href={categoryHref(item)}
                  title={item.title}
                  meta={`${categoryLabel(item)} · ${formatShortDate(item.created_at)}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* Coming next */}
        {upcoming.length > 0 && (
          <section className="mt-14 border-t border-white/[0.06] pt-10">
            <SectionHeader title="Coming next" />
            <div className="-mx-3">
              {upcoming.map((item, i) => (
                <StaticRow
                  key={`${item.date}-${i}`}
                  title={item.title}
                  meta={`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} · ${formatShortDate(item.date)}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
