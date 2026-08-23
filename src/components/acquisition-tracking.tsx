"use client";

import { useEffect, type ReactNode } from "react";
import { trackEvent } from "@/lib/client-analytics";

export const OUTBOUND_BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink";

type Attribution = {
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
};

const ATTRIBUTION_KEY = "muditek_acquisition_first_touch";

function readAttribution(): Attribution {
  if (typeof window === "undefined") {
    return { source: "unknown", medium: "unknown", campaign: "", referrer: "" };
  }

  try {
    const saved = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (saved) return JSON.parse(saved) as Attribution;
  } catch {
    // Use live URL data when session storage is unavailable.
  }

  const params = new URLSearchParams(window.location.search);
  const referrer = document.referrer;
  let referrerHost = "";
  try {
    referrerHost = referrer ? new URL(referrer).hostname.replace(/^www\./, "") : "";
  } catch {
    referrerHost = "";
  }

  const attribution: Attribution = {
    source: params.get("utm_source") || referrerHost || "direct",
    medium: params.get("utm_medium") || (referrerHost ? "referral" : "none"),
    campaign: params.get("utm_campaign") || "",
    referrer,
  };

  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Analytics must never block the page.
  }

  return attribution;
}

export function AcquisitionPageView({ asset }: { asset: string }) {
  useEffect(() => {
    const attribution = readAttribution();
    trackEvent("acquisition_landing_viewed", {
      asset,
      path: window.location.pathname,
      ...attribution,
    });
  }, [asset]);

  return null;
}

export function TrackedBookingLink({
  asset,
  placement,
  className,
  children,
}: {
  asset: string;
  placement: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={OUTBOUND_BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        const attribution = readAttribution();
        trackEvent("acquisition_booking_clicked", {
          asset,
          placement,
          path: window.location.pathname,
          ...attribution,
        });
      }}
    >
      {children}
    </a>
  );
}

export function trackCalculatorCompletion(currency: string) {
  const attribution = readAttribution();
  trackEvent("appointment_quote_calculator_completed", {
    asset: "appointment-setting-quote-calculator",
    currency,
    path: window.location.pathname,
    ...attribution,
  });
}

