"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { CreditCard, LogOut, Mail, ShieldCheck, Sparkles, UserCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortalShell } from "@/components/portal/portal-shell";
import type { PortalAccess, PortalRole } from "@/lib/portal-access";

const ROLE_LABEL: Record<PortalRole, string> = {
  free: "Free",
  mudikit: "MudiKit",
  client: "Client",
  admin: "Admin",
};

function tierLine(access: PortalAccess): string {
  if (access.isAdmin) return "Admin access";
  if (access.isMudikit) return "MudiKit access";
  return "Free account";
}

function formatLongDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function AccountContent({
  email,
  displayName: displayNameProp,
  access,
  stripeCustomerId,
  memberSinceIso,
}: {
  email: string;
  displayName?: string;
  access: PortalAccess;
  stripeCustomerId: string | null;
  memberSinceIso: string | null;
}) {
  const { user } = useUser();
  const displayName =
    displayNameProp || user?.firstName || user?.fullName || email.split("@")[0];
  const memberSince = formatLongDate(memberSinceIso);
  const extraRoles = access.roles.filter((r) => r !== "free");

  return (
    <PortalShell access={access} email={email} displayName={displayName}>
    <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <header className="reveal mb-10">
        <p className="mb-4 inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          <ShieldCheck className="size-3" />
          Settings · Account
        </p>
        <h1 className="font-[family-name:var(--font-serif-display)] text-[40px] font-normal leading-[1.04] tracking-tight text-foreground md:text-[52px]">
          Hi, {displayName}.
        </h1>
        <p className="mt-3 max-w-xl text-[14px] leading-7 text-muted-foreground">
          Identity, access tier, and billing — anything that affects what you see in
          the portal. Profile editing lives in the user menu in the topbar.
        </p>
      </header>

      <section className="reveal reveal-delay-1 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.018]">
        <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.01] px-6 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-foreground/80">
            <UserCircle2 className="size-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[13.5px] font-semibold tracking-tight text-foreground">Identity</h2>
            <p className="text-[11.5px] text-muted-foreground">What this account looks like to the portal.</p>
          </div>
        </div>

        <dl className="divide-y divide-white/[0.05] px-6">
          <Row label="Email" value={email} icon={<Mail className="size-3.5" />} />
          <Row label="Access" value={tierLine(access)} />
          {extraRoles.length > 0 && (
            <div className="flex items-center justify-between gap-4 py-4 text-sm">
              <dt className="text-muted-foreground">Roles</dt>
              <dd className="flex flex-wrap justify-end gap-1.5">
                {extraRoles.map((role) => (
                  <Badge
                    key={role}
                    variant="outline"
                    className="rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em]"
                  >
                    {ROLE_LABEL[role]}
                  </Badge>
                ))}
              </dd>
            </div>
          )}
          {memberSince && (
            <Row label="Member since" value={memberSince} />
          )}
        </dl>

        <footer className="flex flex-col gap-3 border-t border-white/[0.06] bg-white/[0.012] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-muted-foreground">
            Manage your name, email, and password in the user menu (top right).
          </p>
          <SignOutButton redirectUrl="/">
            <Button type="button" variant="outline" size="sm">
              <LogOut className="size-3.5" />
              Sign out
            </Button>
          </SignOutButton>
        </footer>
      </section>

      {stripeCustomerId ? (
        <section className="reveal reveal-delay-2 mt-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.018]">
          <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.01] px-6 py-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-400/[0.06] text-amber-200">
              <CreditCard className="size-4" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[13.5px] font-semibold tracking-tight text-foreground">Billing</h2>
              <p className="text-[11.5px] text-muted-foreground">Subscription state on file with Stripe.</p>
            </div>
          </div>
          <dl className="divide-y divide-white/[0.05] px-6">
            <Row label="Subscription" value="MudiKit — Active" />
            <Row label="Customer ID" value={stripeCustomerId} mono />
          </dl>
          <footer className="flex items-center justify-end border-t border-white/[0.06] bg-white/[0.012] px-6 py-4">
            <Button
              render={<Link href="/api/portal/billing" prefetch={false} />}
              nativeButton={false}
              size="sm"
              variant="outline"
            >
              <CreditCard className="size-3.5" />
              Manage in Stripe
            </Button>
          </footer>
        </section>
      ) : (
        <section className="reveal reveal-delay-2 mt-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-[radial-gradient(120%_120%_at_0%_0%,rgba(244,209,140,0.06),transparent_55%),linear-gradient(160deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))]">
          <div className="px-6 py-7">
            <p className="inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              <Sparkles className="size-3" />
              No active subscription
            </p>
            <h2 className="font-[family-name:var(--font-serif-display)] mt-3 text-2xl font-normal leading-tight tracking-tight text-foreground md:text-[28px]">
              You&apos;re on the free portal.
            </h2>
            <p className="mt-2 max-w-md text-[13px] leading-6 text-muted-foreground">
              MudiKit unlocks the paid library — billing controls appear here when a
              subscription is active.
            </p>
            <div className="mt-5">
              <Button render={<Link href="/portal/mudikit" />} nativeButton={false} variant="outline" size="sm">
                See MudiKit
              </Button>
            </div>
          </div>
        </section>
      )}
    </main>
    </PortalShell>
  );
}

function Row({
  label,
  value,
  icon,
  mono,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 text-sm">
      <dt className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd
        className={`min-w-0 truncate text-right text-foreground ${
          mono ? "font-mono text-[12px]" : "font-medium"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
