"use client";

import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";

const CLERK_ELEMENTS = {
  rootBox: "w-full!",
  cardBox: "w-full!",
  card: "bg-white/[0.018] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_60px_-25px_rgba(0,0,0,0.7)] rounded-[12px] w-full! backdrop-blur-md px-6! py-7!",
  logoBox: "hidden!",
  header: "hidden!",
  socialButtons: "hidden!",
  socialButtonsBlockButton: "hidden!",
  socialButtonsBlockButtonText: "text-[13px] font-medium text-white",
  socialButtonsProviderIcon: "w-4 h-4",
  dividerRow: "hidden!",
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
      Members
    </p>
    <h1 className="reveal text-5xl font-black leading-[0.95] tracking-[-0.035em] text-white md:text-[64px]">
      Welcome back to{" "}
      <span className="text-primary">Muditek</span>.
    </h1>
  </div>
);

export default function SignInForm({ redirectUrl = "/portal" }: { redirectUrl?: string }) {
  const encodedRedirect = encodeURIComponent(redirectUrl);

  return (
    <AuthShell variant="sign-in" hero={HERO}>
      <div className="reveal reveal-delay-2 mb-6 hidden lg:block">
        <p className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-white/60">
          <span className="h-px w-8 bg-white/30" />
          Sign in
        </p>
      </div>
      <div className="reveal reveal-delay-3">
        <SignIn
          appearance={{ elements: CLERK_ELEMENTS }}
          signUpUrl={`/sign-up?redirect_url=${encodedRedirect}`}
          fallbackRedirectUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
          signUpFallbackRedirectUrl={redirectUrl}
          signUpForceRedirectUrl={redirectUrl}
        />
      </div>
    </AuthShell>
  );
}
