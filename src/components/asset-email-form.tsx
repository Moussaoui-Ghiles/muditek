"use client";

import { useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/client-analytics";

interface AssetEmailFormProps {
  slug: string;
  label?: string;
  className?: string;
}

type Unlocked = { assetUrl: string | null; button: string; mode: "page" | "email" };

export function AssetEmailForm({
  slug,
  label = "",
  className = "",
}: AssetEmailFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [unlocked, setUnlocked] = useState<Unlocked | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/assets/${encodeURIComponent(slug)}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to send.");
      setUnlocked({
        assetUrl: data.assetUrl ?? null,
        button: data.button ?? "Open it",
        mode: data.mode === "email" ? "email" : "page",
      });
      setStatus("success");
      trackEvent("lead_magnet_optin", { slug });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success" && unlocked) {
    if (unlocked.mode === "page" && unlocked.assetUrl) {
      return (
        <div className={className}>
          <a
            href={unlocked.assetUrl}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-[2px] bg-primary px-5 py-3 text-center text-sm font-black uppercase tracking-[0.14em] text-background"
          >
            {unlocked.button}
          </a>
          <p className="mt-3 text-sm font-semibold text-foreground/70">
            A copy is also in your inbox.
          </p>
        </div>
      );
    }
    return (
      <p className={`text-sm font-bold uppercase tracking-[0.14em] text-primary ${className}`}>
        Sent. Check your inbox.
      </p>
    );
  }

  return (
    <div className={className}>
      {label ? (
        <p className="text-xs font-black uppercase tracking-[0.18em] text-foreground/50">{label}</p>
      ) : null}
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          disabled={status === "loading"}
          className="min-w-0 rounded-[2px] border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:border-primary/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-primary px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-background transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "One second..." : "Get it"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-400/80">{errorMsg}</p>
      )}
    </div>
  );
}
