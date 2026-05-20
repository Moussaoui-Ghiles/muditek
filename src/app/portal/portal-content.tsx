"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Lock, Newspaper, Wand2, Wrench } from "lucide-react";
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

function resourceLabel(item: ContentItem): string {
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

function byDateDesc(items: ContentItem[]): ContentItem[] {
  return [...items].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/* ─── Scroll reveal: drives the globals.css .sr / .sr.visible system ─── */
function InView({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`sr ${visible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  action,
}: {
  kicker: string;
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-white/[0.07] pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#3ECF8E]">
          <span aria-hidden className="h-px w-7 bg-[#3ECF8E]/50" />
          {kicker}
        </p>
        <h2 className="mt-3 text-[24px] font-black leading-none tracking-[-0.02em] text-white md:text-[28px]">
          {title}
        </h2>
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#3ECF8E] transition-colors hover:text-[#62dca9]"
        >
          {action.label}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}

/* ─── Skill row: no thumbnail. Dense, list-like. Distinct from cards. ─── */
function SkillRow({ item, access }: { item: ContentItem; access: PortalAccess }) {
  const accessible = isAccessible(item, access);

  return (
    <Link
      href={itemHref(item)}
      className="group flex min-h-[92px] items-center gap-4 rounded-[10px] border border-white/[0.08] bg-card/40 px-5 py-4 transition-colors hover:border-[#3ECF8E]/30 hover:bg-white/[0.03]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-white/[0.1] bg-black/25 text-[#3ECF8E]">
        <Wand2 className="size-[17px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
          Skill
          {!accessible ? <Lock className="size-3" /> : null}
        </div>
        <div className="mt-1 truncate text-[15.5px] font-semibold tracking-[-0.01em] text-white">
          {item.title}
        </div>
        {item.description ? (
          <div className="mt-0.5 truncate text-[12.5px] text-white/70">{item.description}</div>
        ) : null}
      </div>
      <span className="shrink-0 text-[12px] font-bold text-[#3ECF8E] transition-colors group-hover:text-white">
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* ─── Resource card: the only section with cover thumbnails. Equal height. ─── */
function ResourceCard({ item, access }: { item: ContentItem; access: PortalAccess }) {
  const accessible = isAccessible(item, access);
  const date = formatShortDate(item.created_at);

  return (
    <Link
      href={itemHref(item)}
      className="card-lift group flex h-full flex-col overflow-hidden rounded-[10px] border border-white/[0.08] bg-card/50 transition-colors hover:border-[#3ECF8E]/30"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.06] bg-white/[0.03]">
        {item.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnail_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.01))]" />
        )}
        {!accessible ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
              <Lock className="size-3.5" />
              MudiKit
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
          <span>{resourceLabel(item)}</span>
          {date ? <span>{date}</span> : null}
        </div>
        <h3 className="mt-3 line-clamp-2 text-[16px] font-semibold leading-[1.3] tracking-[-0.01em] text-white">
          {item.title}
        </h3>
        {item.description ? (
          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-white/70">{item.description}</p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12px] font-bold text-[#3ECF8E] transition-colors group-hover:text-white">
          {accessible ? "Open" : "Preview"}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

/* ─── Tool card: action card with a button. Distinct from skills and resources. ─── */
function ToolCard({ tool }: { tool: (typeof PORTAL_TOOLS)[number] }) {
  return (
    <Link
      href={`/portal/tools/${encodeURIComponent(tool.slug)}`}
      className="card-lift group flex h-full flex-col rounded-[10px] border border-white/[0.08] bg-card/50 p-6 transition-colors hover:border-[#3ECF8E]/30"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-[8px] border border-white/[0.1] bg-black/25 text-[#3ECF8E]">
          <Wrench className="size-[18px]" />
        </span>
        <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
          {tool.category}
        </span>
      </div>
      <h3 className="mt-5 text-[16px] font-semibold leading-[1.3] tracking-[-0.01em] text-white">
        {tool.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-white/70">{tool.short}</p>
      <span className="mt-auto pt-6">
        <span className="inline-flex items-center gap-2 rounded-[8px] border border-[#3ECF8E]/30 bg-[#3ECF8E]/10 px-4 py-2.5 text-[12px] font-bold text-[#3ECF8E] transition-colors group-hover:bg-[#3ECF8E]/20">
          Open tool
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
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
  hero,
}: HomeContentProps) {
  const isFreeOnly = !access.isMudikit && !access.isAdmin;

  const allItems = useMemo(
    () => uniqueItems([...freeItems, ...paidItems, ...playbookGuideItems]),
    [freeItems, paidItems, playbookGuideItems]
  );

  const skills = useMemo(
    () => byDateDesc(allItems.filter((item) => item.category === SKILL_CATEGORY)).slice(0, 6),
    [allItems]
  );

  const resources = useMemo(
    () =>
      byDateDesc(
        playbookGuideItems.filter((item) => isPlaybookResourceCategory(item.category))
      ).slice(0, 6),
    [playbookGuideItems]
  );

  const tools = useMemo(
    () => PORTAL_TOOLS.filter((tool) => tool.access === "free" || !isFreeOnly),
    [isFreeOnly]
  );

  const latestIssue = issues[0];
  const hasHero = !!(hero && hero.title);

  return (
    <main className="relative noise">
      {/* ── Hero band ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_0%,rgba(62,207,142,0.07),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-12 sm:px-6 md:pb-16 md:pt-16 lg:px-10">
          {hasHero ? (
            <div className="max-w-3xl">
              <p className="reveal text-[13px] font-bold tracking-[-0.01em] text-white/75">
                Welcome back, {displayName}.
              </p>
              {hero!.eyebrow ? (
                <p className="reveal reveal-delay-1 mt-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#3ECF8E]">
                  <span aria-hidden className="h-px w-8 bg-[#3ECF8E]/50" />
                  {hero!.eyebrow}
                </p>
              ) : null}
              <h1 className="reveal reveal-delay-1 mt-4 text-[40px] font-black leading-[0.96] tracking-[-0.035em] text-white sm:text-[52px] md:text-[64px]">
                {hero!.title}
              </h1>
              {hero!.body ? (
                <div className="reveal reveal-delay-2 mt-6 max-w-2xl space-y-3 text-[15.5px] leading-[1.7] text-white/75">
                  {hero!.body.split(/\n\s*\n/).map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}
                </div>
              ) : null}
              {hero!.ctaLabel && hero!.ctaHref ? (
                <a
                  href={hero!.ctaHref}
                  className="btn-press reveal reveal-delay-3 mt-7 inline-flex items-center gap-2 rounded-[8px] bg-[#3ECF8E] px-6 py-3.5 text-[13px] font-black uppercase tracking-[0.12em] text-[#0a0a0c]"
                >
                  {hero!.ctaLabel}
                  <ArrowRight className="size-4" />
                </a>
              ) : null}
            </div>
          ) : (
            <div className="max-w-3xl">
              <h1 className="reveal text-[40px] font-black leading-[0.96] tracking-[-0.04em] text-white sm:text-[56px] md:text-[68px]">
                Hey, {displayName}.
              </h1>
              <p className="reveal reveal-delay-1 mt-6 max-w-2xl text-[16px] leading-[1.7] text-white/75">
                Your Muditek library: skills, resources, tools, and every newsletter issue.
                Everything opens inside the portal.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        {/* ── Skills: dense rows, no thumbnails ── */}
        {skills.length > 0 ? (
          <section>
            <SectionHeading
              kicker="Skills"
              title="Agent instruction files."
              action={{ href: "/portal/skills", label: "All skills" }}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {skills.map((item, index) => (
                <InView key={`${item.id}-${item.slug}`} delay={(index % 2) * 70}>
                  <SkillRow item={item} access={access} />
                </InView>
              ))}
            </div>
          </section>
        ) : null}

        {/* ── Resources: cover-thumbnail cards ── */}
        {resources.length > 0 ? (
          <section className={skills.length > 0 ? "mt-16" : ""}>
            <SectionHeading
              kicker="Resources"
              title="Guides, templates, and scorecards."
              action={{ href: "/portal/playbooks", label: "All resources" }}
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((item, index) => (
                <InView key={`${item.id}-${item.slug}`} delay={(index % 3) * 80}>
                  <ResourceCard item={item} access={access} />
                </InView>
              ))}
            </div>
          </section>
        ) : null}

        {/* ── Tools: action cards ── */}
        {tools.length > 0 ? (
          <section className="mt-16">
            <SectionHeading
              kicker="Tools"
              title="Workbenches you run here."
              action={{ href: "/portal/tools", label: "All tools" }}
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool, index) => (
                <InView key={tool.slug} delay={(index % 3) * 80}>
                  <ToolCard tool={tool} />
                </InView>
              ))}
            </div>
          </section>
        ) : null}

        {/* ── Newsletter ── */}
        {latestIssue ? (
          <section className="mt-16">
            <InView>
              <Link
                href={`/portal/newsletter/${encodeURIComponent(latestIssue.slug)}`}
                className="card-lift group grid gap-5 rounded-[10px] border border-white/[0.08] bg-card/50 p-6 transition-colors hover:border-[#3ECF8E]/30 md:grid-cols-[auto_1fr_auto] md:items-center"
              >
                <span className="flex size-12 items-center justify-center rounded-[8px] border border-white/[0.1] bg-black/25 text-[#3ECF8E]">
                  <Newspaper className="size-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                    From the newsletter
                    {formatShortDate(latestIssue.sent_at)
                      ? ` · ${formatShortDate(latestIssue.sent_at)}`
                      : ""}
                  </div>
                  <div className="mt-1.5 truncate text-[19px] font-semibold tracking-[-0.01em] text-white">
                    {latestIssue.subject}
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#3ECF8E] transition-colors group-hover:text-white">
                  Read
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </InView>
          </section>
        ) : null}
      </div>
    </main>
  );
}
