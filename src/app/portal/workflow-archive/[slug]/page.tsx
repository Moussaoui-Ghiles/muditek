import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getPublicWorkflow,
  WORKFLOW_CATEGORY_META,
} from "@/lib/workflows-public";
import { WorkflowDownloadButton } from "./download-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = getPublicWorkflow(slug);
  return {
    title: `${w ? w.title : slug} · Workflows · Muditek Portal`,
  };
}

function nodeSteps(flow: string): string[] {
  return flow
    .split(/\s*(?:->|;)\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function WorkflowArchiveDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();
  if (!slug) redirect("/portal/workflow-archive");

  const target = `/portal/workflow-archive/${encodeURIComponent(slug)}`;
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(target)}`;

  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect(signInHref);
  const user = await currentUser();
  if (!user) redirect(signInHref);

  const w = getPublicWorkflow(slug);
  if (!w) redirect("/portal/workflow-archive");

  const cat = WORKFLOW_CATEGORY_META[w.category];
  const steps = nodeSteps(w.nodeFlow);
  const paragraphs = w.excerpt.split(/\n\n+/).filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-[900px] px-5 py-8 md:px-8 md:py-12">
      <Link
        href="/portal/workflow-archive"
        className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-foreground/45 transition-colors hover:text-foreground/80"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All workflows
      </Link>

      <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
        {cat.label} · n8n Workflow
      </p>
      <h1 className="mb-5 text-2xl font-black leading-[1.12] tracking-[-0.02em] text-foreground md:text-4xl">
        {w.title}
      </h1>
      <p className="mb-7 max-w-2xl text-base font-light leading-relaxed text-foreground/70 md:text-lg">
        {w.outcome}
      </p>

      <div className="mb-8 flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-foreground/45">
        <span className="rounded-[3px] border border-white/[0.08] px-3 py-1.5">
          {w.nodeCount} nodes
        </span>
        <span className="rounded-[3px] border border-white/[0.08] px-3 py-1.5">
          {w.integrations} integrations
        </span>
        <span className="rounded-[3px] border border-white/[0.08] px-3 py-1.5">
          n8n / JSON
        </span>
      </div>

      <div className="mb-12 rounded-[6px] border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
        <WorkflowDownloadButton slug={w.slug} />
        <p className="mt-3 text-[11px] font-mono uppercase tracking-[0.18em] text-foreground/40">
          Importable n8n JSON. Credentials are never included, you connect your own.
        </p>
      </div>

      {/* What it does */}
      <section className="mb-10">
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-foreground/55">
          What it does
        </h2>
        <p className="text-base font-light leading-relaxed text-foreground/85">
          {w.whatItDoes}
        </p>
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-foreground/55">
          How it works
        </h2>
        <div className="space-y-4 text-[15px] font-light leading-relaxed text-foreground/80">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Node graph */}
      <section className="mb-10">
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-foreground/55">
          The node graph
        </h2>
        <ol className="relative ml-2 border-l border-white/[0.1]">
          {steps.map((step, i) => (
            <li key={i} className="relative pb-4 pl-7 last:pb-0">
              <span className="absolute -left-[5px] top-[7px] h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <p className="text-sm font-light leading-relaxed text-foreground/80">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Apps */}
      <section className="mb-10">
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-foreground/55">
          Apps it connects
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {w.apps.map((a) => (
            <span
              key={a}
              className="rounded-[4px] border border-white/[0.08] bg-card/[0.3] px-4 py-2 text-sm font-medium text-foreground/80"
            >
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* Import + setup */}
      <section className="mb-10">
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-foreground/55">
          Import into n8n
        </h2>
        <ol className="mb-8 space-y-2.5 text-[15px] font-light leading-relaxed text-foreground/80">
          <li>1. Download the workflow JSON above.</li>
          <li>2. In n8n, open Workflows, then choose Import from File.</li>
          <li>3. Select the downloaded {w.slug}.json file.</li>
          <li>4. Open each node that needs an account and connect your own credentials.</li>
          <li>5. Work through the setup checklist below, then activate the workflow.</li>
        </ol>

        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-foreground/55">
          Setup checklist
        </h2>
        <div className="space-y-3">
          {w.setupSteps.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-[4px] border border-white/[0.06] bg-card/[0.2] px-5 py-4"
            >
              <span className="w-6 shrink-0 text-sm font-black text-emerald-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-light leading-relaxed text-foreground/80">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-[6px] border border-white/[0.06] bg-card/[0.15] p-6">
        <p className="text-sm font-light leading-relaxed text-foreground/70">
          Want this built for you, wired into your stack and owned by your team?{" "}
          <Link
            href="/portal"
            className="font-bold text-emerald-400 hover:underline"
          >
            Explore the rest of the portal
          </Link>
          : hundreds of workflows, operator AI skills, and agent playbooks.
        </p>
      </div>
    </div>
  );
}
