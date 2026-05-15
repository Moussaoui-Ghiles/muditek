"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo/logo";
import { AuthAlreadyIn } from "./auth-already-in";

export function AuthShell({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "sign-in" | "sign-up";
}) {
  const { isSignedIn, isLoaded } = useUser();
  const altHref = variant === "sign-in" ? "/sign-up" : "/sign-in";
  const altLabel = variant === "sign-in" ? "Create account" : "Sign in";

  return (
    <div className="mudikit-dark relative min-h-[100dvh] bg-[#0c0c0e] text-[#e8e8ec] grid md:grid-cols-[1.22fr_1fr]">
      {/* LEFT — treated asset (desktop only) */}
      <aside className="relative hidden md:block overflow-hidden border-r border-white/[0.04]">
        <Image
          src="/images/documents-desk.png"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover"
        />
        {/* darken + fade into form side */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,12,14,0.55) 0%, rgba(12,12,14,0.4) 50%, rgba(12,12,14,0.7) 100%), linear-gradient(90deg, rgba(12,12,14,0.2) 0%, rgba(12,12,14,0.55) 60%, #0c0c0e 100%)",
          }}
        />
        {/* grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 320 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        {/* hairline frame */}
        <div className="pointer-events-none absolute inset-6 lg:inset-10 border border-white/[0.05] rounded-[2px]" />
      </aside>

      {/* RIGHT — form column */}
      <section className="relative flex flex-col min-h-[100dvh]">
        <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10 md:py-7">
          <Link
            href="/"
            aria-label="Muditek home"
            className="reveal inline-flex transition-opacity hover:opacity-80"
          >
            <Logo variant="mark+text" size={26} />
          </Link>
          <Link
            href={altHref}
            className="reveal reveal-delay-1 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-[12px] font-medium text-white/65 transition-all hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white btn-press"
          >
            {altLabel}
            <span aria-hidden className="ml-1.5 inline-block text-white/45">→</span>
          </Link>
        </header>

        <main className="relative z-10 flex flex-1 flex-col justify-center px-6 py-10 md:px-12 lg:px-16 md:py-14">
          {!isLoaded ? (
            <div className="h-[420px] w-full max-w-[420px] animate-pulse rounded-[12px] border border-white/[0.07] bg-white/[0.015]" />
          ) : isSignedIn ? (
            <AuthAlreadyIn variant={variant} />
          ) : (
            <div className="w-full max-w-[420px]">{children}</div>
          )}
        </main>

        <footer className="relative z-10 px-6 py-5 md:px-10 md:py-6">
          <div className="flex items-center justify-between text-[11px] text-white/30">
            <Link
              href="/"
              className="transition-colors hover:text-white/55"
            >
              ← muditek.com
            </Link>
            <span className="font-mono tracking-wide">© Muditek</span>
          </div>
        </footer>
      </section>
    </div>
  );
}
