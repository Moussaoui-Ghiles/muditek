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
import { SHOW_MUDIKIT_IN_PORTAL } from "@/lib/portal-features";
import { PORTAL_TOOLS, type PortalTool } from "@/app/portal/tools-catalog";

type AccessFilter = "all" | "mudikit";

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
        {locked ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
            <Lock className="size-3" /> MudiKit
          </span>
        ) : tool.access === "mudikit" ? (
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-300/85">
            MudiKit
          </span>
        ) : null}
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
          {locked ? "Preview" : "Launch"}
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
  const visibleTools = useMemo(
    () => (SHOW_MUDIKIT_IN_PORTAL ? PORTAL_TOOLS : PORTAL_TOOLS.filter((tool) => tool.access === "free")),
    []
  );

  const counts = useMemo(() => {
    const included = visibleTools.filter((tool) => tool.access === "free").length;
    const paid = visibleTools.length - included;
    const locked = visibleTools.filter((tool) => isToolLocked(tool, access)).length;
    return { total: visibleTools.length, included, paid, locked };
  }, [access, visibleTools]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return visibleTools.filter((tool) => {
      if (accessFilter === "mudikit" && tool.access !== "mudikit") return false;
      if (!needle) return true;
      const haystack = [tool.title, tool.short, tool.description, tool.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, accessFilter, visibleTools]);

  const grid = filtered;
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
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-10 sm:px-6 md:flex-row md:items-end md:justify-between md:pb-12 md:pt-14 lg:px-10">
          <div className="reveal">
            <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
              <span aria-hidden className="h-px w-8 bg-primary/50" />
              Workbenches
            </p>
            <h1 className="mt-4 text-[32px] font-semibold leading-[1.05] tracking-[-0.025em] text-foreground sm:text-[40px] md:text-[44px]">
              Tools
            </h1>
            <p className="mt-3 max-w-xl text-[14px] leading-[1.6] text-foreground/60">
              Calculators and lead-finding workbenches that run inside the portal.
            </p>
          </div>
          <dl className="reveal reveal-delay-1 flex flex-wrap items-end gap-x-6 gap-y-3 md:border-l md:border-white/[0.07] md:pl-6">
            <Stat label="Live" value={counts.total} />
            {counts.paid > 0 && <Stat label="MudiKit" value={counts.paid} />}
            {counts.locked > 0 && <Stat label="Locked" value={counts.locked} accent />}
          </dl>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-10">
        {counts.total === 0 ? (
          <EmptyState />
        ) : (
          <>
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
                        <FilterPill active={accessFilter === "mudikit"} onClick={() => setAccessFilter("mudikit")}>
                          MudiKit only <span className="ml-2 opacity-60">{counts.paid}</span>
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
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/[0.04] pb-3">
                <h2 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/55">
                  <span aria-hidden className="h-px w-6 bg-white/20" />
                  {query.trim().length > 0 || accessFilter !== "all" ? `Results · ${filtered.length}` : "All workbenches"}
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

            {!access.isMudikit && !access.isAdmin && counts.locked > 0 && (
              <section className="mesh-subtle relative mt-16 overflow-hidden rounded-[2px] border border-primary/20 bg-card/[0.4] backdrop-blur-md">
                <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-primary/10 blur-[80px]" />
                <div className="relative grid gap-8 p-10 md:grid-cols-[1.1fr_auto] md:items-center md:p-12">
                  <div>
                    <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                      <Lock className="size-3.5" />
                      MudiKit
                    </p>
                    <h3 className="mt-5 max-w-xl text-[26px] font-black leading-[1] tracking-[-0.025em] text-foreground md:text-[34px]">
                      Unlock the paid workbenches.
                    </h3>
                    <p className="mt-4 max-w-lg text-[13.5px] leading-7 text-foreground/65">
                      Included tools stay accessible. Paid tools appear inside the same MudiKit account.
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
