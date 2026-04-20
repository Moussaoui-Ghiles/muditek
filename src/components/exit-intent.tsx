"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { EmailCapture } from "./email-capture";

const PAGE_CONFIG: Record<string, { heading: string; description: string; tags: string[]; accent: "primary" | "emerald" | "sky" }> = {
  "/tools/revenue-leak-calculator": {
    heading: "Before you go — get your full revenue leak report.",
    description: "We'll email you the complete breakdown with formulas, methodology, and a prioritized fix roadmap.",
    tags: ["source:exit-intent", "segment:saas", "exit:calculator"],
    accent: "emerald",
  },
  "/mudiagent": {
    heading: "Get the 3 workflows every telecom can automate.",
    description: "A free guide to the highest-ROI automation targets for telecom and enterprise operations.",
    tags: ["source:exit-intent", "segment:telecom", "exit:mudiagent"],
    accent: "primary",
  },
  "/revenue-leak-audit": {
    heading: "Get the 5-Leak Diagnostic Framework.",
    description: "The exact methodology we use to find €80-180K in annual pipeline leakage.",
    tags: ["source:exit-intent", "segment:saas", "exit:revenue-audit"],
    accent: "emerald",
  },
  "/pe-ops": {
    heading: "Get the PE Operations Maturity Checklist.",
    description: "Score your firm's operational infrastructure across 12 dimensions.",
    tags: ["source:exit-intent", "segment:pe", "exit:pe-ops"],
    accent: "sky",
  },
};

const DEFAULT_CONFIG = {
  heading: "One deployable system. Every week.",
  description: "Last edition: an outbound system that books 153 calls for $1,200/month. You get the full build — architecture, code, and steps to deploy it.",
  tags: ["source:exit-intent"],
  accent: "primary" as const,
};

export function ExitIntent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  const showPopup = useCallback(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("exit-intent-shown")) return;
    sessionStorage.setItem("exit-intent-shown", "1");
    setVisible(true);
  }, []);

  useEffect(() => {
    // Desktop: mouse leave
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) showPopup();
    }

    // Mobile fallback: 60s timeout
    const timeout = setTimeout(showPopup, 60000);

    document.addEventListener("mouseout", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseout", handleMouseLeave);
      clearTimeout(timeout);
    };
  }, [showPopup]);

  // Reset on navigation
  useEffect(() => {
    setVisible(false);
  }, [pathname]);

  if (!visible) return null;

  const config = PAGE_CONFIG[pathname] || DEFAULT_CONFIG;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Subscribe before you go"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setVisible(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card border border-white/[0.08] rounded-[4px] p-8 md:p-10 shadow-2xl animate-in">
        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="mb-6">
          <h3 className="text-xl md:text-2xl font-black tracking-[-0.02em] text-foreground mb-3 pr-8">
            {config.heading}
          </h3>
          <p className="text-sm text-foreground/60 font-light leading-relaxed">
            {config.description}
          </p>
        </div>

        <EmailCapture
          tags={config.tags}
          accentColor={config.accent}
          buttonText="Send It"
          successMessage="Done. Check your inbox."
          onSuccess={() => setTimeout(() => setVisible(false), 2000)}
        />

        <p className="text-xs text-foreground/30 mt-4 font-mono tracking-wider">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
