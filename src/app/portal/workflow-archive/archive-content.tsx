"use client";

import { Make, N8n } from "@lobehub/icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownToLine, Filter, FolderArchive, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ArchiveFacets, ArchiveFormat, ArchiveItem, UseCaseId } from "@/lib/workflow-archive";
import {
  AppBrandIcon,
  appHasBrandIcon,
  letterFor,
  prettyAppName,
  stableAppColors,
} from "@/lib/workflow-app-icons";

type UseCaseDef = { id: UseCaseId; label: string };

const FORMAT_OPTIONS: Array<{ value: ArchiveFormat; label: string }> = [
  { value: "n8n", label: "n8n" },
  { value: "make", label: "Make.com" },
];

const NOISE_APPS = new Set([
  "set", "code", "if", "merge", "switch", "wait", "manualtrigger", "splitinbatches",
  "function", "noop", "stickynote", "executeworkflow", "executiondata", "scheduletrigger",
  "filter", "itemlists", "splitout", "summarize", "aggregate", "limit", "comparedatasets",
  "renamekeys", "editimage", "sort", "removeduplicates", "respondtowebhook",
  "webhook", "stopanderror", "executecommand", "errortrigger", "interval",
  "httprequest", "builtin", "gateway", "executeworkflowtrigger",
  "langchain.outputparserstructured", "langchain.outputparseritemlist",
]);

function cleanApps(apps: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const a of apps) {
    const key = a.toLowerCase();
    if (NOISE_APPS.has(key)) continue;
    const label = prettyAppName(a);
    if (seen.has(label)) continue;
    seen.add(label);
    out.push(a);
  }
  return out;
}

