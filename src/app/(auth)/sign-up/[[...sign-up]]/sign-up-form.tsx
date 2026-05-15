"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { AuthShell } from "@/components/auth/auth-shell";

const CLERK_ELEMENTS = {
  rootBox: "w-full!",
  cardBox: "w-full!",
  card: "bg-white/[0.018] border border-white/[0.06] shadow-[0_20px_60px_-25px_rgba(0,0,0,0.7)] rounded-[12px] w-full! backdrop-blur-[2px] px-6! py-7!",
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
    "bg-[#0e0e11] border border-white/[0.07] focus:border-white/[0.22] focus:ring-1 focus:ring-white/10 transition-colors rounded-[8px] h-10 text-[13.5px] text-white placeholder:text-white/30",
  formButtonPrimary:
    "bg-white text-[#0a0a0c] hover:bg-white/95 active:scale-[0.99] transition-all duration-150 rounded-[8px] h-10 text-[13.5px] font-semibold normal-case tracking-normal",
  footer: "bg-transparent",
  footerActionText: "text-[12px] text-white/40",
  footerActionLink: "text-[12px] text-white font-semibold hover:underline underline-offset-4",
  identityPreviewText: "text-[13.5px] text-white",
  identityPreviewEditButton: "text-[12px] text-white/55 hover:text-white",
  formFieldErrorText: "text-[11.5px] text-red-400/90",
  alertText: "text-[12.5px] text-red-400/90",
} as const;

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
    <AuthShell variant="sign-up">
      <h1 className="mb-7 text-center text-[20px] font-semibold tracking-[-0.01em] text-white">
        Create your Muditek account
      </h1>
      <SignUp
        appearance={{ elements: CLERK_ELEMENTS }}
        signInUrl={`/sign-in?redirect_url=${encodedRedirect}`}
        fallbackRedirectUrl={redirectUrl}
        forceRedirectUrl={redirectUrl}
        signInFallbackRedirectUrl={redirectUrl}
        signInForceRedirectUrl={redirectUrl}
      />
      <p className="mt-6 text-center text-[11.5px] leading-relaxed text-white/35">
        Free. Includes the weekly newsletter — unsubscribe anytime.
      </p>
    </AuthShell>
  );
}
