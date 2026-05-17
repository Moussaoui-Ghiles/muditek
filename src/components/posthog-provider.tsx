"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

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

  if (!key) return <>{children}</>;
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
