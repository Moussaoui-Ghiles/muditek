"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookText,
  Lock,
  Newspaper,
  Package,
  Sparkles,
  Wand2,
  Wrench,
} from "lucide-react";
import { PORTAL_TOOLS } from "@/app/portal/tools-catalog";
import {
  categoryLabel as contentCategoryLabel,
  isPlaybookResourceCategory,
  resourceDetailHref,
  type ContentItem,
} from "@/lib/content-item";
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

function uniqueItems(items: ContentItem[]): ContentItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.id || item.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isAccessible(item: ContentItem, access: PortalAccess): boolean {
  return item.is_free || access.isMudikit || access.isAdmin;
}

function itemHref(item: ContentItem): string {
  if (item.category === SKILL_CATEGORY) return `/portal/skills/${encodeURIComponent(item.slug)}`;
  return resourceDetailHref(item);
}

function categoryLabel(item: ContentItem): string {
  if (item.category === SKILL_CATEGORY) return "Skill";
  if (item.category === "guide") return "Guide";
  if (item.category === "playbook") return "Playbook";
  if (item.category === "tool") return "Scorecard";
  if (item.category === "automation") return "Automation";
  if (item.category === "template") return "Template";
  return contentCategoryLabel(item.category);
}

function formatShortDate(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric" });
}

function latestTitle(items: ContentItem[], fallback: string): string {
  const latest = [...items].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
  return latest?.title || fallback;
}

function StatPill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] px-4 py-3">
      <div className="font-mono text-[20px] font-semibold leading-none tracking-[-0.02em] text-white">
        {value}
      </div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
        {label}
      </div>
    </div>
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.26em] text-white/55">
      <span aria-hidden className="h-px w-7 bg-white/20" />
      {children}
    </p>
  );
}

function CategoryTile({
  href,
  title,
  body,
  count,
  latest,
  icon: Icon,
  locked,
}: {
  href: string;
  title: string;
  body: string;
  count: number;
  latest: string;
  icon: typeof BookText;
  locked?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative isolate min-h-[220px] overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.35] p-5 transition-all duration-500 hover:border-white/[0.16] hover:bg-card/[0.55]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_260px_at_20%_0%,rgba(245,204,120,0.10),transparent_60%)] opacity-70 transition-opacity group-hover:opacity-100" />
      <div className="relative flex h-full flex-col justify-between gap-8">
        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex size-9 items-center justify-center rounded-[2px] border border-white/[0.08] bg-black/25 text-primary">
              <Icon className="size-4" />
            </div>
            {locked ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
                <Lock className="size-3" />
                MudiKit
              </span>
            ) : null}
          </div>
          <h2 className="mt-5 text-[25px] font-black leading-[1] tracking-[-0.025em] text-white">
            {title}
          </h2>
          <p className="mt-3 max-w-[34ch] text-[13.5px] leading-6 text-white/58">{body}</p>
        </div>
        <div className="border-t border-white/[0.07] pt-4">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="font-mono text-[22px] font-semibold leading-none text-white">{count}</div>
              <div className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/42">
                Items
              </div>
            </div>
            <div className="min-w-0 flex-1 text-right">
              <div className="truncate text-[12.5px] font-medium text-white/75">{latest}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-semibold text-primary">
                Open <ArrowRight className="size-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function DropCard({ item, access }: { item: ContentItem; access: PortalAccess }) {
  const accessible = isAccessible(item, access);
  const date = formatShortDate(item.created_at);

  return (
    <Link
      href={itemHref(item)}
      className="group relative isolate overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.35] transition-all duration-500 hover:border-white/[0.16] hover:bg-card/[0.55]"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.06] bg-white/[0.03]">
        {item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(450px_220px_at_10%_0%,rgba(245,204,120,0.16),transparent_60%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]" />
        )}
        {!accessible && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
            <Lock className="size-5 text-white/85" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
          <span>{categoryLabel(item)}</span>
          {date && <span>{date}</span>}
        </div>
        <h3 className="mt-3 line-clamp-2 text-[17px] font-semibold leading-[1.2] tracking-[-0.01em] text-white">
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-white/55">{item.description}</p>
        )}
        <div className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold text-primary">
          {accessible ? "Open" : "Preview"}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}

