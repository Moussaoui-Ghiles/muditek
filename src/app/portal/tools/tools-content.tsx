"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Calculator,
  Filter,
  Gauge,
  Lock,
  Search,
  Wrench,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Input } from "@/components/ui/input";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";
import { PORTAL_TOOLS, type PortalTool } from "@/app/portal/tools-catalog";

type AccessFilter = "all" | "free" | "mudikit";
type ShelfEntry =
  | { kind: "workbench"; tool: PortalTool }
  | { kind: "asset"; item: ContentItem };

function isAccessible(item: ContentItem, access: PortalAccess): boolean {
  if (item.is_free) return true;
  return access.isMudikit || access.isAdmin;
}

function isToolLocked(tool: PortalTool, access: PortalAccess): boolean {
  return tool.access === "mudikit" && !access.isMudikit && !access.isAdmin;
}

function accessLabel(isIncluded: boolean): string {
  return isIncluded ? "Included" : "MudiKit";
}

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", { timeZone: "UTC", month: "short", year: "numeric" });
}

function categoryLabel(category: string): string {
  return category
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function iconForCategory(category: string): React.ReactNode {
  const c = category.toLowerCase();
  if (c.includes("automation")) return <Gauge className="size-4" />;
  if (c.includes("template")) return <Calculator className="size-4" />;
  if (c.includes("diagnostic")) return <Calculator className="size-4" />;
  return <Wrench className="size-4" />;
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

function FeaturedWorkbench({ tool, access }: { tool: PortalTool; access: PortalAccess }) {
  const locked = isToolLocked(tool, access);
  const parts = tool.title.split(" ");
  const lastWord = parts.pop() ?? tool.title;
  const restWords = parts.join(" ");
  const previewBars = [22, 38, 28, 44, 18];
  const previewLabels = ["Speed", "Pipe", "Churn", "Spend", "Out."];

  return (
    <Link
      href={`/portal/tools/${encodeURIComponent(tool.slug)}`}
      className="group card-lift relative grid items-stretch gap-0 overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-3 backdrop-blur-md transition-all duration-700 hover:bg-card/[0.6] md:grid-cols-[1.1fr_1fr] md:gap-10 md:p-4"
    >
      <div className="pointer-events-none absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-400/0 to-transparent transition-all duration-[1.2s] group-hover:via-emerald-400/70" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-emerald-500/[0.07] blur-[110px] transition-colors duration-700 group-hover:bg-emerald-500/[0.16]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-60 w-60 rounded-full bg-primary/[0.05] blur-[100px]" />

      <div className="relative z-10 flex min-w-0 flex-col justify-between gap-7 p-5 md:py-10 md:pl-8 md:pr-2">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            <span aria-hidden className="h-px w-8 bg-primary/50" />
            Live · Workbench
            <span className="inline-flex items-center gap-1.5 text-emerald-300/85">
              <span aria-hidden className="inline-flex size-1.5 animate-pulse rounded-full bg-emerald-400" />
              In production
            </span>
          </div>
          <h2 className="mt-6 text-[40px] font-black leading-[0.95] tracking-[-0.035em] text-foreground sm:text-[52px] md:text-[64px]">
            {restWords ? <>{restWords} </> : null}
            <span className="text-primary italic font-medium">{lastWord}.</span>
          </h2>
          <p className="mt-5 max-w-[44ch] text-[14.5px] leading-[1.7] text-foreground/65">
            {tool.description}
          </p>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/[0.06] pt-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px] font-black uppercase tracking-[0.22em] text-foreground/55">
            <span>{tool.category}</span>
            <span aria-hidden className="h-3 w-px bg-white/15" />
            <span>5 leak categories</span>
            <span aria-hidden className="h-3 w-px bg-white/15" />
            <span>OpenView · HBR · Bessemer</span>
          </div>
          <span className="inline-flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.2em] text-foreground transition-colors group-hover:text-primary">
            {locked ? "View details" : "Open workbench"}
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center p-4 md:p-6">
        <div className="relative w-full">
          <div className="relative rounded-[2px] border border-white/[0.08] bg-black/40 p-6 shadow-[0_30px_80px_-30px_rgba(16,185,129,0.4)] backdrop-blur md:p-7">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300/80">
              Estimated annual leakage
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-[family-name:var(--font-serif-display)] text-[64px] italic leading-none tracking-tight text-foreground">
                €
              </span>
              <span className="font-mono text-[44px] font-bold leading-none tracking-tight tabular-nums text-muted-foreground">
                ───
              </span>
              <span className="ml-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                /yr
              </span>
            </div>
            <div className="mt-7 grid grid-cols-5 gap-1.5">
              {previewBars.map((h, i) => (
                <div key={i} className="relative h-20 w-full overflow-hidden rounded-sm bg-white/[0.04]">
                  <div
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-500/70 to-emerald-300/30"
                    style={{ height: `${h * 1.8}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground/80">
              {previewLabels.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
            <span
              className={
                locked
                  ? "inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-[#0a0a0c] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-foreground/60"
                  : tool.access === "free"
                    ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-[#0a0a0c] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200"
                    : "inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-[#0a0a0c] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-primary"
              }
            >
              {locked ? (
                <>
                  <Lock className="size-3" />
                  MudiKit only
                </>
              ) : tool.access === "free" ? (
                <>
                  <span aria-hidden className="inline-block size-1.5 rounded-full bg-emerald-300/80" />
                  Included
                </>
              ) : (
                <>MudiKit</>
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ShelfCardSurface({ kind }: { kind: "workbench" | "asset" }) {
  return (
    <div className="absolute inset-0">
      <div
        className={
          kind === "workbench"
            ? "absolute inset-0 bg-[radial-gradient(900px_400px_at_20%_-10%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))]"
            : "absolute inset-0 bg-[radial-gradient(900px_400px_at_20%_-10%,rgba(245,158,11,0.12),transparent_60%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))]"
        }
      />
      <div className="absolute inset-0 [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_14px)]" />
    </div>
  );
}

function WorkbenchShelfCard({ tool, access }: { tool: PortalTool; access: PortalAccess }) {
  const locked = isToolLocked(tool, access);
  return (
    <Link
      href={`/portal/tools/${encodeURIComponent(tool.slug)}`}
      className="group card-lift relative flex h-[460px] flex-col overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-3 backdrop-blur-md transition-all duration-700 hover:bg-card/[0.6]"
    >
      <div className="pointer-events-none absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-400/0 to-transparent transition-all duration-[1.2s] group-hover:via-emerald-400/70" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-emerald-500/[0.06] blur-[60px] transition-colors group-hover:bg-emerald-500/[0.14]" />

      <div className="relative overflow-hidden rounded-[2px] border border-white/[0.08]" style={{ aspectRatio: "16/10" }}>
        <ShelfCardSurface kind="workbench" />
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60">
            <span>WORKBENCH</span>
            <span aria-hidden>{tool.slug.slice(0, 3).toUpperCase()}</span>
          </div>
          <div>
            <p className="line-clamp-2 text-[17px] font-black leading-[1.1] tracking-[-0.02em] text-foreground">
              {tool.title}
            </p>
            <div className="mt-3 h-px w-12 bg-emerald-300/60" />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-1 pb-2 pt-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/55">
          <span>{tool.category}</span>
          {locked && (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1 text-primary/80">
                <Lock className="size-3" /> Locked
              </span>
            </>
          )}
        </div>
        <h3 className="mt-3 text-[17px] font-black leading-[1.2] tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary">
          {tool.title}
        </h3>
        {tool.short && (
          <p className="mt-3 line-clamp-3 text-[13.5px] leading-6 text-foreground/65">{tool.short}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-5 text-[10.5px] font-black uppercase tracking-[0.2em] text-foreground/55">
          <span className="inline-flex items-center gap-1.5">
            {locked ? (
              <span className="inline-flex items-center gap-1">
                <Lock className="size-3" /> MudiKit
              </span>
            ) : (
              <>
                <span aria-hidden className="inline-block size-1.5 rounded-full bg-emerald-300/80" />
                {accessLabel(tool.access === "free")}
              </>
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

function AssetShelfCard({ item, access }: { item: ContentItem; access: PortalAccess }) {
  const accessible = isAccessible(item, access);
  const href = `/portal/tools/${encodeURIComponent(item.slug)}`;
  return (
    <Link
      href={href}
      className="group card-lift relative flex h-[460px] flex-col overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-3 backdrop-blur-md transition-all duration-700 hover:bg-card/[0.6]"
    >
      <div className="pointer-events-none absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-[1.2s] group-hover:via-primary/70" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-primary/5 blur-[60px] transition-colors group-hover:bg-primary/10" />

      <div className="relative overflow-hidden rounded-[2px] border border-white/[0.08]" style={{ aspectRatio: "16/10" }}>
        {item.thumbnail_url ? (
          <>
            <img
              src={item.thumbnail_url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </>
        ) : (
          <>
            <ShelfCardSurface kind="asset" />
            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60">
                <span>{categoryLabel(item.category).toUpperCase()}</span>
                <span aria-hidden>{(item.slug || "").slice(0, 3).toUpperCase() || "···"}</span>
              </div>
              <div>
                <p className="line-clamp-2 text-[17px] font-black leading-[1.1] tracking-[-0.02em] text-foreground">
                  {item.title}
                </p>
                <div className="mt-3 h-px w-12 bg-primary/60" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-1 pb-2 pt-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/55">
          <span className="inline-flex items-center gap-1.5">
            {iconForCategory(item.category)}
            {categoryLabel(item.category)}
          </span>
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
          <p className="mt-3 line-clamp-3 text-[13.5px] leading-6 text-foreground/65">{item.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-5 text-[10.5px] font-black uppercase tracking-[0.2em] text-foreground/55">
          <span className="inline-flex items-center gap-1.5">
            {accessible ? (
              <>
                <span aria-hidden className="inline-block size-1.5 rounded-full bg-emerald-300/80" />
                {accessLabel(item.is_free)}
              </>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Lock className="size-3" /> MudiKit
              </span>
            )}
            {item.file_type && (
              <>
                <span aria-hidden className="ml-1 h-3 w-px bg-white/10" />
                <span>{item.file_type.toUpperCase()}</span>
              </>
            )}
            {item.created_at && (
              <>
                <span aria-hidden className="ml-1 h-3 w-px bg-white/10" />
                <span>{formatDate(item.created_at)}</span>
              </>
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

function ShelfCard({ entry, access }: { entry: ShelfEntry; access: PortalAccess }) {
  if (entry.kind === "workbench") {
    return <WorkbenchShelfCard tool={entry.tool} access={access} />;
  }
  return <AssetShelfCard item={entry.item} access={access} />;
}

function EmptyShelf({ message, hint }: { message: string; hint: string }) {
  return (
    <div className="mt-10 flex min-h-64 flex-col items-start justify-center rounded-[2px] border border-dashed border-white/[0.1] bg-white/[0.015] p-10">
      <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
        <span aria-hidden className="h-px w-6 bg-primary/50" />
        The workbench
      </p>
      <h3 className="mt-4 text-[24px] font-black leading-[1] tracking-[-0.02em] text-foreground">
        {message}
      </h3>
      <p className="mt-3 max-w-xl text-[13.5px] leading-7 text-foreground/65">{hint}</p>
    </div>
  );
}

function UpgradeBand({ count }: { count: number }) {
  return (
    <section className="mesh-subtle relative mt-20 overflow-hidden rounded-[2px] border border-primary/20 bg-card/[0.4] backdrop-blur-md">
      <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-primary/10 blur-[80px]" />
      <div className="relative grid gap-8 p-10 md:grid-cols-[1.1fr_auto] md:items-center md:p-12">
        <div>
          <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
            <Lock className="size-3.5" />
            MudiKit
          </p>
          <h3 className="mt-5 max-w-xl text-[26px] font-black leading-[1] tracking-[-0.025em] text-foreground md:text-[34px]">
            {count} {count === 1 ? "tool is" : "tools are"} part of{" "}
            <span className="text-primary italic font-medium">MudiKit</span>.
          </h3>
          <p className="mt-4 max-w-lg text-[13.5px] leading-7 text-foreground/65">
            MudiKit unlocks every paid workbench, automation, and template attached to this portal.
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

export default function ToolsContent({
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
      workbenches: workbenches.length,
    };
  }, [items, workbenches]);

  const lockedCount = useMemo(() => {
    const dbLocked = items.filter((i) => !i.is_free && !isAccessible(i, access)).length;
    const wbLocked = workbenches.filter((w) => isToolLocked(w, access)).length;
    return dbLocked + wbLocked;
  }, [items, workbenches, access]);

  const hasBothAccess = counts.free > 0 && counts.paid > 0;
  const showSearch = counts.total >= 5;

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

  const isFilteredView = query.trim().length > 0 || accessFilter !== "all";
  const featured = !isFilteredView ? filteredWorkbenches[0] ?? null : null;

  const shelfEntries: ShelfEntry[] = useMemo(() => {
    const entries: ShelfEntry[] = [];
    filteredWorkbenches.forEach((tool) => {
      if (!featured || tool.slug !== featured.slug) {
        entries.push({ kind: "workbench", tool });
      }
    });
    filteredItems.forEach((item) => {
      entries.push({ kind: "asset", item });
    });
    return entries;
  }, [filteredWorkbenches, filteredItems, featured]);

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
              The workbench
            </p>
            <h1 className="mt-6 text-[44px] font-black leading-[0.92] tracking-[-0.04em] text-foreground sm:text-[60px] md:text-[78px]">
              Run the <span className="text-primary italic font-medium">numbers.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-foreground/65">
              Interactive instruments that turn your real metrics into euro-denominated answers.
              Workbenches run inside the portal. Downloadable tools open from the shelf.
            </p>
          </div>
          <dl className="reveal reveal-delay-1 grid grid-cols-3 gap-x-6 gap-y-6 self-end border-l border-white/[0.07] pl-6 md:pl-10">
            <Stat label="Total" value={counts.total} />
            <Stat label="Workbenches" value={counts.workbenches} />
            <Stat label="Included" value={counts.free} />
            <Stat label="MudiKit" value={counts.paid} />
            <Stat label="Locked" value={lockedCount} accent={lockedCount > 0} />
            <Stat label="New" value={items.filter((i) => i.is_new).length} />
          </dl>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        {counts.total === 0 ? (
          <EmptyShelf
            message="The workbench is empty."
            hint="Interactive tools and calculators will appear here as they ship."
          />
        ) : (
          <>
            {featured && (
              <ScrollReveal>
                <section className="mb-14">
                  <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/[0.04] pb-4">
                    <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/55">
                      <span aria-hidden className="h-px w-6 bg-white/20" />
                      Featured workbench
                    </h2>
                    <span className="text-[10.5px] font-black uppercase tracking-[0.2em] text-foreground/55">
                      Live · runs in your browser
                    </span>
                  </div>
                  <FeaturedWorkbench tool={featured} access={access} />
                </section>
              </ScrollReveal>
            )}

            {(hasBothAccess || showSearch) && (
              <section className="sticky top-14 z-20 -mx-4 mb-10 border-y border-white/[0.06] bg-[#0a0a0c]/85 px-4 py-3.5 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/55">
                      <Filter className="size-3" />
                      Browse
                    </span>
                    {hasBothAccess && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <FilterPill active={accessFilter === "all"} onClick={() => setAccessFilter("all")}>
                          All
                        </FilterPill>
                        <FilterPill active={accessFilter === "free"} onClick={() => setAccessFilter("free")}>
                          Included <span className="ml-2 opacity-60">{counts.free}</span>
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
            )}

            <section>
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/[0.04] pb-4">
                <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/55">
                  <span aria-hidden className="h-px w-6 bg-white/20" />
                  {isFilteredView ? `Results · ${shelfEntries.length}` : "Everything on the shelf"}
                </h2>
                {!isFilteredView && lockedCount > 0 && (
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/55">
                    {lockedCount} {lockedCount === 1 ? "item" : "items"} need MudiKit
                  </span>
                )}
              </div>

              {shelfEntries.length === 0 ? (
                <div className="rounded-[2px] border border-dashed border-white/[0.1] bg-white/[0.015] p-10 text-[13.5px] text-foreground/65">
                  Nothing matches the current search and filters. Try removing one or two.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {shelfEntries.map((entry, i) => (
                    <ScrollReveal
                      key={entry.kind === "workbench" ? `wb-${entry.tool.slug}` : `ai-${entry.item.id}`}
                      delay={Math.min(i * 60, 360)}
                    >
                      <ShelfCard entry={entry} access={access} />
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </section>

            {!access.isMudikit && !access.isAdmin && lockedCount > 0 && accessFilter !== "free" && (
              <UpgradeBand count={lockedCount} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
