"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { ScrollReveal } from "@/components/scroll-reveal";
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

function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:translate-x-1">
      <path
        d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
    <div className="relative w-full overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-amber-500/[0.06] rounded-full blur-[140px]"
      />
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <main className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-32 pt-20 md:px-12">
        {/* HERO */}
        <header className="mb-24">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-amber-400 mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-amber-400/50" />
              Account
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.9] text-foreground text-balance max-w-4xl drop-shadow-2xl">
              Hi, {displayName}.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-400/40 italic font-medium">
                Your portal.
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-base md:text-lg text-foreground/70 leading-relaxed">
              Identity, access, billing. Everything that controls what you see in the portal.
              Profile edits live in the user menu, top right.
            </p>
          </ScrollReveal>
        </header>

        {/* TWO CARDS — IDENTITY + BILLING */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* IDENTITY */}
          <ScrollReveal delay={100}>
            <div className="group relative h-full min-h-[480px] border border-white/[0.08] bg-card/[0.4] hover:bg-card/[0.6] backdrop-blur-md p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 card-lift">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/0 to-transparent group-hover:via-amber-400/70 transition-all duration-[1.2s]" />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-amber-400/[0.05] rounded-full blur-[80px] group-hover:bg-amber-400/[0.12] transition-colors" />

              <div className="relative z-10">
                <div className="text-sm font-semibold text-amber-400 mb-6 tracking-wider uppercase">
                  Identity
                </div>
                <h4 className="text-3xl md:text-4xl font-black tracking-[-0.02em] text-foreground mb-8 group-hover:text-amber-400 transition-colors">
                  Who the portal sees.
                </h4>

                <dl className="divide-y divide-white/[0.06]">
                  <Row label="Email" value={email} />
                  <Row label="Access" value={tierLine(access)} />
                  {extraRoles.length > 0 && (
                    <div className="flex items-center justify-between gap-4 py-5">
                      <dt className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/50">
                        Roles
                      </dt>
                      <dd className="flex flex-wrap justify-end gap-1.5">
                        {extraRoles.map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/[0.06] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200"
                          >
                            {ROLE_LABEL[role]}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {memberSince && <Row label="Member since" value={memberSince} />}
                </dl>
              </div>

              <div className="relative z-10 pt-6 border-t border-white/[0.08] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/45">
                  Profile in topbar menu
                </p>
                <SignOutButton redirectUrl="/">
                  <button
                    type="button"
                    className="btn-press inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.15em] text-foreground/80 hover:text-amber-400 transition-colors"
                  >
                    Sign out
                    <Arrow />
                  </button>
                </SignOutButton>
              </div>
            </div>
          </ScrollReveal>

          {/* BILLING */}
          <ScrollReveal delay={200}>
            {hasBilling ? (
              <div className="group relative h-full min-h-[480px] border border-white/[0.08] bg-card/[0.4] hover:bg-card/[0.6] backdrop-blur-md p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 card-lift">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/0 to-transparent group-hover:via-emerald-400/70 transition-all duration-[1.2s]" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-400/[0.05] rounded-full blur-[80px] group-hover:bg-emerald-400/[0.12] transition-colors" />

                <div className="relative z-10">
                  <div className="text-sm font-semibold text-emerald-400 mb-6 tracking-wider uppercase">
                    Billing
                  </div>
                  <h4 className="text-3xl md:text-4xl font-black tracking-[-0.02em] text-foreground mb-8 group-hover:text-emerald-400 transition-colors">
                    Subscription on file.
                  </h4>

                  <dl className="divide-y divide-white/[0.06]">
                    <Row label="Subscription" value="MudiKit — Active" emphasis />
                    <Row label="Customer ID" value={stripeCustomerId!} mono />
                  </dl>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/[0.08] flex items-center justify-between gap-4">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-foreground/45">
                    Managed by Stripe
                  </span>
                  <Link
                    href="/api/portal/billing"
                    prefetch={false}
                    className="btn-press inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.15em] text-foreground group-hover:text-emerald-400 transition-colors"
                  >
                    Manage in Stripe
                    <Arrow />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="group relative h-full min-h-[480px] border border-white/[0.08] bg-card/[0.4] hover:bg-card/[0.6] backdrop-blur-md p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 card-lift">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-400/0 to-transparent group-hover:via-sky-400/70 transition-all duration-[1.2s]" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-sky-400/[0.05] rounded-full blur-[80px] group-hover:bg-sky-400/[0.12] transition-colors" />

                <div className="relative z-10">
                  <div className="text-sm font-semibold text-sky-400 mb-6 tracking-wider uppercase">
                    No subscription
                  </div>
                  <h4 className="text-3xl md:text-4xl font-black tracking-[-0.02em] text-foreground mb-6 group-hover:text-sky-400 transition-colors">
                    You&apos;re on the free portal.
                  </h4>
                  <p className="text-base text-foreground/75 leading-relaxed max-w-md">
                    MudiKit unlocks the paid library — playbooks, skills, tools, and templates
                    we use to run Muditek. Billing controls appear here when a subscription is active.
                  </p>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/[0.08] flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs uppercase tracking-[0.18em] text-foreground/50">
                      Membership
                    </span>
                    <span className="text-sky-400 text-2xl font-black tracking-tight">
                      $47<span className="text-foreground/40 text-sm font-bold">/mo</span>
                    </span>
                  </div>
                  <Link
                    href="/portal/mudikit"
                    className="btn-press inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.15em] text-foreground group-hover:text-sky-400 transition-colors"
                  >
                    See MudiKit
                    <Arrow />
                  </Link>
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>

        {/* SHORTCUTS — echo home page proof block layout */}
        <ScrollReveal delay={300}>
          <section className="mt-24 border-t border-white/[0.05] pt-16">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6">
              <div>
                <h2 className="text-sm font-black tracking-[0.3em] uppercase text-amber-400 mb-5 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-amber-400/50" />
                  Shortcuts
                </h2>
                <h3 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[0.95] text-foreground text-balance max-w-2xl">
                  Jump back into the <span className="text-amber-400 italic font-medium">library.</span>
                </h3>
              </div>
              <Link
                href="/portal"
                className="btn-press group inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] text-foreground/70 hover:text-amber-400 transition-colors"
              >
                Portal home
                <Arrow />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <ShortcutCard
                href={access.isMudikit ? "/portal/mudikit" : "/portal/mudikit"}
                eyebrow={access.isMudikit ? "Active" : "Locked"}
                title="MudiKit"
                hint={access.isMudikit ? "Paid library access" : "Upgrade to unlock"}
                accent="amber"
              />
              <ShortcutCard
                href="/portal/newsletter"
                eyebrow="Archive"
                title="Newsletter"
                hint="Every past issue"
                accent="emerald"
              />
              <ShortcutCard
                href="/portal/playbooks"
                eyebrow="Library"
                title="Playbooks & guides"
                hint="How we ship"
                accent="sky"
              />
              <ShortcutCard
                href="/portal/skills"
                eyebrow="Library"
                title="Skills"
                hint="Claude Code skills"
                accent="amber"
              />
              <ShortcutCard
                href="/portal/tools"
                eyebrow="Library"
                title="Tools"
                hint="Scripts & utilities"
                accent="emerald"
              />
              <ShortcutCard
                href="mailto:biz@ghiless.com?subject=Muditek%20portal%20%E2%80%94%20account%20question"
                eyebrow="Support"
                title="Email Ghiles"
                hint="biz@ghiless.com"
                accent="sky"
                external
              />
            </div>
          </section>
        </ScrollReveal>
      </main>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  emphasis,
}: {
  label: string;
  value: string;
  mono?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <dt className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/50">
        {label}
      </dt>
      <dd
        className={`min-w-0 truncate text-right ${
          mono
            ? "font-mono text-[12px] text-foreground/80"
            : emphasis
              ? "text-base font-black text-foreground"
              : "text-sm font-bold text-foreground"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

const ACCENT: Record<string, { text: string; barFrom: string; glow: string; ring: string }> = {
  amber: {
    text: "group-hover:text-amber-400",
    barFrom: "group-hover:via-amber-400/70",
    glow: "group-hover:bg-amber-400/[0.12]",
    ring: "text-amber-400",
  },
  emerald: {
    text: "group-hover:text-emerald-400",
    barFrom: "group-hover:via-emerald-400/70",
    glow: "group-hover:bg-emerald-400/[0.12]",
    ring: "text-emerald-400",
  },
  sky: {
    text: "group-hover:text-sky-400",
    barFrom: "group-hover:via-sky-400/70",
    glow: "group-hover:bg-sky-400/[0.12]",
    ring: "text-sky-400",
  },
};

function ShortcutCard({
  href,
  eyebrow,
  title,
  hint,
  accent,
  external,
}: {
  href: string;
  eyebrow: string;
  title: string;
  hint: string;
  accent: "amber" | "emerald" | "sky";
  external?: boolean;
}) {
  const a = ACCENT[accent];
  const cls =
    "group relative h-[180px] border border-white/[0.08] bg-card/[0.35] hover:bg-card/[0.55] backdrop-blur-md p-7 flex flex-col justify-between overflow-hidden transition-all duration-700 card-lift";

  const inner = (
    <>
      <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-transparent to-transparent ${a.barFrom} transition-all duration-[1.2s]`} />
      <div className={`absolute -bottom-10 -right-10 w-48 h-48 bg-white/[0.02] rounded-full blur-[60px] transition-colors ${a.glow}`} />

      <div className="relative z-10 flex items-center justify-between">
        <span className={`text-[10px] font-black uppercase tracking-[0.22em] ${a.ring}`}>
          {eyebrow}
        </span>
        <span className={`text-foreground/40 ${a.text} transition-colors`}>
          <Arrow />
        </span>
      </div>

      <div className="relative z-10">
        <div className={`text-xl font-black tracking-[-0.01em] text-foreground ${a.text} transition-colors`}>
          {title}
        </div>
        <div className="mt-1.5 text-[11.5px] uppercase tracking-[0.18em] text-foreground/50">
          {hint}
        </div>
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
