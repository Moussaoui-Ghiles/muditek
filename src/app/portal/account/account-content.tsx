"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { ArrowRight, ArrowUpRight, CreditCard, LogOut, Mail, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const hasBilling = !!stripeCustomerId;

  return (
    <main className="relative">
      <div className="mx-auto w-full max-w-[1340px] px-6 pb-24 pt-10 md:px-10 md:pt-12 lg:px-14">
        {/* Header strip */}
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.06] pb-7">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
              <ShieldCheck className="size-3" />
              Settings · Account
            </p>
            <h1 className="text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[44px]">
              Hi, {displayName}.
            </h1>
            <p className="mt-2 text-[14px] text-white/45">
              Identity, access, and billing — anything that shapes what you see in the portal.
            </p>
          </div>
        </header>

        {/* HERO REGION — 2.2:1 split (matches home) */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] lg:gap-7">
          {/* Identity */}
          <div className="group relative isolate flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-7 md:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full bg-amber-400/[0.08] blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -bottom-1/2 h-full bg-gradient-to-t from-amber-500/[0.05] via-transparent to-transparent"
            />
            <div className="relative">
              <p className="text-[12.5px] uppercase tracking-[0.18em] text-amber-300/70">
                {tierLine(access)}
              </p>
              <h2 className="mt-3 max-w-[20ch] text-[30px] font-semibold leading-[1.08] tracking-[-0.022em] text-white md:text-[38px]">
                {email}
              </h2>
              <dl className="relative mt-6 divide-y divide-white/[0.05] border-y border-white/[0.05]">
                <Row label="Email" value={email} icon={<Mail className="size-3.5" />} />
                <Row label="Access" value={tierLine(access)} />
                {memberSince && <Row label="Member since" value={memberSince} />}
              </dl>
            </div>

            <div className="relative flex flex-wrap items-center gap-3">
              <SignOutButton redirectUrl="/">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#0a0a0c] transition-all duration-200 hover:gap-3 hover:bg-amber-50"
                >
                  <LogOut className="size-3.5" />
                  Sign out
                </button>
              </SignOutButton>
              <p className="text-[12.5px] text-white/40">
                Edit name, email, and password in the user menu (top right).
              </p>
            </div>
          </div>

          {/* Side aside */}
          <aside className="flex flex-col gap-7 rounded-2xl bg-white/[0.018] p-7">
            <div>
              <h3 className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/40">
                Roles
              </h3>
              {extraRoles.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {extraRoles.map((role) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className="rounded-full border-white/15 bg-white/[0.03] px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.16em] text-white/80"
                    >
                      {ROLE_LABEL[role]}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-[14px] leading-[1.6] text-white/55">
                  Free portal access. MudiKit unlocks the paid library.
                </p>
              )}
            </div>

            <div className="border-t border-white/[0.06] pt-6">
              <h3 className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/40">
                Need a hand
              </h3>
              <a
                href="mailto:biz@ghiless.com?subject=Muditek%20portal%20%E2%80%94%20account%20question"
                className="group mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-amber-300/85 transition-colors hover:text-amber-200"
              >
                Email biz@ghiless.com
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>
          </aside>
        </section>

        {/* BILLING */}
        <section className="mt-14">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-white">Billing</h2>
            <p className="text-[13px] text-white/40">
              {hasBilling ? "Stripe on file" : "No paid subscription"}
            </p>
          </div>

          {hasBilling ? (
            <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.035] via-white/[0.015] to-transparent p-7">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-emerald-400/[0.06] blur-3xl"
                />
                <p className="relative text-[12.5px] uppercase tracking-[0.18em] text-emerald-300/75">
                  MudiKit · Active
                </p>
                <h3 className="relative mt-3 text-[22px] font-semibold leading-[1.15] tracking-[-0.015em] text-white">
                  Subscription is live.
                </h3>
                <dl className="relative mt-6 divide-y divide-white/[0.05] border-y border-white/[0.05]">
                  <Row label="Customer ID" value={stripeCustomerId!} mono />
                </dl>
                <div className="relative mt-6">
                  <Button
                    render={<Link href="/api/portal/billing" prefetch={false} />}
                    nativeButton={false}
                    size="sm"
                    className="rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#0a0a0c] transition-all duration-200 hover:bg-amber-50"
                  >
                    <CreditCard className="size-3.5" />
                    Manage in Stripe
                  </Button>
                </div>
              </div>

              <aside className="self-start rounded-2xl bg-white/[0.018] p-7">
                <h3 className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/40">
                  What MudiKit unlocks
                </h3>
                <ul className="mt-4 space-y-3 text-[14px] leading-[1.55] text-white/75">
                  <li>Paid skills, playbooks, and tools as they drop.</li>
                  <li>Every newsletter issue, archived in the portal.</li>
                  <li>Direct access to systems behind the offers.</li>
                </ul>
                <Link
                  href="/portal/mudikit"
                  className="group mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-amber-300/85 transition-colors hover:text-amber-200"
                >
                  Open MudiKit
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </aside>
            </div>
          ) : (
            <Link
              href="/portal/mudikit"
              className="group relative isolate flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-7 transition-all duration-300 hover:from-white/[0.06] md:flex-row md:items-center md:p-9"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full bg-amber-400/[0.08] blur-3xl"
              />
              <div className="relative max-w-[55ch]">
                <p className="text-[12.5px] uppercase tracking-[0.18em] text-amber-300/70">
                  No active subscription
                </p>
                <h3 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[32px]">
                  You&apos;re on the free portal.
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-white/55">
                  MudiKit unlocks the paid library — skills, playbooks, tools, and newsletter archive.
                  Billing controls appear here when a subscription is active.
                </p>
              </div>
              <span className="relative inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#0a0a0c] transition-all duration-200 group-hover:gap-3 group-hover:bg-amber-50">
                See MudiKit
                <ArrowUpRight className="size-3.5" />
              </span>
            </Link>
          )}
        </section>

        {/* BROWSE — echoes home page footer cluster */}
        <section className="mt-14">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-white">Jump back in</h2>
            <Link
              href="/portal"
              className="group inline-flex items-center gap-1 text-[13px] text-white/50 transition-colors hover:text-white"
            >
              Portal home
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ul className="divide-y divide-white/[0.05]">
            {[
              { href: "/portal/mudikit", title: "MudiKit", meta: access.isMudikit ? "Active" : "Locked" },
              { href: "/portal/newsletter", title: "Newsletter", meta: "Archive" },
              { href: "/portal/playbooks", title: "Playbooks & guides", meta: "Library" },
              { href: "/portal/skills", title: "Skills", meta: "Library" },
              { href: "/portal/tools", title: "Tools", meta: "Library" },
            ].map((row) => (
              <li key={row.href}>
                <Link
                  href={row.href}
                  className="group flex items-center justify-between gap-6 py-4 transition-colors hover:bg-white/[0.018]"
                >
                  <span className="text-[15px] font-medium text-white transition-colors group-hover:text-white">
                    {row.title}
                  </span>
                  <span className="flex items-center gap-2 text-[12.5px] text-white/40">
                    {row.meta}
                    <ArrowRight className="size-3.5 text-white/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-amber-300/85" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
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
      <dt className="flex items-center gap-2 text-white/45">
        {icon}
        {label}
      </dt>
      <dd
        className={`min-w-0 truncate text-right text-white/90 ${
          mono ? "font-mono text-[12px]" : "font-medium"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
