"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, FileText, MousePointer2, Users, Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UsageData = {
  summary: {
    portal_accounts: number;
    active_today: number;
    active_7d: number;
    active_30d: number;
    content_opens_30d: number;
    downloads_30d: number;
    tool_runs_30d: number;
  };
  daily: Array<{
    date: string;
    active_people: number;
    content_opens: number;
    downloads: number;
    tool_runs: number;
  }>;
  contentDemand: Array<{
    title: string;
    slug: string;
    category: string;
    file_type: string | null;
    thumbnail_url: string | null;
    opens_30d: number;
    downloads_30d: number;
    people_30d: number;
    signups_total: number;
  }>;
  toolAdoption: Array<{
    resource_slug: string;
    views_30d: number;
    runs_30d: number;
    users_30d: number;
    last_used_at: string | null;
  }>;
  recentEvents: Array<{
    email: string | null;
    event: string;
    path: string | null;
    resource_slug: string | null;
    created_at: string;
  }>;
};

function formatNumber(value: number | null | undefined): string {
  return Number(value ?? 0).toLocaleString();
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
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

export default function UsageContent() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/usage")
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => {
        setData(payload?.summary && Array.isArray(payload.daily) ? payload : null);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const maxDaily = useMemo(() => {
    if (!data?.daily?.length) return 1;
    return Math.max(
      1,
      ...data.daily.map((day) =>
        Math.max(day.active_people, day.content_opens, day.downloads, day.tool_runs),
      ),
    );
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
    <div className="mt-6 space-y-6">
      <section className="grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 md:grid-cols-4">
        <Metric icon={Users} label="Portal accounts" value={summary.portal_accounts} />
        <Metric icon={MousePointer2} label="Active users 7d" value={summary.active_7d} />
        <Metric icon={FileText} label="Content opens 30d" value={summary.content_opens_30d} />
        <Metric icon={Wrench} label="Tool runs 30d" value={summary.tool_runs_30d} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <Panel title="Daily portal activity">
          <div className="space-y-3">
            {data.daily.map((day) => (
              <div key={day.date} className="grid gap-2 rounded-lg border border-border/50 bg-background/25 p-3 md:grid-cols-[92px_minmax(0,1fr)] md:items-center">
                <p className="text-xs text-muted-foreground">{formatDate(day.date)}</p>
                <div className="grid gap-2 sm:grid-cols-4">
                  <DailyBar label="Users" value={day.active_people} max={maxDaily} />
                  <DailyBar label="Opens" value={day.content_opens} max={maxDaily} />
                  <DailyBar label="Downloads" value={day.downloads} max={maxDaily} />
                  <DailyBar label="Tools" value={day.tool_runs} max={maxDaily} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent portal events">
          <div className="space-y-2">
            {data.recentEvents.slice(0, 12).map((event, index) => (
              <div key={`${event.created_at}-${index}`} className="rounded-lg border border-border/50 bg-background/25 p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{eventLabel(event.event)}</p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {formatDateTime(event.created_at)}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{event.email ?? "Unknown"}</p>
                <p className="mt-2 truncate text-xs text-muted-foreground">{event.resource_slug || event.path || "-"}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="Resources people open">
          <div className="space-y-2 md:hidden">
            {data.contentDemand.map((item) => (
              <Link
                key={item.slug}
                href={`/portal/playbooks/${item.slug}`}
                className="block rounded-lg border border-border/55 bg-background/25 p-3"
              >
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.category} · {item.file_type || "asset"}
                </p>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  <CompactMetric label="People" value={item.people_30d} />
                  <CompactMetric label="Opens" value={item.opens_30d} />
                  <CompactMetric label="Downloads" value={item.downloads_30d} />
                  <CompactMetric label="Signups" value={item.signups_total} />
                </div>
              </Link>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-xl border border-border/55 md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead className="text-right">People</TableHead>
                  <TableHead className="text-right">Opens</TableHead>
                  <TableHead className="text-right">Downloads</TableHead>
                  <TableHead className="text-right">Signups</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.contentDemand.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link href={`/portal/playbooks/${item.slug}`} className="font-medium hover:underline">
                        {item.title}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.category} · {item.file_type || "asset"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(item.people_30d)}</TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(item.opens_30d)}</TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(item.downloads_30d)}</TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(item.signups_total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>

        <Panel title="Tools people run">
          {data.toolAdoption.length === 0 ? (
            <Empty text="No tool usage recorded yet." />
          ) : (
            <div className="space-y-2">
              {data.toolAdoption.map((tool, index) => (
                <Link
                  key={tool.resource_slug}
                  href={`/portal/tools/${tool.resource_slug}`}
                  className="group flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/35"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary/60 text-[11px] font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{shortLabel(tool.resource_slug)}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Last used {formatDate(tool.last_used_at)}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground">
                    {formatNumber(tool.runs_30d)} runs · {formatNumber(tool.users_30d)} users
                    <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>
              ))}
            </div>
          )}
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
  icon: typeof Users;
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

function DailyBar({ label, value, max }: { label: string; value: number; max: number }) {
  const width = max > 0 ? Math.max(3, (value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{formatNumber(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary/45">
        <div className="h-full rounded-full bg-foreground" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function CompactMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-secondary/35 px-2 py-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-sm text-foreground">{formatNumber(value)}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-border/60 bg-card/45 p-4 sm:p-5">
      <h2 className="mb-4 text-[17px] font-semibold tracking-[-0.02em]">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed border-border/60 px-4 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-px overflow-hidden rounded-lg border border-border/60 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-none" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
}
