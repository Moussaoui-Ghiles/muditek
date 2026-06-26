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

export type AiSource = "chatgpt" | "perplexity" | "gemini" | "copilot" | "claude";

export type AiReferral = {
  ai_source: AiSource;
  referrer: string;
};

const AI_SESSION_KEY = "muditek_ai_referral_fired";

// Map a normalized referrer host (and optional path) or utm_source value to an AI sub-source.
function classifyAiSource(value: string): AiSource | null {
  const v = value.toLowerCase().trim();
  if (!v) return null;

  // chatgpt
  if (
    v === "chatgpt.com" ||
    v === "chat.openai.com" ||
    v === "openai.com" ||
    v === "chatgpt"
  ) {
    return "chatgpt";
  }

  // perplexity
  if (v === "perplexity.ai" || v === "perplexity") {
    return "perplexity";
  }

  // gemini
  if (
    v === "gemini.google.com" ||
    v === "bard.google.com" ||
    v === "gemini" ||
    v === "bard"
  ) {
    return "gemini";
  }

  // copilot
  if (
    v === "copilot.microsoft.com" ||
    v === "bing.com/chat" ||
    v === "www.bing.com/chat" ||
    v === "copilot"
  ) {
    return "copilot";
  }

  // claude
  if (v === "claude.ai" || v === "claude") {
    return "claude";
  }

  return null;
}

// First-touch detection: read document.referrer and the utm_source query param,
// classify AI-assistant sources, and return a normalized source label (or null).
export function detectAiReferral(): AiReferral | null {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  // utm_source takes priority — it's an explicit signal.
  try {
    const utmSource = new URLSearchParams(window.location.search).get(
      "utm_source",
    );
    if (utmSource) {
      const fromUtm = classifyAiSource(utmSource);
      if (fromUtm) {
        return { ai_source: fromUtm, referrer: document.referrer || "" };
      }
    }
  } catch {
    // ignore malformed URL/search params
  }

  const referrer = document.referrer;
  if (referrer) {
    try {
      const url = new URL(referrer);
      const host = url.hostname.replace(/^www\./, "");
      // Try host first, then host + first path segment (e.g. bing.com/chat).
      const fromHost = classifyAiSource(host);
      if (fromHost) {
        return { ai_source: fromHost, referrer };
      }
      const firstSegment = url.pathname.split("/").filter(Boolean)[0];
      if (firstSegment) {
        const fromHostPath = classifyAiSource(`${host}/${firstSegment}`);
        if (fromHostPath) {
          return { ai_source: fromHostPath, referrer };
        }
      }
    } catch {
      // ignore unparseable referrer
    }
  }

  return null;
}

// Fire AI-referral detection once per session, guarded with sessionStorage.
// Returns the detected referral (or null). Invokes the optional callback only
// on the first detection in a session.
export function fireAiReferralOnce(
  onDetect?: (referral: AiReferral) => void,
): AiReferral | null {
  if (typeof window === "undefined") return null;

  let alreadyFired = false;
  try {
    alreadyFired = window.sessionStorage.getItem(AI_SESSION_KEY) === "1";
  } catch {
    // sessionStorage may be unavailable (privacy mode); fall through.
  }
  if (alreadyFired) return null;

  const referral = detectAiReferral();
  if (!referral) return null;

  try {
    window.sessionStorage.setItem(AI_SESSION_KEY, "1");
  } catch {
    // ignore write failures
  }

  onDetect?.(referral);
  return referral;
}
