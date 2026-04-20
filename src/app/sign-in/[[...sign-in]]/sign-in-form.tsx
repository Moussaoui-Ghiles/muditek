"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

type Step = "credentials" | "second-factor";

export default function SignInForm() {
  const clerk = useClerk();
  const params = useSearchParams();
  const redirectUrl = params.get("redirect_url") || "/admin";

  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (clerk?.loaded && clerk.user) {
      window.location.href = redirectUrl;
    }
  }, [clerk, clerk?.loaded, clerk?.user, redirectUrl]);

  useEffect(() => {
    if (step === "credentials") emailRef.current?.focus();
    if (step === "second-factor") codeRef.current?.focus();
  }, [step]);

  async function submitCredentials(e: React.FormEvent) {
    e.preventDefault();
    if (!clerk?.loaded) return;
    setSubmitting(true);
    setError(null);
    try {
      const client = clerk.client;
      if (!client) throw new Error("Clerk not ready");
      const si = await client.signIn.create({
        identifier: email,
        password,
      });
      if (si.status === "complete" && si.createdSessionId) {
        await clerk.setActive({ session: si.createdSessionId });
        window.location.href = redirectUrl;
        return;
      }
      if (si.status === "needs_second_factor") {
        // Prepare email code 2FA
        const emailFactor = si.supportedSecondFactors?.find(
          (f: { strategy: string; emailAddressId?: string }) => f.strategy === "email_code"
        ) as { strategy: string; emailAddressId?: string } | undefined;
        if (!emailFactor?.emailAddressId) {
          setError("No email 2FA available. Contact admin.");
          setSubmitting(false);
          return;
        }
        await si.prepareSecondFactor({
          strategy: "email_code",
          emailAddressId: emailFactor.emailAddressId,
        });
        setCodeSent(true);
        setStep("second-factor");
        setSubmitting(false);
        return;
      }
      setError(`Unexpected sign-in state: ${si.status}`);
      setSubmitting(false);
    } catch (err: unknown) {
      const clerkErr = (err as { errors?: Array<{ longMessage?: string; message?: string }> })?.errors?.[0];
      const fallback = (err as Error)?.message;
      setError(clerkErr?.longMessage || clerkErr?.message || fallback || "Sign in failed.");
      setSubmitting(false);
    }
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    if (!clerk?.loaded) return;
    setSubmitting(true);
    setError(null);
    try {
      const client = clerk.client;
      if (!client) throw new Error("Clerk not ready");
      const si = await client.signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });
      if (si.status === "complete" && si.createdSessionId) {
        await clerk.setActive({ session: si.createdSessionId });
        window.location.href = redirectUrl;
        return;
      }
      setError(`Unexpected state: ${si.status}`);
      setSubmitting(false);
    } catch (err: unknown) {
      const clerkErr = (err as { errors?: Array<{ longMessage?: string; message?: string }> })?.errors?.[0];
      const fallback = (err as Error)?.message;
      setError(clerkErr?.longMessage || clerkErr?.message || fallback || "Invalid code.");
      setSubmitting(false);
    }
  }

  async function resendCode() {
    if (!clerk?.loaded) return;
    setError(null);
    try {
      const client = clerk.client;
      if (!client) throw new Error("Clerk not ready");
      const emailFactor = client.signIn.supportedSecondFactors?.find(
        (f: { strategy: string; emailAddressId?: string }) => f.strategy === "email_code"
      ) as { strategy: string; emailAddressId?: string } | undefined;
      if (!emailFactor?.emailAddressId) return;
      await client.signIn.prepareSecondFactor({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
      });
      setCodeSent(true);
    } catch (err: unknown) {
      const clerkErr = (err as { errors?: Array<{ longMessage?: string; message?: string }> })?.errors?.[0];
      setError(clerkErr?.longMessage || clerkErr?.message || "Could not resend code.");
    }
  }

  const headerTitle = step === "credentials" ? "Sign in" : "Verify it's you";
  const headerSub =
    step === "credentials"
      ? "Admin access only."
      : codeSent
        ? `Code sent to ${email}.`
        : `We'll send a code to ${email}.`;

  return (
    <main className="min-h-[100dvh] bg-[#0c0c0e] text-[#e8e8ec] flex items-center justify-center px-6">
      <div className="w-full max-w-[360px]">
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="flex size-8 items-center justify-center rounded-md bg-[#e8e8ec] text-[#0c0c0e] text-sm font-bold">
              M
            </div>
            <span className="text-sm font-semibold tracking-tight">MudiKit</span>
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight">{headerTitle}</h1>
          <p className="text-sm text-[#a0a0a6] mt-1.5">{headerSub}</p>
        </div>

        {step === "credentials" ? (
          <form onSubmit={submitCredentials} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[13px] font-medium text-[#e8e8ec]">
                Email
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                autoComplete="email"
                required
                disabled={submitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-[#151517] border border-[#232326] text-[#e8e8ec] text-sm placeholder:text-[#636366] focus:outline-none focus:border-[#4a4a4e] focus:ring-2 focus:ring-[#e8e8ec]/10 transition-colors disabled:opacity-50"
                placeholder="you@muditek.com"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[13px] font-medium text-[#e8e8ec]">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={submitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-[#151517] border border-[#232326] text-[#e8e8ec] text-sm placeholder:text-[#636366] focus:outline-none focus:border-[#4a4a4e] focus:ring-2 focus:ring-[#e8e8ec]/10 transition-colors disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p role="alert" className="text-[13px] text-red-400/90 leading-relaxed">
                {error}
              </p>
            )}

            <div id="clerk-captcha" />

            <button
              type="submit"
              disabled={submitting || !email || !password}
              className="w-full h-10 rounded-md bg-[#e8e8ec] text-[#0c0c0e] text-sm font-semibold hover:bg-white active:scale-[0.99] disabled:bg-[#232326] disabled:text-[#636366] disabled:cursor-not-allowed transition-all duration-100"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitCode} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="code" className="block text-[13px] font-medium text-[#e8e8ec]">
                Verification code
              </label>
              <input
                ref={codeRef}
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                disabled={submitting}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full h-10 px-3 rounded-md bg-[#151517] border border-[#232326] text-[#e8e8ec] text-base tracking-[0.3em] font-mono placeholder:text-[#636366] focus:outline-none focus:border-[#4a4a4e] focus:ring-2 focus:ring-[#e8e8ec]/10 transition-colors disabled:opacity-50"
                placeholder="123456"
                maxLength={6}
              />
            </div>

            {error && (
              <p role="alert" className="text-[13px] text-red-400/90 leading-relaxed">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || code.length < 6}
              className="w-full h-10 rounded-md bg-[#e8e8ec] text-[#0c0c0e] text-sm font-semibold hover:bg-white active:scale-[0.99] disabled:bg-[#232326] disabled:text-[#636366] disabled:cursor-not-allowed transition-all duration-100"
            >
              {submitting ? "Verifying…" : "Continue"}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={resendCode}
                className="text-[13px] text-[#a0a0a6] hover:text-[#e8e8ec] transition-colors"
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setCode("");
                  setError(null);
                }}
                className="text-[13px] text-[#a0a0a6] hover:text-[#e8e8ec] transition-colors"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
