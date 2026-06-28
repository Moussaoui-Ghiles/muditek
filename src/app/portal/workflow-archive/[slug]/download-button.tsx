"use client";

import { useState } from "react";
import { ArrowDownToLine, Check, Loader2 } from "lucide-react";

export function WorkflowDownloadButton({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function handleDownload() {
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch(
        `/api/portal/workflow-archive/${encodeURIComponent(slug)}/download`,
      );
      if (!res.ok) throw new Error(`download failed: ${res.status}`);
      const text = await res.text();
      const blob = new Blob([text], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  const label =
    state === "loading"
      ? "Preparing JSON…"
      : state === "done"
        ? "Downloaded"
        : state === "error"
          ? "Try again"
          : "Download workflow JSON";

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={state === "loading"}
      className={
        "inline-flex items-center gap-2.5 rounded-[2px] bg-emerald-500 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-background transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 " +
        (className ?? "")
      }
    >
      {state === "loading" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : state === "done" ? (
        <Check className="h-4 w-4" />
      ) : (
        <ArrowDownToLine className="h-4 w-4" />
      )}
      {label}
    </button>
  );
}
