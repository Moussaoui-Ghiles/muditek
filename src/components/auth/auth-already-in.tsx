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
    <div className="w-full max-w-[400px]">
      <h1 className="mb-7 text-center text-[20px] font-semibold tracking-[-0.01em] text-white">
        You&apos;re signed in
      </h1>

      <div className="rounded-[12px] border border-white/[0.06] bg-white/[0.018] p-7 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.7)]">
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
            className="flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-white text-[13.5px] font-semibold text-[#0a0a0c] transition-all duration-150 hover:bg-white/95 active:scale-[0.99]"
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
