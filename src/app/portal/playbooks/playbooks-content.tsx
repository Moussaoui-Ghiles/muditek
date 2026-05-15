"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Filter, Lock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";

type AccessFilter = "all" | "free" | "mudikit";
type TypeFilter = "all" | "playbook" | "guide";

function isAccessible(item: ContentItem, access: PortalAccess): boolean {
  if (item.is_free) return true;
  return access.isMudikit || access.isAdmin;
}

function typeLabel(item: ContentItem): "Playbook" | "Guide" {
  return item.category === "guide" ? "Guide" : "Playbook";
}

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
      <div className="relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-white/[0.02]" style={style}>
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
    <div className="relative overflow-hidden rounded-[2px] border border-white/[0.08]" style={style}>
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
      className="group card-lift relative grid items-stretch gap-6 overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-3 backdrop-blur-md transition-all duration-700 hover:bg-card/[0.6] md:grid-cols-[1.05fr_1fr] md:gap-8 md:p-4"
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
            <span className="inline-flex items-center gap-2">
              {accessible ? (
                <>
                  <span className="inline-block size-1.5 rounded-full bg-emerald-300/80" />
                  {item.is_free ? "Free" : "MudiKit"}
                </>
              ) : (
                <>
                  <Lock className="size-3" /> Locked · MudiKit
                </>
              )}
            </span>
            <span aria-hidden className="inline-block h-3 w-px bg-white/10" />
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
      className="group card-lift relative flex h-[460px] flex-col overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-3 backdrop-blur-md transition-all duration-700 hover:bg-card/[0.6]"
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
            {accessible ? (
              <>
                <span className="inline-block size-1.5 rounded-full bg-emerald-300/80" />
                {item.is_free ? "Free" : "MudiKit"}
              </>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Lock className="size-3" /> MudiKit
              </span>
            )}
          </span>
          <span className="inline-flex items-center gap-1.5 text-foreground/75 group-hover:text-primary">
            Open
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
        When playbooks or guides ship, they will appear here. Nothing on this page is mocked or invented.
      </p>
    </div>
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
            {count} {count === 1 ? "playbook is" : "playbooks are"} part of <span className="text-primary italic font-medium">MudiKit</span>.
          </h3>
          <p className="mt-4 max-w-lg text-[13.5px] leading-7 text-foreground/65">
            MudiKit unlocks the full long-form library and every new drop, alongside the paid skills and tools.
          </p>
        </div>
        <Link
          href="/portal/mudikit"
          className="group btn-press relative inline-flex items-center justify-center overflow-hidden rounded-[2px] bg-foreground px-10 py-5 text-[12px] font-black uppercase tracking-[0.2em] text-background"
        >
          <span className="relative z-10 inline-flex items-center gap-3">
            Unlock MudiKit
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </span>
          <span className="absolute inset-0 z-0 w-0 bg-primary transition-all duration-500 ease-in-out group-hover:w-full" />
        </Link>
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
        active
          ? "inline-flex h-9 items-center rounded-[2px] border border-primary/40 bg-primary/15 px-4 text-[10.5px] font-black uppercase tracking-[0.2em] text-primary transition-colors"
          : "inline-flex h-9 items-center rounded-[2px] border border-white/[0.08] bg-white/[0.025] px-4 text-[10.5px] font-black uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:border-white/[0.2] hover:bg-white/[0.05] hover:text-foreground"
      }
    >
      {children}
    </button>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
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
        {value}
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
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const counts = useMemo(
    () => ({
      total: items.length,
      playbooks: items.filter((item) => item.category === "playbook").length,
      guides: items.filter((item) => item.category === "guide").length,
      free: items.filter((item) => item.is_free).length,
      paid: items.filter((item) => !item.is_free).length,
      locked: items.filter((item) => !item.is_free && !(access.isMudikit || access.isAdmin)).length,
      newDrops: items.filter((item) => item.is_new).length,
    }),
    [items, access]
  );

  const hasBothTypes = counts.playbooks > 0 && counts.guides > 0;
  const hasBothAccess = counts.free > 0 && counts.paid > 0;
  const showSearch = items.length >= 5;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (typeFilter !== "all" && item.category !== typeFilter) return false;
      if (accessFilter === "free" && !item.is_free) return false;
      if (accessFilter === "mudikit" && item.is_free) return false;
      if (!needle) return true;
      const haystack = [item.title, item.description, item.category, item.file_type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [items, query, typeFilter, accessFilter]);

  const isFilteredView =
    query.trim().length > 0 || typeFilter !== "all" || accessFilter !== "all";
  const featured = !isFilteredView ? filtered[0] ?? null : null;
  const grid = featured ? filtered.slice(1) : filtered;

  return (
    <main className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="mesh-subtle pointer-events-none absolute inset-0 opacity-60" />
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
              The long-form shelf
            </p>
            <h1 className="mt-6 text-[44px] font-black leading-[0.92] tracking-[-0.04em] text-foreground sm:text-[60px] md:text-[78px]">
              Playbooks <span className="text-primary italic font-medium">&amp;</span> Guides.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-foreground/65">
              Deeper documents, frameworks, and implementation playbooks. Read them in the portal or open the source. Free items are attached to every account. MudiKit unlocks the full shelf.
            </p>
          </div>
          <dl className="reveal reveal-delay-1 grid grid-cols-3 gap-x-6 gap-y-6 self-end border-l border-white/[0.07] pl-6 md:pl-10">
            <Stat label="Total" value={counts.total} />
            <Stat label="Playbooks" value={counts.playbooks} />
            <Stat label="Guides" value={counts.guides} />
            <Stat label="Free" value={counts.free} />
            <Stat label="MudiKit" value={counts.paid} />
            <Stat label="New" value={counts.newDrops} accent={counts.newDrops > 0} />
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
              <section className="reveal reveal-delay-2 mb-14">
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
                  {hasBothTypes && (
                    <div className="flex items-center gap-1.5">
                      <FilterPill active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
                        All
                      </FilterPill>
                      <FilterPill active={typeFilter === "playbook"} onClick={() => setTypeFilter("playbook")}>
                        Playbooks <span className="ml-2 opacity-60">{counts.playbooks}</span>
                      </FilterPill>
                      <FilterPill active={typeFilter === "guide"} onClick={() => setTypeFilter("guide")}>
                        Guides <span className="ml-2 opacity-60">{counts.guides}</span>
                      </FilterPill>
                    </div>
                  )}
                  {hasBothTypes && hasBothAccess && (
                    <span aria-hidden className="hidden h-4 w-px bg-white/10 lg:inline-block" />
                  )}
                  {hasBothAccess && (
                    <div className="flex items-center gap-1.5">
                      <FilterPill active={accessFilter === "all"} onClick={() => setAccessFilter("all")}>
                        Any access
                      </FilterPill>
                      <FilterPill active={accessFilter === "free"} onClick={() => setAccessFilter("free")}>
                        Free <span className="ml-2 opacity-60">{counts.free}</span>
                      </FilterPill>
                      <FilterPill active={accessFilter === "mudikit"} onClick={() => setAccessFilter("mudikit")}>
                        MudiKit <span className="ml-2 opacity-60">{counts.paid}</span>
                      </FilterPill>
                    </div>
                  )}
                </div>
                {showSearch && (
                  <div className="flex min-w-0 items-center gap-2 rounded-[2px] border border-white/[0.08] bg-white/[0.025] px-3 lg:w-[300px]">
                    <Search className="size-3.5 shrink-0 text-foreground/55" />
                    <Input
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
                  {grid.map((item) => (
                    <LibraryCard key={item.id} item={item} access={access} />
                  ))}
                </div>
              </section>
            )}

            {!access.isMudikit && !access.isAdmin && counts.locked > 0 && accessFilter !== "free" && (
              <UpgradeBand count={counts.locked} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
