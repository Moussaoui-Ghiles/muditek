"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
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

export interface PortalHero {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
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
  hero: PortalHero | null;
}

const SKILL_CATEGORY = "skill";
const PLAYBOOK_GUIDE = new Set(["playbook", "guide"]);
const TOOL_CATEGORY = "tool";

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
  thisWeek,
  hero,
}: HomeContentProps) {
  const isFreeOnly = !access.isMudikit && !access.isAdmin;

  const skills = useMemo(
    () => freeItems.filter((i) => i.category === SKILL_CATEGORY),
    [freeItems]
  );

  const resources = useMemo(
    () => (isFreeOnly ? playbookGuideItems.filter((i) => i.is_free) : playbookGuideItems),
    [playbookGuideItems, isFreeOnly]
  );

  const recent = useMemo(() => {
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
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4);
  }, [resources, skills, paidItems, access.isMudikit]);

  return (
    <main className="relative">
      <div className="mx-auto w-full max-w-[1100px] px-6 pb-24 pt-12 md:px-10 md:pt-14 lg:px-14">
        {/* Greeting */}
        <header>
          <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[42px]">
            Hey, {displayName}.
          </h1>
        </header>

        {/* HERO BANNER — controlled by content/portal/hero.md */}
        {hero && hero.title && (
          <section className="relative isolate mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/[0.12] via-amber-500/[0.04] to-transparent p-8 md:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full bg-amber-400/[0.16] blur-3xl"
            />
            <div className="relative max-w-[640px]">
              {hero.eyebrow && (
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                  {hero.eyebrow}
                </p>
              )}
              <h2 className="mt-3 text-[44px] font-bold leading-[1.02] tracking-[-0.025em] text-white md:text-[64px]">
                {hero.title}
              </h2>
              {hero.body && (
                <div className="mt-5 space-y-3 text-[16px] leading-[1.65] text-white/90">
                  {hero.body.split(/\n\s*\n/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
              {hero.ctaLabel && hero.ctaHref && (
                <a
                  href={hero.ctaHref}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-[#0a0a0c] transition-all duration-200 hover:gap-3"
                >
                  {hero.ctaLabel}
                  <ArrowRight className="size-4" />
                </a>
              )}
            </div>
          </section>
        )}

        {/* Note from Ghiles */}
        {thisWeek && (
          <section className="mt-14">
            <p className="text-[17px] leading-[1.7] text-white/90">{thisWeek}</p>
            <a
              href="mailto:biz@ghiless.com?subject=Muditek%20portal%20%E2%80%94%20what%20I%27m%20solving"
              className="group mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-amber-300 transition-colors hover:text-amber-200"
            >
              Reply directly
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </section>
        )}

        {/* Recent — real DB items */}
        {recent.length > 0 && (
          <section className="mt-14 border-t border-white/10 pt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-white">Recent</h2>
              <Link
                href="/portal/playbooks"
                className="group inline-flex items-center gap-1 text-[14px] font-medium text-white/70 transition-colors hover:text-white"
              >
                View all
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <ul className="mt-5 divide-y divide-white/[0.09]">
              {recent.map((item) => (
                <li key={item.id}>
                  <Link
                    href={categoryHref(item)}
                    className="group flex items-center justify-between gap-6 py-4 transition-colors hover:bg-white/[0.025]"
                  >
                    <span className="min-w-0 flex-1 truncate text-[15.5px] font-medium text-white">
                      {item.title}
                    </span>
                    <span className="shrink-0 text-[13px] text-white/70">
                      {categoryLabel(item)}, {formatShortDate(item.created_at)}
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-white/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-amber-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
