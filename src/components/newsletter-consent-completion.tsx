"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { trackFunnelEvent } from "@/components/acquisition-tracking";
import { NEWSLETTER_CONSENT_STORAGE_KEY } from "@/lib/newsletter-consent";

export function NewsletterConsentCompletion() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    if (sessionStorage.getItem(NEWSLETTER_CONSENT_STORAGE_KEY) !== "1") return;

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return;

    let cancelled = false;
    fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source: "account-signup-explicit-consent",
        topics: ["ai-agents", "gtm-systems", "solo-operator"],
      }),
    })
      .then(async (response) => {
        if (!response.ok || cancelled) return;
        const result = await response.json().catch(() => ({})) as { subscribed?: boolean };
        sessionStorage.removeItem(NEWSLETTER_CONSENT_STORAGE_KEY);
        if (result.subscribed === false) return;
        trackFunnelEvent("newsletter_opted_in", {
          asset: "account-signup",
          lane: "ai-implementation",
          placement: "signup-checkbox",
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, user]);

  return null;
}
