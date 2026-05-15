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
      <div className="reveal reveal-delay-1 mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] font-semibold text-emerald-300/80">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Signed in
      </div>
      <h1 className="reveal reveal-delay-1 text-4xl font-black tracking-[-0.02em] leading-[1.05] text-white">
        You&apos;re in.
      </h1>
      <p className="reveal reveal-delay-2 mt-3 mb-7 text-[13.5px] leading-relaxed text-white/55">
        Continue to your portal, or sign out to use a different account.
      </p>

      <div className="reveal reveal-delay-3 rounded-[12px] border border-white/10 bg-white/[0.018] p-6 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_60px_-25px_rgba(0,0,0,0.7)]">
        {email && (
          <div className="flex items-center gap-3 rounded-[8px] border border-white/[0.06] bg-[#0e0e11] p-3">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-[13px] font-semibold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-white">{name}</div>
              <div className="truncate text-[11.5px] text-white/45 font-mono">{email}</div>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-2">
          <Link
            href="/portal"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-white text-[13.5px] font-semibold text-[#0c0c0e] transition-all duration-150 hover:bg-white/95 active:scale-[0.99] btn-press"
          >
            Continue to portal
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex h-10 w-full items-center justify-center rounded-[8px] border border-white/[0.08] bg-transparent text-[13.5px] font-medium text-white/65 transition-all duration-150 hover:bg-white/[0.04] hover:text-white active:scale-[0.99] disabled:opacity-50"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}
