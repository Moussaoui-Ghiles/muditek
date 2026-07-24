"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo/logo";
import { NEWSLETTER_CONSENT_TEXT } from "@/lib/newsletter-consent";

const TOPICS = [
  { value: "ai-agents", label: "Workflow audits and AI adoption" },
  { value: "gtm-systems", label: "Revenue workflows" },
  { value: "solo-operator", label: "Operator systems" },
];

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [topics, setTopics] = useState<string[]>(TOPICS.map((t) => t.value));
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTopic(v: string) {
    setTopics((prev) => (prev.includes(v) ? prev.filter((t) => t !== v) : [...prev, v]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, topics, source: "subscribe-page" }),
      });
      const data = await res.json();
      if (res.ok) setDone(true);
      else setError(data.error ?? "Something went wrong");
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="min-h-[100dvh] bg-[#0a0a0c] text-[#e8e8ec] flex flex-col items-center justify-center px-6">
        <div className="absolute top-8 left-8">
          <Link href="/" aria-label="Muditek home">
            <Logo variant="mark+text" size={24} />
          </Link>
        </div>
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">You&apos;re in.</h1>
          <p className="text-[#a0a0a6]">
            Your first workflow email is queued.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-[#0a0a0c] text-[#e8e8ec] flex flex-col items-center justify-center px-6 py-16">
      <div className="absolute top-8 left-8">
        <Link href="/" aria-label="Muditek home">
          <Logo variant="mark+text" size={24} />
        </Link>
      </div>
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="text-xs font-mono tracking-wider text-[#a0a0a6] mb-3 uppercase">
            Muditek Newsletter
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Make one workflow AI-executable each week.
          </h1>
          <p className="text-[#a0a0a6]">
            One real system, including the inputs, instructions, and human checks.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 bg-[#151517] border border-white/[0.06] rounded-lg text-[#e8e8ec] placeholder:text-[#636366] focus:outline-none focus:border-[#e8e8ec] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Topics</label>
            <div className="space-y-2">
              {TOPICS.map((t) => (
                <label
                  key={t.value}
                  className="flex items-center gap-3 p-3 bg-[#151517] border border-white/[0.06] rounded-lg cursor-pointer hover:border-[#3a3a3e] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={topics.includes(t.value)}
                    onChange={() => toggleTopic(t.value)}
                    className="size-4 accent-[#e8e8ec]"
                  />
                  <span className="text-sm">{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !email || topics.length === 0}
            className="w-full px-6 py-3.5 bg-[#e8e8ec] text-[#0a0a0c] font-bold rounded-lg hover:bg-white active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Subscribing…" : "Get the newsletter"}
          </button>

          <p className="text-xs text-[#636366] text-center">
            {NEWSLETTER_CONSENT_TEXT} One-click unsubscribe is included in every email.
          </p>
        </form>
      </div>
    </main>
  );
}
