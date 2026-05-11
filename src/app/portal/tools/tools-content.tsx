"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Lock,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";
import { PORTAL_TOOLS, type PortalTool } from "@/app/portal/tools-catalog";

type AccessFilter = "all" | "free" | "mudikit";

function isAccessible(item: ContentItem, access: PortalAccess): boolean {
  if (item.is_free) return true;
  return access.isMudikit || access.isAdmin;
}

function ToolRow({ item, access }: { item: ContentItem; access: PortalAccess }) {
  const accessible = isAccessible(item, access);
  return (
    <Link
      href={`/portal/tools/${encodeURIComponent(item.slug)}`}
      className="group grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/[0.06] px-3 py-3 transition-colors hover:bg-white/[0.025]"
    >
      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.03]">
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : accessible ? (
          <Wrench className="size-4 text-muted-foreground" />
        ) : (
          <Lock className="size-4 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[14px] font-medium text-foreground">{item.title}</h3>
          {item.is_new && (
            <Badge variant="default" className="h-4 rounded-md px-1.5 text-[10px]">
              New
            </Badge>
          )}
        </div>
        {item.description && (
          <p className="mt-0.5 line-clamp-1 text-[12.5px] leading-5 text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {item.file_type && (
          <Badge variant="outline" className="hidden h-5 rounded-md text-[10px] uppercase tracking-[0.1em] sm:inline-flex">
            {item.file_type.toUpperCase()}
          </Badge>
        )}
        <Badge
          variant={item.is_free ? "secondary" : "outline"}
          className="h-5 rounded-md text-[10px] uppercase tracking-[0.1em]"
        >
          {item.is_free ? "Free" : accessible ? "MudiKit" : "Locked"}
        </Badge>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </Link>
  );
}

function WorkbenchRow({ tool, access }: { tool: PortalTool; access: PortalAccess }) {
  const locked = tool.access === "mudikit" && !access.isMudikit;
  return (
    <Link
      href={`/portal/tools/${encodeURIComponent(tool.slug)}`}
      className="group grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/[0.06] px-3 py-3 transition-colors hover:bg-white/[0.025]"
    >
      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.03]">
        {locked ? <Lock className="size-4 text-muted-foreground" /> : <Wrench className="size-4 text-muted-foreground" />}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[14px] font-medium text-foreground">{tool.title}</h3>
          <Badge variant="outline" className="h-4 rounded-md px-1.5 text-[10px]">
            Interactive
          </Badge>
        </div>
        <p className="mt-0.5 line-clamp-1 text-[12.5px] leading-5 text-muted-foreground">{tool.short}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="hidden h-5 rounded-md text-[10px] uppercase tracking-[0.1em] sm:inline-flex">
          {tool.category}
        </Badge>
        <Badge
          variant={tool.access === "free" ? "secondary" : "outline"}
          className="h-5 rounded-md text-[10px] uppercase tracking-[0.1em]"
        >
          {tool.access === "free" ? "Free" : locked ? "MudiKit only" : "MudiKit"}
        </Badge>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-56 flex-col items-start justify-center rounded-lg border border-dashed border-white/[0.1] bg-white/[0.015] p-6">
      <div className="mb-4 flex size-10 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
        <Sparkles className="size-4" />
      </div>
      <h3 className="text-sm font-medium text-foreground">No tools published yet</h3>
      <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
        Interactive utilities will appear here as they are added. The portal never lists tools that do not exist.
      </p>
    </div>
  );
}

function UpgradeRow({ count }: { count: number }) {
  return (
    <div className="mt-8 flex flex-col gap-3 rounded-lg border border-white/[0.1] bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-muted-foreground">
          <Lock className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="text-sm font-medium text-foreground">
            {count} {count === 1 ? "tool requires" : "tools require"} MudiKit
          </div>
          <p className="mt-0.5 text-[12.5px] leading-5 text-muted-foreground">
            MudiKit unlocks every paid workbench, automation, and template.
          </p>
        </div>
      </div>
      <Button render={<Link href="/mudikit" />} nativeButton={false}>
        Unlock MudiKit
        <ArrowUpRight className="size-4" />
      </Button>
    </div>
  );
}

