"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/client-analytics";

function eventForPath(pathname: string): {
  event: string;
  resourceSlug?: string;
  metadata?: Record<string, string>;
} {
  const parts = pathname.split("/").filter(Boolean);
  const section = parts[1] ?? "home";
  const slug = parts[2];

  if (pathname === "/portal") return { event: "portal_opened", metadata: { section: "home" } };
  if (section === "playbooks" && slug) {
    return { event: "resource_viewed", resourceSlug: slug, metadata: { section } };
  }
  if (section === "skills" && slug) {
    return { event: "skill_viewed", resourceSlug: slug, metadata: { section } };
  }
  if (section === "tools" && slug) {
    return { event: "tool_viewed", resourceSlug: slug, metadata: { section } };
  }
  if (section === "newsletter" && slug) {
    return { event: "newsletter_article_opened", resourceSlug: slug, metadata: { section } };
  }
  return { event: "portal_page_view", metadata: { section } };
}

export function trackPortalUsage(
  event: string,
  payload: { path?: string; resourceSlug?: string; metadata?: Record<string, unknown> } = {},
) {
  const path = payload.path ?? (typeof window !== "undefined" ? window.location.pathname : undefined);
  trackEvent(event, {
    path,
    resource_slug: payload.resourceSlug,
    ...(payload.metadata ?? {}),
  });

  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    event,
    path,
    resourceSlug: payload.resourceSlug,
    metadata: payload.metadata ?? {},
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/usage/track", new Blob([body], { type: "application/json" }));
    return;
  }
  fetch("/api/usage/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function PortalUsageTracker() {
  const pathname = usePathname() || "/portal";

  useEffect(() => {
    if (!pathname.startsWith("/portal")) return;
    const usage = eventForPath(pathname);
    trackPortalUsage(usage.event, {
      path: pathname,
      resourceSlug: usage.resourceSlug,
      metadata: usage.metadata,
    });
  }, [pathname]);

  return null;
}
