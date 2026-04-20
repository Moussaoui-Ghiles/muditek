"use client";

import { useState, type FormEvent } from "react";

interface EmailCaptureProps {
  tags: string[];
  accentColor?: "primary" | "emerald" | "sky";
  heading?: string;
  description?: string;
  buttonText?: string;
  successMessage?: string;
  className?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

const ACCENT_MAP = {
  primary: {
    ring: "focus:border-primary/40",
    btn: "bg-foreground text-background",
    btnHover: "hover:scale-[1.02]",
    text: "text-primary",
    pulse: "bg-primary",
  },
  emerald: {
    ring: "focus:border-emerald-500/40",
    btn: "bg-emerald-500 text-background",
    btnHover: "hover:scale-[1.02]",
    text: "text-emerald-400",
    pulse: "bg-emerald-400",
  },
  sky: {
    ring: "focus:border-sky-500/40",
    btn: "bg-sky-500 text-background",
    btnHover: "hover:scale-[1.02]",
    text: "text-sky-400",
    pulse: "bg-sky-400",
  },
};

export function EmailCapture({
  tags,
  accentColor = "primary",
  heading,
  description,
  buttonText = "Get It Free",
  successMessage = "Check your inbox.",
  className = "",
  compact = false,
  onSuccess,
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const accent = ACCENT_MAP[accentColor];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tags }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to subscribe.");
      }

      setStatus("success");
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className={`flex items-center gap-3 ${compact ? "py-3" : "py-6"} ${className}`}>
        <div className={`w-2 h-2 rounded-full ${accent.pulse} animate-pulse`} />
        <span className={`text-sm font-bold uppercase tracking-[0.15em] ${accent.text}`}>
          {successMessage}
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      {heading && !compact && (
        <h4 className="text-lg font-black tracking-[0.05em] text-foreground mb-2">
          {heading}
        </h4>
      )}
      {description && !compact && (
        <p className="text-sm text-foreground/60 font-light leading-relaxed mb-4">
          {description}
        </p>
      )}

      <form onSubmit={handleSubmit} className={`flex ${compact ? "flex-row gap-2" : "flex-col sm:flex-row gap-3"}`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={`flex-1 bg-white/[0.03] border border-white/[0.08] rounded-[2px] ${compact ? "py-2.5 px-4 text-sm" : "py-3.5 px-5 text-sm"} font-mono text-foreground placeholder:text-foreground/30 focus:outline-none ${accent.ring} transition-colors`}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`btn-press ${accent.btn} ${accent.btnHover} ${compact ? "px-5 py-2.5" : "px-8 py-3.5"} font-black text-sm uppercase tracking-[0.15em] rounded-[2px] transition-transform whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {compact ? "" : "Sending..."}
            </span>
          ) : (
            buttonText
          )}
        </button>
      </form>

      {status === "error" && (
        <p className="text-sm text-red-400/80 mt-2">{errorMsg}</p>
      )}
    </div>
  );
}