export default function ToolsContent({
  items,
  access,
  email,
}: {
  items: ContentItem[];
  access: PortalAccess;
  email: string;
}) {
  const [query, setQuery] = useState("");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("all");

  const workbenches = PORTAL_TOOLS;
  const totalCount = workbenches.length + items.length;

  const counts = useMemo(() => {
    const dbFree = items.filter((i) => i.is_free).length;
    const dbPaid = items.length - dbFree;
    const wbFree = workbenches.filter((w) => w.access === "free").length;
    const wbPaid = workbenches.length - wbFree;
    return {
      free: dbFree + wbFree,
      paid: dbPaid + wbPaid,
    };
  }, [items, workbenches]);

  const hasBothAccess = counts.free > 0 && counts.paid > 0;
  const showSearch = totalCount >= 5;

  const lockedCount = useMemo(() => {
    const dbLocked = items.filter((i) => !i.is_free && !(access.isMudikit || access.isAdmin)).length;
    const wbLocked = workbenches.filter((w) => w.access === "mudikit" && !access.isMudikit).length;
    return dbLocked + wbLocked;
  }, [items, workbenches, access]);

  const filteredWorkbenches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return workbenches.filter((tool) => {
      if (accessFilter === "free" && tool.access !== "free") return false;
      if (accessFilter === "mudikit" && tool.access !== "mudikit") return false;
      if (!needle) return true;
      const haystack = [tool.title, tool.short, tool.category].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [workbenches, query, accessFilter]);

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (accessFilter === "free" && !item.is_free) return false;
      if (accessFilter === "mudikit" && item.is_free) return false;
      if (!needle) return true;
      const haystack = [item.title, item.description, item.category, item.file_type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [items, query, accessFilter]);

  const totalFiltered = filteredWorkbenches.length + filteredItems.length;

  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.07] bg-background/92 px-4 backdrop-blur md:px-6">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Portal
        </Link>
        <div className="flex flex-1 items-center justify-center gap-2">
          <Logo variant="mark" size={22} />
          <span className="text-[13px] font-semibold tracking-tight">Tools</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden truncate text-[11px] text-muted-foreground sm:inline">{email}</span>
          <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-7">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Library
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">
            Tools
          </h1>
          <p className="mt-2 max-w-xl text-[13.5px] leading-6 text-muted-foreground">
            Interactive calculators, scorecards, and operating tools. Workbenches run inside the portal; downloadable tools open from this list.
          </p>
        </div>

        {totalCount === 0 ? (
          <EmptyState />
        ) : (
          <>
            {(showSearch || hasBothAccess) && (
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {showSearch ? (
                  <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-2.5">
                    <Search className="size-4 shrink-0 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search tools"
                      className="h-9 w-full border-0 bg-transparent px-0 focus-visible:ring-0"
                    />
                  </div>
                ) : (
                  <span className="text-[12px] text-muted-foreground">
                    {totalCount} {totalCount === 1 ? "tool" : "tools"}
                  </span>
                )}
                {hasBothAccess && (
                  <div className="flex gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant={accessFilter === "all" ? "default" : "outline"}
                      onClick={() => setAccessFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={accessFilter === "free" ? "default" : "outline"}
                      onClick={() => setAccessFilter("free")}
                    >
                      Free
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={accessFilter === "mudikit" ? "default" : "outline"}
                      onClick={() => setAccessFilter("mudikit")}
                    >
                      MudiKit
                    </Button>
                  </div>
                )}
              </div>
            )}

            {totalFiltered === 0 ? (
              <div className="rounded-lg border border-dashed border-white/[0.1] bg-white/[0.015] p-6 text-[13px] text-muted-foreground">
                Nothing matches this filter.
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.015]">
                {filteredWorkbenches.map((tool) => (
                  <WorkbenchRow key={tool.slug} tool={tool} access={access} />
                ))}
                {filteredItems.map((item) => (
                  <ToolRow key={item.id} item={item} access={access} />
                ))}
              </div>
            )}

            {!access.isMudikit && !access.isAdmin && lockedCount > 0 && accessFilter !== "free" && (
              <UpgradeRow count={lockedCount} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
