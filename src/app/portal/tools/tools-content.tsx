"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Calculator,
  Filter,
  Lock,
  MapPinned,
  Search,
  UserSearch,
  Wrench,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Input } from "@/components/ui/input";
import type { PortalAccess } from "@/lib/portal-access";
import { PORTAL_TOOLS, type PortalTool } from "@/app/portal/tools-catalog";

type AccessFilter = "all" | "included" | "mudikit";

function isToolLocked(tool: PortalTool, access: PortalAccess): boolean {
  return tool.access === "mudikit" && !access.isMudikit && !access.isAdmin;
}

function ToolIcon({ slug, className }: { slug: string; className?: string }) {
  if (slug.includes("maps")) return <MapPinned className={className} />;
  if (slug.includes("linkedin")) return <UserSearch className={className} />;
  if (slug.includes("calculator")) return <Calculator className={className} />;
  return <Wrench className={className} />;
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[9.5px] font-black uppercase tracking-[0.25em] text-foreground/55">
        {label}
      </dt>
      <dd
        className={
          accent
            ? "text-[28px] font-black tracking-[-0.03em] text-emerald-300 tnum"
            : "text-[28px] font-black tracking-[-0.03em] text-foreground tnum"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "inline-flex h-9 items-center rounded-[2px] border border-primary/40 bg-primary/15 px-4 text-[10.5px] font-black uppercase tracking-[0.2em] text-primary transition-colors"
          : "inline-flex h-9 items-center rounded-[2px] border border-white/[0.08] bg-white/[0.025] px-4 text-[10.5px] font-black uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:border-white/[0.2] hover:bg-white/[0.05] hover:text-foreground"
      }
    >
      {children}
    </button>
  );
}

function toolFields(tool: PortalTool): { inputs: string; output: string } {
  if (tool.slug === "google-maps-lead-finder") {
    return {
      inputs: "Business type, location, max results",
      output: "Businesses, websites, phones, ratings, reviews, returned emails",
    };
  }
  if (tool.slug === "linkedin-serper-lead-finder") {
    return {
      inputs: "Role, market, company keyword, max results",
      output: "LinkedIn profile results returned by Serper",
    };
  }
  return {
    inputs: "Revenue, pipeline, churn, response time, channel spend",
    output: "Estimated annual leakage by category",
  };
}

function WorkbenchPreview({ tool, locked }: { tool: PortalTool; locked: boolean }) {
  const fields = toolFields(tool);
  return (
    <div className="relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-black/35 p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-foreground/45">
          Workbench
        </span>
        <span
          className={
            locked
              ? "inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary/80"
              : "inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300/80"
          }
        >
          {locked ? <Lock className="size-3" /> : <span aria-hidden className="size-1.5 rounded-full bg-emerald-300" />}
          {locked ? "Locked" : "Ready"}
        </span>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-foreground/38">
            Inputs
          </p>
          <p className="mt-1 text-[13px] leading-6 text-foreground/72">{fields.inputs}</p>
        </div>
        <div className="h-px w-full bg-white/[0.07]" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-foreground/38">
            Output
          </p>
          <p className="mt-1 text-[13px] leading-6 text-foreground/72">{fields.output}</p>
        </div>
      </div>
    </div>
  );
}

function FeaturedWorkbench({ tool, access }: { tool: PortalTool; access: PortalAccess }) {
  const locked = isToolLocked(tool, access);
  const parts = tool.title.split(" ");
  const lastWord = parts.pop() ?? tool.title;
  const restWords = parts.join(" ");

  return (
    <Link
      href={`/portal/tools/${encodeURIComponent(tool.slug)}`}
      className="group card-lift relative grid overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.42] p-3 transition-all duration-700 hover:border-white/[0.16] hover:bg-card/[0.6] md:grid-cols-[1.1fr_0.9fr] md:gap-8 md:p-4"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_360px_at_10%_-10%,rgba(16,185,129,0.12),transparent_58%)]" />
      <div className="pointer-events-none absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-400/0 to-transparent transition-all duration-[1.2s] group-hover:via-emerald-400/70" />

      <div className="relative z-10 flex min-w-0 flex-col justify-between gap-8 p-5 md:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            <span className="flex size-9 items-center justify-center rounded-[2px] border border-white/[0.08] bg-black/25 text-primary">
              <ToolIcon slug={tool.slug} className="size-4" />
            </span>
            Featured workbench
            <span className="inline-flex items-center gap-1.5 text-emerald-300/85">
              <span aria-hidden className="inline-flex size-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live
            </span>
          </div>
          <h2 className="mt-7 text-[38px] font-black leading-[0.94] tracking-[-0.035em] text-foreground sm:text-[52px] md:text-[62px]">
            {restWords ? <>{restWords} </> : null}
            <span className="text-primary italic font-medium">{lastWord}.</span>
          </h2>
          <p className="mt-5 max-w-[48ch] text-[14.5px] leading-[1.75] text-foreground/65">
            {tool.description}
          </p>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/[0.06] pt-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px] font-black uppercase tracking-[0.22em] text-foreground/55">
            <span>{tool.category}</span>
            <span aria-hidden className="h-3 w-px bg-white/15" />
            <span>{tool.access === "free" ? "Open" : "MudiKit"}</span>
            <span aria-hidden className="h-3 w-px bg-white/15" />
            <span>Runs in portal</span>
          </div>
          <span className="inline-flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.2em] text-foreground transition-colors group-hover:text-primary">
            {locked ? "View locked workbench" : "Open workbench"}
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center p-4 md:p-6">
        <WorkbenchPreview tool={tool} locked={locked} />
      </div>
    </Link>
  );
}

