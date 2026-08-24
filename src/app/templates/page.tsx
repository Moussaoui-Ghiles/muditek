import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AcquisitionContentHub } from "@/components/acquisition/content-hub";
import { getRenderableAcquisitionPages } from "@/lib/acquisition/content-registry";

export const metadata: Metadata = {
  title: "Free B2B Outbound Templates and Checklists | Muditek",
  description: "Editable outbound worksheets for qualification, market research, cohort tracking and buyer-signal evidence.",
  alternates: { canonical: "https://muditek.com/templates" },
};

export default function TemplatesHubPage() {
  const pages = getRenderableAcquisitionPages(["template"]);
  if (pages.length === 0) notFound();
  return <AcquisitionContentHub title="Outbound templates you can actually use." description="Download the working file. Replace the prompts with your evidence. Keep unknowns marked as unknown." pages={pages} asset="outbound-template-hub" />;
}
