"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { ArrowUpRight, CreditCard, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PortalAccess } from "@/lib/portal-access";

function accessLine(access: PortalAccess): string {
  if (access.isAdmin) return "Admin";
  if (access.isMudikit) return "MudiKit";
  return "Included";
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-5 border-t border-white/[0.06] py-4">
      <dt className="text-[11px] font-black uppercase tracking-[0.22em] text-foreground/45">
        {label}
      </dt>
      <dd className="min-w-0 truncate text-right text-[13.5px] font-semibold text-foreground">
        {value}
      </dd>
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
    <section className="card-lift relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.38] p-6 backdrop-blur-md md:p-7">
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

export default function AccountContent({
  email,
  displayName: displayNameProp,
  access,
  stripeCustomerId,
  memberSinceIso,
  preferencesHref,
}: {
  email: string;
  displayName?: string;
  access: PortalAccess;
  stripeCustomerId: string | null;
  memberSinceIso: string | null;
  preferencesHref: string | null;
}) {
  const { user } = useUser();
  const displayName = displayNameProp || user?.firstName || user?.fullName || email.split("@")[0];
  const memberSince = formatDate(memberSinceIso);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <header className="mb-10 border-b border-white/[0.06] pb-8">
        <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
          <span aria-hidden className="h-px w-6 bg-primary/50" />
          Account
        </p>
        <h1 className="mt-5 text-[38px] font-black leading-[0.95] tracking-[-0.035em] text-foreground md:text-[58px]">
          {displayName}
        </h1>
        <p className="mt-4 max-w-xl text-[14.5px] leading-7 text-foreground/60">
          The basics that control access, billing, newsletter preferences, and sign out.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          icon={<UserRound className="size-4" />}
          eyebrow="Identity"
          title="Portal profile"
          body="Profile photo and name are managed from the user menu in the sidebar."
        >
          <dl>
            <Row label="Email" value={email} />
            <Row label="Access" value={accessLine(access)} />
            {memberSince && <Row label="Member since" value={memberSince} />}
          </dl>
        </Panel>

        <Panel
          icon={<CreditCard className="size-4" />}
          eyebrow="Billing"
          title={access.isMudikit ? "MudiKit active" : "No active subscription"}
          body={
            access.isMudikit
              ? "Stripe manages subscription changes, invoices, and card details."
              : "MudiKit billing appears here after checkout."
          }
        >
          {access.isMudikit && stripeCustomerId ? (
            <Button
              render={<Link href="/api/portal/billing" prefetch={false} />}
              nativeButton={false}
            >
              <CreditCard className="size-4" />
              Manage billing
            </Button>
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
          icon={<ShieldCheck className="size-4" />}
          eyebrow="Session"
          title="Account actions"
          body="Use Clerk for profile controls. Sign out returns you to the public site."
        >
          <SignOutButton redirectUrl="/">
            <Button type="button" variant="outline">
              <LogOut className="size-4" />
              Sign out
            </Button>
          </SignOutButton>
        </Panel>
      </div>
    </main>
  );
}
