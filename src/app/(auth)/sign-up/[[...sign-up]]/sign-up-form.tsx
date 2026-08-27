"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { useClerkInputPurpose } from "@/components/auth/use-clerk-input-purpose";
import { SIGNUP_ORIGIN_KEY, trackFunnelEvent, type FunnelLane } from "@/components/acquisition-tracking";
import { NEWSLETTER_CONSENT_STORAGE_KEY } from "@/lib/newsletter-consent";

const CLERK_ELEMENTS = {
  rootBox: "w-full!",
  cardBox: "w-full!",
  card: "bg-white/[0.018] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_60px_-25px_rgba(0,0,0,0.7)] rounded-[12px] w-full! backdrop-blur-md px-6! py-7!",
  logoBox: "hidden!",
  header: "hidden!",
  socialButtonsBlockButton:
    "border border-white/[0.08] bg-transparent hover:bg-white/[0.04] hover:border-white/[0.16] transition-colors duration-200 rounded-[8px] h-10 text-[13px] font-medium text-white",
  socialButtonsBlockButtonText: "text-[13px] font-medium text-white",
  socialButtonsProviderIcon: "w-4 h-4",
  dividerLine: "bg-white/[0.06]",
  dividerText: "text-[10px] uppercase tracking-[0.18em] text-white/35",
  formFieldLabel: "text-[11px] font-medium text-white/55",
  formFieldInput:
    "bg-[#0e0e11] border border-white/[0.07] focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 transition-colors rounded-[8px] h-10 text-[13.5px] text-white placeholder:text-white/30",
  formButtonPrimary:
    "bg-white text-[#0c0c0e] hover:bg-white/95 active:scale-[0.99] transition-[background-color,transform] duration-150 rounded-[8px] h-10 text-[13.5px] font-semibold normal-case tracking-normal",
  footer: "bg-transparent",
  footerActionText: "text-[12px] text-white/40",
  footerActionLink: "text-[12px] text-white font-semibold hover:underline underline-offset-4",
  identityPreviewText: "text-[13.5px] text-white",
  identityPreviewEditButton: "text-[12px] text-white/55 hover:text-white",
  formFieldErrorText: "text-[11.5px] text-red-400/90",
  alertText: "text-[12.5px] text-red-400/90",
} as const;

const HERO = (
  <div className="max-w-[560px]">
    <p className="reveal mb-5 inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-primary">
      <span className="h-px w-8 bg-primary/50" />
      Free account
    </p>
    <h1 className="reveal text-5xl font-black leading-[0.95] tracking-[-0.035em] text-white md:text-[64px]">
      Get the complete <span className="text-primary">skill bundle</span>.
    </h1>
    <p className="reveal reveal-delay-1 mt-7 max-w-[480px] text-[15px] leading-relaxed text-white/65 md:text-[16px]">
      Create a free account to download advanced skill files and see your download history. Public reading and browser tools remain open.
    </p>
  </div>
);

export default function SignUpForm({ redirectUrl = "/portal" }: { redirectUrl?: string }) {
  useClerkInputPurpose("sign-up");
  const { isSignedIn, isLoaded } = useUser();
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const encodedRedirect = encodeURIComponent(redirectUrl);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/account/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});

    if (sessionStorage.getItem("muditek_account_created_tracked") !== "1") {
      sessionStorage.setItem("muditek_account_created_tracked", "1");
      let origin: { asset: string; lane: FunnelLane; placement: string } = {
        asset: "account-signup",
        lane: "ai-implementation",
        placement: "signup-complete",
      };
      try {
        const saved = sessionStorage.getItem(SIGNUP_ORIGIN_KEY);
        if (saved) origin = { ...origin, ...JSON.parse(saved) };
        sessionStorage.removeItem(SIGNUP_ORIGIN_KEY);
      } catch {
        // Use the direct-signup fallback origin.
      }
      trackFunnelEvent("account_created", {
        asset: origin.asset,
        lane: origin.lane,
        placement: origin.placement,
      });
    }
  }, [isSignedIn, isLoaded]);

  function updateNewsletterConsent(checked: boolean) {
    setNewsletterConsent(checked);
    if (checked) sessionStorage.setItem(NEWSLETTER_CONSENT_STORAGE_KEY, "1");
    else sessionStorage.removeItem(NEWSLETTER_CONSENT_STORAGE_KEY);
  }

  return (
    <AuthShell variant="sign-up" hero={HERO}>
      <div className="reveal reveal-delay-2 mb-6 hidden lg:block">
        <p className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-white/60">
          <span className="h-px w-8 bg-white/30" />
          Create account
        </p>
      </div>
      <div className="reveal reveal-delay-3">
        <SignUp
          appearance={{ elements: CLERK_ELEMENTS }}
          signInUrl={`/sign-in?redirect_url=${encodedRedirect}`}
          fallbackRedirectUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
          signInFallbackRedirectUrl={redirectUrl}
          signInForceRedirectUrl={redirectUrl}
        />
      </div>
      <label className="reveal reveal-delay-3 mt-5 flex cursor-pointer items-start gap-3 text-[12px] leading-5 text-white/55">
        <input
          type="checkbox"
          checked={newsletterConsent}
          onChange={(event) => updateNewsletterConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent accent-amber-400"
        />
        <span>Also send me the Muditek newsletter. This is optional and unchecked by default.</span>
      </label>
    </AuthShell>
  );
}
