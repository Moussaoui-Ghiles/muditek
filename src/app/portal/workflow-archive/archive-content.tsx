"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, FolderArchive, Loader2, Search, X } from "lucide-react";
import type { ArchiveFacets, ArchiveFormat, ArchiveItem, UseCaseId } from "@/lib/workflow-archive";

type UseCaseDef = { id: UseCaseId; label: string };

const FORMAT_OPTIONS: Array<{ value: ArchiveFormat; label: string }> = [
  { value: "n8n", label: "n8n" },
  { value: "make", label: "Make.com" },
];

function prettyApp(app: string): string {
  if (!app) return "";
  const lower = app.toLowerCase();
  if (lower.startsWith("langchain.")) {
    const stem = lower.slice("langchain.".length);
    if (stem.startsWith("lmchat")) return stem.slice("lmchat".length).replace(/^./, (c) => c.toUpperCase());
    if (stem === "agent") return "AI Agent";
    if (stem === "memorybufferwindow") return "Memory";
    if (stem === "chainllm") return "Chain";
    return stem.replace(/^./, (c) => c.toUpperCase());
  }
  return app
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function cleanApps(apps: string[]): string[] {
  const NOISE = new Set([
    "set", "code", "if", "merge", "switch", "wait", "manualtrigger", "splitinbatches",
    "function", "noop", "stickynote", "executeworkflow", "executiondata", "scheduletrigger",
    "filter", "itemlists", "splitout", "summarize", "aggregate", "limit", "comparedatasets",
    "renamekeys", "editimage", "sort", "removeduplicates", "respondtowebhook",
    "webhook", "stopanderror", "executecommand", "errortrigger", "interval",
    "httprequest", "builtin", "gateway", "executeworkflowtrigger",
  ]);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const a of apps) {
    const key = a.toLowerCase();
    if (NOISE.has(key)) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(a);
  }
  return out;
}

function FormatPill({ format }: { format: ArchiveFormat }) {
  return (
    <span
      className={
        "inline-flex h-5 items-center rounded px-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] " +
        (format === "n8n"
          ? "bg-orange-300/10 text-orange-200"
          : "bg-violet-300/10 text-violet-200")
      }
    >
      {format === "n8n" ? "n8n" : "Make"}
    </span>
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
      {typeof count === "number" && count > 0 && (
        <span className={active ? "text-black/60" : "text-white/35"}>{count.toLocaleString()}</span>
      )}
    </button>
  );
}

