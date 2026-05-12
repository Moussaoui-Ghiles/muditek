"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Lock,
  Package,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";
import { PortalShell } from "@/components/portal/portal-shell";

interface MudikitContentProps {
  access: PortalAccess;
  email: string;
  paidItems: ContentItem[];
  stripeCustomerId: string | null;
  displayName: string;
}

type GroupKey = "skills" | "playbooks" | "tools" | "other";

interface Group {
  key: GroupKey;
  label: string;
  blurb: string;
  items: ContentItem[];
}

const GROUP_ORDER: GroupKey[] = ["skills", "playbooks", "tools", "other"];
const GROUP_LABEL: Record<GroupKey, string> = {
  skills: "Skills",
  playbooks: "Playbooks & guides",
  tools: "Tools",
  other: "Other",
};
const GROUP_BLURB: Record<GroupKey, string> = {
  skills: "Claude Code skills you can drop in and run.",
  playbooks: "Step-by-step systems and operating guides.",
  tools: "Calculators, scorecards, and interactive tools.",
  other: "Other paid assets attached to your account.",
};

function classifyCategory(category: string): GroupKey {
  const c = (category || "").toLowerCase().trim();
  if (c === "skill" || c === "skills") return "skills";
  if (c === "playbook" || c === "playbooks" || c === "guide" || c === "guides") return "playbooks";
  if (c === "tool" || c === "tools" || c === "template" || c === "templates") return "tools";
  return "other";
}

function groupItems(items: ContentItem[]): Group[] {
  const buckets: Record<GroupKey, ContentItem[]> = {
    skills: [],
    playbooks: [],
    tools: [],
    other: [],
  };
  for (const item of items) {
    buckets[classifyCategory(item.category)].push(item);
  }
  return GROUP_ORDER
    .map((key) => ({
      key,
      label: GROUP_LABEL[key],
      blurb: GROUP_BLURB[key],
      items: buckets[key],
    }))
    .filter((group) => group.items.length > 0);
}

function itemHref(item: Pick<ContentItem, "slug" | "category">): string {
  const group = classifyCategory(item.category);
  if (group === "skills") return `/portal/skills/${encodeURIComponent(item.slug)}`;
  if (group === "playbooks") return `/portal/playbooks/${encodeURIComponent(item.slug)}`;
  if (group === "tools") return `/portal/tools/${encodeURIComponent(item.slug)}`;
  return `/portal?view=resource&slug=${encodeURIComponent(item.slug)}`;
}

function timeAgo(date: Date | string): string {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(diff / day);
  if (days < 1) return "today";
  if (days < 2) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function countNewSince(items: ContentItem[], days: number): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return items.filter((i) => new Date(i.created_at).getTime() >= cutoff).length;
}

