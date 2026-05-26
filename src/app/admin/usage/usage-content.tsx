"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Flame,
  Link2,
  Mail,
  Search,
  UserRoundCheck,
  Users,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type UsageData = {
  business: {
    newsletter_active: number;
    newsletter_new_7d: number;
    newsletter_new_30d: number;
    portal_accounts: number;
    portal_accounts_new_7d: number;
    people_active_today: number;
    people_active_7d: number;
    people_active_30d: number;
    content_consumers_30d: number;
    downloaders_30d: number;
    tool_users_30d: number;
    high_intent_30d: number;
    lead_magnet_signups_30d: number;
    paid_active: number;
    mrr: number;
  };
  daily: Array<{
    date: string;
    people: number;
    content_people: number;
    tool_people: number;
    downloads: number;
  }>;
  funnel: Array<{ label: string; description: string; value: number; sort_order: number }>;
  contentDemand: Array<{
    title: string;
    slug: string;
    category: string;
    file_type: string | null;
    thumbnail_url: string | null;
    viewers_30d: number;
    downloaders_30d: number;
    actions_30d: number;
    leads_total: number;
  }>;
  toolAdoption: Array<{
    resource_slug: string;
    views_30d: number;
    runs_30d: number;
    users_30d: number;
    last_used_at: string | null;
  }>;
  leadMagnets: Array<{
    resource_slug: string;
    title: string;
    leads: number;
    first_signup_at: string | null;
    last_signup_at: string | null;
  }>;
  segments: Array<{
    segment: string;
    subscribers: number;
    new_30d: number;
    avg_open_rate: number;
    lifetime_clicks: number;
  }>;
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
    last_activity_at: string | null;
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

function formatMoney(value: number | null | undefined): string {
  return `$${formatNumber(value ?? 0)}`;
}

function percent(part: number, total: number): string {
  if (!total) return "0%";
  const value = (part / total) * 100;
  if (value > 0 && value < 1) return `${value.toFixed(1)}%`;
  return `${Math.round(value)}%`;
}

function barWidth(part: number, total: number): string {
  if (!total || part <= 0) return "0%";
  const value = (part / total) * 100;
  return `${Math.max(2, Math.min(100, value))}%`;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
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

function intentScore(user: UsageData["users"][number]): number {
  return (
    user.actions +
    user.content_views * 2 +
    user.downloads * 5 +
    user.tool_runs * 6 +
    (user.lead_magnets ?? 0) * 3 +
    user.active_paid * 30
  );
}

function intentLabel(score: number): string {
  if (score >= 25) return "Strong follow-up";
  if (score >= 10) return "Worth watching";
  if (score > 0) return "Some activity";
  return "No portal use";
}

export default function UsageContent() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/usage")
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((payload) => {
        if (!payload?.business || !Array.isArray(payload.users)) {
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
    return Math.max(1, ...data.daily.map((d) => d.people));
  }, [data]);

  const filteredUsers = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    const users = data.users
      .map((user) => ({ ...user, score: intentScore(user) }))
      .sort((a, b) => {
        const scoreDiff = b.score - a.score;
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.last_activity_at ?? 0).getTime() - new Date(a.last_activity_at ?? 0).getTime();
      });
    if (!q) return users;
    return users.filter((user) => {
      return (
        user.email.toLowerCase().includes(q) ||
        (user.segment?.toLowerCase().includes(q) ?? false) ||
        (user.source?.toLowerCase().includes(q) ?? false) ||
        (user.first_resource_slug?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [data, search]);

  const visibleUsers = useMemo(() => filteredUsers.slice(0, 40), [filteredUsers]);

  if (loading) return <LoadingState />;
  if (!data) {
    return (
      <div className="mt-6 rounded-xl border border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">
        Usage data could not load.
      </div>
    );
  }

  const { business } = data;
  return (
    <div className="mt-6 space-y-6">
      <section className="grid gap-3 lg:grid-cols-4">
        <Definition
          title="Newsletter list"
          text="Everyone on the email list. Most of them do not have portal accounts yet."
        />
        <Definition
          title="Portal accounts"
          text="People who can log in. This is the pool we can watch inside the product."
        />
        <Definition
          title="Lead magnet signups"
          text="People who came in through a specific resource link."
        />
        <Definition
          title="Follow-up candidates"
          text="People who downloaded something or used a tool."
        />
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <BusinessMetric
          icon={Mail}
          label="Newsletter list"
          value={business.newsletter_active}
          note={`${formatNumber(business.newsletter_new_30d)} new in 30d`}
        />
        <BusinessMetric
          icon={UserRoundCheck}
          label="Portal accounts"
          value={business.portal_accounts}
          note={`${percent(business.portal_accounts, business.newsletter_active)} of newsletter`}
        />
        <BusinessMetric
          icon={Link2}
          label="Lead magnet signups"
          value={business.lead_magnet_signups_30d}
          note="From resource links in 30d"
        />
        <BusinessMetric
          icon={Users}
          label="Portal users this week"
          value={business.people_active_7d}
          note="Unique signed-in people"
          accent
        />
        <BusinessMetric
          icon={Flame}
          label="Follow-up candidates"
          value={business.high_intent_30d}
          note="Downloaded or used a tool in 30d"
          accent
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <Panel
          eyebrow="Main funnel"
          title="From email list to portal usage"
          action={<span className="text-[12px] text-muted-foreground">Paid customers: {formatNumber(business.paid_active)} · MRR {formatMoney(business.mrr)}</span>}
        >
          <div className="space-y-3">
            {data.funnel.map((step, index) => {
              const previous = index === 0 ? step.value : data.funnel[index - 1]?.value ?? 0;
              const width = barWidth(step.value, data.funnel[0]?.value ?? step.value);
              return (
                <div key={step.label} className="grid gap-2 rounded-xl border border-border/50 bg-background/25 p-3 sm:grid-cols-[210px_minmax(0,1fr)_76px] sm:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{step.label}</p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">{step.description}</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary/45">
                    <div className="h-full rounded-full bg-foreground" style={{ width }} />
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold text-foreground">{formatNumber(step.value)}</p>
                    {index > 0 && (
                      <p className="text-[11px] text-muted-foreground">{percent(step.value, previous)} prev</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel eyebrow="Last 14 days" title="Daily signed-in users">
          <div className="flex h-56 items-end gap-2 border-b border-border/50 pb-4">
            {data.daily.map((day) => (
              <div key={day.date} className="group flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end rounded-t bg-secondary/25 px-1">
                  <div
                    className="w-full rounded-t bg-foreground transition-colors group-hover:bg-primary"
                    style={{ height: `${Math.max(4, (day.people / maxDaily) * 100)}%` }}
                    title={`${day.people} people, ${day.content_people} content users, ${day.tool_people} tool users, ${day.downloads} downloads`}
                  />
                </div>
                <span className="hidden truncate text-[10px] text-muted-foreground sm:block">
                  {day.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[12px]">
            <MiniStat label="Today" value={business.people_active_today} />
            <MiniStat label="Used tools" value={business.tool_users_30d} />
            <MiniStat label="Downloaded" value={business.downloaders_30d} />
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Panel eyebrow="Email list" title="Newsletter segments">
          <div className="space-y-2">
            {data.segments.map((segment) => (
              <div key={segment.segment} className="grid grid-cols-[minmax(0,1fr)_72px_72px] items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-secondary/30">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{segment.segment}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {formatNumber(segment.new_30d)} new · {formatNumber(segment.lifetime_clicks)} lifetime clicks
                  </p>
                </div>
                <p className="text-right text-sm font-semibold">{formatNumber(segment.subscribers)}</p>
                <p className="text-right text-[12px] text-muted-foreground">{segment.avg_open_rate}% open</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Resource links" title="What creates portal accounts">
          <div className="space-y-2">
            {data.leadMagnets.length === 0 ? (
              <Empty text="No lead magnet signups recorded yet." />
            ) : (
              data.leadMagnets.map((item, index) => (
                <RankedRow
                  key={item.resource_slug}
                  index={index}
                  title={item.title}
                  href={`/portal/playbooks/${item.resource_slug}`}
                  primary={`${formatNumber(item.leads)} leads`}
                  secondary={`Last signup ${formatDate(item.last_signup_at)}`}
                />
              ))
            )}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel eyebrow="Portal content" title="What people open after login">
          <div className="space-y-2">
            {data.contentDemand.length === 0 ? (
              <Empty text="No content usage recorded yet." />
            ) : (
              data.contentDemand.map((item, index) => (
                <RankedRow
                  key={item.slug}
                  index={index}
                  title={item.title}
                  href={`/portal/playbooks/${item.slug}`}
                  primary={`${formatNumber(item.viewers_30d)} viewers`}
                  secondary={`${formatNumber(item.downloaders_30d)} downloaders · ${formatNumber(item.leads_total)} leads`}
                />
              ))
            )}
          </div>
        </Panel>

        <Panel eyebrow="Portal tools" title="Tools people actually run">
          <div className="space-y-2">
            {data.toolAdoption.length === 0 ? (
              <Empty text="No tool usage recorded yet." />
            ) : (
              data.toolAdoption.map((tool, index) => (
                <RankedRow
                  key={tool.resource_slug}
                  index={index}
                  title={shortLabel(tool.resource_slug)}
                  href={`/portal/tools/${tool.resource_slug}`}
                  primary={`${formatNumber(tool.runs_30d)} runs`}
                  secondary={`${formatNumber(tool.users_30d)} users · ${formatNumber(tool.views_30d)} views`}
                />
              ))
            )}
          </div>
        </Panel>
      </section>

      <Panel
        eyebrow="People"
        title="Users and follow-up priority"
        action={
          <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <span className="text-[12px] text-muted-foreground">
              Showing {formatNumber(visibleUsers.length)} of {formatNumber(filteredUsers.length)}
            </span>
            <div className="relative w-full min-w-0 sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users, source, segment..."
                className="h-9 rounded-full border-border/70 bg-background/45 pl-9 text-[13px]"
              />
            </div>
          </div>
        }
      >
        <div className="hidden overflow-x-auto rounded-xl border border-border/55 lg:block">
          <table className="w-full min-w-[980px] text-left text-[12.5px]">
            <thead className="border-b border-border/50 bg-secondary/35 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium">Usage</th>
                <th className="px-3 py-2 font-medium">Follow-up</th>
                <th className="px-3 py-2 font-medium">Last activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {visibleUsers.map((user) => {
                const score = intentScore(user);
                return (
                  <tr key={user.email} className="text-foreground/85 transition-colors hover:bg-secondary/25">
                    <td className="max-w-[260px] px-3 py-3">
                      <p className="truncate font-medium text-foreground">{user.email}</p>
                      <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                        {user.segment ?? "No segment"} · {user.newsletter_status ?? "no newsletter row"}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roles && <Badge variant="secondary">Portal</Badge>}
                        {user.active_paid > 0 && <Badge>Paid</Badge>}
                        {!user.roles && user.newsletter_status && <Badge variant="outline">Newsletter</Badge>}
                      </div>
                    </td>
                    <td className="max-w-[220px] px-3 py-3 text-muted-foreground">
                      <p className="truncate">{user.first_resource_slug ? shortLabel(user.first_resource_slug) : user.source ?? "-"}</p>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {formatNumber(user.content_views)} reads · {formatNumber(user.downloads)} downloads · {formatNumber(user.tool_runs)} tool runs
                    </td>
                    <td className="px-3 py-3">
                      <IntentPill score={score} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                      {formatDateTime(user.last_activity_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-2 lg:hidden">
          {visibleUsers.map((user) => {
            const score = intentScore(user);
            return (
              <div key={user.email} className="rounded-xl border border-border/55 bg-background/25 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{user.email}</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">
                      {user.segment ?? "No segment"} · {formatDateTime(user.last_activity_at)}
                    </p>
                  </div>
                  <IntentPill score={score} />
                </div>
                <p className="mt-3 text-[12px] text-muted-foreground">
                  {formatNumber(user.content_views)} reads · {formatNumber(user.downloads)} downloads · {formatNumber(user.tool_runs)} tool runs
                </p>
                <p className="mt-1 truncate text-[12px] text-muted-foreground">
                  Source: {user.first_resource_slug ? shortLabel(user.first_resource_slug) : user.source ?? "-"}
                </p>
              </div>
            );
          })}
        </div>
      </Panel>

    </div>
  );
}

function Definition({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-[12.5px] leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}

function BusinessMetric({
  icon: Icon,
  label,
  value,
  note,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  note: string;
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
      <p className="mt-1 text-[12px] text-muted-foreground">{note}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/25 p-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-[-0.03em]">{formatNumber(value)}</p>
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

function RankedRow({
  index,
  title,
  href,
  primary,
  secondary,
}: {
  index: number;
  title: string;
  href: string;
  primary: string;
  secondary: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/35"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary/60 text-[11px] font-semibold text-muted-foreground">
          {index + 1}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-foreground">{title}</p>
          <p className="mt-0.5 text-[11.5px] text-muted-foreground">{secondary}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-[12px] font-medium text-muted-foreground">
        {primary}
        <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}

function IntentPill({ score }: { score: number }) {
  const label = intentLabel(score);
  const hot = label === "Strong follow-up";
  const warm = label === "Worth watching";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        hot
          ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-200"
          : warm
            ? "border-primary/35 bg-primary/10 text-primary"
            : "border-border/60 bg-secondary/40 text-muted-foreground",
      ].join(" ")}
    >
      {label}
    </span>
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
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
