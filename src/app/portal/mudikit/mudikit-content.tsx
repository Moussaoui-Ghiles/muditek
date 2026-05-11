"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Lock,
  Package,
  Sparkles,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";

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
  items: ContentItem[];
}

const GROUP_ORDER: GroupKey[] = ["skills", "playbooks", "tools", "other"];
const GROUP_LABEL: Record<GroupKey, string> = {
  skills: "Skills",
  playbooks: "Playbooks & guides",
  tools: "Tools",
  other: "Other",
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
    .map((key) => ({ key, label: GROUP_LABEL[key], items: buckets[key] }))
    .filter((group) => group.items.length > 0);
}

function itemHref(item: Pick<ContentItem, "slug" | "category">): string {
  if (classifyCategory(item.category) === "skills") {
    return `/portal/skills/${encodeURIComponent(item.slug)}`;
  }
  return `/portal?view=resource&slug=${encodeURIComponent(item.slug)}`;
}

function itemKind(item: ContentItem): string {
  if (item.file_type) return item.file_type.toUpperCase();
  return GROUP_LABEL[classifyCategory(item.category)];
}

function PortalHeader({ email, title }: { email: string; title: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.07] bg-background/92 px-4 backdrop-blur md:px-6">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Portal
      </Link>
      <div className="flex flex-1 items-center justify-center gap-2">
        <Logo variant="mark" size={22} />
        <span className="text-[13px] font-semibold tracking-tight">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden truncate text-[11px] text-muted-foreground sm:inline">{email}</span>
        <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
      </div>
    </header>
  );
}

