"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  CreditCard,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PortalAccess } from "@/lib/portal-access";

interface NewsletterAccountState {
  status: string;
  source: string;
  topics: string[];
  subscribedAtIso: string | null;
  unsubscribedAtIso: string | null;
}

interface ResourceUnlock {
  slug: string;
  title: string | null;
  category: string | null;
  createdAtIso: string | null;
  lastSeenAtIso: string | null;
}

function accessLine(access: PortalAccess): string {
  if (access.isAdmin) return "Admin";
  if (access.isMudikit) return "MudiKit";
  return "Included";
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function sentenceCase(value: string): string {
  if (!value) return "";
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function Row({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex items-center justify-between gap-5 border-t border-white/[0.06] py-4">
      <dt className="text-[11px] font-black uppercase tracking-[0.22em] text-foreground/45">
        {label}
      </dt>
      <dd className="min-w-0 truncate text-right text-[13.5px] font-semibold text-foreground">
        {href ? (
          <Link
            href={href}
            className="underline decoration-white/20 underline-offset-4 hover:decoration-white/70"
          >
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function StatusPill({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  tone?: "neutral" | "good" | "warn";
}) {
  return (
    <div
      className={
        "rounded-[2px] border px-4 py-3 " +
        (tone === "good"
          ? "border-emerald-400/20 bg-emerald-500/10"
          : tone === "warn"
            ? "border-primary/25 bg-primary/10"
            : "border-white/[0.08] bg-white/[0.025]")
      }
    >
      <div className="truncate font-mono text-[20px] font-semibold leading-none tracking-[-0.02em] text-foreground">
        {value}
      </div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/45">
        {label}
      </div>
    </div>
  );
}

function Panel({
  icon,
  eyebrow,
  title,
  body,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.38] p-6 backdrop-blur-md md:p-7">
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-primary/5 blur-[60px]" />
      <div className="relative flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[2px] border border-white/[0.1] bg-white/[0.035] text-primary">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-[22px] font-black leading-[1] tracking-[-0.02em] text-foreground">
            {title}
          </h2>
          <p className="mt-3 text-[13.5px] leading-6 text-foreground/60">{body}</p>
        </div>
      </div>
      {children && <div className="relative mt-6">{children}</div>}
    </section>
  );
}

function EmptyResourceHistory() {
  return (
    <div className="rounded-[2px] border border-dashed border-white/[0.1] bg-white/[0.015] p-5 text-[13px] leading-6 text-foreground/55">
      No resource unlocks are attached to this account yet.
    </div>
  );
}

function ResourceHistory({ unlocks }: { unlocks: ResourceUnlock[] }) {
  if (unlocks.length === 0) return <EmptyResourceHistory />;

  return (
    <ol className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
      {unlocks.map((unlock) => {
        const href = `/r/${encodeURIComponent(unlock.slug)}`;
        const date = formatDate(unlock.lastSeenAtIso || unlock.createdAtIso);
        return (
          <li key={unlock.slug}>
            <Link
              href={href}
              className="group flex items-center gap-4 py-3.5 transition-colors hover:bg-white/[0.018]"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[2px] border border-white/[0.08] bg-white/[0.03] text-primary">
                <BookOpen className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold text-foreground">
                  {unlock.title || sentenceCase(unlock.slug)}
                </span>
                <span className="mt-0.5 block truncate text-[11.5px] text-foreground/45">
                  {unlock.category ? sentenceCase(unlock.category) : "Resource"}
                  {date ? ` · ${date}` : ""}
                </span>
              </span>
              <ArrowRight className="size-3.5 shrink-0 text-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export default function AccountContent({
  email,
  displayName: displayNameProp,
  access,
  roles,
  stripeCustomerId,
  subscriptionStatus,
  currentPeriodEndIso,
  memberSinceIso,
  preferencesHref,
  newsletter,
  resourceUnlockCount,
  resourceUnlocks,
}: {
  email: string;
  displayName?: string;
  access: PortalAccess;
  roles: string[];
  stripeCustomerId: string | null;
  subscriptionStatus: string | null;
  currentPeriodEndIso: string | null;
  memberSinceIso: string | null;
  preferencesHref: string | null;
  newsletter: NewsletterAccountState | null;
  resourceUnlockCount: number;
  resourceUnlocks: ResourceUnlock[];
}) {
  const { user } = useUser();
  const displayName = displayNameProp || user?.firstName || user?.fullName || email.split("@")[0];
  const memberSince = formatDate(memberSinceIso);
  const renewalDate = formatDate(currentPeriodEndIso);
  const newsletterStatus = newsletter?.unsubscribedAtIso
    ? "Unsubscribed"
    : newsletter?.status
      ? sentenceCase(newsletter.status)
      : "Active";
  const roleList = roles.length > 0 ? roles.map(sentenceCase).join(", ") : accessLine(access);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <header className="mb-8 border-b border-white/[0.06] pb-8">
        <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
          <span aria-hidden className="h-px w-6 bg-primary/50" />
          Account
        </p>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-[38px] font-black leading-[0.95] tracking-[-0.035em] text-foreground md:text-[58px]">
              {displayName}
            </h1>
            <p className="mt-4 max-w-xl text-[14.5px] leading-7 text-foreground/60">
              Access, billing, newsletter settings, and the resources this account has unlocked.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:w-[390px]">
            <StatusPill
              label="Access"
              value={accessLine(access)}
              tone={access.isMudikit ? "good" : "neutral"}
            />
            <StatusPill label="Resources" value={resourceUnlockCount} />
            <StatusPill
              label="Newsletter"
              value={newsletterStatus}
              tone={newsletterStatus === "Active" ? "good" : "warn"}
            />
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          icon={<UserRound className="size-4" />}
          eyebrow="Identity"
          title="Portal profile"
          body="This is the account currently linked to the portal, newsletter, and unlock tracking."
        >
          <dl>
            <Row label="Email" value={email} />
            <Row label="Access" value={accessLine(access)} />
            <Row label="Roles" value={roleList} />
            {memberSince && <Row label="Member since" value={memberSince} />}
          </dl>
        </Panel>

        <Panel
          icon={<CreditCard className="size-4" />}
          eyebrow="Billing"
          title={access.isMudikit ? "MudiKit active" : "No active subscription"}
          body={
            access.isMudikit
              ? "Stripe manages subscription changes, invoices, and card details when this account has a Stripe customer."
              : "MudiKit billing appears here after checkout."
          }
        >
          <dl className="mb-5">
            <Row
              label="Status"
              value={subscriptionStatus ? sentenceCase(subscriptionStatus) : access.isMudikit ? "Active" : "None"}
            />
            {renewalDate && <Row label="Renews" value={renewalDate} />}
          </dl>
          {access.isMudikit && stripeCustomerId ? (
            <Button
              render={<Link href="/api/portal/billing" prefetch={false} />}
              nativeButton={false}
            >
              <CreditCard className="size-4" />
              Manage billing
            </Button>
          ) : access.isMudikit ? (
            <p className="text-[12.5px] leading-6 text-foreground/55">
              Billing management is unavailable because this account has MudiKit access without a linked Stripe customer.
            </p>
          ) : (
            <Button render={<Link href="/portal/mudikit" />} nativeButton={false}>
              View MudiKit
              <ArrowUpRight className="size-4" />
            </Button>
          )}
        </Panel>

        <Panel
          icon={<Mail className="size-4" />}
          eyebrow="Newsletter"
          title="Email preferences"
          body="Manage topics, unsubscribe, or resubscribe from your preference center."
        >
          <dl className="mb-5">
            <Row label="Status" value={newsletterStatus} />
            {newsletter?.source && <Row label="Source" value={newsletter.source} />}
            {newsletter?.topics?.length ? (
              <Row label="Topics" value={newsletter.topics.map(sentenceCase).join(", ")} />
            ) : null}
            {newsletter?.subscribedAtIso && <Row label="Since" value={formatDate(newsletter.subscribedAtIso)} />}
          </dl>
          {preferencesHref ? (
            <Button render={<Link href={preferencesHref} />} nativeButton={false} variant="outline">
              Manage preferences
            </Button>
          ) : (
            <p className="text-[12.5px] leading-6 text-foreground/55">
              Preference link is not available yet. Open the newsletter archive and try again.
            </p>
          )}
        </Panel>

        <Panel
          icon={<BookOpen className="size-4" />}
          eyebrow="Unlock history"
          title="Resources opened from shared links"
          body="Tracked from `/r/slug` links after signup or sign-in. These are real account events, not suggested resources."
        >
          <ResourceHistory unlocks={resourceUnlocks} />
          <div className="mt-5 flex flex-wrap gap-2">
            <Button render={<Link href="/portal/playbooks" />} nativeButton={false} variant="outline">
              Browse resources
              <ArrowUpRight className="size-4" />
            </Button>
            <Button render={<Link href="/portal/skills" />} nativeButton={false} variant="outline">
              Browse skills
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </Panel>

        <Panel
          icon={<ShieldCheck className="size-4" />}
          eyebrow="Session"
          title="Account actions"
          body="Profile controls live in the sidebar user menu. Sign out returns you to the public site."
        >
          <div className="flex flex-wrap gap-2">
            <Button render={<Link href="/portal" />} nativeButton={false} variant="outline">
              <CheckCircle2 className="size-4" />
              Back to portal
            </Button>
            <SignOutButton redirectUrl="/">
              <Button type="button" variant="outline">
                <LogOut className="size-4" />
                Sign out
              </Button>
            </SignOutButton>
          </div>
        </Panel>
      </div>
    </main>
  );
}
