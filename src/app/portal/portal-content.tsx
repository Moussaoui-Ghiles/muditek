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
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">
          <span aria-hidden className="h-px w-7 bg-primary/60" />
          {kicker}
        </p>
        <h2 className="mt-3 text-[24px] font-black leading-none tracking-[-0.02em] text-white md:text-[28px]">
          {title}
        </h2>
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-primary transition-opacity hover:opacity-80"
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
      className="group flex min-h-[92px] items-center gap-4 rounded-[10px] border border-white/[0.08] bg-card/40 px-5 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.03]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-white/[0.1] bg-black/25 text-white/80">
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
      <span className="shrink-0 text-white/70 transition-colors group-hover:text-primary">
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
      className="card-lift group flex h-full flex-col overflow-hidden rounded-[10px] border border-white/[0.08] bg-card/50 transition-colors hover:border-white/20"
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
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12px] font-bold text-white/85 transition-colors group-hover:text-primary">
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
      className="card-lift group flex h-full flex-col rounded-[10px] border border-white/[0.08] bg-card/50 p-6 transition-colors hover:border-white/20"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-[8px] border border-white/[0.1] bg-black/25 text-white/85">
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
        <span className="inline-flex items-center gap-2 rounded-[8px] border border-white/15 bg-white/[0.04] px-4 py-2.5 text-[12px] font-bold text-white transition-colors group-hover:border-primary/40 group-hover:text-primary">
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
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="portal-mesh">
            <span className="portal-blob portal-blob-1" />
            <span className="portal-blob portal-blob-2" />
            <span className="portal-blob portal-blob-3" />
            <span className="portal-blob portal-blob-4" />
            <span className="portal-blob portal-blob-5" />
          </div>
          <div className="portal-hero-grid absolute inset-0" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,12,0.8)_0%,rgba(10,10,12,0.28)_38%,transparent_70%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(to_bottom,transparent_0%,rgba(10,10,12,0.55)_78%,#0a0a0c_100%)]" />
        </div>
        <style>{`
          .portal-mesh {
            position: absolute;
            inset: 0;
            filter: blur(56px) saturate(150%);
          }
          .portal-blob {
            position: absolute;
            border-radius: 9999px;
            mix-blend-mode: screen;
            opacity: 0.7;
            will-change: transform;
          }
          .portal-blob-1 {
            width: 46%; height: 150%; left: -8%; top: -25%;
            background: radial-gradient(circle at 50% 50%, #3b6cf5, transparent 60%);
            animation: portalBlob1 24s ease-in-out infinite alternate;
          }
          .portal-blob-2 {
            width: 42%; height: 155%; left: 22%; top: -30%;
            background: radial-gradient(circle at 50% 50%, #7c3aed, transparent 60%);
            animation: portalBlob2 30s ease-in-out infinite alternate;
          }
          .portal-blob-3 {
            width: 46%; height: 150%; right: 8%; top: -22%;
            background: radial-gradient(circle at 50% 50%, #d6409f, transparent 60%);
            animation: portalBlob3 27s ease-in-out infinite alternate;
          }
          .portal-blob-4 {
            width: 40%; height: 150%; right: -10%; top: -18%;
            background: radial-gradient(circle at 50% 50%, #22b8cf, transparent 60%);
            animation: portalBlob4 33s ease-in-out infinite alternate;
          }
          .portal-blob-5 {
            width: 34%; height: 140%; left: 6%; top: -8%; opacity: 0.5;
            background: radial-gradient(circle at 50% 50%, #f59e0b, transparent 62%);
            animation: portalBlob5 22s ease-in-out infinite alternate;
          }
          @keyframes portalBlob1 { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(7%,6%,0) scale(1.14); } }
          @keyframes portalBlob2 { from { transform: translate3d(0,0,0) scale(1.05); } to { transform: translate3d(-6%,-5%,0) scale(0.95); } }
          @keyframes portalBlob3 { from { transform: translate3d(0,0,0) scale(0.96); } to { transform: translate3d(-7%,6%,0) scale(1.16); } }
          @keyframes portalBlob4 { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(-8%,-6%,0) scale(1.12); } }
          @keyframes portalBlob5 { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(9%,5%,0) scale(1.18); } }
          .portal-hero-grid {
            background-image:
              linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px);
            background-size: 48px 48px;
            -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 85%);
            mask-image: linear-gradient(to bottom, #000 0%, transparent 85%);
            opacity: 0.5;
          }
          @media (prefers-reduced-motion: reduce) {
            .portal-blob-1, .portal-blob-2, .portal-blob-3, .portal-blob-4, .portal-blob-5 { animation: none; }
          }
        `}</style>
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-10">
          {hasHero ? (
            <div className="max-w-3xl">
              <p className="reveal text-[13px] font-bold tracking-[-0.01em] text-white/75">
                {displayName ? `Welcome back, ${displayName}.` : "Welcome back."}
              </p>
              {hero!.eyebrow ? (
                <p className="reveal reveal-delay-1 mt-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">
                  <span aria-hidden className="h-px w-8 bg-primary/60" />
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
                  className="btn-press reveal reveal-delay-3 mt-7 inline-flex items-center gap-2 rounded-[8px] bg-primary px-6 py-3.5 text-[13px] font-black uppercase tracking-[0.12em] text-primary-foreground"
                >
                  {hero!.ctaLabel}
                  <ArrowRight className="size-4" />
                </a>
              ) : null}
            </div>
          ) : (
            <div className="max-w-3xl">
              <h1 className="reveal text-[40px] font-black leading-[0.96] tracking-[-0.04em] text-white sm:text-[56px] md:text-[68px]">
                {displayName ? `Hey, ${displayName}.` : "Welcome back."}
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
                className="card-lift group grid gap-5 rounded-[10px] border border-white/[0.08] bg-card/50 p-6 transition-colors hover:border-white/20 md:grid-cols-[auto_1fr_auto] md:items-center"
              >
                <span className="flex size-12 items-center justify-center rounded-[8px] border border-white/[0.1] bg-black/25 text-white/85">
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
                <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white/85 transition-colors group-hover:text-primary">
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
