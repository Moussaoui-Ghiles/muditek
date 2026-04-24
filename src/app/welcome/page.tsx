"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo/logo";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/portal"), 3000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="min-h-[100dvh] bg-[#0a0a0c] text-[#e8e8ec] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <Link href="/" aria-label="Muditek home">
            <Logo variant="mark+text" size={28} />
          </Link>
        </div>

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-black text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          You're in
        </div>

        <h1 className="text-3xl font-black tracking-[-0.02em] mb-4">Payment confirmed.</h1>
        <p className="text-[#a0a0a6] text-base leading-relaxed mb-8">
          Opening your portal now. Receipt in your inbox.
        </p>

        <Link
          href="/portal"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-[6px] bg-[#e8e8ec] text-[#0a0a0c] font-semibold text-sm hover:bg-white active:scale-[0.99] transition-all duration-150"
        >
          Go to portal now
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
