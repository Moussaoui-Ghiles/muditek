import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getArchiveFacets, listArchive, USE_CASES } from "@/lib/workflow-archive";
import ArchiveContent from "./archive-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "n8n & Make.com Workflows · Muditek Portal",
  description: "Searchable archive of n8n and Make.com workflows. Download single JSONs or folder bundles.",
};

const PAGE_SIZE = 100;

export default async function WorkflowArchivePage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in?redirect_url=/portal/workflow-archive");
  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/portal/workflow-archive");

  const [facets, items] = await Promise.all([
    getArchiveFacets(),
    listArchive({ limit: PAGE_SIZE }),
  ]);

  return (
    <ArchiveContent
      initialItems={items}
      facets={facets}
      pageSize={PAGE_SIZE}
      useCases={USE_CASES.map((u) => ({ id: u.id, label: u.label }))}
    />
  );
}
