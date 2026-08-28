"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/client-analytics";

export function ResourceUnlockActions({
  slug,
  createHref,
  signInHref,
}: {
  slug: string;
  createHref: string;
  signInHref: string;
}) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link
        href={createHref}
        onClick={() => trackEvent("resource_unlock_signup_click", { resource_slug: slug })}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-foreground px-6 text-sm font-black uppercase tracking-[0.16em] text-background transition-transform hover:scale-[1.02]"
      >
        Create account
        <ArrowRight className="size-4" strokeWidth={2} />
      </Link>
      <Link
        href={signInHref}
        onClick={() => trackEvent("resource_unlock_signin_click", { resource_slug: slug })}
        className="inline-flex h-12 items-center justify-center rounded-[4px] border border-white/[0.1] px-6 text-sm font-black uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:border-white/[0.22] hover:text-foreground"
      >
        Sign in
      </Link>
    </div>
  );
}
