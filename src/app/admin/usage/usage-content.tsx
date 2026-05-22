"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowUpRight, Clock, MousePointer2, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type UsageData = {
  summary: {
    total_events: number;
    total_users: number;
    active_today: number;
    active_7d: number;
    active_30d: number;
    events_7d: number;
  };
  daily: Array<{ date: string; events: number; users: number }>;
  topResources: Array<{ resource_slug: string; events: number; users: number }>;
  topTools: Array<{ resource_slug: string; runs: number; users: number }>;
  topPages: Array<{ path: string; views: number; users: number }>;
  recentUsers: Array<{
    email: string;
    last_seen_at: string;
    events: number;
    pages: number;
    tools_used: number;
    downloads: number;
  }>;
  recentEvents: Array<{
    email: string | null;
    event: string;
    path: string | null;
    resource_slug: string | null;
    created_at: string;
  }>;
};

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function shortLabel(value: string): string {
  return value
    .replace(/^\/portal\/?/, "portal/")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function UsageContent() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/usage")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const maxDaily = useMemo(() => {
    if (!data?.daily.length) return 1;
    return Math.max(1, ...data.daily.map((d) => d.users));
  }, [data]);

  if (loading) return <LoadingState />;
  if (!data) {
    return (
      <div className="mt-6 rounded-xl border border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">
        Usage data could not load.
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="mt-7 space-y-5">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Active today" value={summary.active_today} icon={Activity} />
        <Metric label="Active 7d" value={summary.active_7d} icon={Users} />
        <Metric label="Active 30d" value={summary.active_30d} icon={Users} />
        <Metric label="Events 7d" value={summary.events_7d} icon={MousePointer2} />
        <Metric label="Tracked users" value={summary.total_users} icon={Clock} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <Panel
          title="Daily active users"
          eyebrow="Last 14 days"
          action={<span className="text-[11px] text-muted-foreground">{summary.total_events} total events</span>}
        >
          <div className="flex h-52 items-end gap-2 pt-6">
            {data.daily.map((day) => (
              <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end rounded-t bg-secondary/30 px-1">
                  <div
                    className="w-full rounded-t bg-primary/80 shadow-[0_0_24px_rgba(251,146,60,0.16)]"
                    style={{ height: `${Math.max(4, (day.users / maxDaily) * 100)}%` }}
                    title={`${day.users} users · ${day.events} events`}
                  />
                </div>
                <span className="w-full truncate text-center text-[10px] text-muted-foreground">
                  {day.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent users" eyebrow="Newest activity">
          <div className="divide-y divide-border/50">
            {data.recentUsers.length === 0 ? (
              <Empty text="No portal usage recorded yet." />
            ) : (
              data.recentUsers.slice(0, 8).map((user) => (
                <div key={user.email} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-foreground">{user.email}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                      {formatDateTime(user.last_seen_at)} · {user.pages} pages
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {user.tools_used > 0 && <Badge variant="secondary">{user.tools_used} tools</Badge>}
                    {user.downloads > 0 && <Badge variant="secondary">{user.downloads} downloads</Badge>}
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <RankedPanel
          title="Resources"
          eyebrow="Most used, 30d"
          rows={data.topResources.map((r) => ({
            label: shortLabel(r.resource_slug),
            href: `/portal/playbooks/${r.resource_slug}`,
            primary: `${r.users} users`,
            secondary: `${r.events} events`,
          }))}
        />
        <RankedPanel
          title="Tools"
          eyebrow="Runs, 30d"
          rows={data.topTools.map((r) => ({
            label: shortLabel(r.resource_slug),
            href: `/portal/tools/${r.resource_slug}`,
            primary: `${r.runs} runs`,
            secondary: `${r.users} users`,
          }))}
        />
        <RankedPanel
          title="Pages"
          eyebrow="Most visited, 30d"
          rows={data.topPages.map((r) => ({
            label: shortLabel(r.path),
            href: r.path,
            primary: `${r.users} users`,
            secondary: `${r.views} views`,
          }))}
        />
      </section>

      <Panel title="Event stream" eyebrow="Latest 30">
        <div className="overflow-hidden rounded-lg border border-border/50">
          <table className="w-full text-left text-[12.5px]">
            <thead className="border-b border-border/50 bg-secondary/30 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Time</th>
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Event</th>
                <th className="px-3 py-2 font-medium">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.recentEvents.map((event, index) => (
                <tr key={`${event.created_at}-${index}`} className="text-foreground/80">
                  <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{formatDateTime(event.created_at)}</td>
                  <td className="max-w-[240px] truncate px-3 py-2">{event.email ?? "Unknown"}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium">{event.event.replace(/_/g, " ")}</td>
                  <td className="max-w-[320px] truncate px-3 py-2 text-muted-foreground">
                    {event.resource_slug || event.path || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Activity }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/45 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground">{value.toLocaleString()}</p>
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
    <section className="rounded-xl border border-border/60 bg-card/45 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.02em]">{title}</h2>
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function RankedPanel({
  title,
  eyebrow,
  rows,
}: {
  title: string;
  eyebrow: string;
  rows: Array<{ label: string; href: string; primary: string; secondary: string }>;
}) {
  return (
    <Panel title={title} eyebrow={eyebrow}>
      <div className="space-y-2">
        {rows.length === 0 ? (
          <Empty text="No usage recorded yet." />
        ) : (
          rows.map((row) => (
            <Link
              key={`${row.href}-${row.label}`}
              href={row.href}
              className="group flex items-center justify-between gap-4 rounded-lg border border-border/45 bg-background/25 px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-primary/10"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">{row.label}</p>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">{row.secondary}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-[12px] text-muted-foreground">
                {row.primary}
                <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))
        )}
      </div>
    </Panel>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed border-border/60 text-center text-[13px] text-muted-foreground">
      {text}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-7 space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-xl" />
      <div className="grid gap-4 xl:grid-cols-3">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}
