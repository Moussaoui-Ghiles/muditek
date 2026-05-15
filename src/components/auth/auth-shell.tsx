"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "@/components/logo/logo";
import { AuthAlreadyIn } from "./auth-already-in";

export function AuthShell({
  children,
  variant,
  hero,
}: {
  children: React.ReactNode;
  variant: "sign-in" | "sign-up";
  hero: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useUser();
  const altHref = variant === "sign-in" ? "/sign-up" : "/sign-in";
  const altLabel = variant === "sign-in" ? "Create account" : "Sign in";

  return (
    <div className="mudikit-dark relative flex min-h-[100dvh] flex-col bg-[#0c0c0e] text-[#e8e8ec]">
      {/* faint grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* top-right amber radial / single accent moment */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-[520px] w-[520px] opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, rgba(245,158,11,0.10) 0%, transparent 70%)",
        }}
      />
      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.022] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 320 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 md:py-7">
        <Link
          href="/"
          aria-label="Muditek home"
          className="reveal inline-flex transition-opacity hover:opacity-80"
        >
          <Logo variant="mark+text" size={26} />
        </Link>
        <Link
          href={altHref}
          className="reveal reveal-delay-1 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-[12px] font-medium text-white/65 transition-all hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white btn-press"
        >
          {altLabel}
          <span aria-hidden className="text-white/45">→</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1">
        <div className="mx-auto grid w-full max-w-[1320px] gap-x-16 gap-y-14 px-6 pb-14 pt-6 md:px-12 md:pt-10 md:pb-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-x-24">
          {/* LEFT / typography hero */}
          <section className="flex flex-col justify-center">
            {!isLoaded || !isSignedIn ? hero : null}
          </section>

          {/* RIGHT / form */}
          <section className="flex flex-col justify-center">
            {!isLoaded ? (
              <div className="h-[420px] w-full max-w-[440px] animate-pulse rounded-[12px] border border-white/[0.07] bg-white/[0.015]" />
            ) : isSignedIn ? (
              <AuthAlreadyIn variant={variant} />
            ) : (
              <div className="w-full max-w-[440px]">{children}</div>
            )}
          </section>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.05] px-6 py-5 md:px-12">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between text-[11px] text-white/35">
          <Link
            href="/"
            className="transition-colors hover:text-white/65"
          >
            ← muditek.com
          </Link>
          <div className="flex items-center gap-5 font-mono tracking-wide">
            <Link href="/newsletter" className="transition-colors hover:text-white/65">
              Newsletter
            </Link>
            <Link href="/about" className="transition-colors hover:text-white/65">
              About
            </Link>
            <span>© Muditek</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
