"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Calculator,
  ChevronRight,
  Filter,
  Gauge,
  Lock,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";
import { PORTAL_TOOLS, type PortalTool } from "@/app/portal/tools-catalog";

type AccessFilter = "all" | "free" | "mudikit";

function isAccessible(item: ContentItem, access: PortalAccess): boolean {
  if (item.is_free) return true;
  return access.isMudikit || access.isAdmin;
}

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function categoryLabel(category: string): string {
  return category
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-[var(--font-serif-display)] text-[28px] leading-none tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}

function FeaturedWorkbench({ tool, access }: { tool: PortalTool; access: PortalAccess }) {
  const locked = tool.access === "mudikit" && !access.isMudikit;
  return (
    <Link
      href={`/portal/tools/${encodeURIComponent(tool.slug)}`}
      className="group relative isolate flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e0e10] p-7 transition-all duration-500 hover:-translate-y-0.5 hover:border-emerald-400/40 md:min-h-[420px] md:p-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-80 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120% 80% at 85% 0%, rgba(16,185,129,0.14), transparent 55%), radial-gradient(80% 60% at 0% 100%, rgba(255,255,255,0.04), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-60"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
          <span className="inline-flex size-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live · Workbench
        </div>
        <Badge
          variant="outline"
          className={
            locked
              ? "rounded-full border-white/[0.12] bg-white/[0.04] text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              : "rounded-full border-emerald-400/30 bg-emerald-500/[0.08] text-[10px] uppercase tracking-[0.18em] text-emerald-200"
          }
        >
          {tool.access === "free" ? "Free" : locked ? "MudiKit only" : "MudiKit"}
        </Badge>
      </div>

      <div className="mt-10 grid flex-1 gap-8 md:grid-cols-[1.15fr_1fr] md:items-end">
        <div className="min-w-0">
          <h2 className="text-[40px] leading-[0.96] tracking-tight text-foreground md:text-[56px]">
            {tool.title.split(" ").map((word, i, arr) => {
              if (i === arr.length - 1) {
                return (
                  <span key={i} className="font-[var(--font-serif-display)] italic text-foreground/90">
                    {word}
                  </span>
                );
              }
              return <span key={i}>{word} </span>;
            })}
          </h2>
          <p className="mt-5 max-w-[42ch] text-[14.5px] leading-7 text-muted-foreground">
            {tool.description}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            <span>{tool.category}</span>
            <span className="h-3 w-px bg-white/15" />
            <span>5 leak categories</span>
            <span className="h-3 w-px bg-white/15" />
            <span>OpenView · HBR · Bessemer</span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-xl border border-white/[0.08] bg-black/40 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_60px_-30px_rgba(16,185,129,0.35)] backdrop-blur">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300/80">
              Estimated annual leakage
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-[var(--font-serif-display)] text-[56px] leading-none tracking-tight text-foreground">
                €
              </span>
              <span className="font-mono text-[40px] leading-none tracking-tight text-muted-foreground">
                ───
              </span>
              <span className="ml-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                /yr
              </span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-1">
              {[14, 24, 20, 28, 14].map((h, i) => (
                <div key={i} className="h-12 w-full rounded-sm bg-white/[0.04]">
                  <div
                    className="h-full rounded-sm bg-gradient-to-t from-emerald-500/60 to-emerald-300/30 transition-all duration-700 group-hover:h-full"
                    style={{ height: `${h * 1.3}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Speed</span>
              <span>Pipe</span>
              <span>Churn</span>
              <span>Spend</span>
              <span>Out.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-white/[0.06] pt-5">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {locked ? "MudiKit unlocks this workbench" : "No email required · runs in your browser"}
        </span>
        <span className="inline-flex items-center gap-2 text-[13px] font-medium text-foreground transition-transform duration-500 group-hover:translate-x-1">
          {locked ? "View details" : "Open workbench"}
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}

function CompactToolRow({
  href,
  title,
  description,
  badge,
  meta,
  locked,
  icon,
  isNew,
}: {
  href: string;
  title: string;
  description: string | null;
  badge: { label: string; tone: "free" | "mudikit" | "locked" };
  meta: string[];
  locked?: boolean;
  icon?: React.ReactNode;
  isNew?: boolean;
}) {
  const toneClass =
    badge.tone === "free"
      ? "border-emerald-400/25 bg-emerald-500/[0.06] text-emerald-200"
      : badge.tone === "mudikit"
        ? "border-white/[0.12] bg-white/[0.04] text-foreground/80"
        : "border-white/[0.08] bg-white/[0.02] text-muted-foreground";

  return (
    <Link
      href={href}
      className="group relative flex items-stretch gap-5 rounded-xl border border-white/[0.06] bg-[#0e0e10] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-[#111114] md:p-5"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-muted-foreground transition-colors group-hover:border-white/15 group-hover:text-foreground">
        {locked ? <Lock className="size-4" /> : icon ?? <Wrench className="size-4" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[14px] font-medium tracking-tight text-foreground">{title}</h3>
          {isNew && (
            <Badge variant="default" className="h-4 rounded-md px-1.5 text-[10px]">
              New
            </Badge>
          )}
        </div>
        {description && (
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-muted-foreground">
            {description}
          </p>
        )}
        {meta.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
            {meta.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end justify-between gap-3">
        <Badge variant="outline" className={`rounded-full px-2.5 text-[10px] uppercase tracking-[0.14em] ${toneClass}`}>
          {badge.label}
        </Badge>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
      </div>
    </Link>
  );
}

function EmptyShelf({ message, hint }: { message: string; hint: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.012] p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
          <Sparkles className="size-4" />
        </span>
        <div>
          <div className="text-[13px] font-medium text-foreground">{message}</div>
          <p className="mt-1 max-w-md text-[12.5px] leading-5 text-muted-foreground">{hint}</p>
        </div>
      </div>
    </div>
  );
}

function UpgradeBanner({ count }: { count: number }) {
  return (
    <div className="relative isolate overflow-hidden rounded-xl border border-white/[0.08] bg-[#0e0e10] p-5 md:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 100% 0%, rgba(244,209,140,0.06), transparent 60%)",
        }}
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
            <Lock className="size-4" />
          </span>
          <div>
            <div className="text-[14px] font-medium text-foreground">
              {count} {count === 1 ? "tool requires" : "tools require"} MudiKit
            </div>
            <p className="mt-1 max-w-md text-[12.5px] leading-5 text-muted-foreground">
              MudiKit unlocks every paid workbench, automation, and template attached to this portal.
            </p>
          </div>
        </div>
        <Button render={<Link href="/mudikit" />} nativeButton={false} size="lg">
          Unlock MudiKit
          <ArrowUpRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function iconForCategory(category: string): React.ReactNode {
  if (category === "automation") return <Gauge className="size-4" />;
  if (category === "template") return <Calculator className="size-4" />;
  return <Wrench className="size-4" />;
}

export default function ToolsContent({
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

  const workbenches = PORTAL_TOOLS;

  const counts = useMemo(() => {
    const dbFree = items.filter((i) => i.is_free).length;
    const dbPaid = items.length - dbFree;
    const wbFree = workbenches.filter((w) => w.access === "free").length;
    const wbPaid = workbenches.length - wbFree;
    return {
      total: items.length + workbenches.length,
      free: dbFree + wbFree,
      paid: dbPaid + wbPaid,
    };
  }, [items, workbenches]);

  const lockedCount = useMemo(() => {
    const dbLocked = items.filter((i) => !i.is_free && !isAccessible(i, access)).length;
    const wbLocked = workbenches.filter((w) => w.access === "mudikit" && !access.isMudikit).length;
    return dbLocked + wbLocked;
  }, [items, workbenches, access]);

  const showFilters = counts.total >= 4;

  const filteredWorkbenches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return workbenches.filter((tool) => {
      if (accessFilter === "free" && tool.access !== "free") return false;
      if (accessFilter === "mudikit" && tool.access !== "mudikit") return false;
      if (!needle) return true;
      const haystack = [tool.title, tool.short, tool.description, tool.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [workbenches, query, accessFilter]);

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (accessFilter === "free" && !item.is_free) return false;
      if (accessFilter === "mudikit" && item.is_free) return false;
      if (!needle) return true;
      const haystack = [item.title, item.description, item.category, item.file_type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [items, query, accessFilter]);

  const featured = filteredWorkbenches[0] ?? workbenches[0] ?? null;
  const remainingWorkbenches = featured
    ? filteredWorkbenches.filter((w) => w.slug !== featured.slug)
    : filteredWorkbenches;

  const totalFiltered = filteredWorkbenches.length + filteredItems.length;
  const isSearching = query.trim().length > 0 || accessFilter !== "all";

  return (
    <main className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px]"
        style={{
          background:
            "radial-gradient(60% 50% at 12% 0%, rgba(16,185,129,0.06), transparent 60%), radial-gradient(50% 40% at 95% 5%, rgba(255,255,255,0.04), transparent 60%)",
        }}
      />

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-12">
        {/* Editorial header */}
        <header className="grid gap-8 border-b border-white/[0.06] pb-10 md:grid-cols-[1.5fr_1fr] md:items-end md:gap-12">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
              <Wrench className="size-3.5" />
              <span>Tools · Workbench</span>
            </div>
            <h1 className="mt-5 text-[44px] leading-[0.96] tracking-[-0.03em] text-foreground sm:text-[56px] md:text-[68px]">
              Run the{" "}
              <span className="font-[var(--font-serif-display)] italic text-foreground/90">
                numbers.
              </span>
            </h1>
            <p className="mt-5 max-w-[58ch] text-[14.5px] leading-7 text-muted-foreground">
              Interactive instruments that turn your real metrics into euro-denominated answers.
              Workbenches run inside the portal; downloadable tools open from the shelf.
              Nothing fake. Nothing demoed.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-x-6 gap-y-2 self-end border-l border-white/[0.06] pl-6 md:pl-10">
            <Stat label="Total" value={counts.total} />
            <Stat label="Free" value={counts.free} />
            <Stat label="MudiKit" value={counts.paid} />
          </dl>
        </header>

        {counts.total === 0 ? (
          <div className="mt-10">
            <EmptyShelf
              message="The workbench is empty."
              hint="Interactive tools and calculators will appear here as they ship. This page only lists real, working tools — never placeholders."
            />
          </div>
        ) : (
          <>
            {/* Featured + secondary rail */}
            <div className="mt-10 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-7 xl:col-span-8">
                {featured ? (
                  <FeaturedWorkbench tool={featured} access={access} />
                ) : (
                  <EmptyShelf
                    message="No workbenches in this filter."
                    hint="Adjust filters above to see the live workbench."
                  />
                )}
              </div>

              <aside className="flex flex-col gap-4 md:col-span-5 xl:col-span-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
                    Library shelf
                  </div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground/70">
                    {filteredItems.length + remainingWorkbenches.length}{" "}
                    {filteredItems.length + remainingWorkbenches.length === 1 ? "item" : "items"}
                  </div>
                </div>

                {remainingWorkbenches.length === 0 && filteredItems.length === 0 ? (
                  <EmptyShelf
                    message={isSearching ? "Nothing matches this filter." : "The shelf is bare."}
                    hint={
                      isSearching
                        ? "Try a different keyword or switch the access filter."
                        : "Additional tools, templates, and automations will appear here as they ship."
                    }
                  />
                ) : (
                  <div className="flex flex-col gap-3">
                    {remainingWorkbenches.map((tool) => {
                      const locked = tool.access === "mudikit" && !access.isMudikit;
                      return (
                        <CompactToolRow
                          key={tool.slug}
                          href={`/portal/tools/${encodeURIComponent(tool.slug)}`}
                          title={tool.title}
                          description={tool.short}
                          icon={<Wrench className="size-4" />}
                          locked={locked}
                          badge={{
                            label:
                              tool.access === "free" ? "Free" : locked ? "MudiKit only" : "MudiKit",
                            tone: tool.access === "free" ? "free" : locked ? "locked" : "mudikit",
                          }}
                          meta={[tool.category, "Workbench"]}
                        />
                      );
                    })}

                    {filteredItems.slice(0, 6).map((item) => {
                      const accessible = isAccessible(item, access);
                      return (
                        <CompactToolRow
                          key={item.id}
                          href={`/portal/tools/${encodeURIComponent(item.slug)}`}
                          title={item.title}
                          description={item.description}
                          icon={iconForCategory(item.category)}
                          locked={!accessible}
                          isNew={item.is_new}
                          badge={{
                            label: item.is_free
                              ? "Free"
                              : accessible
                                ? "MudiKit"
                                : "Locked",
                            tone: item.is_free
                              ? "free"
                              : accessible
                                ? "mudikit"
                                : "locked",
                          }}
                          meta={[
                            categoryLabel(item.category),
                            item.file_type ? item.file_type.toUpperCase() : "",
                            `Added ${formatDate(item.created_at)}`,
                          ].filter(Boolean)}
                        />
                      );
                    })}
                  </div>
                )}

                {showFilters && (
                  <div className="mt-2 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3">
                    <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      <Filter className="size-3" /> Filter
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-black/30 px-2.5">
                        <Search className="size-3.5 shrink-0 text-muted-foreground" />
                        <Input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search tools"
                          className="h-8 w-full border-0 bg-transparent px-0 text-[12.5px] focus-visible:ring-0"
                        />
                      </div>
                      <div className="flex gap-1.5">
                        {(["all", "free", "mudikit"] as const).map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setAccessFilter(key)}
                            className={`flex-1 rounded-md border px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                              accessFilter === key
                                ? "border-emerald-400/30 bg-emerald-500/[0.08] text-emerald-200"
                                : "border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                            }`}
                          >
                            {key === "all" ? "All" : key === "free" ? "Free" : "MudiKit"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </aside>
            </div>

            {/* Remaining DB items as full-width rows when shelf overflows */}
            {filteredItems.length > 6 && (
              <section className="mt-12">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                    More on the shelf
                  </h2>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground/70">
                    {filteredItems.length - 6} more
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredItems.slice(6).map((item) => {
                    const accessible = isAccessible(item, access);
                    return (
                      <CompactToolRow
                        key={item.id}
                        href={`/portal/tools/${encodeURIComponent(item.slug)}`}
                        title={item.title}
                        description={item.description}
                        icon={iconForCategory(item.category)}
                        locked={!accessible}
                        isNew={item.is_new}
                        badge={{
                          label: item.is_free
                            ? "Free"
                            : accessible
                              ? "MudiKit"
                              : "Locked",
                          tone: item.is_free ? "free" : accessible ? "mudikit" : "locked",
                        }}
                        meta={[
                          categoryLabel(item.category),
                          item.file_type ? item.file_type.toUpperCase() : "",
                          `Added ${formatDate(item.created_at)}`,
                        ].filter(Boolean)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {totalFiltered === 0 && (
              <div className="mt-8">
                <EmptyShelf
                  message="Nothing matches this filter."
                  hint="Adjust the search query or access filter on the right."
                />
              </div>
            )}

            {!access.isMudikit && !access.isAdmin && lockedCount > 0 && accessFilter !== "free" && (
              <div className="mt-12">
                <UpgradeBanner count={lockedCount} />
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
