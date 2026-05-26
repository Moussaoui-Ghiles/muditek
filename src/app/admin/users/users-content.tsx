"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, FileText, Mail, Search, UserRoundCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

type UsersData = {
  summary: {
    newsletter_active: number;
    portal_accounts: number;
    resource_signups: number;
    portal_users_30d: number;
    newsletter_sent_events: number;
    newsletter_delivered_events: number;
  };
  users: Array<{
    email: string;
    newsletter_status: string | null;
    segment: string | null;
    source: string | null;
    subscribed_at: string | null;
    lifetime_open_rate: number | null;
    lifetime_click_count: number | null;
    roles: string | null;
    account_created_at: string | null;
    resources_requested: number | null;
    first_resource_slug: string | null;
    first_seen_at: string | null;
    last_seen_at: string | null;
    actions: number;
    content_views: number;
    downloads: number;
    tool_runs: number;
    newsletter_sent: number;
    newsletter_delivered: number;
    newsletter_bounced: number;
    pool: string;
    last_activity_at: string | null;
  }>;
  recentActivity: Array<{
    email: string | null;
    event: string;
    path: string | null;
    resource_slug: string | null;
    created_at: string;
  }>;
};

const FILTERS = [
  { value: "all", label: "All people" },
  { value: "newsletter", label: "Newsletter" },
  { value: "portal", label: "Portal accounts" },
  { value: "resources", label: "Resource signups" },
  { value: "no-portal", label: "Newsletter, no portal" },
] as const;

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

function shortLabel(value: string | null | undefined): string {
  if (!value) return "-";
  return value.replace(/^\/portal\/?/, "Portal/").replace(/-/g, " ");
}

function eventLabel(value: string): string {
  return value.replace(/_/g, " ");
}

export default function UsersContent() {
  const [data, setData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");

  useEffect(() => {
    let cancelled = false;

    async function load(showLoading: boolean) {
      if (showLoading) setLoading(true);
      const params = new URLSearchParams({ filter, limit: "300" });
      if (search.trim()) params.set("q", search.trim());
      await fetch(`/api/admin/users?${params}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((payload) => {
          if (cancelled) return;
          setData(payload?.summary && Array.isArray(payload.users) ? payload : null);
        })
        .catch(() => {
          if (!cancelled) setData(null);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    const timeout = window.setTimeout(() => void load(true), 180);
    const interval = window.setInterval(() => void load(false), 30000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [search, filter]);

  const users = data?.users ?? [];
  const recentActivity = useMemo(() => data?.recentActivity.slice(0, 10) ?? [], [data]);

  if (!data && loading) return <LoadingState />;
  if (!data) {
    return (
      <div className="mt-6 rounded-xl border border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">
        People could not load.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <section className="grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 md:grid-cols-4">
        <Metric icon={Mail} label="Newsletter active" value={data.summary.newsletter_active} />
        <Metric icon={UserRoundCheck} label="Portal accounts" value={data.summary.portal_accounts} />
        <Metric icon={FileText} label="Resource signups" value={data.summary.resource_signups} />
        <Metric icon={Activity} label="Portal users 30d" value={data.summary.portal_users_30d} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel
          title="People"
          action={
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search email, segment, source..."
                className="pl-9"
              />
            </div>
          }
        >
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={[
                  "shrink-0 rounded-full border px-3 py-1.5 text-[12px] transition-colors",
                  filter === item.value
                    ? "border-foreground/25 bg-foreground text-background"
                    : "border-border/60 bg-secondary/25 text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/55">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[260px]">Person</TableHead>
                  <TableHead>Pool</TableHead>
                  <TableHead>First source</TableHead>
                  <TableHead>Portal activity</TableHead>
                  <TableHead>Email delivery</TableHead>
                  <TableHead className="text-right">Last activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>
                      <p className="font-medium">{user.email}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {user.segment ?? "No segment"} · {user.newsletter_status ?? "no newsletter row"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <PoolBadge pool={user.pool} />
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-muted-foreground">
                      {user.first_resource_slug ? shortLabel(user.first_resource_slug) : user.source ?? "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatNumber(user.content_views)} opens · {formatNumber(user.downloads)} downloads · {formatNumber(user.tool_runs)} tool runs
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatNumber(user.newsletter_sent)} sent · {formatNumber(user.newsletter_delivered)} delivered
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right text-muted-foreground">
                      {formatDateTime(user.last_activity_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>

        <Panel title="Recent portal events">
          <div className="space-y-2">
            {recentActivity.length === 0 ? (
              <div className="rounded-lg border border-border/50 bg-background/25 p-3 text-[13px] text-muted-foreground">
                No portal activity recorded yet.
              </div>
            ) : (
              recentActivity.map((event, index) => (
                <div key={`${event.created_at}-${index}`} className="rounded-lg border border-border/50 bg-background/25 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">{eventLabel(event.event)}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {formatDateTime(event.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[12px] text-muted-foreground">{event.email ?? "Unknown"}</p>
                  <p className="mt-2 truncate text-[12px] text-muted-foreground">{event.resource_slug || event.path || "-"}</p>
                </div>
              ))
            )}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-background/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] tabular-nums">
        {formatNumber(value)}
      </p>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-border/60 bg-card/45 p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[17px] font-semibold tracking-[-0.02em]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function PoolBadge({ pool }: { pool: string }) {
  const variant = pool === "Portal account" ? "secondary" : "outline";
  return <Badge variant={variant}>{pool}</Badge>;
}

function LoadingState() {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-px overflow-hidden rounded-lg border border-border/60 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-none" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
