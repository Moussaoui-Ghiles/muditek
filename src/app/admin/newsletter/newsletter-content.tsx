"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronRight, Eye, EyeOff, Loader2, Plus } from "lucide-react";
import IssueEditor from "./issue-editor";
import { isPortalNewsletterArticle } from "@/lib/newsletter-portal";

interface Issue {
  id: string;
  subject: string;
  slug: string;
  status: "draft" | "scheduled" | "sent";
  audience_filter: string | null;
  sent_at: string | null;
  stats: (Record<string, unknown> & {
    sent?: number;
    failed?: number;
    opens?: number;
    clicks?: number;
    portal_article?: boolean;
    portalArticle?: boolean;
    source?: string;
  }) | null;
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
  const [savingPortalId, setSavingPortalId] = useState<string | null>(null);

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
          portal_article: false,
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

  async function setPortalArticle(issue: Issue, next: boolean) {
    setSavingPortalId(issue.id);
    try {
      const res = await fetch(`/api/admin/newsletter/issues/${issue.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portal_article: next }),
      });
      if (!res.ok) return;
      setIssues((current) =>
        current?.map((item) =>
          item.id === issue.id
            ? {
                ...item,
                stats: {
                  ...(item.stats ?? {}),
                  portal_article: next,
                },
              }
            : item,
        ) ?? null,
      );
    } finally {
      setSavingPortalId(null);
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
        <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.025em] text-zinc-50 leading-[1.05]">
          Newsletter
        </h1>

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
        <h2 className="text-sm font-semibold text-zinc-300">Issues</h2>

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
                <IssueRow
                  issue={i}
                  saving={savingPortalId === i.id}
                  onEdit={() => setEditingId(i.id)}
                  onTogglePortalArticle={(next) => void setPortalArticle(i, next)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function IssueRow({
  issue,
  saving,
  onEdit,
  onTogglePortalArticle,
}: {
  issue: Issue;
  saving: boolean;
  onEdit: () => void;
  onTogglePortalArticle: (next: boolean) => void;
}) {
  const portalArticle = isPortalNewsletterArticle(issue.stats);
  const date = (issue.sent_at
    ? new Date(issue.sent_at)
    : new Date(issue.created_at)
  ).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <div className="group -mx-2 flex items-center gap-3 rounded-md px-2 py-5 transition-colors hover:bg-white/[0.015]">
      <button
        type="button"
        onClick={onEdit}
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
      >
        <span
          aria-hidden
          className={`shrink-0 size-1.5 rounded-full ${
            issue.status === "sent"
              ? "bg-zinc-500"
              : issue.status === "scheduled"
                ? "bg-[var(--color-warn,#f5a524)]"
                : "bg-[var(--color-live,#32d583)]"
          }`}
        />

        <span className="min-w-0 flex-1 truncate text-base font-medium text-zinc-100 group-hover:text-white">
          {issue.subject || <span className="text-zinc-500 italic">Untitled draft</span>}
        </span>

        <span className="hidden md:inline-flex shrink-0 items-center gap-1.5 text-xs text-zinc-500">
          {issue.audience_filter ? (
            <>
              <span className={`size-1.5 rounded-full ${SEG_DOT[issue.audience_filter] ?? "bg-zinc-500"}`} />
              {issue.audience_filter}
            </>
          ) : (
            "All active"
          )}
        </span>

        <span className="hidden sm:inline-block w-16 shrink-0 text-right text-xs text-zinc-400 tabular-nums">
          {issue.stats?.sent ?? "—"}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTogglePortalArticle(!portalArticle)}
        disabled={saving}
        className={`hidden h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium transition-colors lg:inline-flex ${
          portalArticle
            ? "bg-white/[0.08] text-zinc-100 hover:bg-white/[0.12]"
            : "bg-white/[0.03] text-zinc-500 hover:bg-white/[0.07] hover:text-zinc-300"
        } ${saving ? "opacity-60" : ""}`}
        title={portalArticle ? "Hide from portal archive" : "Show in portal archive"}
      >
        {saving ? (
          <Loader2 className="size-3 animate-spin" />
        ) : portalArticle ? (
          <Eye className="size-3" />
        ) : (
          <EyeOff className="size-3" />
        )}
        {portalArticle ? "Portal article" : "Email only"}
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="flex shrink-0 items-center gap-3"
        aria-label={`Open ${issue.subject || "issue"}`}
      >
        <span className="w-16 text-right text-xs text-zinc-500 sm:w-24">{date}</span>
        <ChevronRight
          className="size-4 shrink-0 text-zinc-700 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-300"
          strokeWidth={1.8}
        />
      </button>
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
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        {dotClass && <span className={`size-1.5 rounded-full ${dotClass}`} />}
        {label}
      </div>
      <div
        className={`mt-2 text-3xl font-bold tracking-[-0.02em] tabular-nums ${
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
        <h3 className="text-xl font-semibold text-zinc-200">No issues yet.</h3>
        <button
          onClick={onCreate}
          className="mt-2 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-zinc-100 text-zinc-950 text-sm font-semibold spring hover:bg-white"
        >
          Start drafting
          <ArrowUpRight className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
