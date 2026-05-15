"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
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
    <div className="mudikit-dark relative min-h-[100dvh] bg-[#0a0a0c] text-[#e8e8ec] flex flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px] opacity-95"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 0%, rgba(255,255,255,0.045) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 320 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10 md:py-7">
        <Link
          href="/"
          aria-label="Muditek home"
          className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Image src="/icon.svg" alt="" width={26} height={26} aria-hidden />
          <span className="text-[12px] font-black tracking-[0.22em] uppercase text-white">
            Muditek
          </span>
        </Link>
        <Link
          href={altHref}
          className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-[12px] font-medium text-white/65 transition-all hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white"
        >
          {altLabel}
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-10 md:py-14">
        {!isLoaded ? (
          <div className="h-[360px] w-full max-w-[400px] animate-pulse rounded-[12px] border border-white/[0.06] bg-white/[0.015]" />
        ) : isSignedIn ? (
          <AuthAlreadyIn variant={variant} />
        ) : (
          <div className="w-full max-w-[400px]">{children}</div>
        )}
      </main>

      <footer className="relative z-10 px-6 py-6 md:px-10">
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
    </div>
  );
}
