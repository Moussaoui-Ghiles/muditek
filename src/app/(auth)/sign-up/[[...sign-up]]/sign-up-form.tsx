"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { DataCitation } from "@/components/data-citation";
import { DATA_POINTS } from "@/lib/data-points";

const CLERK_ELEMENTS = {
  rootBox: "w-full!",
  cardBox: "w-full!",
  card: "bg-white/[0.018] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_60px_-25px_rgba(0,0,0,0.7)] rounded-[12px] w-full! backdrop-blur-md px-6! py-7!",
  logoBox: "hidden!",
  header: "hidden!",
  socialButtonsBlockButton:
    "border border-white/[0.08] bg-transparent hover:bg-white/[0.04] hover:border-white/[0.16] transition-all duration-200 rounded-[8px] h-10 text-[13px] font-medium text-white",
  socialButtonsBlockButtonText: "text-[13px] font-medium text-white",
  socialButtonsProviderIcon: "w-4 h-4",
  dividerLine: "bg-white/[0.06]",
  dividerText: "text-[10px] uppercase tracking-[0.18em] text-white/35",
  formFieldLabel: "text-[11px] font-medium text-white/55",
  formFieldInput:
    "bg-[#0e0e11] border border-white/[0.07] focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 transition-colors rounded-[8px] h-10 text-[13.5px] text-white placeholder:text-white/30",
  formButtonPrimary:
    "bg-white text-[#0c0c0e] hover:bg-white/95 active:scale-[0.99] transition-all duration-150 rounded-[8px] h-10 text-[13.5px] font-semibold normal-case tracking-normal",
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
      Join{" "}
      <span className="text-primary">Muditek</span>.
    </h1>
    <p className="reveal reveal-delay-1 mt-7 max-w-[480px] text-[15px] leading-relaxed text-white/65 md:text-[16px]">
      Free portal access. One deployable AI system in your inbox every week.
    </p>
    <p className="reveal reveal-delay-2 mt-8 text-[13px] text-white/55">
      <DataCitation
        claim="Read by 5,000+ B2B operators"
        source={DATA_POINTS.newsletterSubscribers.source}
        n={DATA_POINTS.newsletterSubscribers.n}
      />
    </p>
  </div>
);

export default function SignUpForm({ redirectUrl = "/portal" }: { redirectUrl?: string }) {
  const { isSignedIn, isLoaded } = useUser();
  const encodedRedirect = encodeURIComponent(redirectUrl);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/account/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  }, [isSignedIn, isLoaded]);

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
      <p className="reveal reveal-delay-3 mt-5 text-[11.5px] leading-relaxed text-white/35">
        Subscribes you to the newsletter. Unsubscribe anytime.
      </p>
    </AuthShell>
  );
}
