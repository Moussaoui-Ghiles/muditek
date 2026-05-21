import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react";
import { getPortalTool } from "@/app/portal/tools-catalog";
import { GoogleMapsLeadWorkbench } from "@/components/portal/google-maps-lead-workbench";
import { LinkedInSerperLeadWorkbench } from "@/components/portal/linkedin-serper-lead-workbench";
import { RevenueLeakWorkbench } from "@/components/portal/revenue-leak-workbench";
import { buildAssetAccess } from "@/lib/portal-asset-loader";
import { SHOW_MUDIKIT_IN_PORTAL } from "@/lib/portal-features";

export const dynamic = "force-dynamic";

function ToolWorkbench({
  slug,
}: {
  slug: string;
}) {
  if (slug === "revenue-leak-calculator") {
    return <RevenueLeakWorkbench />;
  }
  if (slug === "google-maps-lead-finder") return <GoogleMapsLeadWorkbench />;
  if (slug === "linkedin-serper-lead-finder") return <LinkedInSerperLeadWorkbench />;
  return null;
}

function WorkbenchHeroAside({ slug }: { slug: string }) {
  if (slug === "revenue-leak-calculator") {
    return (
      <aside className="card-lift relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-7 backdrop-blur-md">
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-[60px]" />
        <p className="relative z-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300/80">
          <span aria-hidden className="inline-flex size-1.5 animate-pulse rounded-full bg-emerald-400" />
          What this returns
        </p>
        <h2 className="relative z-10 mt-3 text-[20px] font-black leading-tight tracking-[-0.02em] text-foreground md:text-[22px]">
          Euro-denominated leakage with the formulas and the benchmark each number is grounded in.
        </h2>
        <ul className="relative z-10 mt-6 space-y-2.5 text-[12.5px] leading-6 text-foreground/70">
          <li className="flex items-baseline gap-3">
            <span aria-hidden className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/80">01</span>
            Speed-to-lead: InsideSales · HBR
          </li>
          <li className="flex items-baseline gap-3">
            <span aria-hidden className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/80">02</span>
            Pipeline conversion: OpenView · HubSpot
          </li>
          <li className="flex items-baseline gap-3">
            <span aria-hidden className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/80">03</span>
            Revenue churn: Bessemer · SaaS Capital
          </li>
          <li className="flex items-baseline gap-3">
            <span aria-hidden className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/80">04</span>
            Lead source ROI: channel spend vs pipeline
          </li>
          <li className="flex items-baseline gap-3">
            <span aria-hidden className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/80">05</span>
            Outbound performance: meeting-rate benchmark
          </li>
        </ul>
      </aside>
    );
  }
  return (
    <aside className="card-lift relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-7 backdrop-blur-md">
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-[60px]" />
      <p className="relative z-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300/80">
        <span aria-hidden className="inline-flex size-1.5 animate-pulse rounded-full bg-emerald-400" />
        Live data
      </p>
      <h2 className="relative z-10 mt-3 text-[20px] font-black leading-tight tracking-[-0.02em] text-foreground md:text-[22px]">
        This tool only shows results returned by the connected API.
      </h2>
      <p className="relative z-10 mt-4 text-[13px] leading-6 text-foreground/65">
        If an API key is missing, the workbench returns a setup message instead of invented results.
      </p>
    </aside>
  );
}

function toolTrustLabel(slug: string): string {
  if (slug === "revenue-leak-calculator") return "Cited benchmarks";
  if (slug === "google-maps-lead-finder") return "Apify backed";
  if (slug === "linkedin-serper-lead-finder") return "Serper backed";
  return "Portal workbench";
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
  const titleParts = title.split(" ");
  const lastWord = titleParts.pop() ?? title;
  const restWords = titleParts.join(" ");

  return (
    <main className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="mesh-subtle pointer-events-none absolute inset-0 opacity-60" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 md:pb-20 md:pt-14 lg:px-10">
          <Link
            href="/portal/tools"
            className="inline-flex items-center gap-2 text-[10.5px] font-black uppercase tracking-[0.25em] text-foreground/55 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            All tools
          </Link>

          <div className="reveal mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <p className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                <span aria-hidden className="h-px w-6 bg-primary/50" />
                Tool · {category}
                <span aria-hidden className="text-foreground/30">·</span>
                {locked ? (
                  <span className="inline-flex items-center gap-1.5 text-foreground/55">
                    <Lock className="size-3" /> MudiKit only
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-emerald-300/90">
                    <span aria-hidden className="inline-flex size-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Available
                  </span>
                )}
              </p>
              <h1 className="mt-6 text-[40px] font-black leading-[0.92] tracking-[-0.04em] text-foreground md:text-[68px]">
                {restWords ? <>{restWords} </> : null}
                <span className="text-primary italic font-medium">{lastWord}.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-[15px] leading-[1.75] text-foreground/65">
                {description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-[2px] border border-white/[0.1] bg-white/[0.025] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-foreground/75">
                  Workbench
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">
                  <span aria-hidden className="inline-block size-1.5 rounded-full bg-emerald-300/80" />
                  Runs in browser
                </span>
                <span className="inline-flex items-center rounded-[2px] border border-white/[0.1] bg-white/[0.025] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-foreground/75">
                  Portal account
                </span>
                <span className="inline-flex items-center rounded-[2px] border border-white/[0.1] bg-white/[0.025] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-foreground/75">
                  {toolTrustLabel(slug)}
                </span>
              </div>
            </div>
            <WorkbenchHeroAside slug={slug} />
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        {locked ? (
          <section className="card-lift relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] backdrop-blur-md">
            <div className="pointer-events-none absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
            <div className="relative flex flex-col gap-6 p-10 md:p-12">
              <span className="flex size-12 items-center justify-center rounded-[2px] border border-primary/30 bg-primary/10 text-primary">
                <Lock className="size-4" />
              </span>
              <h2 className="max-w-2xl text-[28px] font-black leading-[1] tracking-[-0.025em] text-foreground md:text-[36px]">
                Unlock this workbench with{" "}
                <span className="text-primary italic font-medium">MudiKit</span>.
              </h2>
              <p className="max-w-xl text-[14px] leading-7 text-foreground/65">
                This tool is attached to the paid library. Open workbenches stay open to every
                portal account.
              </p>
              <Link
                href="/portal/mudikit"
                className="group btn-press relative inline-flex items-center justify-center self-start overflow-hidden rounded-[2px] bg-foreground px-10 py-5 text-[11px] font-black uppercase tracking-[0.22em] text-background"
              >
                <span className="relative z-10 inline-flex items-center gap-3">
                  Open MudiKit
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </span>
                <span className="absolute inset-0 z-0 w-0 bg-primary transition-all duration-500 ease-in-out group-hover:w-full" />
              </Link>
            </div>
          </section>
        ) : (
          <section>
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/[0.04] pb-4">
              <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/55">
                <span aria-hidden className="h-px w-6 bg-white/20" />
                Live · runs in your browser
              </h2>
              <span className="text-[10.5px] font-black uppercase tracking-[0.2em] text-foreground/55">
                Inputs to diagnosis
              </span>
            </div>
            <ToolWorkbench slug={slug} />
          </section>
        )}
      </div>
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
  const workbench = getPortalTool(slug);

  if (!workbench) redirect("/portal/tools");
  if (!SHOW_MUDIKIT_IN_PORTAL && workbench.access === "mudikit") redirect("/portal/tools");

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
