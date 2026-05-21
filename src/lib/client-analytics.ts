"use client";

import posthog from "posthog-js";

type EventProperties = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: Record<string, string | number | boolean | null | undefined>,
    ) => void;
  }
}

export function trackEvent(name: string, properties: EventProperties = {}) {
  if (typeof window === "undefined") return;

  if (posthog.__loaded) {
    posthog.capture(name, properties);
  }

  window.gtag?.("event", name, properties);
}
