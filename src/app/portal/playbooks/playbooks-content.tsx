"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookText,
  Filter,
  Lock,
  Search,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PortalShell } from "@/components/portal/portal-shell";
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
  rounded = "rounded-xl",
  showOverlay = false,
}: {
  item: ContentItem;
  ratio?: string;
  rounded?: string;
  showOverlay?: boolean;
}) {
  const style: React.CSSProperties = { aspectRatio: ratio };
  if (item.thumbnail_url) {
    return (
      <div
        className={`relative ${rounded} overflow-hidden border border-white/[0.08] bg-white/[0.02]`}
        style={style}
      >
        <img
          src={item.thumbnail_url}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        {showOverlay && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        )}
      </div>
    );
  }
  // Fallback: typographic cover with serial number + type
  const label = typeLabel(item).toUpperCase();
  return (
    <div
      className={`relative ${rounded} overflow-hidden border border-white/[0.08]`}
      style={style}
    >
      <div className="absolute inset-0 bg-[radial-gradient(900px_400px_at_20%_-10%,rgba(255,255,255,0.10),transparent_60%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))]" />
      <div className="absolute inset-0 [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_14px)]" />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          <span>{label}</span>
          <span aria-hidden>{(item.slug || "").slice(0, 3).toUpperCase() || "···"}</span>
        </div>
        <div>
          <p className="line-clamp-2 text-[17px] font-medium leading-[1.2] tracking-[-0.015em] text-foreground">
            {item.title}
          </p>
          <div className="mt-3 h-px w-12 bg-white/30" />
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
      className="group grid items-stretch gap-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-3 transition-colors hover:border-white/[0.18] md:grid-cols-[1.05fr_1fr] md:gap-8 md:p-4"
    >
      <CoverFrame item={item} ratio="16/10" rounded="rounded-xl" showOverlay />
      <div className="flex min-w-0 flex-col justify-between gap-5 p-2 md:py-6 md:pr-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <span>Featured</span>
            <span aria-hidden>·</span>
            <span>{typeLabel(item)}</span>
            {item.is_new && (
              <>
                <span aria-hidden>·</span>
                <span className="text-emerald-300/90">New drop</span>
              </>
            )}
          </div>
          <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.022em] text-foreground md:text-[34px]">
            {item.title}
          </h2>
          {item.description && (
            <p className="mt-4 max-w-xl text-[14.5px] leading-[1.7] text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 border-t border-white/[0.06] pt-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
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
            <span className="inline-block h-3 w-px bg-white/10" />
            <span>{readingHint(item)}</span>
            {item.created_at && (
              <>
                <span className="inline-block h-3 w-px bg-white/10" />
                <span>{formatDate(item.created_at)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
            <span className="transition-transform group-hover:translate-x-0.5">
              {accessible ? "Open in portal" : "Preview locked card"}
            </span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
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
      className="group flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-white/[0.012] p-3 transition-all hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.04]"
    >
      <CoverFrame item={item} ratio="16/10" rounded="rounded-lg" />
      <div className="flex flex-1 flex-col px-1 pb-2 pt-1">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
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
              <span className="inline-flex items-center gap-1">
                <Lock className="size-3" /> Locked
              </span>
            </>
          )}
        </div>
        <h3 className="mt-2 text-[16px] font-medium leading-[1.3] tracking-[-0.015em] text-foreground">
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-muted-foreground">
            {item.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-muted-foreground">
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
          <span className="opacity-70">{readingHint(item)}</span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 flex min-h-64 flex-col items-start justify-center rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.015] p-8">
      <div className="mb-5 flex size-11 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
        <Sparkles className="size-4" />
      </div>
      <h3 className="text-[15px] font-medium text-foreground">The shelf is empty for now</h3>
      <p className="mt-2 max-w-xl text-[13.5px] leading-6 text-muted-foreground">
        When playbooks or guides are published, they will appear here. Nothing on this page is mocked or invented.
      </p>
    </div>
  );
}

function UpgradeBand({ count }: { count: number }) {
  return (
    <section className="relative mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent">
      <div className="pointer-events-none absolute -right-12 -top-12 size-64 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.10),transparent_70%)]" />
      <div className="relative grid gap-6 p-8 md:grid-cols-[1.1fr_auto] md:items-center">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <Lock className="size-3" />
            MudiKit
          </div>
          <h3 className="mt-3 max-w-xl text-[22px] font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-[26px]">
            {count} {count === 1 ? "playbook is" : "playbooks are"} part of MudiKit.
          </h3>
          <p className="mt-2 max-w-lg text-[13.5px] leading-6 text-muted-foreground">
            MudiKit unlocks the full long-form library and every new drop, alongside the paid skills and tools.
          </p>
        </div>
        <Button render={<Link href="/mudikit" />} nativeButton={false} size="lg">
          Unlock MudiKit
          <ArrowUpRight className="size-4" />
        </Button>
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
          ? "inline-flex h-8 items-center rounded-full border border-white/[0.18] bg-white text-background px-3.5 text-[12px] font-medium tracking-tight transition-colors"
          : "inline-flex h-8 items-center rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-white/[0.2] hover:bg-white/[0.05] hover:text-foreground"
      }
    >
      {children}
    </button>
  );
}

