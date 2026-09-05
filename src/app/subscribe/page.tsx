"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo/logo";

function SubscribeForm() {
  const searchParams = useSearchParams();
  const sourceParam = (searchParams.get("src") || searchParams.get("source") || "subscribe-page").slice(0, 50);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: sourceParam }),
      });
      const data = await res.json();
      if (res.ok) setDone(true);
      else setError(data.error ?? "Subscription failed. Try again.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <div className="px-6 md:px-12 py-6">
        <Link href="/" aria-label="Muditek home">
          <Logo variant="mark+text" size={24} />
        </Link>
      </div>

      <div className="flex-1 flex items-center">
        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 py-16 grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <p className="text-sm font-bold text-foreground/60 mb-8">The newsletter</p>
            <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.92] text-balance max-w-[12ch] mb-8">
              One working system <span className="text-primary">per issue.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/75 leading-relaxed max-w-[50ch]">
              What I am shipping, what is working, what is breaking. The outbound engine, the lead research, the agents running the operations. Written by the person running them.
            </p>
          </div>

          <div className="lg:col-span-5">
            {done ? (
              <div className="border-t border-white/[0.08] pt-8" role="status">
                <h2 className="text-3xl font-black tracking-[-0.02em] mb-3">You&apos;re in.</h2>
                <p className="text-base text-foreground/70 leading-relaxed mb-8">Check your inbox for a confirmation. The next issue lands there.</p>
                <Link href="/library" className="btn btn-outline">Open the library</Link>
              </div>
            ) : (
              <form onSubmit={submit} className="border-t border-white/[0.08] pt-8">
                <label htmlFor="email" className="block text-sm font-bold text-foreground mb-3">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="field"
                />
                {error && <p className="text-sm text-primary mt-3" role="alert">{error}</p>}
                <button type="submit" disabled={submitting || !email} className="btn btn-solid w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Sending" : "Subscribe"}
                </button>
                <p className="text-sm text-foreground/50 mt-4">Unsubscribe in one click, in every email.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={null}>
      <SubscribeForm />
    </Suspense>
  );
}
