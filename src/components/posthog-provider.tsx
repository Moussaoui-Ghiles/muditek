"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
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

  useEffect(() => {
    if (!key) return;
    if (typeof window === "undefined") return;
    if (posthog.__loaded) return;
    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
  }, [key, host]);

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