function prettyFolder(folder: string): string {
  return folder
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function FilterPill({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-[2px] border px-3.5 py-2 text-[12.5px] font-black uppercase tracking-[0.16em] transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 " +
        (active
          ? "border-primary/40 bg-primary/10 text-foreground"
          : "border-white/[0.1] bg-white/[0.025] text-foreground hover:border-white/[0.2] hover:bg-white/[0.05]")
      }
    >
      {children}
      {typeof count === "number" && count > 0 && (
        <span className={active ? "text-primary" : "text-foreground/70"}>
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
}

function AppIconChip({ app }: { app: string }) {
  if (appHasBrandIcon(app)) {
    return (
      <span
        title={prettyAppName(app)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-[3px] border border-white/[0.08] bg-white/[0.04]"
      >
        <AppBrandIcon app={app} size={16} />
      </span>
    );
  }
  const c = stableAppColors(app.toLowerCase());
  return (
    <span
      title={prettyAppName(app)}
      className={
        "inline-flex h-7 w-7 items-center justify-center rounded-[3px] border border-white/[0.08] text-[11px] font-black " +
        c.bg +
        " " +
        c.fg
      }
    >
      {letterFor(app)}
    </span>
  );
}

function WorkflowCard({ item }: { item: ArchiveItem }) {
  const apps = cleanApps(item.apps);
  const visibleApps = apps.slice(0, 5);
  const extra = apps.length - visibleApps.length;
  const downloadHref = `/api/portal/workflow-archive/${encodeURIComponent(item.slug)}/download`;
  const FormatIcon = item.format === "n8n" ? N8n.Avatar : Make.Avatar;
  const formatLabel = item.format === "n8n" ? "n8n" : "Make.com";

  return (
    <a
      href={downloadHref}
      download
      className="group card-lift relative flex h-full flex-col overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-5 backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:bg-card/[0.6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="pointer-events-none absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-[1.2s] group-hover:via-primary/70" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FormatIcon size={28} />
          <span className="text-[12.5px] font-black uppercase tracking-[0.2em] text-foreground">
            {formatLabel}
          </span>
        </div>
        {item.node_count > 0 && (
          <span className="inline-flex items-center gap-1 text-[12.5px] font-black uppercase tracking-[0.16em] text-foreground tnum">
            {item.node_count} nodes
          </span>
        )}
      </div>

      <h3 className="mt-5 line-clamp-2 text-[18.5px] font-black leading-[1.15] tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary">
        {item.title}
      </h3>

      {item.folder && (
        <p className="mt-2 line-clamp-1 text-[13.5px] font-medium text-foreground/85">
          {prettyFolder(item.folder)}
        </p>
      )}

      {visibleApps.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {visibleApps.map((app) => (
            <AppIconChip key={app} app={app} />
          ))}
          {extra > 0 && (
            <span className="inline-flex h-7 items-center rounded-[3px] border border-white/[0.08] bg-white/[0.04] px-2 text-[12px] font-black text-foreground">
              +{extra}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-6 text-[13px] font-black uppercase tracking-[0.18em] text-foreground">
        <span className="text-foreground/85">JSON</span>
        <span className="inline-flex items-center gap-2 text-foreground transition-colors group-hover:text-primary">
          Download
          <ArrowDownToLine className="size-4 transition-transform group-hover:translate-y-0.5" />
        </span>
      </div>
    </a>
  );
}

function FolderBundleCard({ folder, count }: { folder: string; count: number }) {
  return (
    <a
      href={`/api/portal/workflow-archive/folder/${encodeURIComponent(folder)}`}
      download
      className="group card-lift relative flex items-center justify-between gap-4 rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-5 backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:bg-card/[0.6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[3px] border border-white/[0.08] bg-white/[0.04] text-foreground group-hover:border-primary/30 group-hover:text-primary">
          <FolderArchive className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="line-clamp-1 text-[15px] font-black leading-tight text-foreground">
            {prettyFolder(folder)}
          </div>
          <div className="mt-1 text-[12.5px] font-black uppercase tracking-[0.16em] text-foreground/85 tnum">
            {count} workflows · ZIP
          </div>
        </div>
      </div>
      <ArrowDownToLine className="size-4 shrink-0 text-foreground transition-colors group-hover:text-primary" />
    </a>
  );
}

export default function ArchiveContent({
  initialItems,
  facets,
  pageSize,
  useCases,
}: {
  initialItems: ArchiveItem[];
  facets: ArchiveFacets;
  pageSize: number;
  useCases: UseCaseDef[];
}) {
  const [items, setItems] = useState<ArchiveItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(initialItems.length < pageSize);
  const [totalForQuery, setTotalForQuery] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [formats, setFormats] = useState<Set<ArchiveFormat>>(new Set());
  const [selectedUseCases, setSelectedUseCases] = useState<Set<UseCaseId>>(new Set());
  const reqIdRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 220);
    return () => clearTimeout(t);
  }, [query]);

  const fetchPage = useCallback(
    async (offset: number, replace: boolean) => {
      const reqId = ++reqIdRef.current;
      setLoading(true);
      const params = new URLSearchParams();
      params.set("limit", String(pageSize));
      params.set("offset", String(offset));
      for (const f of formats) params.append("format", f);
      for (const uc of selectedUseCases) params.append("use_case", uc);
      if (debouncedQuery) params.set("q", debouncedQuery);
      try {
        const res = await fetch(`/api/portal/workflow-archive/list?${params.toString()}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (reqId !== reqIdRef.current) return;
        const next: ArchiveItem[] = Array.isArray(data?.items) ? data.items : [];
        setItems((prev) => (replace ? next : prev.concat(next)));
        setExhausted(next.length < pageSize);
        if (replace) {
          setTotalForQuery(typeof data?.total === "number" ? data.total : null);
        }
      } finally {
        if (reqId === reqIdRef.current) setLoading(false);
      }
    },
    [pageSize, formats, selectedUseCases, debouncedQuery]
  );

  useEffect(() => {
    void fetchPage(0, true);
  }, [fetchPage]);

  const toggleFormat = (f: ArchiveFormat) => {
    setFormats((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  const toggleUseCase = (uc: UseCaseId) => {
    setSelectedUseCases((prev) => {
      const next = new Set(prev);
      if (next.has(uc)) next.delete(uc);
      else next.add(uc);
      return next;
    });
  };

  const clearAll = () => {
    setQuery("");
    setFormats(new Set());
    setSelectedUseCases(new Set());
  };

  const hasFilters = debouncedQuery.length > 0 || formats.size > 0 || selectedUseCases.size > 0;
  const folderBundles = useMemo(() => facets.top_folders.slice(0, 6), [facets.top_folders]);

  return (
    <main className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-10">
        {/* Hero */}
        <section className="mb-10 reveal">
          <p className="flex items-center gap-3 text-[12.5px] font-black uppercase tracking-[0.22em] text-foreground">
            <span aria-hidden className="h-px w-7 bg-primary/60" />
            The Archive
          </p>
          <h1 className="mt-4 text-[40px] font-black leading-[0.95] tracking-[-0.03em] text-foreground md:text-[52px]">
            n8n & Make.com workflows
          </h1>
          <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.7] text-foreground">
            <span className="font-black tnum">{facets.total.toLocaleString()}</span> ready-to-import automations from my archive. Search by name, app, or use case. Click any card to download the raw JSON.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-[12.5px] font-black uppercase tracking-[0.18em] text-foreground">
            <span className="inline-flex items-center gap-2">
              <N8n.Avatar size={18} />
              <span className="tnum">{facets.n8n_count.toLocaleString()}</span> n8n
            </span>
            <span aria-hidden className="inline-block h-3 w-px bg-white/15" />
            <span className="inline-flex items-center gap-2">
              <Make.Avatar size={18} />
              <span className="tnum">{facets.make_count.toLocaleString()}</span> Make.com
            </span>
          </div>
        </section>

        {/* Folder bundles strip */}
        {folderBundles.length > 0 && !hasFilters && (
          <section className="reveal mb-12">
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/[0.06] pb-4">
              <h2 className="flex items-center gap-3 text-[13px] font-black uppercase tracking-[0.22em] text-foreground">
                <span aria-hidden className="h-px w-7 bg-primary/60" />
                Folder bundles
              </h2>
              <span className="text-[12.5px] font-black uppercase tracking-[0.16em] text-foreground/85">
                Download all as ZIP
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {folderBundles.map((f) => (
                <FolderBundleCard key={f.folder} folder={f.folder} count={f.count} />
              ))}
            </div>
          </section>
        )}

        {/* Sticky search + filters */}
        <section className="sticky top-14 z-20 -mx-4 mb-10 border-y border-white/[0.06] bg-[#0a0a0c]/85 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <div className="flex min-w-0 items-center gap-2 rounded-[2px] border border-white/[0.1] bg-white/[0.025] px-4 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/30">
            <Search aria-hidden className="size-5 shrink-0 text-foreground" />
            <Input
              type="search"
              aria-label="Search the workflow archive"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, app, folder…"
              className="h-12 w-full border-0 bg-transparent px-0 text-[15px] font-medium text-foreground placeholder:text-foreground/60 focus-visible:ring-0"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-[12.5px] font-black uppercase tracking-[0.18em] text-foreground hover:text-primary"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 text-[12.5px] font-black uppercase tracking-[0.18em] text-foreground">
              <Filter className="size-3.5" />
              Format
            </span>
            {FORMAT_OPTIONS.map((o) => (
              <FilterPill
                key={o.value}
                active={formats.has(o.value)}
                onClick={() => toggleFormat(o.value)}
                count={o.value === "n8n" ? facets.n8n_count : facets.make_count}
              >
                <span className="inline-flex items-center gap-1.5">
                  {o.value === "n8n" ? <N8n.Avatar size={14} /> : <Make.Avatar size={14} />}
                  {o.label}
                </span>
              </FilterPill>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 text-[12.5px] font-black uppercase tracking-[0.18em] text-foreground">
              Use case
            </span>
            {useCases.map((uc) => (
              <FilterPill
                key={uc.id}
                active={selectedUseCases.has(uc.id)}
                onClick={() => toggleUseCase(uc.id)}
                count={facets.use_case_counts[uc.id] ?? 0}
              >
                {uc.label}
              </FilterPill>
            ))}
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-1 inline-flex items-center gap-1 text-[12.5px] font-black uppercase tracking-[0.18em] text-foreground hover:text-primary"
              >
                Clear all
              </button>
            )}
          </div>
        </section>

        {/* Results header */}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/[0.06] pb-4">
            <h2 className="flex items-center gap-3 text-[13px] font-black uppercase tracking-[0.22em] text-foreground">
              <span aria-hidden className="h-px w-7 bg-primary/60" />
              {hasFilters
                ? `Results · ${(totalForQuery ?? items.length).toLocaleString()}`
                : "Every workflow on file"}
            </h2>
            {!hasFilters && (
              <span className="text-[12.5px] font-black uppercase tracking-[0.16em] text-foreground">
                Click card → download JSON
              </span>
            )}
          </div>

          {items.length === 0 && !loading ? (
            <div className="rounded-[2px] border border-dashed border-white/[0.1] bg-white/[0.015] p-10">
              <p className="text-[15px] leading-[1.7] text-foreground">
                Nothing matches the current search and filters. Try removing one or two.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 inline-flex items-center gap-2 text-[12.5px] font-black uppercase tracking-[0.18em] text-foreground hover:text-primary"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it, i) => (
                <div
                  key={it.slug}
                  className="reveal h-full"
                  style={{ animationDelay: `${Math.min(i * 25, 320)}ms` }}
                >
                  <WorkflowCard item={it} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 flex items-center justify-center">
            {loading && items.length === 0 ? (
              <Loader2 className="size-5 animate-spin text-foreground" />
            ) : !exhausted ? (
              <button
                type="button"
                onClick={() => fetchPage(items.length, false)}
                disabled={loading}
                className="inline-flex items-center gap-3 rounded-[2px] border border-white/[0.1] bg-white/[0.025] px-6 py-3.5 text-[13px] font-black uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                {loading ? "Loading" : `Load ${pageSize} more`}
              </button>
            ) : items.length > 0 ? (
              <span className="text-[12.5px] font-black uppercase tracking-[0.18em] text-foreground/85">
                End of archive
              </span>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
