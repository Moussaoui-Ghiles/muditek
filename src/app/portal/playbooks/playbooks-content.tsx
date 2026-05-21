"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Filter, Lock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ContentItem } from "@/lib/content-item";
import { CONTENT_TOPIC_LABEL, type ContentTopic } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";

type TypeFilter = "all" | "playbook" | "guide" | "resource";
type TopicFilter = "all" | ContentTopic;

const TOPIC_OPTIONS: Array<{ value: TopicFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "lead-gen", label: CONTENT_TOPIC_LABEL["lead-gen"] },
  { value: "sales", label: CONTENT_TOPIC_LABEL.sales },
  { value: "marketing", label: CONTENT_TOPIC_LABEL.marketing },
  { value: "gtm", label: CONTENT_TOPIC_LABEL.gtm },
];

function isAccessible(item: ContentItem, access: PortalAccess): boolean {
  if (item.is_free) return true;
  return access.isMudikit || access.isAdmin;
}

function isResourceFile(item: ContentItem): boolean {
  return item.category !== "playbook" && item.category !== "guide";
}

function typeLabel(item: ContentItem): string {
  if (item.category === "guide") return "Guide";
  if (item.category === "playbook") return "Playbook";
  if (item.category === "automation") return "Automation";
  if (item.category === "template") return "Template";
  if (item.category === "tool") return "Scorecard";
  return "Resource";
}

function accessLabel(item: ContentItem): string | null {
  return item.is_free ? null : "MudiKit";
}

function topicForItem(item: ContentItem): ContentTopic {
  const explicit = item.topic?.trim().toLowerCase();
  if (explicit && (explicit in CONTENT_TOPIC_LABEL)) {
    return explicit as ContentTopic;
  }
  const text = `${item.title} ${item.description ?? ""} ${item.slug} ${item.category}`.toLowerCase();
  if (/(lead|outbound|apollo|maps|scrap|prospect|sdr)/.test(text)) return "lead-gen";
  if (/(sales|call|crm|pipeline|deal|revenue)/.test(text)) return "sales";
  if (/(content|creative|marketing|newsletter|viral|media)/.test(text)) return "marketing";
  if (/(llm|claude|gpt|model|ai)/.test(text)) return "gtm";
  if (/(automation|workflow|process)/.test(text)) return "gtm";
  return "gtm";
}

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" });
}

function readingHint(item: ContentItem): string {
  const ft = item.file_type?.toLowerCase();
  if (ft === "pdf") return "PDF · long-form";
  if (ft === "html") return "HTML · in-portal read";
  if (ft === "md" || ft === "markdown") return "Markdown · doc";
  if (item.file_type) return `${item.file_type.toUpperCase()} · download`;
  return "Long-form";
}

function CoverFrame({
  item,
  ratio = "16/9",
}: {
  item: ContentItem;
  ratio?: string;
}) {
  const style: React.CSSProperties = { aspectRatio: ratio };
  if (item.thumbnail_url) {
    return (
      <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-[2px] border border-white/[0.08] bg-white/[0.02]" style={style}>
        <img
          src={item.thumbnail_url}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>
    );
  }
  const label = typeLabel(item).toUpperCase();
  return (
    <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-[2px] border border-white/[0.08]" style={style}>
      <div className="absolute inset-0 bg-[radial-gradient(900px_400px_at_20%_-10%,rgba(245,158,11,0.12),transparent_60%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))]" />
      <div className="absolute inset-0 [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_14px)]" />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60">
          <span>{label}</span>
          <span aria-hidden>{(item.slug || "").slice(0, 3).toUpperCase() || "···"}</span>
        </div>
        <div>
          <p className="line-clamp-2 text-[17px] font-black leading-[1.1] tracking-[-0.02em] text-foreground">
            {item.title}
          </p>
          <div className="mt-3 h-px w-12 bg-primary/60" />
        </div>
      </div>
    </div>
  );
}