function PaidGroup({ group }: { group: Group }) {
  return (
    <section className="mb-10 last:mb-0">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {group.label}
        </h2>
        <span className="text-[11px] text-muted-foreground">
          {group.items.length}
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.015]">
        {group.items.map((item) => (
          <Link
            key={item.id}
            href={itemHref(item)}
            className="group grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/[0.06] px-4 py-3.5 last:border-b-0 transition-colors hover:bg-white/[0.03]"
          >
            <span className="flex size-9 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.035] text-muted-foreground">
              {item.thumbnail_url ? (
                <img src={item.thumbnail_url} alt="" className="h-full w-full rounded-md object-cover" loading="lazy" />
              ) : (
                <Package className="size-4" />
              )}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="truncate text-[14px] font-medium text-foreground">
                  {item.title}
                </span>
                {item.is_new && (
                  <Badge className="h-4 rounded-md px-1.5 text-[10px]">New</Badge>
                )}
              </span>
              {item.description && (
                <span className="mt-0.5 line-clamp-1 text-[12.5px] leading-5 text-muted-foreground">
                  {item.description}
                </span>
              )}
            </span>
            <span className="flex items-center gap-2">
              {item.file_type && (
                <Badge variant="outline" className="hidden h-5 rounded-md text-[10px] uppercase tracking-[0.1em] sm:inline-flex">
                  {itemKind(item)}
                </Badge>
              )}
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LockedGroup({ group, total }: { group: Group; total: number }) {
  const preview = group.items.slice(0, 6);
  return (
    <section className="mb-8 last:mb-0">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {group.label}
        </h2>
        <span className="text-[11px] text-muted-foreground">
          {group.items.length} locked
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.015]">
        {preview.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/[0.06] px-4 py-3 last:border-b-0"
          >
            <span className="flex size-9 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.025] text-muted-foreground">
              <Lock className="size-3.5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-medium text-foreground/85">
                {item.title}
              </span>
              {item.description && (
                <span className="mt-0.5 line-clamp-1 text-[12px] leading-5 text-muted-foreground">
                  {item.description}
                </span>
              )}
            </span>
            <span className="flex items-center gap-2">
              {item.file_type && (
                <Badge variant="outline" className="hidden h-5 rounded-md text-[10px] uppercase tracking-[0.1em] sm:inline-flex">
                  {itemKind(item)}
                </Badge>
              )}
            </span>
          </div>
        ))}
        {group.items.length > preview.length && (
          <div className="border-t border-white/[0.06] bg-white/[0.012] px-4 py-2 text-[11.5px] text-muted-foreground">
            + {group.items.length - preview.length} more in {group.label.toLowerCase()}
          </div>
        )}
      </div>
      <p className="sr-only">
        {group.items.length} of {total} locked items.
      </p>
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
  const groups = useMemo(() => groupItems(paidItems), [paidItems]);
  const total = paidItems.length;
  const newCount = useMemo(() => paidItems.filter((i) => i.is_new).length, [paidItems]);

  if (!access.isMudikit) {
    return (
      <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
        <PortalHeader email={email} title="MudiKit" />
        <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
          <div className="mb-10">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Upgrade
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">
              MudiKit unlocks the paid library
            </h1>
            <p className="mt-2 max-w-xl text-[14px] leading-6 text-muted-foreground">
              MudiKit unlocks paid skills, playbooks, and tools, plus every new drop. Your free
              access stays unchanged.
            </p>
          </div>

          {total === 0 ? (
            <div className="rounded-lg border border-dashed border-white/[0.1] bg-white/[0.015] p-6">
              <div className="mb-3 flex size-9 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
                <Sparkles className="size-4" />
              </div>
              <h2 className="text-sm font-medium text-foreground">No paid items published yet</h2>
              <p className="mt-1 max-w-lg text-[13px] leading-6 text-muted-foreground">
                MudiKit is set up on your account, but no paid items are in the library at this
                time. New drops appear here when published.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <Lock className="size-3.5" /> Locked items
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    {total}
                  </div>
                  <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                    Real paid items in the library right now.
                  </p>
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <Sparkles className="size-3.5" /> Recent drops
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    {newCount}
                  </div>
                  <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                    Items flagged as new in the current library.
                  </p>
                </div>
              </div>

              {groups.map((group) => (
                <LockedGroup key={group.key} group={group} total={total} />
              ))}
            </>
          )}

          <div className="mt-10 rounded-lg border border-white/[0.1] bg-white/[0.025] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-foreground">
                  Unlock MudiKit
                </div>
                <p className="mt-1 max-w-md text-[12.5px] leading-5 text-muted-foreground">
                  Paid skills, playbooks, and tools attached to this account. New drops
                  added over time.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button render={<Link href="/mudikit" />} nativeButton={false} variant="outline">
                  What&rsquo;s inside
                </Button>
                <Button render={<Link href={`/buy?email=${encodeURIComponent(email)}`} />} nativeButton={false}>
                  Unlock MudiKit
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Free access stays open
            </p>
            <div className="mt-3 grid gap-2">
              <Link
                href="/portal/skills"
                className="group flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.04]"
              >
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-medium text-foreground">Skills</span>
                  <span className="block text-[12px] leading-5 text-muted-foreground">
                    Free skills stay accessible.
                  </span>
                </span>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
              <Link
                href="/portal/playbooks"
                className="group flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.04]"
              >
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-medium text-foreground">Playbooks &amp; guides</span>
                  <span className="block text-[12px] leading-5 text-muted-foreground">
                    Free playbooks and guides on your account.
                  </span>
                </span>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
              <Link
                href="/portal/tools"
                className="group flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.04]"
              >
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-medium text-foreground">Tools</span>
                  <span className="block text-[12px] leading-5 text-muted-foreground">
                    Free portal tools attached to your account.
                  </span>
                </span>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
              <Link
                href="/portal/newsletter"
                className="group flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.04]"
              >
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-medium text-foreground">Newsletter</span>
                  <span className="block text-[12px] leading-5 text-muted-foreground">
                    Past issues, free.
                  </span>
                </span>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      <PortalHeader email={email} title="MudiKit" />
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <CheckCircle2 className="size-3.5" /> MudiKit active
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">
              Your MudiKit, {displayName}
            </h1>
            <p className="mt-2 max-w-xl text-[14px] leading-6 text-muted-foreground">
              Paid skills, playbooks, and tools attached to {email}.
            </p>
          </div>
          {stripeCustomerId && (
            <Button
              render={<Link href="/api/portal/billing" prefetch={false} />}
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              <CreditCard className="size-3.5" />
              Manage billing
            </Button>
          )}
        </div>

        {total === 0 ? (
          <div className="rounded-lg border border-dashed border-white/[0.1] bg-white/[0.015] p-6">
            <div className="mb-3 flex size-9 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
              <Sparkles className="size-4" />
            </div>
            <h2 className="text-sm font-medium text-foreground">No paid items published yet</h2>
            <p className="mt-1 max-w-lg text-[13px] leading-6 text-muted-foreground">
              Your access is active. Paid items appear here when published. Free content stays
              available in the library.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button render={<Link href="/portal" />} nativeButton={false} variant="outline">
                Back to portal
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <Package className="size-3.5" /> Items
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{total}</div>
                <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                  Paid items attached to this account.
                </p>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <Sparkles className="size-3.5" /> New
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{newCount}</div>
                <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                  Recent drops flagged as new.
                </p>
              </div>
            </div>

            {groups.map((group) => (
              <PaidGroup key={group.key} group={group} />
            ))}
          </>
        )}
      </main>
    </div>
  );
}
