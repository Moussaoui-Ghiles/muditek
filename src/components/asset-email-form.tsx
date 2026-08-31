"use client";

import { useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/client-analytics";

interface AssetEmailFormProps {
  slug: string;
  label?: string;
  className?: string;
}

export function AssetEmailForm({
  slug,
  label = "Or get it by email",
  className = "",
}: AssetEmailFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send.");
      }
      setStatus("success");
      trackEvent("asset_email_requested", { slug });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <p className={`text-sm font-bold uppercase tracking-[0.14em] text-primary ${className}`}>
        Sent. Check your inbox.
      </p>
    );
  }

  return (
    <div className={className}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-foreground/50">{label}</p>
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
          className="inline-flex min-h-11 items-center justify-center rounded-[2px] border border-white/[0.14] px-5 py-2.5 text-sm font-black uppercase tracking-[0.14em] text-foreground transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Email it to me"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-400/80">{errorMsg}</p>
      )}
    </div>
  );
}
