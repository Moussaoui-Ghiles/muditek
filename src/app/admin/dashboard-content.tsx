"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Mail,
  MousePointer2,
  Newspaper,
  Users,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type SendState = "draft" | "sending" | "sent" | "imported_article";

interface Stats {
  newsletter: {
    active: number;
    new_7d: number;
    hot: number;
    warm: number;
    cold: number;
    currentEmail: null | {
      id: string;
      subject: string;
      audience: string;
      sendState: SendState;
      sent: number;
      remaining: number;
      failed: number;
      lastBatchSent: number;
      lastBatchFailed: number;
      delivered: number;
      bounced: number;
      complained: number;
      updatedAt: string | null;
      sentAt: string | null;
    };
  };
  portal: {
    activeUsers7d: number;
    activeUsers30d: number;
    contentOpens7d: number;
    downloads7d: number;
    toolRuns7d: number;
    recentActivity: Array<{
      email: string | null;
      event: string;
      path: string | null;
      resource_slug: string | null;
      created_at: string;
    }>;
  };
  resources: {
    total: number;
    missingThumbnail: number;
    missingAsset: number;
    html: number;
    pdf: number;
    added7d: number;
    recent: Array<{
      title: string;
      slug: string;
      category: string;
      file_type: string | null;
      thumbnail_url: string | null;
      created_at: string;
    }>;
  };
}