export default function PlaybooksContent({
  items,
  access,
  email,
  displayName,
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
    <PortalShell access={access} email={email} displayName={displayName}>
      <main className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-10">
        {/* Editorial header */}
        <section className="mb-10 grid gap-6 border-b border-white/[0.07] pb-10 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-12">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              <BookText className="size-3.5" />
              <span>The long-form shelf</span>
            </div>
            <h1 className="mt-5 text-[40px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[52px] md:text-[64px]">
              Playbooks <span className="text-muted-foreground">&amp;</span> Guides
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-[1.7] text-muted-foreground">
              Deeper documents, frameworks, and implementation playbooks. Read them in the portal or open the source.
              Free items are attached to every account. MudiKit unlocks the full shelf.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-x-6 gap-y-2 self-end border-l border-white/[0.07] pl-6 md:pl-10">
            <Stat label="Total" value={counts.total} />
            <Stat label="Playbooks" value={counts.playbooks} />
            <Stat label="Guides" value={counts.guides} />
            <Stat label="Free" value={counts.free} />
            <Stat label="MudiKit" value={counts.paid} />
            <Stat label="New" value={counts.newDrops} accent={counts.newDrops > 0} />
          </dl>
        </section>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <section className="mb-10">
                <FeaturedItem item={featured} access={access} />
              </section>
            )}

            {/* Filter strip */}
            <section className="sticky top-14 z-20 -mx-4 mb-8 border-y border-white/[0.06] bg-background/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    <Filter className="size-3" />
                    Browse
                  </span>
                  {hasBothTypes && (
                    <div className="flex items-center gap-1.5">
                      <FilterPill active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
                        All
                      </FilterPill>
                      <FilterPill
                        active={typeFilter === "playbook"}
                        onClick={() => setTypeFilter("playbook")}
                      >
                        Playbooks <span className="ml-1 opacity-60">{counts.playbooks}</span>
                      </FilterPill>
                      <FilterPill
                        active={typeFilter === "guide"}
                        onClick={() => setTypeFilter("guide")}
                      >
                        Guides <span className="ml-1 opacity-60">{counts.guides}</span>
                      </FilterPill>
                    </div>
                  )}
                  {hasBothTypes && hasBothAccess && (
                    <span className="hidden h-4 w-px bg-white/10 lg:inline-block" />
                  )}
                  {hasBothAccess && (
                    <div className="flex items-center gap-1.5">
                      <FilterPill
                        active={accessFilter === "all"}
                        onClick={() => setAccessFilter("all")}
                      >
                        Any access
                      </FilterPill>
                      <FilterPill
                        active={accessFilter === "free"}
                        onClick={() => setAccessFilter("free")}
                      >
                        Free <span className="ml-1 opacity-60">{counts.free}</span>
                      </FilterPill>
                      <FilterPill
                        active={accessFilter === "mudikit"}
                        onClick={() => setAccessFilter("mudikit")}
                      >
                        MudiKit <span className="ml-1 opacity-60">{counts.paid}</span>
                      </FilterPill>
                    </div>
                  )}
                </div>
                {showSearch && (
                  <div className="flex min-w-0 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 lg:w-[300px]">
                    <Search className="size-3.5 shrink-0 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search the shelf"
                      className="h-8 w-full border-0 bg-transparent px-0 text-[13px] focus-visible:ring-0"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.015] p-8 text-[13.5px] text-muted-foreground">
                Nothing matches the current search and filters. Try removing one or two.
              </div>
            ) : (
              <section>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <h2 className="text-[12px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    {isFilteredView ? `Results · ${filtered.length}` : "Everything on the shelf"}
                  </h2>
                  {!isFilteredView && counts.locked > 0 && (
                    <span className="text-[11px] text-muted-foreground">
                      {counts.locked} {counts.locked === 1 ? "item" : "items"} require MudiKit
                    </span>
                  )}
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
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
    </PortalShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd
        className={
          accent
            ? "text-[22px] font-semibold tracking-tight text-emerald-300"
            : "text-[22px] font-semibold tracking-tight text-foreground"
        }
      >
        {value}
      </dd>
    </div>
  );
}
