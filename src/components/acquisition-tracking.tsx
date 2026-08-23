"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/client-analytics";

export const OUTBOUND_BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink";

export type FunnelEventName =
  | "library_item_viewed"
  | "tool_completed"
  | "skill_gate_viewed"
  | "account_created"
  | "skill_downloaded"
  | "newsletter_opted_in"
  | "commercial_offer_viewed"
  | "booking_clicked";

export type FunnelLane = "outbound" | "ai-implementation";

type Attribution = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  referrer: string;
};

const ATTRIBUTION_KEY = "muditek_acquisition_first_touch";
export const SIGNUP_ORIGIN_KEY = "muditek_signup_origin";

function safeText(value: unknown): string {
  return typeof value === "string" ? value.slice(0, 300) : "";
}

function sanitizeReferrer(value: string): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return "";
  }
}

function readAttribution(): Attribution {
  if (typeof window === "undefined") {
    return {
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
      referrer: "",
    };
  }

  try {
    const saved = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Record<string, unknown>;
      return {
        utm_source: safeText(parsed.utm_source ?? parsed.source),
        utm_medium: safeText(parsed.utm_medium ?? parsed.medium),
        utm_campaign: safeText(parsed.utm_campaign ?? parsed.campaign),
        utm_term: safeText(parsed.utm_term),
        utm_content: safeText(parsed.utm_content),
        referrer: sanitizeReferrer(safeText(parsed.referrer)),
      };
    }
  } catch {
    // Use live URL data when session storage is unavailable.
  }

  const params = new URLSearchParams(window.location.search);
  const referrer = sanitizeReferrer(document.referrer);
  const attribution: Attribution = {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
    referrer,
  };

  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Analytics must never block the page.
  }

  return attribution;
}

export function trackFunnelEvent(
  event: FunnelEventName,
  {
    asset,
    lane,
    placement,
  }: { asset: string; lane: FunnelLane; placement: string },
) {
  const attribution = readAttribution();
  trackEvent(event, {
    asset_slug: asset,
    lane,
    placement,
    path: typeof window === "undefined" ? "" : window.location.pathname,
    ...attribution,
  });
}

export function AcquisitionPageView({
  asset,
  lane = "outbound",
  event = "commercial_offer_viewed",
  placement = "page",
}: {
  asset: string;
  lane?: FunnelLane;
  event?: Extract<FunnelEventName, "library_item_viewed" | "commercial_offer_viewed">;
  placement?: string;
}) {
  useEffect(() => {
    trackFunnelEvent(event, { asset, lane, placement });
  }, [asset, event, lane, placement]);

  return null;
}

export function FunnelEventOnView({
  event,
  asset,
  lane,
  placement,
}: {
  event: FunnelEventName;
  asset: string;
  lane: FunnelLane;
  placement: string;
}) {
  useEffect(() => {
    trackFunnelEvent(event, { asset, lane, placement });
  }, [asset, event, lane, placement]);

  return null;
}

export function TrackedBookingLink({
  asset,
  lane = "outbound",
  placement,
  className,
  children,
}: {
  asset: string;
  lane?: FunnelLane;
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
        trackFunnelEvent("booking_clicked", { asset, lane, placement });
      }}
    >
      {children}
    </a>
  );
}

export function TrackedDownloadLink({
  href,
  asset,
  lane,
  placement,
  className,
  children,
}: {
  href: string;
  asset: string;
  lane: FunnelLane;
  placement: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackFunnelEvent("skill_downloaded", { asset, lane, placement })}
    >
      {children}
    </a>
  );
}

export function TrackedAccountLink({
  href,
  asset,
  lane,
  placement,
  className,
  children,
}: {
  href: string;
  asset: string;
  lane: FunnelLane;
  placement: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        try {
          sessionStorage.setItem(SIGNUP_ORIGIN_KEY, JSON.stringify({ asset, lane, placement }));
        } catch {
          // Account creation still works when storage is unavailable.
        }
      }}
    >
      {children}
    </Link>
  );
}

export function trackToolCompletion(
  asset: string,
  lane: FunnelLane = "outbound",
  placement = "tool-result",
) {
  trackFunnelEvent("tool_completed", { asset, lane, placement });
}

export function trackCalculatorCompletion(currency: string) {
  void currency;
  trackToolCompletion("appointment-setting-quote-calculator");
}