interface Health {
  status: "ready" | "warning" | "blocked";
  blocking: number;
  warnings: number;
  checks: Array<{
    key: string;
    label: string;
    state: "ok" | "warn" | "error";
    required: boolean;
    detail: string;
  }>;
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

function eventLabel(value: string): string {
  return value.replace(/_/g, " ");
}

function sendLabel(state: SendState): string {
  if (state === "sending") return "Sending";
  if (state === "sent") return "Sent";
  if (state === "imported_article") return "Imported article";
  return "Draft";
}

export default function DashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/health").then((r) => r.json()),
    ])
      .then(([statsData, healthData]) => {
        if (cancelled) return;
        setStats(statsData);
        setHealth(healthData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleChecks = useMemo(
    () => health?.checks.filter((check) => check.state !== "ok") ?? [],
    [health],
  );

  if (loading) return <LoadingState />;
  if (!stats) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">
        Admin data could not load.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <NewsletterPanel stats={stats.newsletter} />
        <SystemPanel health={health} checks={visibleChecks} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <PortalPanel stats={stats.portal} />
        <ResourcesPanel stats={stats.resources} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <RecentActivity events={stats.portal.recentActivity} />
        <ResourceHealth stats={stats.resources} />
      </section>
    </div>
  );
}

function NewsletterPanel({ stats }: { stats: Stats["newsletter"] }) {
  const email = stats.currentEmail;
  const primaryAction =
    email?.sendState === "sending"
      ? "Continue Send 100"
      : email?.sendState === "draft"
        ? "Open draft"
        : "Open newsletter";

  return (
    <section className="rounded-xl border border-border/60 bg-card/50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <Newspaper className="size-3.5" />
            Newsletter sending
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">
            {email ? email.subject || "Untitled email" : "No active email"}
          </h2>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/newsletter" />} size="sm">
          {primaryAction}
          <ArrowUpRight className="size-3.5" />
        </Button>
      </div>

      {email ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant={email.sendState === "sending" ? "default" : "secondary"}>
              {sendLabel(email.sendState)}
            </Badge>
            <Badge variant="outline">{email.audience}</Badge>
            {email.updatedAt && (
              <span className="text-xs text-muted-foreground">
                Updated {formatDateTime(email.updatedAt)}
              </span>
            )}
          </div>

          <div className="mt-5 grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-4">
            <Cell label="Sent" value={email.sent} />
            <Cell label="Remaining" value={email.remaining} />
            <Cell label="Failed" value={email.failed} />
            <Cell label="Delivered" value={email.delivered} />
          </div>

          {email.sendState === "sending" && (
            <div className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
              This email already went to {formatNumber(email.sent)} people. The next safe action is another 100-person batch.
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
          Create a newsletter email when you are ready to send the next batch.
        </div>
      )}
    </section>
  );
}

function PortalPanel({ stats }: { stats: Stats["portal"] }) {
  return (
    <section className="rounded-xl border border-border/60 bg-card/45 p-5 lg:col-span-2">
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <MousePointer2 className="size-3.5" />
        Portal usage
      </p>
      <div className="mt-5 grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-5">
        <Cell label="Active 7d" value={stats.activeUsers7d} />
        <Cell label="Active 30d" value={stats.activeUsers30d} />
        <Cell label="Content opens 7d" value={stats.contentOpens7d} />
        <Cell label="Downloads 7d" value={stats.downloads7d} />
        <Cell label="Tool runs 7d" value={stats.toolRuns7d} />
      </div>
    </section>
  );
}

function ResourcesPanel({ stats }: { stats: Stats["resources"] }) {
  return (
    <section className="rounded-xl border border-border/60 bg-card/45 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <FileText className="size-3.5" />
            Resources
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] tabular-nums">
            {formatNumber(stats.total)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatNumber(stats.html)} HTML · {formatNumber(stats.pdf)} PDF
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/content" />} size="sm" variant="outline">
          Open CMS
          <ArrowUpRight className="size-3.5" />
        </Button>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60">
        <Cell label="Added 7d" value={stats.added7d} />
        <Cell label="No thumbnail" value={stats.missingThumbnail} />
        <Cell label="No asset" value={stats.missingAsset} />
      </div>
    </section>
  );
}

function SystemPanel({
  health,
  checks,
}: {
  health: Health | null;
  checks: Health["checks"];
}) {
  if (!health) return null;

  if (checks.length === 0) {
    return (
      <section className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-5">
        <p className="flex items-center gap-2 text-sm font-medium text-emerald-100">
          <CheckCircle2 className="size-4" />
          System checks are clean.
        </p>
        <p className="mt-2 text-sm text-emerald-100/70">
          Auth, sending, storage, database, and portal resources are configured.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-5">
      <p className="flex items-center gap-2 text-sm font-medium text-amber-100">
        <AlertTriangle className="size-4" />
        {health.blocking} blocker{health.blocking === 1 ? "" : "s"} · {health.warnings} warning{health.warnings === 1 ? "" : "s"}
      </p>
      <div className="mt-4 space-y-2">
        {checks.map((check) => (
          <div key={check.key} className="rounded-lg border border-white/10 bg-background/35 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{check.label}</p>
              <Badge variant={check.state === "error" ? "destructive" : "secondary"}>
                {check.state}
              </Badge>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{check.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentActivity({ events }: { events: Stats["portal"]["recentActivity"] }) {
  return (
    <section className="rounded-xl border border-border/60 bg-card/45 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          <Users className="size-3.5" />
          Recent portal events
        </p>
        <Link href="/admin/usage" className="text-xs text-muted-foreground hover:text-foreground">
          Usage <ArrowUpRight className="inline size-3" />
        </Link>
      </div>
      <div className="mt-4 divide-y divide-border/50">
        {events.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">No portal activity recorded yet.</p>
        ) : (
          events.map((event, index) => (
            <div key={`${event.created_at}-${index}`} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{eventLabel(event.event)}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {event.email ?? "Unknown"} · {event.resource_slug || event.path || "-"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{formatDateTime(event.created_at)}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function ResourceHealth({ stats }: { stats: Stats["resources"] }) {
  return (
    <section className="rounded-xl border border-border/60 bg-card/45 p-5">
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <Wrench className="size-3.5" />
        Recent resources
      </p>
      <div className="mt-4 divide-y divide-border/50">
        {stats.recent.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">No resources in the CMS yet.</p>
        ) : (
          stats.recent.map((item) => (
            <Link
              key={item.slug}
              href="/admin/content"
              className="grid gap-1 py-3 transition-colors hover:text-foreground"
            >
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {item.category} · {item.file_type || "asset"} · {formatDateTime(item.created_at)}
              </p>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

function Cell({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-background/70 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-[-0.03em] tabular-nums">
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-36 rounded-xl lg:col-span-2" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}
