"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Loader2, Search, SlidersHorizontal, Workflow as WorkflowIcon, X } from "lucide-react";
import type { WorkflowFacets, WorkflowListItem } from "@/lib/workflow-loader";
import { appColorClasses, appInitial as appLabelInitial, prettyAppLabel } from "@/lib/workflow-app-labels";

type FormatFilter = "all" | "n8n" | "make";
type SortKey = "newest" | "nodes" | "alpha";

const FORMAT_OPTIONS: Array<{ value: FormatFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "n8n", label: "n8n" },
  { value: "make", label: "Make.com" },
];

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "nodes", label: "Most nodes" },
  { value: "alpha", label: "A → Z" },
];

function prettyApp(app: string): string {
  return prettyAppLabel(app);
}

function formatBadge(f: WorkflowListItem["format"]): string {
  return f === "n8n" ? "n8n" : "Make";
}

function appInitial(app: string): string {
  return appLabelInitial(app);
}

function dedupApps(apps: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const a of apps) {
    const norm = a.toLowerCase();
    if (seen.has(norm)) continue;
    if (/^(set|code|if|merge|switch|wait|manualTrigger|splitInBatches|function|noOp|stickyNote|executeWorkflow|executionData|scheduleTrigger|filter|itemLists|splitOut|summarize|aggregate|limit|compareDatasets|renameKeys|editImage|sort|removeDuplicates|respondToWebhook|webhook|stopAndError|executeCommand|errorTrigger|interval)$/i.test(a)) continue;
    seen.add(norm);
    out.push(a);
  }
  return out;
}

function WorkflowCard({ item }: { item: WorkflowListItem }) {
  const cleanApps = dedupApps(item.apps);
  const heroApps = cleanApps.slice(0, 3);
  const extraCount = cleanApps.length - heroApps.length;

  return (
    <Link
      href={`/portal/workflows/${encodeURIComponent(item.slug)}`}
      className="group relative flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.04]"
    >
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.1] bg-white/[0.03] px-1.5 py-[2px]">
          <span className={item.format === "n8n" ? "text-orange-300" : "text-violet-300"}>●</span>
          {formatBadge(item.format)}
        </span>
        <span className="inline-flex items-center gap-1 text-white/55">
          <WorkflowIcon className="size-3" />
          {item.node_count}
        </span>
      </div>

      <h2 className="mt-3 line-clamp-2 text-[14px] font-semibold leading-snug text-white">
        {item.title}
      </h2>

      {item.description && (
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-white/55">
          {item.description}
        </p>
      )}

      {heroApps.length > 0 && (
        <div className="mt-auto pt-4">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1.5">
              {heroApps.map((app, idx) => {
                const c = appColorClasses(app);
                return (
                  <span
                    key={app + idx}
                    title={prettyApp(app)}
                    className={
                      "inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#0a0a0a] text-[11px] font-semibold ring-1 " +
                      c.chip +
                      " " +
                      c.ring
                    }
                    style={{ zIndex: heroApps.length - idx }}
                  >
                    {appInitial(app)}
                  </span>
                );
              })}
            </div>
            <span className="ml-1 line-clamp-1 text-[11px] text-white/55">
              {heroApps.map(prettyApp).join(" · ")}
              {extraCount > 0 ? ` · +${extraCount}` : ""}
            </span>
          </div>
        </div>
      )}

      <ArrowRight className="absolute right-4 top-4 size-4 -translate-y-0.5 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-60" />
    </Link>
  );
}

function FilterChip({
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
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors " +
        (active
          ? "border-white/40 bg-white text-black"
          : "border-white/[0.1] bg-white/[0.02] text-white/65 hover:bg-white/[0.06] hover:text-white")
      }
    >
      {children}
      {typeof count === "number" && (
        <span className={active ? "text-black/60" : "text-white/35"}>{count}</span>
      )}
    </button>
  );
}

