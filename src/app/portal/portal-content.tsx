"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowUpRight,
  BookText,
  ChevronRight,
  Lock,
  Newspaper,
  Package,
  Sparkles,
  Wand2,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PORTAL_TOOLS } from "./tools-catalog";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";

interface NewsletterIssue {
  slug: string;
  subject: string;
  sent_at: Date | string | null;
}

interface HomeContentProps {
  displayName: string;
  email: string;
  access: PortalAccess;
  freeItems: ContentItem[];
  paidItems: ContentItem[];
  playbookGuideItems: ContentItem[];
  issues: NewsletterIssue[];
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

function categoryEyebrow(item: ContentItem): string {
  if (item.category === SKILL_CATEGORY) return "Skill";
  if (item.category === "guide") return "Guide";
  if (item.category === "playbook") return "Playbook";
  if (item.category === TOOL_CATEGORY) return "Tool";
  return item.category.charAt(0).toUpperCase() + item.category.slice(1);
}

function formatDate(date: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function tierLabel(access: PortalAccess): string {
  if (access.isAdmin) return "Admin";
  if (access.isMudikit) return "MudiKit";
  return "Free";
}

function thumbBackground(item: ContentItem | null): React.CSSProperties {
  if (item?.thumbnail_url) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(10,10,12,0.05) 0%, rgba(10,10,12,0.75) 100%), url(${item.thumbnail_url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return {};
}

function FeaturedCard({
  item,
  eyebrow,
}: {
  item: ContentItem;
  eyebrow: string;
}) {
  const hasImage = !!item.thumbnail_url;
  return (
    <Link
      href={categoryHref(item)}
      className="group relative isolate flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e0e10] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] md:min-h-[340px] md:p-8"
      style={hasImage ? thumbBackground(item) : undefined}
    >
      {!hasImage && (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_15%_90%,rgba(255,255,255,0.04),transparent_55%)]" />
      )}
      {hasImage && <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent" />}
      <div className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-foreground/70">
        <Sparkles className="size-3" />
        <span>{eyebrow}</span>
        {item.is_new && (
          <span className="ml-1 inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-100 backdrop-blur">
            New
          </span>
        )}
      </div>
      <h2 className="font-[var(--font-serif-display)] mt-4 max-w-[28ch] text-3xl italic leading-[1.05] tracking-tight text-foreground md:text-[40px]">
        {item.title}
      </h2>
      {item.description && (
        <p className="mt-3 max-w-[58ch] text-[13.5px] leading-6 text-foreground/75">
          {item.description}
        </p>
      )}
      <div className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-1">
        Open {categoryEyebrow(item).toLowerCase()}
        <ArrowUpRight className="size-3.5" />
      </div>
    </Link>
  );
}

function CompactCard({ item }: { item: ContentItem }) {
  const eyebrow = categoryEyebrow(item);
  return (
    <Link
      href={categoryHref(item)}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-white/[0.07] bg-[#0c0c0e] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-[#101013]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</span>
        {item.is_new && (
          <span className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-400/15 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.16em] text-emerald-100">
            New
          </span>
        )}
      </div>
      <div>
        <h3 className="line-clamp-2 text-[14.5px] font-medium leading-[1.35] tracking-tight text-foreground transition-colors group-hover:text-white">
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-5 text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-white/[0.05] pt-3 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>{item.is_free ? "Free" : "MudiKit"}</span>
        <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </Link>
  );
}

function SectionTile({
  href,
  title,
  description,
  count,
  icon: Icon,
  accent,
  locked,
}: {
  href: string;
  title: string;
  description: string;
  count: number;
  icon: typeof Wand2;
  accent: string;
  locked?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-white/[0.07] bg-[#0c0c0e] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.2] hover:bg-[#101013]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: accent }}
      />
      <div className="relative flex items-start justify-between">
        <span className="flex size-10 items-center justify-center rounded-lg border border-white/[0.08] bg-black/30 text-foreground/90 backdrop-blur">
          {locked ? <Lock className="size-4" /> : <Icon className="size-4" />}
        </span>
        <span className="font-[var(--font-serif-display)] text-[22px] italic leading-none tracking-tight text-foreground/90">
          {locked ? "—" : count === 0 ? "·" : count}
        </span>
      </div>
      <div className="relative mt-8">
        <h3 className="text-[14px] font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-muted-foreground">{description}</p>
        <div className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-foreground/70 transition-colors group-hover:text-foreground">
          {locked ? "Locked" : "Open"}
          <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

export default function PortalHomeContent({
  displayName,
  email,
  access,
  freeItems,
  paidItems,
  playbookGuideItems,
  issues,
}: HomeContentProps) {
  const tier = tierLabel(access);
  const isFreeOnly = !access.isMudikit && !access.isAdmin;

  const skills = useMemo(() => freeItems.filter((i) => i.category === SKILL_CATEGORY), [freeItems]);
  const tools = PORTAL_TOOLS;
  const playbooksVisible = useMemo(
    () => (isFreeOnly ? playbookGuideItems.filter((i) => i.is_free) : playbookGuideItems),
    [playbookGuideItems, isFreeOnly]
  );

  const latestIssue = issues[0];
  const latestPaid = paidItems[0] ?? null;
  const latestFree = freeItems[0] ?? null;

  // Featured logic: prefer paid drop for MudiKit users, else latest free playbook/skill, else null
  const featured: ContentItem | null = access.isMudikit && latestPaid ? latestPaid : latestFree;
  const featuredEyebrow = featured
    ? `Newest ${categoryEyebrow(featured).toLowerCase()}`
    : "Open now";

  // Compact picks (excluding featured)
  const compactPicks = useMemo(() => {
    const pool: ContentItem[] =
      access.isMudikit && paidItems.length > 0
        ? [...paidItems, ...freeItems]
        : freeItems;
    const seen = new Set<string>();
    if (featured) seen.add(featured.id);
    return pool
      .filter((item) => !seen.has(item.id))
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4);
  }, [freeItems, paidItems, access.isMudikit, featured]);

  return (
    <main className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.06),transparent_55%)]"
      />

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-10 lg:pt-14">
        {/* Hero — editorial greeting */}
        <div className="flex flex-col gap-6 border-b border-white/[0.06] pb-10 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="min-w-0">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {tier} · {email}
            </p>
            <h1 className="font-[var(--font-serif-display)] mt-3 text-[44px] leading-[0.98] tracking-tight text-foreground md:text-[64px]">
              Welcome back, <span className="italic">{displayName}</span>.
            </h1>
            <p className="mt-4 max-w-[58ch] text-[14.5px] leading-7 text-muted-foreground">
              Your operating room for the skills, playbooks, tools, and newsletter
              attached to this Muditek account.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:inline">
              Tier
            </span>
            <Badge
              variant="outline"
              className="rounded-full border-white/[0.15] bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground"
            >
              {tier}
            </Badge>
          </div>
        </div>

        {/* Bento — Featured + section tiles */}
        <div className="mt-10 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-7">
            {featured ? (
              <FeaturedCard item={featured} eyebrow={featuredEyebrow} />
            ) : latestIssue ? (
              <Link
                href={`/portal/newsletter/${latestIssue.slug}`}
                className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e0e10] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 md:min-h-[340px] md:p-8"
              >
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.08),transparent_45%)]" />
                <div className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-foreground/70">
                  <Newspaper className="size-3" />
                  Latest issue · {formatDate(latestIssue.sent_at)}
                </div>
                <h2 className="font-[var(--font-serif-display)] mt-4 max-w-[28ch] text-3xl italic leading-[1.05] tracking-tight text-foreground md:text-[40px]">
                  {latestIssue.subject}
                </h2>
                <div className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-1">
                  Read issue
                  <ArrowUpRight className="size-3.5" />
                </div>
              </Link>
            ) : (
              <div className="relative flex min-h-[280px] flex-col justify-center overflow-hidden rounded-2xl border border-dashed border-white/[0.1] bg-[#0c0c0e] p-8 md:min-h-[340px]">
                <Sparkles className="mb-4 size-5 text-muted-foreground" />
                <h2 className="font-[var(--font-serif-display)] text-3xl italic leading-tight tracking-tight text-foreground md:text-[36px]">
                  Nothing published yet.
                </h2>
                <p className="mt-3 max-w-[44ch] text-[13.5px] leading-6 text-muted-foreground">
                  Your portal will fill in here as Skills, Playbooks, and Tools ship.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 md:col-span-5">
            <SectionTile
              href="/portal/skills"
              title="Skills"
              description="Reusable Claude Code skills."
              count={skills.length}
              icon={Wand2}
              accent="radial-gradient(circle at center, rgba(180,160,255,0.4), transparent 60%)"
            />
            <SectionTile
              href="/portal/playbooks"
              title="Playbooks & Guides"
              description="Step-by-step operating docs."
              count={playbooksVisible.length}
              icon={BookText}
              accent="radial-gradient(circle at center, rgba(245,200,140,0.35), transparent 60%)"
            />
            <SectionTile
              href="/portal/tools"
              title="Tools"
              description="Calculators and workbenches."
              count={tools.length}
              icon={Wrench}
              accent="radial-gradient(circle at center, rgba(140,210,255,0.35), transparent 60%)"
            />
            <SectionTile
              href="/portal/mudikit"
              title="MudiKit"
              description={access.isMudikit ? "Your paid library." : "Locked on this account."}
              count={paidItems.length}
              icon={Package}
              accent="radial-gradient(circle at center, rgba(255,180,180,0.32), transparent 60%)"
              locked={!access.isMudikit}
            />
          </div>
        </div>

        {/* Recent drops row */}
        {compactPicks.length > 0 && (
          <section className="mt-14">
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/[0.05] pb-3">
              <div>
                <h2 className="font-[var(--font-serif-display)] text-2xl italic leading-none tracking-tight text-foreground md:text-[28px]">
                  Recent drops
                </h2>
                <p className="mt-1.5 text-[12.5px] leading-5 text-muted-foreground">
                  {access.isMudikit
                    ? "Newest across MudiKit and the free library."
                    : "Newest free items added to the library."}
                </p>
              </div>
              <Link
                href="/portal/playbooks"
                className="hidden items-center gap-1 text-[12px] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Library
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {compactPicks.map((item) => (
                <CompactCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter + MudiKit upsell */}
        <section className="mt-14 grid gap-4 lg:grid-cols-[1.45fr_1fr]">
          <article className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0c0e] p-6 md:p-7">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <Newspaper className="size-3" />
                Newsletter
              </span>
              <Button render={<Link href="/portal/newsletter" />} nativeButton={false} size="sm" variant="outline">
                Archive
              </Button>
            </div>
            {latestIssue ? (
              <Link href={`/portal/newsletter/${latestIssue.slug}`} className="group mt-5 block">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Latest · {formatDate(latestIssue.sent_at)}
                </p>
                <h3 className="font-[var(--font-serif-display)] mt-2 line-clamp-3 text-[26px] italic leading-[1.1] tracking-tight text-foreground transition-colors group-hover:text-white md:text-[30px]">
                  {latestIssue.subject}
                </h3>
                <div className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  Read issue
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ) : (
              <div className="mt-6">
                <p className="font-[var(--font-serif-display)] text-2xl italic leading-tight tracking-tight text-foreground">
                  No issues yet.
                </p>
                <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
                  The archive opens up when the first issue ships.
                </p>
              </div>
            )}
          </article>

          {isFreeOnly ? (
            <Link
              href="/portal/mudikit"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-br from-[#161217] via-[#0e0c10] to-[#0a0a0c] p-6 transition-colors hover:border-white/[0.22] md:p-7"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-[radial-gradient(circle,rgba(255,200,170,0.22),transparent_70%)] blur-2xl"
              />
              <div className="relative">
                <span className="inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  <Lock className="size-3" />
                  MudiKit
                </span>
                <h3 className="font-[var(--font-serif-display)] mt-3 text-2xl italic leading-tight tracking-tight text-foreground md:text-[28px]">
                  Unlock the paid library.
                </h3>
                <p className="mt-2 max-w-[42ch] text-[13px] leading-6 text-muted-foreground">
                  Every paid playbook, tool, and operating system attached to your portal account — and every new drop.
                </p>
              </div>
              <div className="relative mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.18] bg-white/[0.06] px-4 py-2 text-[12px] font-medium tracking-tight text-foreground transition-all group-hover:border-white/30 group-hover:bg-white/[0.1]">
                See what&apos;s inside
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ) : (
            <Link
              href="/portal/mudikit"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-6 transition-colors hover:border-white/[0.18] md:p-7"
            >
              <div>
                <span className="inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  <Package className="size-3" />
                  MudiKit
                </span>
                <h3 className="font-[var(--font-serif-display)] mt-3 text-2xl italic leading-tight tracking-tight text-foreground md:text-[28px]">
                  Your paid shelf.
                </h3>
                <p className="mt-2 max-w-[42ch] text-[13px] leading-6 text-muted-foreground">
                  {paidItems.length > 0
                    ? `${paidItems.length} paid ${paidItems.length === 1 ? "item is" : "items are"} attached to this account.`
                    : "Your paid access is active. New paid drops will appear here as they ship."}
                </p>
              </div>
              <div className="mt-6 inline-flex w-fit items-center gap-2 text-[12px] font-medium tracking-tight text-foreground transition-transform group-hover:translate-x-1">
                Open MudiKit
                <ArrowUpRight className="size-3.5" />
              </div>
            </Link>
          )}
        </section>
      </section>
    </main>
  );
}
