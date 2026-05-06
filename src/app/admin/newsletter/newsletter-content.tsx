"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronRight, Plus } from "lucide-react";
import IssueEditor from "./issue-editor";

interface Issue {
  id: string;
  subject: string;
  slug: string;
  status: "draft" | "scheduled" | "sent";
  audience_filter: string | null;
  sent_at: string | null;
  stats: { sent?: number; failed?: number; opens?: number; clicks?: number } | null;
  created_at: string;
}

interface AudienceBreakdown {
  segment: string | null;
  status: string;
  count: number;
}

const SEG_DOT: Record<string, string> = {
  HOT: "bg-[var(--color-warn,#f5a524)]",
  WARM: "bg-[var(--color-live,#32d583)]",
  COLD: "bg-[var(--color-cool,#70b7ff)]",
};

export default function NewsletterContent() {
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [breakdown, setBreakdown] = useState<AudienceBreakdown[] | null>(null);
  const [totals, setTotals] = useState<{ status: string; count: number }[] | null>(null);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const newBtnRef = useRef<HTMLButtonElement>(null);
  const newInnerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/admin/newsletter/issues").then((r) => r.json()),
      fetch("/api/admin/newsletter/audience").then((r) => r.json()),
    ]).then(([issuesRes, audRes]) => {
      if (cancelled) return;
      setIssues(issuesRes.issues ?? []);
      setBreakdown(audRes.breakdown ?? []);
      setTotals(audRes.totals ?? []);
    });
    return () => { cancelled = true; };
  }, [reloadKey]);

  // Magnetic "New issue"
  useEffect(() => {
    const btn = newBtnRef.current;
    const inner = newInnerRef.current;
    if (!btn || !inner) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    function onMove(e: PointerEvent) {
      if (!btn || !inner) return;
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0)`;
      inner.style.transform = `translate3d(${x * 0.28}px, ${y * 0.28}px, 0)`;
    }
    function onLeave() {
      if (!btn || !inner) return;
      btn.style.transform = "";
      inner.style.transform = "";
    }
    btn.addEventListener("pointermove", onMove);
    btn.addEventListener("pointerleave", onLeave);
    return () => {
      btn.removeEventListener("pointermove", onMove);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, [editingId]);

  async function createIssue() {
    setCreatingLoading(true);
    try {
      const res = await fetch("/api/admin/newsletter/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "",
          html: "",
          audience_filter: null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setEditingId(data.id);
      }
    } finally {
      setCreatingLoading(false);
    }
  }

  const activeByStatus = (totals ?? []).reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + t.count;
    return acc;
  }, {});
  const segmentCounts = (breakdown ?? [])
    .filter((b) => b.status === "active")
    .reduce<Record<string, number>>((acc, b) => {
      const k = b.segment ?? "unsegmented";
      acc[k] = (acc[k] ?? 0) + b.count;
      return acc;
    }, {});

  if (editingId) {
    return (
      <IssueEditor
        issueId={editingId}
        onClose={() => { setEditingId(null); setReloadKey((k) => k + 1); }}
      />
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-mono">
            Newsletter · audience &amp; issues
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.025em] text-zinc-50 leading-[1.05]">
            Write the next edition
          </h1>
          <p className="text-sm text-zinc-400 max-w-[55ch]">
            One inbox. One signal. Send to all active or target HOT, WARM, COLD.
          </p>
        </div>

        <button
          ref={newBtnRef}
          onClick={createIssue}
          disabled={creatingLoading}
          className="magnetic-cta group h-11 pl-5 pr-1.5 inline-flex items-center gap-2.5 rounded-full bg-zinc-100 text-zinc-950 text-sm font-semibold tracking-tight hover:bg-white shadow-[0_10px_30px_-10px_rgba(255,255,255,0.2)] disabled:opacity-50"
        >
          {creatingLoading ? "Creating…" : "New issue"}
          <span
            ref={newInnerRef}
            className="size-8 inline-flex items-center justify-center rounded-full bg-zinc-950/90 text-zinc-100 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] spring"
          >
            <Plus className="size-4" strokeWidth={2} />
          </span>
        </button>
      </header>

      {/* Audience strip — divide-x, no card */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-5 border-y border-white/[0.06] divide-x divide-white/[0.06]">
          <Stat label="Active" value={activeByStatus.active ?? 0} />
          <Stat label="HOT" value={segmentCounts.HOT ?? 0} dotClass={SEG_DOT.HOT} />
          <Stat label="WARM" value={segmentCounts.WARM ?? 0} dotClass={SEG_DOT.WARM} />
          <Stat label="COLD" value={segmentCounts.COLD ?? 0} dotClass={SEG_DOT.COLD} />
          <Stat label="Unsubscribed" value={activeByStatus.unsub ?? 0} muted />
        </div>
      </section>

      {/* Issues list */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-sm font-semibold tracking-[-0.01em] text-zinc-200">Issues</h2>
          {issues && issues.length > 0 && (
            <span className="text-[11px] text-zinc-500 font-mono">
              {issues.length} total
            </span>
          )}
        </div>

        {issues === null ? (
          <ul className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {[1, 2, 3].map((i) => (
              <li key={i} className="py-5 flex items-center gap-4">
                <div className="h-5 w-2/3 rounded bg-white/[0.04] animate-pulse" />
                <div className="ml-auto h-4 w-12 rounded bg-white/[0.04] animate-pulse" />
              </li>
            ))}
          </ul>
        ) : issues.length === 0 ? (
          <EmptyState onCreate={createIssue} />
        ) : (
          <ul className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {issues.map((i) => (
              <li key={i.id}>
                <button
                  type="button"
                  onClick={() => setEditingId(i.id)}
                  className="group w-full py-5 flex items-center gap-4 text-left spring hover:bg-white/[0.015] -mx-2 px-2 rounded-md"
                >
                  {/* Status dot */}
                  <span
                    aria-hidden
                    className={`shrink-0 size-1.5 rounded-full ${
                      i.status === "sent"
                        ? "bg-zinc-500"
                        : i.status === "scheduled"
                          ? "bg-[var(--color-warn,#f5a524)]"
                          : "bg-[var(--color-live,#32d583)]"
                    }`}
                  />

                  {/* Subject */}
                  <span className="min-w-0 flex-1 truncate text-base font-medium text-zinc-100 group-hover:text-white">
                    {i.subject || <span className="text-zinc-500 italic">Untitled draft</span>}
                  </span>

                  {/* Audience */}
                  <span className="hidden md:inline-flex shrink-0 items-center gap-1.5 text-[11px] text-zinc-500 font-mono uppercase tracking-wider">
                    {i.audience_filter ? (
                      <>
                        <span className={`size-1 rounded-full ${SEG_DOT[i.audience_filter] ?? "bg-zinc-500"}`} />
                        {i.audience_filter}
                      </>
                    ) : (
                      "All active"
                    )}
                  </span>

                  {/* Sent count */}
                  <span className="hidden sm:inline-block w-16 text-right text-[12px] text-zinc-400 font-mono tabular-nums">
                    {i.stats?.sent ?? "—"}
                  </span>

                  {/* Status label */}
                  <span
                    className={`hidden sm:inline-block w-20 text-[11px] uppercase tracking-[0.18em] font-mono ${
                      i.status === "sent"
                        ? "text-zinc-400"
                        : i.status === "scheduled"
                          ? "text-[var(--color-warn,#f5a524)]"
                          : "text-zinc-500"
                    }`}
                  >
                    {i.status}
                  </span>

                  {/* Date */}
                  <span className="shrink-0 w-28 text-right text-[11px] text-zinc-500 font-mono">
                    {(i.sent_at
                      ? new Date(i.sent_at)
                      : new Date(i.created_at)
                    ).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" })}
                  </span>

                  <ChevronRight
                    className="size-4 shrink-0 text-zinc-700 group-hover:text-zinc-300 group-hover:translate-x-0.5 spring"
                    strokeWidth={1.8}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  dotClass,
  muted = false,
}: {
  label: string;
  value: number;
  dotClass?: string;
  muted?: boolean;
}) {
  return (
    <div className="px-5 py-6 first:pl-0 last:pr-0">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-mono">
        {dotClass && <span className={`size-1.5 rounded-full ${dotClass}`} />}
        {label}
      </div>
      <div
        className={`mt-3 text-3xl font-bold tracking-[-0.02em] tabular-nums ${
          muted ? "text-zinc-500" : "text-zinc-50"
        }`}
      >
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="border-y border-white/[0.06] py-20 text-center">
      <div className="mx-auto max-w-md space-y-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-mono">
          Empty inbox
        </div>
        <h3 className="text-2xl font-bold tracking-[-0.02em] text-zinc-100">
          The first edition writes itself.
        </h3>
        <p className="text-sm text-zinc-500">
          A subject line, three short sections, one CTA. That&apos;s the shape.
        </p>
        <button
          onClick={onCreate}
          className="mt-3 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-zinc-100 text-zinc-950 text-sm font-semibold spring hover:bg-white"
        >
          Draft issue 001
          <ArrowUpRight className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
