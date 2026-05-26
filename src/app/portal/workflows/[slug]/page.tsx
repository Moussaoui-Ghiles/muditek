import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { loadWorkflowBySlug } from "@/lib/workflow-loader";
import { parseWorkflow } from "@/lib/workflow-parse";
import { WorkflowCanvas } from "@/components/portal/workflow-canvas";
import { WorkflowModules } from "@/components/portal/workflow-modules";
import { appColorClasses, prettyAppLabel } from "@/lib/workflow-app-labels";
import { WorkflowJsonActions } from "./workflow-json-actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${slug} · Workflows · Muditek Portal` };
}


export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();
  if (!slug) redirect("/portal/workflows");

  const target = `/portal/workflows/${encodeURIComponent(slug)}`;
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(target)}`;

  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect(signInHref);
  const user = await currentUser();
  if (!user) redirect(signInHref);
  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect(signInHref);

  const data = await loadWorkflowBySlug(slug);

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-10">
        <Link
          href="/portal/workflows"
          className="inline-flex items-center gap-1.5 text-[12px] text-white/60 hover:text-white"
        >
          <ArrowLeft className="size-3.5" /> All workflows
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-white">Workflow not found</h1>
        <p className="mt-2 text-[14px] text-white/55">No workflow exists at this slug, or it has been removed.</p>
      </div>
    );
  }

  const { workflow, item } = data;
  const parsed = parseWorkflow(workflow.raw_json, item.title);
  const downloadHref = `/api/portal/workflows/${encodeURIComponent(slug)}/download`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
      <Link
        href="/portal/workflows"
        className="inline-flex items-center gap-1.5 text-[12px] text-white/55 hover:text-white"
      >
        <ArrowLeft className="size-3.5" /> All workflows
      </Link>

      <header className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-white/45">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.1] bg-white/[0.03] px-1.5 py-[2px]">
              <span className={workflow.format === "n8n" ? "text-orange-300" : "text-violet-300"}>●</span>
              {workflow.format === "n8n" ? "n8n" : "Make.com"}
            </span>
            <span>{workflow.node_count} nodes</span>
            <span>·</span>
            <span>{workflow.apps.length} apps</span>
          </div>
          <h1 className="mt-2 text-[26px] font-semibold leading-tight text-white">{item.title}</h1>
          {item.description && (
            <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/65">{item.description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <WorkflowJsonActions slug={slug} downloadHref={downloadHref} />
          <a
            href={downloadHref}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/[0.14] bg-white px-3 text-[12px] font-medium text-black hover:bg-white/90"
          >
            <Download className="size-3.5" /> JSON
          </a>
        </div>
      </header>

      <section className="mt-6">
        {parsed?.format === "n8n" ? (
          <WorkflowCanvas parsed={parsed} />
        ) : parsed?.format === "make" ? (
          <WorkflowModules parsed={parsed} />
        ) : (
          <div className="rounded-md border border-white/[0.08] bg-[#141414] p-4 text-[13px] text-white/55">
            Could not parse this workflow JSON.
          </div>
        )}
      </section>

      {workflow.apps.length > 0 && (
        <section className="mt-8">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Apps & nodes ({workflow.apps.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {workflow.apps.map((app) => {
              const c = appColorClasses(app);
              return (
                <span
                  key={app}
                  className={
                    "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] " + c.chip
                  }
                >
                  <span className={"size-1.5 rounded-full " + c.dot} />
                  {prettyAppLabel(app)}
                </span>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
