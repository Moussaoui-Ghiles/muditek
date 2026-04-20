"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  CalendarClock,
  ArrowUpRight,
  Newspaper,
  Flame,
  Snowflake,
  Sparkles,
  TrendingUp,
  Mail,
  Megaphone,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Stats {
  kpis: {
    activeSubscribers: number;
    mrr: number;
    totalLeads: number;
    leadsThisWeek: number;
    emailsThisWeek: number;
  };
  funnel: {
    commenters: number;
    submissions: number;
    verified: number;
    delivered: number;
    subscribed: number;
  };
  alerts: {
    verifiedUndelivered: number;
    overdueNurture: number;
    expiringSoon: number;
  };
  topCampaigns: Array<{
    id: string;
    title: string;
    keyword: string;
    is_active: boolean;
    submissions: number;
    verified: number;
    delivered: number;
  }>;
  newsletter: {
    total: number;
    hot: number;
    warm: number;
    cold: number;
    unsegmented: number;
    newThisWeek: number;
    lastIssue: {
      id: string;
      subject: string;
      slug: string;
      status: string;
      sentAt: string | null;
      scheduledAt: string | null;
      stats: { opens?: number; clicks?: number; sent?: number } | null;
    } | null;
  };
}

export default function DashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!stats) return <ErrorState />;

  const { kpis, funnel, alerts, topCampaigns, newsletter } = stats;

  const actionItems = [
    alerts.verifiedUndelivered > 0 && {
      count: alerts.verifiedUndelivered,
      label: "verified leads waiting on email",
      href: "/admin/leads?status=undelivered",
      icon: AlertTriangle,
      tone: "warn" as const,
    },
    alerts.overdueNurture > 0 && {
      count: alerts.overdueNurture,
      label: "overdue nurture sends",
      href: "/admin/nurture",
      icon: Clock,
      tone: "warn" as const,
    },
    alerts.expiringSoon > 0 && {
      count: alerts.expiringSoon,
      label: "campaigns expiring in 3 days",
      href: "/admin/campaigns",
      icon: CalendarClock,
      tone: "cool" as const,
    },
  ].filter(Boolean) as Array<{
    count: number;
    label: string;
    href: string;
    icon: typeof AlertTriangle;
    tone: "warn" | "cool";
  }>;

  return (
    <div className="space-y-6">
      <AttentionBar items={actionItems} />

      {/* Row 1: Newsletter (wide) + MRR (narrow) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NewsletterCard n={newsletter} />
        </div>
        <RevenueCard
          mrr={kpis.mrr}
          active={kpis.activeSubscribers}
          leadsWeek={kpis.leadsThisWeek}
        />
      </div>

      {/* Row 2: Emails this week + Funnel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <ActivityCard
          emails={kpis.emailsThisWeek}
          leads={kpis.totalLeads}
          leadsWeek={kpis.leadsThisWeek}
        />
        <div className="lg:col-span-3">
          <FunnelCard funnel={funnel} />
        </div>
      </div>

      {/* Row 3: Campaigns */}
      <CampaignsCard campaigns={topCampaigns} />
    </div>
  );
}

/* ------------------------------- attention ------------------------------- */

