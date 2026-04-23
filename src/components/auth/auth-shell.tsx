"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { AuthBrandPanel } from "./auth-brand-panel";
import { AuthAlreadyIn } from "./auth-already-in";

export function AuthShell({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "sign-in" | "sign-up";
}) {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="mudikit-dark min-h-[100dvh] bg-[#0a0a0c] text-[#e8e8ec] grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <AuthBrandPanel />
      <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-12 md:px-10 lg:px-16">
        <div className="flex items-center gap-2.5 mb-10 md:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon.svg" alt="" width={32} height={32} aria-hidden="true" />
            <span className="text-sm font-black tracking-[0.2em] uppercase">MUDITEK</span>
          </Link>
        </div>

        {!isLoaded ? (
          <div className="w-full max-w-[420px] h-[420px] rounded-[10px] border border-white/[0.06] bg-[#101014] animate-pulse" />
        ) : isSignedIn ? (
          <AuthAlreadyIn variant={variant} />
        ) : (
          <div className="w-full max-w-[420px]">{children}</div>
        )}
      </main>
    </div>
  );
}
