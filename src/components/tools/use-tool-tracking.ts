"use client";

import { useRef } from "react";
import { trackFunnelEvent } from "@/components/acquisition-tracking";
import { getToolDefinition } from "@/lib/acquisition/tool-registry";

export function useToolTracking(slug: string) {
  const started = useRef(false);
  const queryCluster = getToolDefinition(slug)?.primaryQuery;

  function start() {
    if (started.current) return;
    started.current = true;
    trackFunnelEvent("tool_started", {
      asset: slug,
      lane: "outbound",
      placement: "tool-page",
      pageFamily: "tool",
      queryCluster,
    });
  }

  function complete() {
    start();
    trackFunnelEvent("tool_completed", {
      asset: slug,
      lane: "outbound",
      placement: "tool-page",
      pageFamily: "tool",
      queryCluster,
    });
  }

  return { start, complete };
}
