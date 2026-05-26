import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWorkflowFacets, listWorkflows } from "@/lib/workflow-loader";
import WorkflowsContent from "./workflows-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Workflows · Muditek Portal",
  description: "n8n and Make.com automations — visual canvas + JSON download for every workflow.",
};

const PAGE_SIZE = 60;

export default async function PortalWorkflowsPage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in?redirect_url=/portal/workflows");
  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/portal/workflows");

  const [facets, initialItems] = await Promise.all([
    getWorkflowFacets({ named_only: true }),
    listWorkflows({ limit: PAGE_SIZE, named_only: true, sort: "newest" }),
  ]);

  return (
    <WorkflowsContent
      initialItems={initialItems}
      facets={facets}
      pageSize={PAGE_SIZE}
    />
  );
}
