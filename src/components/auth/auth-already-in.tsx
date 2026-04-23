"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function AuthAlreadyIn({ variant }: { variant: "sign-in" | "sign-up" }) {
  const { user } = useUser();
  const clerk = useClerk();
  const [signingOut, setSigningOut] = useState(false);

  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const name = user?.firstName || email.split("@")[0] || "there";

  async function signOut() {
    setSigningOut(true);
    try {
      await clerk.signOut({ redirectUrl: variant === "sign-in" ? "/sign-in" : "/sign-up" });
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-8 flex items-center gap-2.5 md:hidden">
        <Image src="/icon.svg" alt="" width={28} height={28} aria-hidden="true" />
        <span className="text-sm font-black tracking-[0.2em] uppercase text-white">MUDITEK</span>
      </div>

      <div className="rounded-[10px] border border-white/[0.06] bg-[#101014] p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] font-black text-emerald-300/80 mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Signed in
        </div>
        <h1 className="text-[22px] font-semibold tracking-tight text-white">
          Welcome back, {name}.
        </h1>
        <p className="mt-1.5 text-[13px] text-white/50">
          You&apos;re already authenticated. Jump straight in or sign out to use a different account.
        </p>

        {email && (
          <div className="mt-6 flex items-center gap-3 rounded-[6px] border border-white/[0.06] bg-[#0a0a0c] p-3">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt=""
                width={32}
                height={32}
                className="rounded-full border border-white/[0.08]"
                unoptimized
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-white/[0.08] flex items-center justify-center text-[13px] font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-white truncate">{name}</div>
              <div className="text-[11px] text-white/50 truncate font-mono">{email}</div>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-2">
          <Link
            href="/portal"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-[6px] bg-[#e8e8ec] text-[14px] font-semibold text-[#0a0a0c] hover:bg-white active:scale-[0.99] transition-all duration-150"
          >
            Go to portal
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex h-10 w-full items-center justify-center rounded-[6px] border border-white/[0.08] bg-transparent text-[14px] font-semibold text-white/70 hover:text-white hover:bg-white/[0.03] active:scale-[0.99] transition-all duration-150 disabled:opacity-50"
          >
            {signingOut ? "Signing out…" : `Sign out${variant === "sign-up" ? " to create a new account" : ""}`}
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 text-[11px] text-white/40 font-mono uppercase tracking-[0.2em]">
        <Link href="/admin" className="hover:text-white/70 transition-colors">Admin</Link>
        <span className="text-white/20">·</span>
        <Link href="/newsletter" className="hover:text-white/70 transition-colors">Newsletter</Link>
        <span className="text-white/20">·</span>
        <Link href="/resources" className="hover:text-white/70 transition-colors">Resources</Link>
      </div>
    </div>
  );
}