function WorkbenchCard({ tool, access }: { tool: PortalTool; access: PortalAccess }) {
  const locked = isToolLocked(tool, access);

  return (
    <Link
      href={`/portal/tools/${encodeURIComponent(tool.slug)}`}
      className="group card-lift relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.38] p-5 transition-all duration-700 hover:border-white/[0.16] hover:bg-card/[0.56]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(620px_260px_at_18%_-10%,rgba(16,185,129,0.10),transparent_58%)] opacity-80 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-center justify-between gap-4">
        <span className="flex size-10 items-center justify-center rounded-[2px] border border-white/[0.08] bg-black/25 text-primary">
          <ToolIcon slug={tool.slug} className="size-4" />
        </span>
        <span
          className={
            locked
              ? "inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/55"
              : "font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-300/80"
          }
        >
          {locked ? (
            <>
              <Lock className="size-3" /> MudiKit
            </>
          ) : (
            "Open"
          )}
        </span>
      </div>

      <div className="relative mt-8 flex-1">
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/45">
          {tool.category}
        </div>
        <h3 className="mt-3 text-[24px] font-black leading-[1] tracking-[-0.025em] text-foreground transition-colors group-hover:text-primary">
          {tool.title}
        </h3>
        <p className="mt-4 text-[13.5px] leading-6 text-foreground/62">{tool.short}</p>
      </div>

      <div className="relative mt-8 border-t border-white/[0.07] pt-5">
        <div className="mb-5 grid grid-cols-3 gap-1.5">
          <span className="h-1.5 rounded-sm bg-emerald-300/50" />
          <span className="h-1.5 rounded-sm bg-primary/45" />
          <span className="h-1.5 rounded-sm bg-white/10" />
        </div>
        <span className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.18em] text-foreground/70 transition-colors group-hover:text-primary">
          {locked ? "Preview" : "Open"}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 flex min-h-64 flex-col items-start justify-center rounded-[2px] border border-dashed border-white/[0.1] bg-white/[0.015] p-10">
      <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
        <span aria-hidden className="h-px w-6 bg-primary/50" />
        Tools
      </p>
      <h3 className="mt-4 text-[24px] font-black leading-[1] tracking-[-0.02em] text-foreground">
        No live workbenches yet.
      </h3>
      <p className="mt-3 max-w-xl text-[13.5px] leading-7 text-foreground/65">
        New calculators and lead-finding tools will appear here once they are connected.
      </p>
    </div>
  );
}