function AttentionBar({
  items,
}: {
  items: Array<{
    count: number;
    label: string;
    href: string;
    icon: typeof AlertTriangle;
    tone: "warn" | "cool";
  }>;
}) {
  if (items.length === 0) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-secondary/30 px-4 py-3">
        <span className="relative flex size-2 items-center justify-center text-[var(--color-live)]">
          <span className="size-2 rounded-full bg-current" />
          <span className="pulse-dot" />
        </span>
        <p className="text-[13px] text-muted-foreground">
          Pipeline is clean. Nothing needs you right now.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const toneColor =
          item.tone === "warn" ? "var(--color-warn)" : "var(--color-cool)";
        const toneBg =
          item.tone === "warn" ? "var(--color-warn-dim)" : "var(--color-cool-dim)";
        return (
          <Link
            key={item.label}
            href={item.href}
            className="group relative flex items-start gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 transition-all hover:border-border hover:bg-secondary/40"
          >
            <div
              className="flex size-7 shrink-0 items-center justify-center rounded-md"
              style={{ background: toneBg, color: toneColor }}
            >
              <item.icon className="size-3.5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium leading-tight">
                <span className="tnum">{item.count}</span>{" "}
                <span className="font-normal text-muted-foreground">
                  {item.label}
                </span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">
                Resolve <ArrowUpRight className="size-3" />
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ------------------------------- newsletter ------------------------------- */

function NewsletterCard({ n }: { n: Stats["newsletter"] }) {
  const total = n.total;
  const segments = [
    {
      key: "hot",
      label: "Hot",
      count: n.hot,
      color: "var(--color-warn)",
      bg: "var(--color-warn-dim)",
      Icon: Flame,
    },
    {
      key: "warm",
      label: "Warm",
      count: n.warm,
      color: "var(--color-cool)",
      bg: "var(--color-cool-dim)",
      Icon: Sparkles,
    },
    {
      key: "cold",
      label: "Cold",
      count: n.cold,
      color: "#8a8a90",
      bg: "rgba(138, 138, 144, 0.12)",
      Icon: Snowflake,
    },
  ];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card hairline transition-colors hover:border-border">
      <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Newspaper className="size-3.5" strokeWidth={1.75} />
            <span className="uppercase tracking-[0.12em] font-medium">Newsletter</span>
          </div>
          <p className="mt-2 text-[32px] font-semibold tracking-[-0.02em] tnum leading-none">
            {total.toLocaleString()}
          </p>
          <p className="mt-1.5 text-[12px] text-muted-foreground">
            active subscribers
            {n.newThisWeek > 0 && (
              <span className="ml-1.5 text-foreground">
                <span className="tnum">+{n.newThisWeek}</span> this week
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/newsletter"
          className="flex size-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-all hover:border-border hover:text-foreground hover:bg-secondary/60"
        >
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {/* Segmented bar */}
      <div className="px-6">
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          {segments.map((s) => {
            const pct = total > 0 ? (s.count / total) * 100 : 0;
            return (
              <div
                key={s.key}
                className="h-full transition-all"
                style={{ width: `${pct}%`, background: s.color }}
              />
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border/60 mt-4 border-t border-border/60">
        {segments.map((s) => {
          const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
          return (
            <div key={s.key} className="px-5 py-3.5">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <s.Icon className="size-3" strokeWidth={2} style={{ color: s.color }} />
                <span className="text-[11px] uppercase tracking-[0.08em] font-medium">
                  {s.label}
                </span>
              </div>
              <p className="mt-1.5 text-[18px] font-semibold tnum leading-none">
                {s.count.toLocaleString()}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground tnum">{pct}%</p>
            </div>
          );
        })}
      </div>

      {/* Last issue */}
      {n.lastIssue ? (
        <Link
          href={`/admin/newsletter/${n.lastIssue.id}`}
          className="flex items-center gap-3 border-t border-border/60 px-6 py-3 transition-colors hover:bg-secondary/40"
        >
          <Badge
            variant="outline"
            className="h-5 px-1.5 text-[9px] uppercase tracking-[0.08em] font-medium"
          >
            {n.lastIssue.status}
          </Badge>
          <span className="flex-1 truncate text-[12px]">{n.lastIssue.subject}</span>
          {n.lastIssue.stats?.sent ? (
            <span className="shrink-0 text-[11px] tnum text-muted-foreground">
              {n.lastIssue.stats.sent.toLocaleString()} sent
            </span>
          ) : null}
          <ArrowUpRight className="size-3 text-muted-foreground" />
        </Link>
      ) : (
        <div className="border-t border-border/60 px-6 py-3">
          <Link
            href="/admin/newsletter"
            className="group/cta inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            No issues drafted yet.
            <span className="underline underline-offset-2 text-foreground">
              Write the first one
            </span>
            <ArrowUpRight className="size-3 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- revenue ------------------------------- */

function RevenueCard({
  mrr,
  active,
  leadsWeek,
}: {
  mrr: number;
  active: number;
  leadsWeek: number;
}) {
  const hasRevenue = active > 0;
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card px-6 py-5 hairline">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <TrendingUp className="size-3.5" strokeWidth={1.75} />
        <span className="uppercase tracking-[0.12em] font-medium">Revenue</span>
      </div>

      <div>
        <p className="text-[32px] font-semibold tracking-[-0.02em] tnum leading-none">
          ${mrr.toLocaleString()}
        </p>
        <p className="mt-1.5 text-[12px] text-muted-foreground">
          {hasRevenue ? (
            <>
              <span className="tnum">{active}</span> paying at <span className="tnum">$47</span>/mo
            </>
          ) : (
            "No paying customers yet"
          )}
        </p>
      </div>

      {!hasRevenue ? (
        <div className="mt-auto space-y-2.5">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Pipeline to monetize:
          </p>
          <div className="space-y-1.5 text-[12px]">
            <Row label="Newsletter list" value="ready" tone="live" />
            <Row label="$47/mo offer" value="live" tone="live" />
            <Row
              label="Leads captured"
              value={leadsWeek > 0 ? `+${leadsWeek} wk` : "waiting"}
              tone={leadsWeek > 0 ? "live" : "muted"}
            />
          </div>
          <Link
            href="/buy"
            className="mt-2 inline-flex w-full items-center justify-between rounded-md border border-border/60 bg-secondary/40 px-3 py-2 text-[12px] font-medium transition-colors hover:bg-secondary hover:border-border"
          >
            Open /buy
            <ArrowUpRight className="size-3.5 text-muted-foreground" />
          </Link>
        </div>
      ) : (
        <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
          <Stat label="Active" value={active.toString()} />
          <Stat label="ARR" value={`$${(mrr * 12).toLocaleString()}`} />
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "live" | "muted";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className="flex items-center gap-1.5 font-medium"
        style={{ color: tone === "live" ? "var(--color-live)" : "var(--color-dim)" }}
      >
        <span className="size-1 rounded-full bg-current" />
        {value}
      </span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-[15px] font-semibold tnum">{value}</p>
    </div>
  );
}

/* ------------------------------- activity ------------------------------- */

function ActivityCard({
  emails,
  leads,
  leadsWeek,
}: {
  emails: number;
  leads: number;
  leadsWeek: number;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card px-6 py-5 lg:col-span-2 hairline">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Mail className="size-3.5" strokeWidth={1.75} />
        <span className="uppercase tracking-[0.12em] font-medium">7-day activity</span>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <p className="text-[28px] font-semibold tracking-[-0.02em] tnum leading-none">
            {emails.toLocaleString()}
          </p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            emails sent (deliveries + nurture)
          </p>
        </div>
        <div className="border-l border-border/60 pl-5">
          <p className="text-[28px] font-semibold tracking-[-0.02em] tnum leading-none">
            {leadsWeek.toLocaleString()}
          </p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            new leads
            {leads > 0 && (
              <span className="block">
                <span className="tnum">{leads.toLocaleString()}</span> total
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- funnel ------------------------------- */

function FunnelCard({ funnel }: { funnel: Stats["funnel"] }) {
  const steps = [
    { label: "Commenters", value: funnel.commenters, hint: "LinkedIn scrape" },
    { label: "Submissions", value: funnel.submissions, hint: "Form capture" },
    { label: "Verified", value: funnel.verified, hint: "Keyword matched" },
    { label: "Delivered", value: funnel.delivered, hint: "Resource sent" },
    { label: "Subscribed", value: funnel.subscribed, hint: "Paying on Stripe" },
  ];
  const max = Math.max(...steps.map((s) => s.value), 1);
  const hasData = steps.some((s) => s.value > 0);

  return (
    <div className="rounded-2xl border border-border/60 bg-card px-6 py-5 hairline">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Users className="size-3.5" strokeWidth={1.75} />
            <span className="uppercase tracking-[0.12em] font-medium">Lead funnel</span>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            LinkedIn comment → paying subscriber
          </p>
        </div>
      </div>
      {!hasData ? (
        <EmptyFunnel />
      ) : (
        <div className="space-y-2">
          {steps.map((step, i) => {
            const prev = i > 0 ? steps[i - 1].value : step.value;
            const stepPct = prev > 0 ? Math.round((step.value / prev) * 100) : 0;
            return (
              <div key={step.label} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <p className="text-[12px] font-medium leading-tight">{step.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {step.hint}
                  </p>
                </div>
                <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-secondary/40">
                  <div
                    className="h-full bg-foreground/70 transition-all"
                    style={{ width: `${(step.value / max) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-2.5 text-[12px] font-medium tnum">
                    {step.value.toLocaleString()}
                  </span>
                </div>
                <span className="w-10 shrink-0 text-right text-[11px] text-muted-foreground tnum">
                  {i === 0 ? "—" : `${stepPct}%`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyFunnel() {
  return (
    <div className="rounded-lg border border-dashed border-border/60 bg-secondary/20 px-5 py-8 text-center">
      <p className="text-[13px] font-medium">No LinkedIn leads captured yet.</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Create a campaign to start collecting commenters.
      </p>
      <Link
        href="/admin/campaigns"
        className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-secondary/60"
      >
        New campaign <ArrowUpRight className="size-3" />
      </Link>
    </div>
  );
}

/* ------------------------------- campaigns ------------------------------- */

function CampaignsCard({ campaigns }: { campaigns: Stats["topCampaigns"] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card hairline">
      <div className="flex items-end justify-between gap-3 px-6 pt-5 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Megaphone className="size-3.5" strokeWidth={1.75} />
            <span className="uppercase tracking-[0.12em] font-medium">
              Top campaigns
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Ranked by submissions · delivery rate shown
          </p>
        </div>
        <Link
          href="/admin/campaigns"
          className="shrink-0 text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          All campaigns
        </Link>
      </div>
      {campaigns.length === 0 ? (
        <EmptyCampaigns />
      ) : (
        <ul className="border-t border-border/60 divide-y divide-border/60">
          {campaigns.map((c, i) => {
            const deliveryRate =
              c.submissions > 0 ? Math.round((c.delivered / c.submissions) * 100) : 0;
            return (
              <li key={c.id}>
                <Link
                  href={`/admin/${c.id}`}
                  className="group flex items-center gap-4 px-6 py-3 transition-colors hover:bg-secondary/40"
                >
                  <span className="w-5 text-[11px] font-medium text-muted-foreground tnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-medium">
                        {c.title}
                      </span>
                      <Badge
                        variant="outline"
                        className="h-4 px-1 font-mono text-[9px] font-medium"
                      >
                        {c.keyword}
                      </Badge>
                      {!c.is_active && (
                        <Badge variant="secondary" className="h-4 px-1 text-[9px]">
                          Paused
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="hidden shrink-0 items-center gap-5 text-[11px] sm:flex">
                    <Metric label="subs" value={c.submissions} />
                    <Metric label="sent" value={c.delivered} />
                    <Metric label="rate" value={`${deliveryRate}%`} />
                  </div>
                  <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function EmptyCampaigns() {
  return (
    <div className="border-t border-border/60 px-6 py-6 text-center">
      <p className="text-[12px] text-muted-foreground">
        No campaigns with submissions yet.
      </p>
      <Link
        href="/admin/campaigns"
        className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground underline-offset-2 hover:underline"
      >
        Create a campaign <ArrowUpRight className="size-3" />
      </Link>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="text-right">
      <p className="font-medium tnum text-foreground">{value}</p>
      <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

/* ------------------------------- loading + error ------------------------------- */

function LoadingState() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 rounded-xl" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-52 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-52 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Skeleton className="h-36 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-36 rounded-2xl lg:col-span-3" />
      </div>
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card px-6 py-10 text-center">
      <p className="text-[13px] font-medium">Couldn't load stats.</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Refresh the page, or check /api/admin/stats in the network tab.
      </p>
    </div>
  );
}

