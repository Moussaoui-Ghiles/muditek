"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Eye, EyeOff, Loader2, MailPlus, Search } from "lucide-react";
import IssueEditor from "./issue-editor";
import { isPortalNewsletterArticle } from "@/lib/newsletter-portal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SendState = "draft" | "sending" | "sent" | "imported_article";

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
    remaining?: number;
    last_batch_sent?: number;
    last_batch_failed?: number;
    portal_article?: boolean;
    portalArticle?: boolean;
    source?: string;
  }) | null;
  event_stats?: {
    sent_events?: number;
    delivered?: number;
    bounced?: number;
    complained?: number;
  };
  created_at: string;
  updated_at?: string | null;
}

interface AudienceBreakdown {
  segment: string | null;
  status: string;
  count: number;
}

function formatNumber(value: number | null | undefined): string {
  return Number(value ?? 0).toLocaleString();
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function stat(issue: Issue, key: keyof NonNullable<Issue["stats"]>): number {
  const value = issue.stats?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sendState(issue: Issue): SendState {
  if (issue.stats?.source === "beehiiv_import") return "imported_article";
  const sent = stat(issue, "sent") || Number(issue.event_stats?.sent_events ?? 0);
  const remaining = stat(issue, "remaining");
  if (issue.status === "sent" || (sent > 0 && remaining === 0)) return "sent";
  if (sent > 0 || remaining > 0) return "sending";
  return "draft";
}

function statusBadge(state: SendState) {
  if (state === "sending") return <Badge>Sending</Badge>;
  if (state === "sent") return <Badge variant="secondary">Sent</Badge>;
  if (state === "imported_article") return <Badge variant="outline">Imported article</Badge>;
  return <Badge variant="outline">Draft</Badge>;
}

export default function NewsletterContent() {
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [breakdown, setBreakdown] = useState<AudienceBreakdown[] | null>(null);
  const [totals, setTotals] = useState<{ status: string; count: number }[] | null>(null);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [savingPortalId, setSavingPortalId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

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
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

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
            ? { ...item, stats: { ...(item.stats ?? {}), portal_article: next } }
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
      const key = b.segment ?? "UNSEGMENTED";
      acc[key] = (acc[key] ?? 0) + b.count;
      return acc;
    }, {});

  const visibleIssues = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = issues ?? [];
    if (!q) return list;
    return list.filter((issue) =>
      [issue.subject, issue.audience_filter, issue.slug, sendState(issue)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [issues, query]);

  if (editingId) {
    return (
      <IssueEditor
        issueId={editingId}
        onClose={() => {
          setEditingId(null);
          setReloadKey((k) => k + 1);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Newsletter
          </p>
          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.03em]">Emails</h1>
        </div>
        <Button onClick={createIssue} disabled={creatingLoading}>
          {creatingLoading ? <Loader2 className="size-4 animate-spin" /> : <MailPlus className="size-4" />}
          {creatingLoading ? "Creating..." : "New email"}
        </Button>
      </header>

      <section className="grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-5">
        <AudienceCell label="Active list" value={activeByStatus.active ?? 0} />
        <AudienceCell label="HOT" value={segmentCounts.HOT ?? 0} />
        <AudienceCell label="WARM" value={segmentCounts.WARM ?? 0} />
        <AudienceCell label="COLD" value={segmentCounts.COLD ?? 0} />
        <AudienceCell label="Unsubscribed" value={activeByStatus.unsub ?? 0} />
      </section>

      <section className="rounded-xl border border-border/60 bg-card/45">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Email history</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Drafts, partial sends, completed sends, and imported portal articles.
            </p>
          </div>
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search emails"
            />
          </div>
        </div>

        {issues === null ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : visibleIssues.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No emails match.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[260px]">Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead className="text-right">Sent</TableHead>
                  <TableHead className="text-right">Remaining</TableHead>
                  <TableHead className="text-right">Delivered</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleIssues.map((issue) => (
                  <IssueRow
                    key={issue.id}
                    issue={issue}
                    saving={savingPortalId === issue.id}
                    onEdit={() => setEditingId(issue.id)}
                    onTogglePortalArticle={(next) => void setPortalArticle(issue, next)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
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
  const state = sendState(issue);
  const portalArticle = isPortalNewsletterArticle(issue.stats);
  const sent = stat(issue, "sent") || Number(issue.event_stats?.sent_events ?? 0);
  const remaining = stat(issue, "remaining");
  const delivered = Number(issue.event_stats?.delivered ?? 0);
  const failed = stat(issue, "failed");

  return (
    <TableRow className="cursor-pointer" onClick={onEdit}>
      <TableCell>
        <div className="max-w-[420px]">
          <p className="truncate font-medium">
            {issue.subject || <span className="text-muted-foreground italic">Untitled email</span>}
          </p>
          <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
            {issue.slug}
            {failed > 0 ? ` · ${formatNumber(failed)} failed` : ""}
          </p>
        </div>
      </TableCell>
      <TableCell>{statusBadge(state)}</TableCell>
      <TableCell>{issue.audience_filter ?? "All active"}</TableCell>
      <TableCell className="text-right font-mono">{formatNumber(sent)}</TableCell>
      <TableCell className="text-right font-mono">
        {state === "sending" ? formatNumber(remaining) : "-"}
      </TableCell>
      <TableCell className="text-right font-mono">{formatNumber(delivered)}</TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={() => onTogglePortalArticle(!portalArticle)}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-secondary/35 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {saving ? (
            <Loader2 className="size-3 animate-spin" />
          ) : portalArticle ? (
            <Eye className="size-3" />
          ) : (
            <EyeOff className="size-3" />
          )}
          {portalArticle ? "Published" : "Off"}
        </button>
      </TableCell>
      <TableCell className="whitespace-nowrap text-right text-xs text-muted-foreground">
        <button type="button" className="inline-flex items-center gap-1 hover:text-foreground">
          {formatDateTime(issue.updated_at ?? issue.sent_at ?? issue.created_at)}
          <ArrowUpRight className="size-3" />
        </button>
      </TableCell>
    </TableRow>
  );
}

function AudienceCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background/70 p-4">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] tabular-nums">
        {formatNumber(value)}
      </p>
    </div>
  );
}
