"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";

type Step = "email" | "code";

function SignUpFormInner() {
  const clerk = useClerk();
  const params = useSearchParams();
  const redirectUrl = params.get("redirect_url") || "/portal";
  const prefilledEmail = params.get("email") || "";

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(prefilledEmail);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (clerk?.loaded && clerk.user) {
      window.location.href = redirectUrl;
    }
  }, [clerk, clerk?.loaded, clerk?.user, redirectUrl]);

  useEffect(() => {
    if (step === "email") emailRef.current?.focus();
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  async function startSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!clerk?.loaded) return;
    setSubmitting(true);
    setError(null);
    try {
      const client = clerk.client;
      if (!client) throw new Error("Clerk not ready");

      const ensureRes = await fetch("/api/account/ensure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!ensureRes.ok) {
        const body = (await ensureRes.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Could not create account");
      }

      const si = await client.signIn.create({ identifier: email });
      const factor = si.supportedFirstFactors?.find((f) => f.strategy === "email_code") as
        | { strategy: string; emailAddressId: string }
        | undefined;
      if (!factor) throw new Error("Email code sign-in not supported.");
      await si.prepareFirstFactor({ strategy: "email_code", emailAddressId: factor.emailAddressId });

      setStep("code");
      setSubmitting(false);
    } catch (err: unknown) {
      const clerkErr = (err as { errors?: Array<{ longMessage?: string; message?: string }> })?.errors?.[0];
      const fallback = (err as Error)?.message;
      setError(clerkErr?.longMessage || clerkErr?.message || fallback || "Could not send code.");
      setSubmitting(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!clerk?.loaded) return;
    setSubmitting(true);
    setError(null);
    try {
      const client = clerk.client;
      if (!client) throw new Error("Clerk not ready");
      const res = await client.signIn.attemptFirstFactor({ strategy: "email_code", code });
      if (res.status === "complete" && res.createdSessionId) {
        await clerk.setActive({ session: res.createdSessionId });
        fetch("/api/account/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }).catch(() => {});
        window.location.href = redirectUrl;
        return;
      }
      setError(`Unexpected state: ${res.status}`);
      setSubmitting(false);
    } catch (err: unknown) {
      const clerkErr = (err as { errors?: Array<{ longMessage?: string; message?: string }> })?.errors?.[0];
      const fallback = (err as Error)?.message;
      setError(clerkErr?.longMessage || clerkErr?.message || fallback || "Invalid code.");
      setSubmitting(false);
    }
  }

  const headerTitle = step === "email" ? "Create your free account" : "Verify it's you";
  const headerSub =
    step === "email"
      ? "One email. 6-digit code. Free portal + newsletter."
      : `Code sent to ${email}.`;

  return (
    <main className="min-h-[100dvh] bg-[#0c0c0e] text-[#e8e8ec] flex items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="flex size-8 items-center justify-center rounded-md bg-[#e8e8ec] text-[#0c0c0e] text-sm font-bold">
              M
            </div>
            <span className="text-sm font-semibold tracking-tight">Muditek</span>
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight">{headerTitle}</h1>
          <p className="text-sm text-[#a0a0a6] mt-1.5">{headerSub}</p>
        </div>

        {step === "email" ? (
          <form onSubmit={startSignUp} className="space-y-5">
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
                placeholder="you@company.com"
              />
            </div>

            {error && (
              <p role="alert" className="text-[13px] text-red-400/90 leading-relaxed">
                {error}
              </p>
            )}

            <div id="clerk-captcha" />

            <p className="text-[12px] text-[#636366] leading-relaxed">
              Creating your account subscribes you to the Muditek newsletter. One email/week. Unsubscribe anytime.
            </p>

            <button
              type="submit"
              disabled={submitting || !email}
              className="w-full h-10 rounded-md bg-[#e8e8ec] text-[#0c0c0e] text-sm font-semibold hover:bg-white active:scale-[0.99] disabled:bg-[#232326] disabled:text-[#636366] disabled:cursor-not-allowed transition-all duration-100"
            >
              {submitting ? "Sending code…" : "Send code"}
            </button>

            <p className="text-[13px] text-[#a0a0a6] text-center pt-2">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-[#e8e8ec] hover:underline">Sign in</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-5">
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
                onClick={() => {
                  setStep("email");
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

export default function SignUpForm() {
  return (
    <Suspense fallback={<main className="min-h-[100dvh] bg-[#0c0c0e]" />}>
      <SignUpFormInner />
    </Suspense>
  );
}
