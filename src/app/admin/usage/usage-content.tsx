"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Clock,
  FileText,
  MousePointer2,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
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

function eventLabel(value: string): string {
  return value.replace(/_/g, " ");
}

export default function UsageContent() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/usage")
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((payload) => {
        if (!payload?.summary || !Array.isArray(payload.daily)) {
          setData(null);
          return;
        }
        setData(payload);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const maxDaily = useMemo(() => {
    if (!data?.daily?.length) return 1;
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
  const mostUsedResource = data.topResources[0];
  const mostUsedTool = data.topTools[0];
  const lastEvent = data.recentEvents[0];

  return (
    <div className="mt-6 space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Active today" value={summary.active_today} icon={Activity} tone="live" />
        <Metric label="Active 7d" value={summary.active_7d} icon={Users} />
        <Metric label="Active 30d" value={summary.active_30d} icon={Users} />
        <Metric label="Events 7d" value={summary.events_7d} icon={MousePointer2} />
        <Metric label="Tracked users" value={summary.total_users} icon={Clock} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]">
        <Panel title="Daily active users" eyebrow="Last 14 days">
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <Insight
              icon={FileText}
              label="Top resource"
              value={mostUsedResource ? shortLabel(mostUsedResource.resource_slug) : "No usage yet"}
              href={mostUsedResource ? `/portal/playbooks/${mostUsedResource.resource_slug}` : undefined}
            />
            <Insight
              icon={Wrench}
              label="Top tool"
              value={mostUsedTool ? shortLabel(mostUsedTool.resource_slug) : "No runs yet"}
              href={mostUsedTool ? `/portal/tools/${mostUsedTool.resource_slug}` : undefined}
            />
            <Insight
              icon={Sparkles}
              label="Latest event"
              value={lastEvent ? eventLabel(lastEvent.event) : "No events yet"}
            />
          </div>
          <div className="relative flex h-64 items-end gap-2 border-t border-border/55 pt-8">
            <div className="absolute left-0 right-0 top-8 h-px bg-border/35" />
            <div className="absolute left-0 right-0 top-[50%] h-px bg-border/30" />
            {data.daily.map((day) => (
              <div key={day.date} className="group flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex h-44 w-full items-end rounded-t-sm bg-secondary/25 px-1 transition-colors group-hover:bg-secondary/45">
                  <div
                    className="w-full rounded-t-sm bg-foreground transition-all duration-200 group-hover:bg-primary"
                    style={{ height: `${Math.max(4, (day.users / maxDaily) * 100)}%` }}
                    title={`${day.users} users · ${day.events} events`}
                  />
                </div>
                <span className="hidden w-full truncate text-center text-[10px] text-muted-foreground sm:block">
                  {day.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent users" eyebrow="Newest activity">
          <div className="space-y-1">
            {data.recentUsers.length === 0 ? (
              <Empty text="No portal usage recorded yet." />
            ) : (
              data.recentUsers.slice(0, 8).map((user) => (
                <div key={user.email} className="flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/35">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-foreground">{user.email}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                      {formatDateTime(user.last_seen_at)} · {user.pages} pages
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10.5px]">
                      {user.events} events
                    </Badge>
                    {user.tools_used > 0 && (
                      <Badge variant="secondary" className="hidden rounded-full px-2 py-0 text-[10.5px] sm:inline-flex">
                        {user.tools_used} tools
                      </Badge>
                    )}
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
        <div className="hidden overflow-x-auto rounded-xl border border-border/55 sm:block">
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead className="border-b border-border/50 bg-secondary/35 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Time</th>
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Event</th>
                <th className="px-3 py-2 font-medium">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.recentEvents.map((event, index) => (
                <tr key={`${event.created_at}-${index}`} className="text-foreground/80 transition-colors hover:bg-secondary/25">
                  <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{formatDateTime(event.created_at)}</td>
                  <td className="max-w-[240px] truncate px-3 py-2">{event.email ?? "Unknown"}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium">{eventLabel(event.event)}</td>
                  <td className="max-w-[320px] truncate px-3 py-2 text-muted-foreground">
                    {event.resource_slug || event.path || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2 sm:hidden">
          {data.recentEvents.length === 0 ? (
            <Empty text="No events recorded yet." />
          ) : (
            data.recentEvents.map((event, index) => (
              <div
                key={`${event.created_at}-${index}`}
                className="rounded-lg border border-border/55 bg-background/30 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-foreground">{eventLabel(event.event)}</p>
                    <p className="mt-1 truncate text-[12px] text-muted-foreground">
                      {event.email ?? "Unknown"}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {formatDateTime(event.created_at)}
                  </span>
                </div>
                <p className="mt-2 truncate text-[12px] text-muted-foreground">
                  {event.resource_slug || event.path || "-"}
                </p>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Activity;
  tone?: "live";
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-foreground/20">
      {tone === "live" && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--color-live)]" />
      )}
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
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
    <section className="min-w-0 rounded-xl border border-border/60 bg-card/45 p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)] sm:p-5">
      <div className="flex items-start justify-between gap-4">
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

function Insight({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof BarChart3;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border/50 bg-background/30 px-3 py-3 transition-colors hover:border-foreground/20">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/70 text-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-[13px] font-medium text-foreground">{value}</p>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block min-w-0">
      {content}
    </Link>
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
      <div className="space-y-1">
        {rows.length === 0 ? (
          <Empty text="No usage recorded yet." />
        ) : (
          rows.map((row, index) => (
            <Link
              key={`${row.href}-${row.label}`}
              href={row.href}
              className="group flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/35"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary/60 text-[11px] font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground">{row.label}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">{row.secondary}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-[12px] font-medium text-muted-foreground">
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
    <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed border-border/60 px-4 text-center text-[13px] text-muted-foreground">
      {text}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-6 space-y-6">
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