export default function WorkflowsContent({
  initialItems,
  facets,
  pageSize,
}: {
  initialItems: WorkflowListItem[];
  facets: WorkflowFacets;
  pageSize: number;
}) {
  const [items, setItems] = useState<WorkflowListItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(initialItems.length < pageSize);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [format, setFormat] = useState<FormatFilter>("all");
  const [app, setApp] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("newest");
  const [namedOnly, setNamedOnly] = useState(true);
  const [showAllApps, setShowAllApps] = useState(false);
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
      params.set("format", format);
      params.set("sort", sort);
      if (namedOnly) params.set("named", "1");
      if (app) params.set("app", app);
      if (debouncedQuery) params.set("q", debouncedQuery);
      try {
        const res = await fetch(`/api/portal/workflows/list?${params.toString()}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (reqId !== reqIdRef.current) return;
        const next: WorkflowListItem[] = Array.isArray(data?.items) ? data.items : [];
        setItems((prev) => (replace ? next : prev.concat(next)));
        setExhausted(next.length < pageSize);
      } finally {
        if (reqId === reqIdRef.current) setLoading(false);
      }
    },
    [pageSize, format, sort, namedOnly, app, debouncedQuery]
  );

  // Reload on filter change
  useEffect(() => {
    void fetchPage(0, true);
  }, [fetchPage]);

  const onLoadMore = () => {
    if (loading || exhausted) return;
    void fetchPage(items.length, false);
  };

  const visibleApps = useMemo(() => {
    const top = facets.top_apps;
    return showAllApps ? top : top.slice(0, 8);
  }, [facets.top_apps, showAllApps]);

  const totalLabel =
    facets.total > 0
      ? `${facets.total.toLocaleString()} workflows · ${facets.n8n_count.toLocaleString()} n8n · ${facets.make_count.toLocaleString()} Make.com`
      : "No workflows yet";

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-white">Workflows</h1>
          <p className="mt-1 text-[13px] text-white/55">{totalLabel}</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/55">
          <button
            type="button"
            onClick={() => setNamedOnly((v) => !v)}
            className={
              "inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 transition-colors " +
              (namedOnly
                ? "border-white/30 bg-white/[0.08] text-white"
                : "border-white/[0.1] bg-transparent text-white/55 hover:bg-white/[0.04]")
            }
          >
            <SlidersHorizontal className="size-3.5" />
            Named only
          </button>
        </div>
      </header>

      <div className="mt-5 flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workflows, apps, descriptions…"
            className="h-11 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] pl-9 pr-9 text-[14px] text-white placeholder:text-white/35 focus:border-white/[0.2] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/45 hover:bg-white/[0.05] hover:text-white"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {FORMAT_OPTIONS.map((o) => (
            <FilterChip
              key={o.value}
              active={format === o.value}
              onClick={() => setFormat(o.value)}
              count={o.value === "n8n" ? facets.n8n_count : o.value === "make" ? facets.make_count : facets.total}
            >
              {o.label}
            </FilterChip>
          ))}
          <span className="mx-1 h-5 w-px bg-white/[0.08]" />
          <FilterChip active={!app} onClick={() => setApp(null)}>
            All apps
          </FilterChip>
          {visibleApps.map((a) => (
            <FilterChip key={a.app} active={app === a.app} onClick={() => setApp(a.app === app ? null : a.app)} count={a.count}>
              {prettyApp(a.app)}
            </FilterChip>
          ))}
          {facets.top_apps.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllApps((v) => !v)}
              className="text-[12px] text-white/55 underline-offset-4 hover:text-white hover:underline"
            >
              {showAllApps ? "Less" : `+${facets.top_apps.length - 8} more`}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[12px] text-white/45">
            {items.length.toLocaleString()} shown
          </div>
          <div className="flex items-center gap-1">
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setSort(o.value)}
                className={
                  "rounded-md px-2 py-1 text-[11px] font-medium transition-colors " +
                  (sort === o.value
                    ? "bg-white/[0.08] text-white"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white")
                }
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {items.length === 0 && !loading ? (
        <div className="mt-12 rounded-lg border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <p className="text-[14px] text-white/60">No workflows match these filters.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setApp(null);
              setFormat("all");
            }}
            className="mt-3 text-[12px] text-white/80 underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <li key={it.slug}>
              <WorkflowCard item={it} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex items-center justify-center">
        {!exhausted ? (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/[0.1] bg-white/[0.03] px-4 text-[13px] font-medium text-white hover:bg-white/[0.06] disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? "Loading…" : "Load more"}
          </button>
        ) : items.length > 0 ? (
          <span className="text-[11px] text-white/35">End of results</span>
        ) : null}
      </div>
    </div>
  );
}
