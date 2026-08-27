"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { fireAiReferralOnce } from "@/lib/client-analytics";

export function PostHogProvider({
  children,
  apiKey,
  host = "https://us.i.posthog.com",
}: {
  children: React.ReactNode;
  apiKey?: string;
  host?: string;
}) {
  const key = apiKey?.trim();
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (!key) return;
    if (typeof window === "undefined") return;
    if (posthog.__loaded) return;
    posthog.init(key, {
      api_host: host,
      capture_pageview: false,
      capture_pageleave: false,
      person_profiles: "identified_only",
    });
  }, [key, host]);

  useEffect(() => {
    if (!key || !posthog.__loaded) return;
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [key, pathname]);

  // First-touch AI-assistant referral detection (once per session, SSR-safe).
  useEffect(() => {
    if (typeof window === "undefined") return;
    fireAiReferralOnce(({ ai_source, referrer }) => {
      if (key && posthog.__loaded) {
        posthog.register({ ai_source });
        posthog.capture("ai_referral", { ai_source, referrer });
      }
      window.gtag?.("event", "ai_referral", { ai_source, referrer });
    });
  }, [key]);

  if (!key) return <>{children}</>;
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
