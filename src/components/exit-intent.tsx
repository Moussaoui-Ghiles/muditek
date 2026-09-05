"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { EmailCapture } from "./email-capture";

const DEFAULT_CONFIG = {
  heading: "Before you go: one working system per issue.",
  description: "How the outbound engine runs, how the agents are written, what broke and what got fixed. Written by the person running it.",
  tags: ["source:exit-intent"],
};

const SUPPRESSED_PATHS = [
  "/sign-in",
  "/sign-up",
  "/portal",
  "/admin",
  "/welcome",
  "/preferences",
  "/mudikit",
  "/get",
  "/subscribe",
];

function isSuppressed(pathname: string): boolean {
  return SUPPRESSED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function ExitIntent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const suppressed = isSuppressed(pathname);

  const showPopup = useCallback(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("exit-intent-shown")) return;
    sessionStorage.setItem("exit-intent-shown", "1");
    setVisible(true);
  }, []);

  useEffect(() => {
    if (suppressed) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) showPopup();
    }

    const timeout = setTimeout(showPopup, 60000);

    document.addEventListener("mouseout", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseout", handleMouseLeave);
      clearTimeout(timeout);
    };
  }, [showPopup, suppressed]);

  // Reset on navigation
  useEffect(() => {
    setVisible(false);
  }, [pathname]);

  if (!visible || suppressed) return null;

  const config = DEFAULT_CONFIG;

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
          <p className="text-sm text-foreground/70 leading-relaxed">
            {config.description}
          </p>
        </div>

        <EmailCapture
          tags={config.tags}
          buttonText="Subscribe"
          successMessage="You're in. Check your inbox."
          onSuccess={() => setTimeout(() => setVisible(false), 2000)}
        />

        <p className="text-xs text-foreground/50 mt-4">
          Unsubscribe in one click, in every email.
        </p>
      </div>
    </div>
  );
}