function NewsletterStrip({ issue }: { issue: NewsletterIssue }) {
  const date = formatShortDate(issue.sent_at);

  return (
    <Link
      href={`/portal/newsletter/${encodeURIComponent(issue.slug)}`}
      className="group relative isolate grid gap-5 overflow-hidden rounded-[2px] border border-white/[0.08] bg-white/[0.025] p-5 transition-all duration-500 hover:border-white/[0.16] hover:bg-white/[0.04] md:grid-cols-[auto_1fr_auto] md:items-center"
    >
      <div className="flex size-11 items-center justify-center rounded-[2px] border border-white/[0.08] bg-black/20 text-primary">
        <Newspaper className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
          Latest article{date ? ` - ${date}` : ""}
        </div>
        <div className="mt-1 truncate text-[17px] font-semibold tracking-[-0.01em] text-white">
          {issue.subject}
        </div>
      </div>
      <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-primary">
        Read
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
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
  hero,
}: HomeContentProps) {
  const isFreeOnly = !access.isMudikit && !access.isAdmin;

  const allItems = useMemo(
    () => uniqueItems([...freeItems, ...paidItems, ...playbookGuideItems]),
    [freeItems, paidItems, playbookGuideItems]
  );

  const skills = useMemo(
    () => allItems.filter((item) => item.category === SKILL_CATEGORY),
    [allItems]
  );

  const playbooks = useMemo(
    () => playbookGuideItems.filter((item) => isPlaybookResourceCategory(item.category)),
    [playbookGuideItems]
  );

  const paidCount = useMemo(
    () =>
      allItems.filter((item) => !item.is_free).length +
      PORTAL_TOOLS.filter((tool) => tool.access === "mudikit").length,
    [allItems]
  );

  const recent = useMemo(
    () => {
      const byDate = (items: ContentItem[]) =>
        [...items].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      return uniqueItems([
        ...byDate(playbooks).slice(0, 2),
        ...byDate(skills).slice(0, 2),
        ...byDate(paidItems).slice(0, 2),
        ...byDate(allItems),
      ]).slice(0, 6);
    },
    [allItems, paidItems, playbooks, skills]
  );

  const latestIssue = issues[0];
  const latestTool = PORTAL_TOOLS[0]?.title || "Tool shelf";

  return (
    <main className="relative">
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="mesh-subtle pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 md:grid-cols-[1.25fr_0.75fr] md:items-end md:gap-14 md:pb-18 md:pt-18 lg:px-10">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-primary">
              <span aria-hidden className="h-px w-8 bg-primary/50" />
              Portal home
            </p>
            <h1 className="mt-5 text-[42px] font-black leading-[0.94] tracking-[-0.04em] text-white sm:text-[56px] md:text-[72px]">
              Hey, {displayName}.
            </h1>
            <p className="mt-6 max-w-[58ch] text-[15px] leading-[1.75] text-white/65">
              Your Muditek library is here: skills, playbooks, tools, and newsletter articles. Everything opens inside the portal so every link can bring people back into the system.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
            <StatPill label="Library" value={allItems.length + PORTAL_TOOLS.length} />
            {paidCount > 0 && <StatPill label="MudiKit" value={paidCount} />}
            <StatPill label="Articles" value={issues.length} />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-10">
        {hero?.title ? (
          <section className="mb-12 relative isolate overflow-hidden rounded-[2px] border border-primary/20 bg-card/[0.42] p-7 md:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/10 blur-[90px]" />
            <div className="relative max-w-3xl">
              {hero.eyebrow && (
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
                  {hero.eyebrow}
                </p>
              )}
              <h2 className="mt-3 text-[34px] font-black leading-[1] tracking-[-0.03em] text-white md:text-[46px]">
                {hero.title}
              </h2>
              {hero.body && (
                <div className="mt-4 space-y-3 text-[14.5px] leading-7 text-white/68">
                  {hero.body.split(/\n\s*\n/).map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}
                </div>
              )}
              {hero.ctaLabel && hero.ctaHref && (
                <a
                  href={hero.ctaHref}
                  className="mt-6 inline-flex items-center gap-2 rounded-[2px] bg-white px-5 py-3 text-[12px] font-black uppercase tracking-[0.16em] text-[#0a0a0c]"
                >
                  {hero.ctaLabel}
                  <ArrowRight className="size-3.5" />
                </a>
              )}
            </div>
          </section>
        ) : null}

        <section>
          <div className="mb-6 flex flex-col gap-3 border-b border-white/[0.05] pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionKicker>Library</SectionKicker>
              <h2 className="mt-3 text-[28px] font-black leading-none tracking-[-0.025em] text-white">
                Choose the shelf you need.
              </h2>
            </div>
            {isFreeOnly && paidCount > 0 && (
              <Link
                href="/portal/mudikit"
                className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.18em] text-primary"
              >
                {paidCount} MudiKit items locked
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CategoryTile
              href="/portal/skills"
              title="Skills"
              body="Reusable agent instructions and operating files for Claude, Codex, GTM, and research."
              count={skills.length}
              latest={latestTitle(skills, "Skill shelf")}
              icon={Wand2}
            />
            <CategoryTile
              href="/portal/playbooks"
              title="Resources"
              body="Guides, scorecards, templates, and implementation docs grouped by motion."
              count={playbooks.length}
              latest={latestTitle(playbooks, "Resource shelf")}
              icon={BookText}
            />
            <CategoryTile
              href="/portal/tools"
              title="Tools"
              body="Live workbenches that run searches, calculators, and lead workflows inside the portal."
              count={PORTAL_TOOLS.length}
              latest={latestTool}
              icon={Wrench}
            />
            <CategoryTile
              href="/portal/mudikit"
              title="MudiKit"
              body="The paid shelf for deeper skills, resource drops, and subscriber tools."
              count={paidCount}
              latest={latestTitle(paidItems, "MudiKit shelf")}
              icon={Package}
              locked={isFreeOnly}
            />
          </div>
        </section>

        {latestIssue ? (
          <section className="mt-12">
            <NewsletterStrip issue={latestIssue} />
          </section>
        ) : null}

        {thisWeek ? (
          <section className="mt-12 grid gap-5 border-y border-white/[0.06] py-8 md:grid-cols-[0.65fr_1fr]">
            <SectionKicker>Note</SectionKicker>
            <div>
              <p className="text-[16px] leading-8 text-white/82">{thisWeek}</p>
              <a
                href="mailto:biz@ghiless.com?subject=Muditek%20portal%20-%20what%20I%27m%20solving"
                className="mt-4 inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.18em] text-primary"
              >
                Reply directly
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </section>
        ) : null}

        {recent.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/[0.05] pb-5">
              <div>
                <SectionKicker>Recent drops</SectionKicker>
                <h2 className="mt-3 text-[28px] font-black leading-none tracking-[-0.025em] text-white">
                  Fresh items in the portal.
                </h2>
              </div>
              <Link
                href="/portal/playbooks"
                className="hidden items-center gap-2 text-[12px] font-black uppercase tracking-[0.18em] text-primary sm:inline-flex"
              >
                Browse library
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((item) => (
                <DropCard key={`${item.id}-${item.slug}`} item={item} access={access} />
              ))}
            </div>
          </section>
        )}

        {upcoming.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 border-b border-white/[0.05] pb-5">
              <SectionKicker>Coming next</SectionKicker>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {upcoming.slice(0, 3).map((item) => (
                <div key={`${item.date}-${item.title}`} className="rounded-[2px] border border-white/[0.08] bg-white/[0.025] p-5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                    <Sparkles className="size-3 text-primary" />
                    {item.type}
                  </div>
                  <h3 className="mt-3 text-[16px] font-semibold leading-snug text-white">{item.title}</h3>
                  <p className="mt-2 text-[12px] text-white/45">{item.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {isFreeOnly && paidCount > 0 && (
          <section className="mt-16 overflow-hidden rounded-[2px] border border-primary/25 bg-primary/[0.08] p-7 md:p-9">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-primary">
                  <Lock className="size-3.5" />
                  MudiKit
                </p>
                <h2 className="mt-4 max-w-2xl text-[28px] font-black leading-[1] tracking-[-0.025em] text-white md:text-[36px]">
                  Unlock the paid shelf when the library is useful enough.
                </h2>
                <p className="mt-4 max-w-2xl text-[14px] leading-7 text-white/62">
                  Paid drops live here too, with the same sidebar and account flow. No second product area, no separate library.
                </p>
              </div>
              <Link
                href="/portal/mudikit"
                className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-white px-7 py-4 text-[12px] font-black uppercase tracking-[0.18em] text-[#0a0a0c]"
              >
                View MudiKit
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
