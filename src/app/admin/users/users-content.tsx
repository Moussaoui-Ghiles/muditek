"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Flame,
  Link2,
  Mail,
  Search,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type UsersData = {
  summary: {
    newsletter_active: number;
    portal_accounts: number;
    resource_signups: number;
    portal_users_30d: number;
    follow_up_candidates_30d: number;
    paid_customers: number;
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
    lead_magnets: number | null;
    first_resource_slug: string | null;
    first_seen_at: string | null;
    last_seen_at: string | null;
    actions: number;
    pages: number;
    content_views: number;
    downloads: number;
    tool_runs: number;
    active_paid: number;
    follow_up_ready: boolean;
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
  { value: "newsletter", label: "Newsletter list" },
  { value: "portal", label: "Portal accounts" },
  { value: "resources", label: "Resource signups" },
  { value: "follow-up", label: "Follow-up" },
  { value: "no-portal", label: "Newsletter only" },
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
  return value
    .replace(/^\/portal\/?/, "Portal/")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function eventLabel(value: string): string {
  return value.replace(/_/g, " ");
}

function followUpLabel(user: UsersData["users"][number]): string {
  if (user.active_paid > 0) return "Customer";
  if (user.follow_up_ready) return "Follow up";
  if (user.content_views > 0 || user.actions > 0) return "Watch";
  return "No portal use";
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
        .then((r) => {
          if (!r.ok) return null;
          return r.json();
        })
        .then((payload) => {
          if (cancelled) return;
          if (!payload?.summary || !Array.isArray(payload.users)) {
            setData(null);
            return;
          }
          setData(payload);
        })
        .catch(() => {
          if (!cancelled) setData(null);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    const timeout = window.setTimeout(() => {
      void load(true);
    }, 180);
    const interval = window.setInterval(() => {
      void load(false);
    }, 30000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [search, filter]);

  const users = data?.users ?? [];
  const recentActivity = useMemo(() => data?.recentActivity.slice(0, 12) ?? [], [data]);

  if (!data && loading) return <LoadingState />;
  if (!data) {
    return (
      <div className="mt-6 rounded-xl border border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">
        Users could not load.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <Metric icon={Mail} label="Newsletter list" value={data.summary.newsletter_active} />
        <Metric icon={UserRoundCheck} label="Portal accounts" value={data.summary.portal_accounts} accent />
        <Metric icon={Link2} label="Resource signups" value={data.summary.resource_signups} />
        <Metric icon={Activity} label="Portal visitors 30d" value={data.summary.portal_users_30d} />
        <Metric icon={Flame} label="Ready for follow-up" value={data.summary.follow_up_candidates_30d} accent />
        <Metric icon={Users} label="Paid customers" value={data.summary.paid_customers} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel
          eyebrow="Users"
          title="People by pool and behavior"
          action={
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative min-w-0 sm:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search email, source, resource..."
                  className="h-9 rounded-full border-border/70 bg-background/45 pl-9 text-[13px]"
                />
              </div>
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

          <div className="hidden overflow-x-auto rounded-xl border border-border/55 lg:block">
            <table className="w-full min-w-[980px] text-left text-[12.5px]">
              <thead className="border-b border-border/50 bg-secondary/35 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">User</th>
                  <th className="px-3 py-2 font-medium">Pool</th>
                  <th className="px-3 py-2 font-medium">Origin</th>
                  <th className="px-3 py-2 font-medium">Portal behavior</th>
                  <th className="px-3 py-2 font-medium">Follow-up</th>
                  <th className="px-3 py-2 font-medium">Last activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {users.map((user) => (
                  <tr key={user.email} className="text-foreground/85 transition-colors hover:bg-secondary/25">
                    <td className="max-w-[260px] px-3 py-3">
                      <p className="truncate font-medium text-foreground">{user.email}</p>
                      <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                        {user.segment ?? "No segment"} · {user.newsletter_status ?? "no newsletter row"}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <PoolBadge pool={user.pool} />
                    </td>
                    <td className="max-w-[240px] px-3 py-3 text-muted-foreground">
                      <p className="truncate">
                        {user.first_resource_slug ? shortLabel(user.first_resource_slug) : user.source ?? "-"}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {formatNumber(user.content_views)} reads · {formatNumber(user.downloads)} downloads · {formatNumber(user.tool_runs)} tool runs
                    </td>
                    <td className="px-3 py-3">
                      <FollowUpBadge label={followUpLabel(user)} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                      {formatDateTime(user.last_activity_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 lg:hidden">
            {users.map((user) => (
              <div key={user.email} className="rounded-xl border border-border/55 bg-background/25 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{user.email}</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">
                      {user.segment ?? "No segment"} · {formatDateTime(user.last_activity_at)}
                    </p>
                  </div>
                  <FollowUpBadge label={followUpLabel(user)} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <PoolBadge pool={user.pool} />
                  {user.first_resource_slug && <Badge variant="secondary">{shortLabel(user.first_resource_slug)}</Badge>}
                </div>
                <p className="mt-3 text-[12px] text-muted-foreground">
                  {formatNumber(user.content_views)} reads · {formatNumber(user.downloads)} downloads · {formatNumber(user.tool_runs)} tool runs
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Recent portal activity" title="Activity stream">
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
                    <span className="shrink-0 text-[11px] text-muted-foreground">{formatDateTime(event.created_at)}</span>
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
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-foreground/20">
      {accent && <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--color-live)]" />}
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground">{formatNumber(value)}</p>
    </div>
  );
}

function Panel({
  title,
  eyebrow,
  action,
  children,
}: {
  title: string;
  eyebrow: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-border/60 bg-card/45 p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.02em]">{title}</h2>
        </div>
        {action}
      </div>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  );
}

function PoolBadge({ pool }: { pool: string }) {
  const variant = pool === "Portal account" || pool === "Paid customer" ? "secondary" : "outline";
  return <Badge variant={variant}>{pool}</Badge>;
}

function FollowUpBadge({ label }: { label: string }) {
  const active = label === "Follow up" || label === "Customer";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        active
          ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-200"
          : "border-border/60 bg-secondary/40 text-muted-foreground",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
