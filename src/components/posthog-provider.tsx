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
      if (key) {
        try {
          posthog.register({ ai_source });
          posthog.capture("ai_referral", { ai_source, referrer });
        } catch {
          // posthog not yet initialized on this paint — skip, PostHog autocapture still fires later
        }
      }
      // GA4: gtag may not exist yet on cold load. dataLayer is created by the inline
      // GA snippet immediately, so push there as a reliable fallback.
      const w = window as typeof window & { dataLayer?: unknown[] };
      if (typeof w.gtag === "function") {
        w.gtag("event", "ai_referral", { ai_source, referrer });
      } else {
        w.dataLayer?.push({ event: "ai_referral", ai_source, referrer });
      }
    });
  }, [key]);

  if (!key) return <>{children}</>;
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
