import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AcquisitionContentHub } from "@/components/acquisition/content-hub";
import { getRenderableAcquisitionPages } from "@/lib/acquisition/content-registry";

export const metadata: Metadata = {
  title: "B2B Outbound Workflows, Economics and Signal Methods | Muditek",
  description: "Practical, sourced methods for building, measuring and diagnosing B2B outbound.",
  alternates: { canonical: "https://muditek.com/outbound" },
};

export default function OutboundHubPage() {
  const pages = getRenderableAcquisitionPages(["operational-workflow", "definition-economics", "signal-method"]);
  if (pages.length === 0) notFound();
  return <AcquisitionContentHub title="Build an outbound system you can diagnose." description="Explicit rules, equations and working methods. No universal benchmarks. No claim that a signal proves intent." pages={pages} asset="outbound-content-hub" />;
}
