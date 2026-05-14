import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Lock, Wrench } from "lucide-react";
import AssetDetailContent, { type AssetLabels } from "@/components/portal/asset-detail-content";
import { getPortalTool } from "@/app/portal/tools-catalog";
import { RevenueLeakWorkbench } from "@/components/portal/revenue-leak-workbench";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  buildAssetAccess,
  getDownloadHref,
  getHTMLContent,
  getPdfPageImages,
  loadAssetBySlugAndCategories,
} from "@/lib/portal-asset-loader";

export const dynamic = "force-dynamic";

const TOOL_CATEGORIES = ["tool", "automation", "template"];

const LABELS: AssetLabels = {
  kindSingular: "Tool",
  kindPlural: "Tools",
  backHref: "/portal/tools",
  backLabel: "All tools",
  notFoundBody: "No tool exists at this slug, or it is no longer published.",
  lockedTitle: "MudiKit unlocks this tool",
  lockedBody: "MudiKit gives access to every paid tool, automation, and template.",
  emptyAssetBody: "This tool exists in the library, but no asset has been attached yet.",
};

function ToolWorkbench({
  slug,
  title,
  description,
}: {
  slug: string;
  title: string;
  description: string;
}) {
  if (slug === "revenue-leak-calculator") {
    return <RevenueLeakWorkbench />;
  }

  return (
    <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.012] p-8 text-[13.5px] leading-7 text-muted-foreground">
      {title} exists in the tool catalog, but no portal component is attached yet.
      <span className="mt-1 block">{description}</span>
    </div>
  );
}

function WorkbenchPage({
  slug,
  title,
  description,
  category,
  locked,
}: {
  slug: string;
  title: string;
  description: string;
  category: string;
  locked: boolean;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <Link
        href="/portal/tools"
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        All tools
      </Link>

      <header className="mt-6 grid gap-8 border-b border-white/[0.06] pb-8 md:grid-cols-[1.35fr_0.65fr] md:items-end">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            <Wrench className="size-3.5" />
            Tool · {category}
          </p>
          <h1 className="text-[40px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[52px]">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-2 md:justify-end">
          <Badge
            variant="outline"
            className={
              locked
                ? "rounded-full border-white/[0.1] bg-white/[0.03] px-3 py-1 text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground"
                : "rounded-full border-emerald-300/25 bg-emerald-400/[0.08] px-3 py-1 text-[10.5px] uppercase tracking-[0.16em] text-emerald-200"
            }
          >
            {locked ? "MudiKit only" : "Available"}
          </Badge>
        </div>
      </header>

      <section className="mt-8">
        {locked ? (
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018] p-8">
            <div className="flex max-w-xl flex-col items-start">
              <span className="mb-5 flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
                <Lock className="size-4" />
              </span>
              <h2 className="text-[24px] font-semibold tracking-tight text-foreground">
                Unlock this workbench with MudiKit
              </h2>
              <p className="mt-2 text-[13.5px] leading-6 text-muted-foreground">
                This tool is attached to the paid library. Free tools stay open in the portal.
              </p>
              <Button render={<Link href="/portal/mudikit" />} nativeButton={false} size="lg" className="mt-6">
                Open MudiKit
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <ToolWorkbench slug={slug} title={title} description={description} />
        )}
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${slug} · Tools · Muditek Portal` };
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();
  if (!slug) redirect("/portal/tools");

  const target = `/portal/tools/${encodeURIComponent(slug)}`;
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(target)}`;

  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect(signInHref);
  const user = await currentUser();
  if (!user) redirect(signInHref);
  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect(signInHref);

  const access = await buildAssetAccess(email, user.id);
  const item = await loadAssetBySlugAndCategories(slug, TOOL_CATEGORIES);
  const displayName = user.firstName || email.split("@")[0];

  if (!item) {
    const workbench = getPortalTool(slug);
    if (workbench) {
      const locked = workbench.access === "mudikit" && !access.isMudikit && !access.isAdmin;
      return (
        <WorkbenchPage
          slug={workbench.slug}
          title={workbench.title}
          description={workbench.description}
          category={workbench.category}
          locked={locked}
        />
      );
    }
    return (
      <AssetDetailContent
        item={null}
        access={access}
        email={email}
        displayName={displayName}
        html={null}
        pageImages={[]}
        downloadHref={null}
        labels={LABELS}
      />
    );
  }

  const hasAccess = item.is_free || access.isMudikit || access.isAdmin;
  const html = hasAccess ? getHTMLContent(item.slug) : null;
  const pageImages = hasAccess ? getPdfPageImages(item.slug) : [];
  const downloadHref = hasAccess ? getDownloadHref(item) : null;

  return (
    <AssetDetailContent
      item={item}
      access={access}
      email={email}
      displayName={displayName}
      html={html}
      pageImages={pageImages}
      downloadHref={downloadHref}
      labels={LABELS}
    />
  );
}
