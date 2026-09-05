"use client";

import { useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/client-analytics";

const VALID_TOPICS = ["ai-agents", "gtm-systems", "solo-operator"] as const;
type Topic = (typeof VALID_TOPICS)[number];

interface EmailCaptureProps {
  tags?: string[];
  source?: string;
  topics?: Topic[];
  /** Kept for legacy callers. The form has one style now. */
  accentColor?: "primary" | "emerald" | "sky";
  heading?: string;
  description?: string;
  buttonText?: string;
  successMessage?: string;
  className?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

function deriveSource(source: string | undefined, tags: string[] | undefined): string {
  if (source) return source.slice(0, 50);
  if (tags && tags.length > 0) {
    for (const t of tags) {
      if (t.startsWith("source:")) return t.slice(7).slice(0, 50);
    }
  }
  return "homepage";
}

function deriveTopics(topics: Topic[] | undefined, tags: string[] | undefined): Topic[] {
  if (topics && topics.length > 0) return topics;
  if (tags && tags.length > 0) {
    const matched = tags.filter((t): t is Topic =>
      (VALID_TOPICS as readonly string[]).includes(t),
    );
    if (matched.length > 0) return matched;
  }
  return [...VALID_TOPICS];
}

export function EmailCapture({
  tags,
  source,
  topics,
  heading,
  description,
  buttonText = "Subscribe",
  successMessage = "You're in. Check your inbox.",
  className = "",
  compact = false,
  onSuccess,
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const derivedSource = deriveSource(source, tags);
      const derivedTopics = deriveTopics(topics, tags);
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: derivedSource, topics: derivedTopics }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Subscription failed. Try again.");
      }

      setStatus("success");
      trackEvent("newsletter_signup", { source: derivedSource, topics: derivedTopics.join(",") });
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Subscription failed. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={`flex items-center gap-3 ${compact ? "py-3" : "py-5"} ${className}`} role="status">
        <span className="w-2 h-2 rounded-full bg-current" />
        <span className="text-base font-bold">{successMessage}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {heading && !compact && (
        <h4 className="text-lg font-black tracking-[-0.01em] text-foreground mb-2">{heading}</h4>
      )}
      {description && !compact && (
        <p className="text-sm text-foreground/70 leading-relaxed mb-4">{description}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor={`email-${deriveSource(source, tags)}`}>Email address</label>
        <input
          id={`email-${deriveSource(source, tags)}`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={`field flex-1 ${compact ? "py-3" : ""}`}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`btn btn-solid ${compact ? "btn-sm" : ""} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {status === "loading" ? "Sending" : buttonText}
        </button>
      </form>

      {status === "error" && (
        <p className="text-sm font-bold mt-3" role="alert">{errorMsg}</p>
      )}
    </div>
  );
}