function MudikitHero({
  unlocked,
  total,
  newThisMonth,
  displayName,
  stripeCustomerId,
  email,
}: {
  unlocked: boolean;
  total: number;
  newThisMonth: number;
  displayName: string;
  stripeCustomerId: string | null;
  email: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0f0f12]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(900px 360px at 8% -10%, rgba(245,158,11,0.10), transparent 60%), radial-gradient(720px 320px at 110% 0%, rgba(255,255,255,0.05), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(transparent 31px, rgba(255,255,255,0.6) 32px), linear-gradient(90deg, transparent 31px, rgba(255,255,255,0.6) 32px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-14 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span
              className={
                unlocked
                  ? "relative inline-flex size-1.5 rounded-full bg-emerald-300/90 shadow-[0_0_12px_rgba(110,231,183,0.6)]"
                  : "relative inline-flex size-1.5 rounded-full bg-amber-300/90 shadow-[0_0_12px_rgba(252,211,77,0.55)]"
              }
            >
              <span
                aria-hidden
                className={
                  unlocked
                    ? "absolute inset-0 animate-ping rounded-full bg-emerald-300/70"
                    : "absolute inset-0 animate-ping rounded-full bg-amber-300/60"
                }
              />
            </span>
            {unlocked ? "MudiKit · Active" : "Paid layer · Locked"}
          </div>

          <h1 className="mt-4 max-w-[18ch] text-balance text-[34px] font-semibold leading-[1.02] tracking-[-0.025em] text-foreground sm:text-[44px] md:text-[52px]">
            {unlocked ? (
              <>
                Your MudiKit, <span className="text-white">{displayName}</span>.
              </>
            ) : (
              <>
                The paid library. <span className="text-white/70">One unlock.</span>
              </>
            )}
          </h1>

          <p className="mt-4 max-w-xl text-[14.5px] leading-7 text-muted-foreground">
            {unlocked
              ? "Paid skills, playbooks, and tools attached to your account. New drops continue to land here."
              : "MudiKit unlocks paid skills, playbooks, and tools — plus every new drop. Your free access stays exactly where it is."}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            {unlocked ? (
              stripeCustomerId ? (
                <Button
                  render={<Link href="/api/portal/billing" prefetch={false} />}
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                >
                  <CreditCard className="size-3.5" />
                  Manage billing
                </Button>
              ) : null
            ) : (
              <>
                <Button
                  render={<Link href={`/buy?email=${encodeURIComponent(email)}`} />}
                  nativeButton={false}
                >
                  <ShoppingBag className="size-4" />
                  Unlock MudiKit
                </Button>
                <Button
                  render={<Link href="/mudikit" />}
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                >
                  See the full kit
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] text-foreground sm:grid-cols-3 md:grid-cols-2">
          <Stat label={unlocked ? "Items" : "Locked"} value={total} />
          <Stat label="New · 30d" value={newThisMonth} accent={newThisMonth > 0} />
          <Stat
            label="Cadence"
            value={<span className="text-[13px] font-medium tracking-tight text-foreground">monthly drops</span>}
            small
          />
        </dl>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div className="bg-[#0f0f12] px-5 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <div
        className={
          (small
            ? "mt-2 text-base font-medium tracking-tight"
            : "mt-2 text-[28px] font-semibold leading-none tracking-tight tabular-nums") +
          (accent ? " text-amber-200/95" : " text-foreground")
        }
      >
        {value}
      </div>
    </div>
  );
}

function SpotlightTile({ item }: { item: ContentItem }) {
  const created = new Date(item.created_at);
  return (
    <Link
      href={itemHref(item)}
      className="group relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-[#121215] p-7 transition-colors hover:border-white/[0.16] hover:bg-[#15151a]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.05] blur-3xl transition-opacity duration-500 group-hover:opacity-80"
      />
      <div className="relative flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          <Sparkles className="size-3.5 text-amber-200/80" /> Latest drop
        </div>
        {item.is_new && (
          <span className="rounded-full border border-amber-200/30 bg-amber-200/[0.07] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-100/90">
            New
          </span>
        )}
      </div>
      <div className="relative">
        <h2 className="text-balance text-[28px] font-semibold leading-[1.08] tracking-[-0.02em] text-foreground transition-colors group-hover:text-white sm:text-[32px]">
          {item.title}
        </h2>
        {item.description && (
          <p className="mt-3 line-clamp-2 max-w-prose text-[14px] leading-6 text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
      <div className="relative mt-8 flex items-center justify-between gap-2 text-[12px] text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="font-medium uppercase tracking-[0.16em] text-foreground/80">
            {GROUP_LABEL[classifyCategory(item.category)]}
          </span>
          <span aria-hidden className="text-muted-foreground/60">·</span>
          <span className="tabular-nums">{timeAgo(created)}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground/85 transition-colors group-hover:text-white">
          Open
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

function ActivityRail({ items }: { items: ContentItem[] }) {
  if (items.length === 0) return null;
  const shown = items.slice(0, 6);
  return (
    <aside className="relative flex h-full flex-col rounded-3xl border border-white/[0.08] bg-[#0f0f12]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          <span className="relative inline-flex size-1.5 rounded-full bg-foreground/60">
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-foreground/40" />
          </span>
          Recent activity
        </div>
        <span className="text-[10.5px] tabular-nums text-muted-foreground">{items.length}</span>
      </div>
      <ol className="flex-1 divide-y divide-white/[0.05]">
        {shown.map((item, idx) => (
          <li key={item.id}>
            <Link
              href={itemHref(item)}
              className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.025]"
            >
              <span className="inline-flex w-6 shrink-0 justify-center text-[10.5px] tabular-nums text-muted-foreground">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-medium text-foreground group-hover:text-white">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-[11.5px] text-muted-foreground">
                  {GROUP_LABEL[classifyCategory(item.category)]} · {timeAgo(item.created_at)}
                </span>
              </span>
              {item.is_new ? (
                <span className="rounded-full bg-amber-200/[0.08] px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-amber-100/85">
                  new
                </span>
              ) : (
                <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              )}
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function GroupColumn({
  group,
  unlocked,
}: {
  group: Group;
  unlocked: boolean;
}) {
  const preview = group.items.slice(0, 4);
  const remaining = group.items.length - preview.length;
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/[0.07] bg-[#0f0f12] p-6">
      <header className="flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
            {group.label}
          </h3>
          <p className="mt-1 text-[12.5px] leading-5 text-muted-foreground">{group.blurb}</p>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
          {group.items.length.toString().padStart(2, "0")}
        </span>
      </header>
      <ul className="mt-5 flex-1 space-y-3">
        {preview.map((item) => (
          <li key={item.id}>
            {unlocked ? (
              <Link
                href={itemHref(item)}
                className="group flex items-center gap-3 -mx-2 rounded-md px-2 py-1.5 transition-colors hover:bg-white/[0.035]"
              >
                <span className="inline-flex size-1.5 shrink-0 rounded-full bg-foreground/40 transition-colors group-hover:bg-foreground" />
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground/90 group-hover:text-white">
                  {item.title}
                </span>
                {item.is_new && (
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-amber-100/80">
                    new
                  </span>
                )}
                <ArrowUpRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            ) : (
              <div className="flex items-center gap-3 -mx-2 rounded-md px-2 py-1.5">
                <Lock className="size-3 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground/80">
                  {item.title}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <p className="mt-5 text-[11.5px] uppercase tracking-[0.18em] text-muted-foreground">
          + {remaining} more in {group.label.toLowerCase()}
        </p>
      )}
    </article>
  );
}

function FreePointersStrip() {
  const items = [
    {
      title: "Skills",
      body: "Free Claude Code skills.",
      href: "/portal/skills",
    },
    {
      title: "Playbooks & guides",
      body: "Free systems on your account.",
      href: "/portal/playbooks",
    },
    {
      title: "Tools",
      body: "Calculators and scorecards.",
      href: "/portal/tools",
    },
    {
      title: "Newsletter",
      body: "Past issues, free.",
      href: "/portal/newsletter",
    },
  ];
  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
      <header className="border-b border-white/[0.05] px-5 py-3">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Free access stays open
        </p>
      </header>
      <div className="grid divide-y divide-white/[0.05] sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.035]"
          >
            <span className="min-w-0">
              <span className="block text-[13px] font-medium text-foreground">{item.title}</span>
              <span className="block text-[11.5px] text-muted-foreground">{item.body}</span>
            </span>
            <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function UnlockBlock({ email }: { email: string }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0f0f12]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(700px 320px at 100% 100%, rgba(245,158,11,0.10), transparent 60%)",
        }}
      />
      <div className="relative grid gap-8 px-7 py-8 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div className="min-w-0">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-amber-100/90">
            Unlock
          </p>
          <h3 className="mt-2 text-balance text-[22px] font-semibold leading-tight tracking-tight text-foreground sm:text-[26px]">
            One unlock. Every paid drop, every refinement.
          </h3>
          <ul className="mt-5 space-y-2 text-[13.5px] text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground/70" />
              Paid skills, playbooks, and tools added over time
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground/70" />
              Free access on this account stays exactly as it is
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground/70" />
              Cancel anytime — keep everything already downloaded
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2.5">
          <Button
            render={<Link href={`/buy?email=${encodeURIComponent(email)}`} />}
            nativeButton={false}
            size="lg"
            className="h-11 w-full justify-center px-4"
          >
            <ShoppingBag className="size-4" />
            Unlock MudiKit
            <ArrowUpRight className="size-4" />
          </Button>
          <Button
            render={<Link href="/mudikit" />}
            nativeButton={false}
            variant="outline"
            className="h-10 w-full justify-center"
          >
            See pricing &amp; details
          </Button>
          <p className="mt-1 text-center text-[11px] text-muted-foreground">
            Price and full inventory live on /mudikit
          </p>
        </div>
      </div>
    </section>
  );
}

export default function MudikitContent({
  access,
  email,
  paidItems,
  stripeCustomerId,
  displayName,
}: MudikitContentProps) {
  const unlocked = access.isMudikit;
  const total = paidItems.length;
  const newThisMonth = useMemo(() => countNewSince(paidItems, 30), [paidItems]);
  const groups = useMemo(() => groupItems(paidItems), [paidItems]);
  const spotlight = paidItems[0] ?? null;
  const activityItems = paidItems.slice(1);

  return (
    <PortalShell access={access} email={email} displayName={displayName}>
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <MudikitHero
          unlocked={unlocked}
          total={total}
          newThisMonth={newThisMonth}
          displayName={displayName}
          stripeCustomerId={stripeCustomerId}
          email={email}
        />

        {total === 0 ? (
          <section className="rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.015] p-10 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
              <Package className="size-5" />
            </div>
            <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
              No paid items in the library right now
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-6 text-muted-foreground">
              {unlocked
                ? "Your access is active. Paid items appear here as soon as they ship."
                : "The paid library will appear here once items are published."}
            </p>
          </section>
        ) : (
          <>
            {spotlight && (
              <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
                <SpotlightTile item={spotlight} />
                {activityItems.length > 0 ? (
                  <ActivityRail items={activityItems} />
                ) : (
                  <div className="flex h-full min-h-[280px] flex-col justify-between rounded-3xl border border-dashed border-white/[0.09] bg-white/[0.015] p-7">
                    <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Recent activity
                    </div>
                    <p className="text-[13px] leading-6 text-muted-foreground">
                      Only one item in the library so far. The next drop will land here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {groups.length > 0 && (
              <section>
                <header className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Inventory
                    </p>
                    <h3 className="mt-1 text-[18px] font-semibold tracking-tight text-foreground">
                      {unlocked ? "Your kit, grouped" : "What MudiKit unlocks"}
                    </h3>
                  </div>
                </header>
                <div
                  className={
                    groups.length === 1
                      ? "grid gap-4"
                      : groups.length === 2
                        ? "grid gap-4 md:grid-cols-2"
                        : "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                  }
                >
                  {groups.map((group) => (
                    <GroupColumn key={group.key} group={group} unlocked={unlocked} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {!unlocked && <UnlockBlock email={email} />}

        <FreePointersStrip />
      </main>
    </PortalShell>
  );
}
