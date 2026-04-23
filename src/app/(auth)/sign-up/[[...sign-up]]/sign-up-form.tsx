"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { AuthShell } from "@/components/auth/auth-shell";

export default function SignUpForm() {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/account/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  }, [isSignedIn, isLoaded]);

  return (
    <AuthShell variant="sign-up">
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold tracking-[-0.01em] text-white">Create your free Muditek account</h1>
        <p className="mt-1.5 text-[13px] text-white/55">One email. Free portal + newsletter archive. Unsubscribe anytime.</p>
      </div>
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-[#101014] border border-white/[0.06] shadow-none rounded-[10px] p-8 w-full",
            header: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton:
              "border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] rounded-[6px] h-11 text-[14px] font-medium text-white",
            socialButtonsBlockButtonText: "text-[14px] font-medium text-white",
            socialButtonsProviderIcon: "w-4 h-4",
            dividerLine: "bg-white/[0.06]",
            dividerText: "text-[11px] uppercase tracking-[0.2em] text-white/40 font-mono",
            formFieldLabel: "text-[12px] font-semibold text-white/60 uppercase tracking-[0.12em]",
            formFieldInput:
              "bg-[#151517] border border-white/[0.06] focus:border-white/[0.2] rounded-[6px] h-10 text-[14px] text-white placeholder:text-white/30",
            formButtonPrimary:
              "bg-[#e8e8ec] text-[#0a0a0c] hover:bg-white rounded-[6px] h-10 text-[14px] font-semibold normal-case tracking-normal",
            footer: "bg-transparent",
            footerActionText: "text-[13px] text-white/50",
            footerActionLink: "text-[13px] text-white font-semibold hover:underline",
            identityPreviewText: "text-[14px] text-white",
            identityPreviewEditButton: "text-[13px] text-white/60 hover:text-white",
            formFieldErrorText: "text-[12px] text-red-400/90",
            alertText: "text-[13px] text-red-400/90",
          },
        }}
        signInUrl="/sign-in"
        fallbackRedirectUrl="/portal"
      />
      <p className="mt-5 text-center text-[12px] leading-relaxed text-white/40">
        Creating an account subscribes you to the Muditek newsletter. One email/week. Unsubscribe anytime.
      </p>
    </AuthShell>
  );
}
