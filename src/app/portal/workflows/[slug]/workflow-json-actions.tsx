"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function WorkflowJsonActions({
  slug,
  downloadHref,
}: {
  slug: string;
  downloadHref: string;
}) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCopy = async () => {
    if (loading || copied) return;
    setLoading(true);
    try {
      const res = await fetch(downloadHref, { credentials: "include" });
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={loading}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/[0.14] bg-white/[0.04] px-3 text-[12px] font-medium text-white transition-colors hover:bg-white/[0.08] disabled:opacity-50"
    >
      {copied ? <Check className="size-3.5 text-emerald-300" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