function FeaturedItem({ item, access }: { item: ContentItem; access: PortalAccess }) {
  const accessible = isAccessible(item, access);
  const href = `/portal/playbooks/${encodeURIComponent(item.slug)}`;
  return (
    <Link
      href={href}
      className="group card-lift relative grid items-stretch gap-6 overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-3 backdrop-blur-md transition-all duration-700 hover:border-primary/30 hover:bg-card/[0.6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:grid-cols-[1.05fr_1fr] md:gap-8 md:p-4"
    >
      <div className="pointer-events-none absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-[1.2s] group-hover:via-primary/70" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-primary/5 blur-[80px] transition-colors group-hover:bg-primary/10" />

      <CoverFrame item={item} ratio="16/10" />

      <div className="relative z-10 flex min-w-0 flex-col justify-between gap-5 p-2 md:py-6 md:pr-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            <span aria-hidden className="h-px w-6 bg-primary/50" />
            Featured · {typeLabel(item)}
            {item.is_new && (
              <span className="text-emerald-300/90">· New drop</span>
            )}
          </div>
          <h2 className="mt-5 text-[28px] font-black leading-[0.95] tracking-[-0.03em] text-foreground md:text-[40px]">
            {item.title}
          </h2>
          {item.description && (
            <p className="mt-5 max-w-xl text-[14.5px] leading-[1.7] text-foreground/65">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-5 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-foreground/55">
            {!accessible ? (
              <span className="inline-flex items-center gap-2">
                <Lock className="size-3" /> Locked · MudiKit
              </span>
            ) : !item.is_free ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-amber-300/80" />
                MudiKit
              </span>
            ) : null}
            {(!accessible || !item.is_free) && (
              <span aria-hidden className="inline-block h-3 w-px bg-white/10" />
            )}
            <span>{readingHint(item)}</span>
            {item.created_at && (
              <>
                <span aria-hidden className="inline-block h-3 w-px bg-white/10" />
                <span>{formatDate(item.created_at)}</span>
              </>
            )}
          </div>
          <span className="inline-flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.2em] text-foreground transition-colors group-hover:text-primary">
            {accessible ? "Open in portal" : "Preview locked card"}
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function LibraryCard({ item, access }: { item: ContentItem; access: PortalAccess }) {
  const accessible = isAccessible(item, access);
  const href = `/portal/playbooks/${encodeURIComponent(item.slug)}`;
  return (
    <Link
      href={href}
      className="group card-lift relative flex h-[460px] flex-col overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-3 backdrop-blur-md transition-all duration-700 hover:border-primary/30 hover:bg-card/[0.6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="pointer-events-none absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-[1.2s] group-hover:via-primary/70" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-primary/5 blur-[60px] transition-colors group-hover:bg-primary/10" />

      <CoverFrame item={item} ratio="16/10" />

      <div className="relative z-10 flex flex-1 flex-col px-1 pb-2 pt-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/55">
          <span>{typeLabel(item)}</span>
          {item.is_new && (
            <>
              <span aria-hidden>·</span>
              <span className="text-emerald-300/90">New</span>
            </>
          )}
          {!accessible && (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1 text-primary/80">
                <Lock className="size-3" /> Locked
              </span>
            </>
          )}
        </div>
        <h3 className="mt-3 text-[17px] font-black leading-[1.2] tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-3 line-clamp-3 text-[13.5px] leading-6 text-foreground/65">
            {item.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-5 text-[10.5px] font-black uppercase tracking-[0.2em] text-foreground/55">
          <span className="inline-flex items-center gap-1.5">
            {!accessible ? (
              <span className="inline-flex items-center gap-1">
                <Lock className="size-3" /> MudiKit
              </span>
            ) : !item.is_free ? (
              <>
                <span className="inline-block size-1.5 rounded-full bg-amber-300/80" />
                MudiKit
              </>
            ) : (
              <span>{typeLabel(item)}</span>
            )}
          </span>
          <span className="inline-flex items-center gap-1.5 text-foreground/75 group-hover:text-primary">
            View
            <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 flex min-h-64 flex-col items-start justify-center rounded-[2px] border border-dashed border-white/[0.1] bg-white/[0.015] p-10">
      <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
        <span aria-hidden className="h-px w-6 bg-primary/50" />
        The shelf
      </p>
      <h3 className="mt-4 text-[24px] font-black leading-[1] tracking-[-0.02em] text-foreground">
        Nothing on the shelf yet.
      </h3>
      <p className="mt-3 max-w-xl text-[13.5px] leading-7 text-foreground/65">
        When playbooks or guides ship, they will appear here.
      </p>
    </div>
  );
}

function MagneticUnlock({ href }: { href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * 0.3;
    const y = (event.clientY - (rect.top + rect.height / 2)) * 0.45;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="group magnetic-cta relative inline-flex items-center justify-center overflow-hidden rounded-[2px] bg-foreground px-10 py-5 text-[12px] font-black uppercase tracking-[0.2em] text-background touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="relative z-10 inline-flex items-center gap-3">
        Unlock MudiKit
        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
      </span>
      <span className="absolute inset-0 z-0 w-0 bg-primary transition-all duration-500 ease-in-out group-hover:w-full" />
    </Link>
  );
}

function UpgradeBand({ count }: { count: number }) {
  return (
    <section className="mesh-subtle relative mt-16 overflow-hidden rounded-[2px] border border-primary/20 bg-card/[0.4] backdrop-blur-md">
      <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-primary/10 blur-[80px]" />
      <div className="relative grid gap-8 p-10 md:grid-cols-[1.1fr_auto] md:items-center md:p-12">
        <div>
          <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
            <Lock className="size-3.5" />
            MudiKit
          </p>
          <h3 className="mt-5 max-w-xl text-[26px] font-black leading-[1] tracking-[-0.025em] text-foreground md:text-[34px]">
            {count} {count === 1 ? "resource is" : "resources are"} part of <span className="text-primary italic font-medium">MudiKit</span>.
          </h3>
          <p className="mt-4 max-w-lg text-[13.5px] leading-7 text-foreground/65">
            MudiKit unlocks the full resource library and every new drop, alongside the paid skills.
          </p>
        </div>
        <MagneticUnlock href="/portal/mudikit" />
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
        (active
          ? "inline-flex h-9 items-center rounded-[2px] border border-primary/40 bg-primary/15 px-4 text-[10.5px] font-black uppercase tracking-[0.2em] text-primary transition-colors"
          : "inline-flex h-9 items-center rounded-[2px] border border-white/[0.08] bg-white/[0.025] px-4 text-[10.5px] font-black uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:border-white/[0.2] hover:bg-white/[0.05] hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Fallback: guarantee the real value shows even if rAF is throttled (background tab).
    const fallback = setTimeout(() => setDisplay(value), 1500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, [value]);

  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[9.5px] font-black uppercase tracking-[0.25em] text-foreground/55">
        {label}
      </dt>
      <dd
        className={
          accent
            ? "text-[28px] font-black tracking-[-0.03em] text-emerald-300 tnum"
            : "text-[28px] font-black tracking-[-0.03em] text-foreground tnum"
        }
      >
        {display}
      </dd>
    </div>
  );
}

export default function PlaybooksContent({
  items,
  access,
}: {
  items: ContentItem[];
  access: PortalAccess;
  email: string;
  displayName: string;
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [topicFilter, setTopicFilter] = useState<TopicFilter>("all");

  const counts = useMemo(
    () => ({
      total: items.length,
      playbooks: items.filter((item) => item.category === "playbook").length,
      guides: items.filter((item) => item.category === "guide").length,
      resources: items.filter(isResourceFile).length,
      included: items.filter((item) => item.is_free).length,
      paid: items.filter((item) => !item.is_free).length,
      locked: items.filter((item) => !item.is_free && !(access.isMudikit || access.isAdmin)).length,
    }),
    [items, access]
  );

  const visibleTypes = [
    { value: "playbook" as const, label: "Playbooks", count: counts.playbooks },
    { value: "guide" as const, label: "Guides", count: counts.guides },
    { value: "resource" as const, label: "Resources", count: counts.resources },
  ].filter((type) => type.count > 0);
  const hasMultipleTypes = visibleTypes.length > 1;
  const topicCounts = useMemo(() => {
    const map: Record<TopicFilter, number> = {
      all: items.length,
      "lead-gen": 0,
      sales: 0,
      marketing: 0,
      gtm: 0,
    };
    for (const item of items) map[topicForItem(item)] += 1;
    return map;
  }, [items]);
  const visibleTopics = TOPIC_OPTIONS.filter((topic) => topic.value === "all" || topicCounts[topic.value] > 0);
  const showSearch = items.length >= 5;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (typeFilter === "playbook" && item.category !== "playbook") return false;
      if (typeFilter === "guide" && item.category !== "guide") return false;
      if (typeFilter === "resource" && !isResourceFile(item)) return false;
      if (topicFilter !== "all" && topicForItem(item) !== topicFilter) return false;
      if (!needle) return true;
      const haystack = [item.title, item.description, item.category, item.file_type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [items, query, typeFilter, topicFilter]);

  const isFilteredView =
    query.trim().length > 0 || typeFilter !== "all" || topicFilter !== "all";
  const featured = !isFilteredView ? filtered[0] ?? null : null;
  const grid = featured ? filtered.slice(1) : filtered;

  return (
    <main className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="mesh-subtle pointer-events-none absolute inset-0 opacity-60" />
        <div aria-hidden className="hero-aurora pointer-events-none absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-16 md:pb-20 md:pt-20 lg:px-10">
          <div className="reveal">
            <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
              <span aria-hidden className="h-px w-8 bg-primary/50" />
              The resource shelf
            </p>
            <h1 className="mt-6 text-[44px] font-black leading-[0.92] tracking-[-0.04em] text-foreground sm:text-[60px] md:text-[78px]">
              Playbooks <span className="text-primary italic font-medium">&amp;</span> Resources.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-foreground/65">
              Deeper docs, scorecards, templates, and implementation assets. Read HTML in the portal, open PDFs cleanly, and keep useful resources tied to one account.
            </p>
          </div>
          <dl className="reveal reveal-delay-1 grid grid-cols-3 gap-x-6 gap-y-6 self-end border-l border-white/[0.07] pl-6 md:pl-10">
            <Stat label="Total" value={counts.total} />
            <Stat label="Playbooks" value={counts.playbooks} />
            <Stat label="Guides" value={counts.guides} />
            <Stat label="Resources" value={counts.resources} />
            {counts.paid > 0 && <Stat label="MudiKit" value={counts.paid} />}
          </dl>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <section className="reveal mb-14">
                <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/[0.04] pb-4">
                  <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/55">
                    <span aria-hidden className="h-px w-6 bg-white/20" />
                    Featured drop
                  </h2>
                  <span className="text-[10.5px] font-black uppercase tracking-[0.2em] text-foreground/55">
                    Resource · in portal
                  </span>
                </div>
                <FeaturedItem item={featured} access={access} />
              </section>
            )}

            {/* Filter strip */}
            <section className="sticky top-14 z-20 -mx-4 mb-10 border-y border-white/[0.06] bg-[#0a0a0c]/85 px-4 py-3.5 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/55">
                    <Filter className="size-3" />
                    Browse
                  </span>
                  {hasMultipleTypes && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <FilterPill active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
                        All
                      </FilterPill>
                      {visibleTypes.map((type) => (
                        <FilterPill
                          key={type.value}
                          active={typeFilter === type.value}
                          onClick={() => setTypeFilter(type.value)}
                        >
                          {type.label} <span className="ml-2 opacity-60">{type.count}</span>
                        </FilterPill>
                      ))}
                    </div>
                  )}
                  {hasMultipleTypes && visibleTopics.length > 1 && (
                    <span aria-hidden className="hidden h-4 w-px bg-white/10 lg:inline-block" />
                  )}
                  {visibleTopics.length > 1 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {visibleTopics.map((topic) => (
                        <FilterPill
                          key={topic.value}
                          active={topicFilter === topic.value}
                          onClick={() => setTopicFilter(topic.value)}
                        >
                          {topic.label} <span className="ml-2 opacity-60">{topicCounts[topic.value]}</span>
                        </FilterPill>
                      ))}
                    </div>
                  )}
                </div>
                {showSearch && (
                  <div className="flex min-w-0 items-center gap-2 rounded-[2px] border border-white/[0.08] bg-white/[0.025] px-3 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/30 lg:w-[300px]">
                    <Search aria-hidden className="size-3.5 shrink-0 text-foreground/55" />
                    <Input
                      type="search"
                      aria-label="Search the resource shelf"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search the shelf"
                      className="h-9 w-full border-0 bg-transparent px-0 text-[13px] focus-visible:ring-0"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="rounded-[2px] border border-dashed border-white/[0.1] bg-white/[0.015] p-10 text-[13.5px] text-foreground/65">
                Nothing matches the current search and filters. Try removing one or two.
              </div>
            ) : (
              <section>
                <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/[0.04] pb-4">
                  <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/55">
                    <span aria-hidden className="h-px w-6 bg-white/20" />
                    {isFilteredView ? `Results · ${filtered.length}` : "Everything on the shelf"}
                  </h2>
                  {!isFilteredView && counts.locked > 0 && (
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/55">
                      {counts.locked} {counts.locked === 1 ? "item" : "items"} need MudiKit
                    </span>
                  )}
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {grid.map((item, i) => (
                    <div
                      key={item.id}
                      className="reveal h-full"
                      style={{ animationDelay: `${Math.min(i * 70, 560)}ms` }}
                    >
                      <LibraryCard item={item} access={access} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!access.isMudikit && !access.isAdmin && counts.locked > 0 && (
              <UpgradeBand count={counts.locked} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