function ArchiveRow({ item }: { item: ArchiveItem }) {
  const apps = cleanApps(item.apps).slice(0, 6);
  const extra = cleanApps(item.apps).length - apps.length;
  return (
    <tr className="group border-b border-white/[0.04] last:border-b-0 transition-colors hover:bg-white/[0.025]">
      <td className="py-2 pl-4 pr-3 align-top">
        <FormatPill format={item.format} />
      </td>
      <td className="py-2 pr-3 align-top">
        <div className="line-clamp-1 text-[13.5px] font-medium text-white">{item.title}</div>
        {item.folder && (
          <div className="mt-0.5 line-clamp-1 text-[11px] text-white/40">
            <span className="text-white/30">{item.folder}</span>
            {item.node_count > 0 && <span className="ml-1.5 text-white/30">· {item.node_count} nodes</span>}
          </div>
        )}
      </td>
      <td className="py-2 pr-3 align-top">
        {apps.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1">
            {apps.map((app) => (
              <span
                key={app}
                className="inline-flex items-center rounded border border-white/[0.06] bg-white/[0.02] px-1.5 py-[2px] text-[10.5px] text-white/65"
              >
                {prettyApp(app)}
              </span>
            ))}
            {extra > 0 && <span className="text-[10.5px] text-white/40">+{extra}</span>}
          </div>
        ) : (
          <span className="text-[11px] text-white/30">—</span>
        )}
      </td>
      <td className="py-2 pr-4 pl-2 align-top text-right">
        <a
          href={`/api/portal/workflow-archive/${encodeURIComponent(item.slug)}/download`}
          className="inline-flex h-7 items-center gap-1.5 rounded-md border border-white/[0.1] bg-white/[0.03] px-2 text-[11px] font-medium text-white/85 transition-colors hover:bg-white/[0.08] hover:text-white"
          title="Download JSON"
        >
          <Download className="size-3" />
          JSON
        </a>
      </td>
    </tr>
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
        const res = await fetch(`/api/portal/workflow-archive/list?${params.toString()}`, { credentials: "include" });
        const data = await res.json();
        if (reqId !== reqIdRef.current) return;
        const next: ArchiveItem[] = Array.isArray(data?.items) ? data.items : [];
        setItems((prev) => (replace ? next : prev.concat(next)));
        setExhausted(next.length < pageSize);
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
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  };

  const toggleUseCase = (uc: UseCaseId) => {
    setSelectedUseCases((prev) => {
      const next = new Set(prev);
      next.has(uc) ? next.delete(uc) : next.add(uc);
      return next;
    });
  };

  const clearAll = () => {
    setQuery("");
    setFormats(new Set());
    setSelectedUseCases(new Set());
  };

  const totalLabel =
    facets.total > 0
      ? `${facets.total.toLocaleString()} workflows · ${facets.n8n_count.toLocaleString()} n8n · ${facets.make_count.toLocaleString()} Make.com`
      : "No workflows yet";

  const folderBundles = useMemo(() => facets.top_folders.slice(0, 12), [facets.top_folders]);
  const hasFilters =
    debouncedQuery.length > 0 || formats.size > 0 || selectedUseCases.size > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-[26px] font-semibold tracking-tight text-white">n8n & Make.com Workflows</h1>
        <p className="text-[13px] text-white/55">{totalLabel}</p>
      </header>

      <div className="mt-5 flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, app, folder…"
            className="h-11 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] pl-9 pr-9 text-[14px] text-white placeholder:text-white/35 focus:border-white/[0.2] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/45 hover:bg-white/[0.05] hover:text-white"
              aria-label="Clear"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">Format</span>
          {FORMAT_OPTIONS.map((o) => (
            <FilterChip
              key={o.value}
              active={formats.has(o.value)}
              onClick={() => toggleFormat(o.value)}
              count={o.value === "n8n" ? facets.n8n_count : facets.make_count}
            >
              {o.label}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">Use case</span>
          {useCases.map((uc) => (
            <FilterChip
              key={uc.id}
              active={selectedUseCases.has(uc.id)}
              onClick={() => toggleUseCase(uc.id)}
              count={facets.use_case_counts[uc.id] ?? 0}
            >
              {uc.label}
            </FilterChip>
          ))}
        </div>

        {hasFilters && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-[11px] text-white/55 underline-offset-4 hover:text-white hover:underline"
            >
              <X className="size-3" /> Clear filters
            </button>
            <span className="text-[11px] text-white/35">{items.length.toLocaleString()} shown</span>
          </div>
        )}
      </div>

      {folderBundles.length > 0 && !hasFilters && (
        <section className="mt-7">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50">Folder bundles</h2>
            <span className="text-[11px] text-white/35">Download all workflows in a folder at once</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {folderBundles.map((f) => (
              <a
                key={f.folder}
                href={`/api/portal/workflow-archive/folder/${encodeURIComponent(f.folder)}`}
                className="group flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:border-white/[0.18] hover:bg-white/[0.05]"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <FolderArchive className="size-4 shrink-0 text-white/55 group-hover:text-white" />
                  <div className="min-w-0">
                    <div className="line-clamp-1 text-[13px] font-medium text-white">{f.folder.replace(/_/g, " ")}</div>
                    <div className="text-[11px] text-white/45">{f.count} workflows</div>
                  </div>
                </div>
                <Download className="size-3.5 shrink-0 text-white/45 group-hover:text-white" />
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="mt-7">
        <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.015]">
          <table className="w-full table-fixed text-[13px]">
            <colgroup>
              <col style={{ width: "62px" }} />
              <col />
              <col style={{ width: "44%" }} />
              <col style={{ width: "92px" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                <th className="py-2.5 pl-4 pr-3">Type</th>
                <th className="py-2.5 pr-3">Workflow</th>
                <th className="py-2.5 pr-3">Apps</th>
                <th className="py-2.5 pr-4 pl-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <ArchiveRow key={it.slug} item={it} />
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && !loading && (
          <div className="mt-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <p className="text-[14px] text-white/60">No workflows match your filters.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-3 text-[12px] text-white/80 underline-offset-4 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center">
          {!exhausted ? (
            <button
              type="button"
              onClick={() => fetchPage(items.length, false)}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-white/[0.1] bg-white/[0.03] px-4 text-[13px] font-medium text-white hover:bg-white/[0.06] disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {loading ? "Loading…" : "Load 100 more"}
            </button>
          ) : items.length > 0 ? (
            <span className="text-[11px] text-white/35">End of results</span>
          ) : null}
        </div>
      </section>
    </div>
  );
}