export default function ToolsContent({
  access,
}: {
  access: PortalAccess;
  email: string;
  displayName: string;
}) {
  const [query, setQuery] = useState("");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("all");

  const counts = useMemo(() => {
    const included = PORTAL_TOOLS.filter((tool) => tool.access === "free").length;
    const paid = PORTAL_TOOLS.length - included;
    const locked = PORTAL_TOOLS.filter((tool) => isToolLocked(tool, access)).length;
    return { total: PORTAL_TOOLS.length, included, paid, locked };
  }, [access]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PORTAL_TOOLS.filter((tool) => {
      if (accessFilter === "included" && tool.access !== "free") return false;
      if (accessFilter === "mudikit" && tool.access !== "mudikit") return false;
      if (!needle) return true;
      const haystack = [tool.title, tool.short, tool.description, tool.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, accessFilter]);

  const isFilteredView = query.trim().length > 0 || accessFilter !== "all";
  const featured = !isFilteredView ? filtered[0] ?? null : null;
  const grid = featured ? filtered.slice(1) : filtered;
  const hasBothAccess = counts.included > 0 && counts.paid > 0;
  const showSearch = counts.total >= 3;

  return (
    <main className="relative">
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
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 md:grid-cols-[1.35fr_1fr] md:items-end md:gap-16 md:pb-20 md:pt-20 lg:px-10">
          <div className="reveal">
            <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
              <span aria-hidden className="h-px w-8 bg-primary/50" />
              Live tools
            </p>
            <h1 className="mt-6 text-[44px] font-black leading-[0.92] tracking-[-0.04em] text-foreground sm:text-[60px] md:text-[78px]">
              Run live <span className="text-primary italic font-medium">workbenches.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-foreground/65">
              Calculators and lead-finding tools that turn inputs into usable outputs inside the portal.
            </p>
          </div>
          <dl className="reveal reveal-delay-1 grid grid-cols-2 gap-x-6 gap-y-6 self-end border-l border-white/[0.07] pl-6 md:grid-cols-2 md:pl-10">
            <Stat label="Live" value={counts.total} />
            <Stat label="Open" value={counts.included} />
            <Stat label="MudiKit" value={counts.paid} />
            <Stat label="Locked" value={counts.locked} accent={counts.locked > 0} />
          </dl>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        {counts.total === 0 ? (
          <EmptyState />
        ) : (
          <>
            {featured && (
              <ScrollReveal>
                <section className="mb-14">
                  <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/[0.04] pb-4">
                    <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/55">
                      <span aria-hidden className="h-px w-6 bg-white/20" />
                      Featured workbench
                    </h2>
                    <Link
                      href="/portal/playbooks"
                      className="text-[10.5px] font-black uppercase tracking-[0.2em] text-foreground/55 transition-colors hover:text-primary"
                    >
                      Open resources
                    </Link>
                  </div>
                  <FeaturedWorkbench tool={featured} access={access} />
                </section>
              </ScrollReveal>
            )}

            {(hasBothAccess || showSearch) && (
              <section className="sticky top-14 z-20 -mx-4 mb-10 border-y border-white/[0.06] bg-[#0a0a0c]/85 px-4 py-3.5 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/55">
                      <Filter className="size-3" />
                      Browse
                    </span>
                    {hasBothAccess && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <FilterPill active={accessFilter === "all"} onClick={() => setAccessFilter("all")}>
                          All
                        </FilterPill>
                        <FilterPill active={accessFilter === "included"} onClick={() => setAccessFilter("included")}>
                          Open <span className="ml-2 opacity-60">{counts.included}</span>
                        </FilterPill>
                        <FilterPill active={accessFilter === "mudikit"} onClick={() => setAccessFilter("mudikit")}>
                          MudiKit <span className="ml-2 opacity-60">{counts.paid}</span>
                        </FilterPill>
                      </div>
                    )}
                  </div>
                  {showSearch && (
                    <div className="flex min-w-0 items-center gap-2 rounded-[2px] border border-white/[0.08] bg-white/[0.025] px-3 lg:w-[300px]">
                      <Search className="size-3.5 shrink-0 text-foreground/55" />
                      <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search workbenches"
                        className="h-9 w-full border-0 bg-transparent px-0 text-[13px] focus-visible:ring-0"
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            <section>
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/[0.04] pb-4">
                <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/55">
                  <span aria-hidden className="h-px w-6 bg-white/20" />
                  {isFilteredView ? `Results · ${filtered.length}` : "All live workbenches"}
                </h2>
                {counts.locked > 0 && (
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/55">
                    {counts.locked} {counts.locked === 1 ? "tool" : "tools"} need MudiKit
                  </span>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="rounded-[2px] border border-dashed border-white/[0.1] bg-white/[0.015] p-10 text-[13.5px] text-foreground/65">
                  Nothing matches the current search and filters. Try removing one or two.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {grid.map((tool, i) => (
                    <ScrollReveal key={tool.slug} delay={Math.min(i * 60, 360)}>
                      <WorkbenchCard tool={tool} access={access} />
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </section>

            {!access.isMudikit && !access.isAdmin && counts.locked > 0 && accessFilter !== "included" && (
              <section className="mesh-subtle relative mt-16 overflow-hidden rounded-[2px] border border-primary/20 bg-card/[0.4] backdrop-blur-md">
                <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-primary/10 blur-[80px]" />
                <div className="relative grid gap-8 p-10 md:grid-cols-[1.1fr_auto] md:items-center md:p-12">
                  <div>
                    <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                      <Lock className="size-3.5" />
                      MudiKit
                    </p>
                    <h3 className="mt-5 max-w-xl text-[26px] font-black leading-[1] tracking-[-0.025em] text-foreground md:text-[34px]">
                      Unlock the paid workbenches when they ship.
                    </h3>
                    <p className="mt-4 max-w-lg text-[13.5px] leading-7 text-foreground/65">
                      Open tools stay open. Paid tools appear here as part of the same MudiKit account.
                    </p>
                  </div>
                  <Link
                    href="/portal/mudikit"
                    className="group btn-press relative inline-flex items-center justify-center overflow-hidden rounded-[2px] bg-foreground px-10 py-5 text-[12px] font-black uppercase tracking-[0.2em] text-background"
                  >
                    <span className="relative z-10 inline-flex items-center gap-3">
                      View MudiKit
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </span>
                    <span className="absolute inset-0 z-0 w-0 bg-primary transition-all duration-500 ease-in-out group-hover:w-full" />
                  </Link>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
