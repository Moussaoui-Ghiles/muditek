"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext } from "react";
import { Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { PortalAccess } from "@/lib/portal-access";
import { PortalSidebar } from "./portal-sidebar";

const PortalShellMountedContext = createContext(false);

function tierLabel(access: PortalAccess): string {
  if (access.isAdmin) return "Admin";
  if (access.isMudikit) return "MudiKit";
  return "Free";
}

type Crumb = { href: string; label: string };

const LEAF_LABEL: Record<string, string> = {
  skills: "Skills",
  playbooks: "Playbooks & Guides",
  tools: "Tools",
  mudikit: "MudiKit",
  newsletter: "Newsletter",
  account: "Account",
};

function buildCrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ href: "/portal", label: "Home" }];
  if (!pathname.startsWith("/portal") || pathname === "/portal") return crumbs;

  const segments = pathname.split("/").filter(Boolean).slice(1);
  let acc = "/portal";
  segments.forEach((segment, index) => {
    acc += `/${segment}`;
    const isFirst = index === 0;
    const label = isFirst && LEAF_LABEL[segment]
      ? LEAF_LABEL[segment]
      : segment
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ");
    crumbs.push({ href: acc, label });
  });

  return crumbs;
}

export interface PortalShellProps {
  email: string;
  displayName: string;
  access: PortalAccess;
  children: React.ReactNode;
  /** Deprecated — active route resolved from pathname. Accepted for legacy callers. */
  activeView?: string;
  /** Optional small caps eyebrow rendered below the sticky breadcrumb header. */
  pageEyebrow?: string;
  /** Optional H1 rendered below the sticky breadcrumb header. */
  pageTitle?: string;
  /** Optional right-aligned slot in the page header (counts, search, etc.). */
  rightSlot?: React.ReactNode;
}

export function PortalShell({
  email,
  displayName,
  access,
  children,
  pageEyebrow,
  pageTitle,
  rightSlot,
}: PortalShellProps) {
  const alreadyMounted = useContext(PortalShellMountedContext);
  const pathname = usePathname() || "/portal";
  const crumbs = buildCrumbs(pathname);
  const tier = tierLabel(access);

  if (alreadyMounted) {
    if (pageEyebrow || pageTitle || rightSlot) {
      return (
        <>
          <section className="border-b border-white/[0.05] bg-[#0a0a0c]">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-end md:justify-between md:py-7 lg:px-10">
              <div className="min-w-0">
                {pageEyebrow && (
                  <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    {pageEyebrow}
                  </p>
                )}
                {pageTitle && (
                  <h1 className="font-[var(--font-serif-display)] mt-2 text-[34px] italic leading-[1.02] tracking-tight text-foreground md:text-[44px]">
                    {pageTitle}
                  </h1>
                )}
              </div>
              {rightSlot && <div className="shrink-0">{rightSlot}</div>}
            </div>
          </section>
          {children}
        </>
      );
    }
    return <>{children}</>;
  }

  return (
    <PortalShellMountedContext.Provider value={true}>
    <div className="mudikit-dark min-h-[100dvh] bg-[#0a0a0c] text-foreground antialiased">
      <SidebarProvider>
        <PortalSidebar access={access} email={email} displayName={displayName} />
        <SidebarInset className="min-h-svh bg-[#0a0a0c]">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.06] bg-[#0a0a0c]/85 px-4 backdrop-blur-xl md:px-6">
            <SidebarTrigger className="md:hidden">
              <Menu className="size-4" />
            </SidebarTrigger>

            <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
              <ol className="flex items-center gap-1.5 overflow-hidden text-[12.5px]">
                {crumbs.map((crumb, index) => {
                  const isLast = index === crumbs.length - 1;
                  return (
                    <li key={crumb.href} className="flex min-w-0 items-center gap-1.5">
                      {index > 0 && (
                        <span aria-hidden className="text-muted-foreground/40">
                          /
                        </span>
                      )}
                      {isLast ? (
                        <span className="truncate font-medium text-foreground">{crumb.label}</span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className="truncate text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>

            <Badge
              variant="outline"
              className="hidden rounded-full border-white/[0.12] bg-white/[0.03] px-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/90 sm:inline-flex"
            >
              {tier}
            </Badge>
          </header>

          {(pageEyebrow || pageTitle || rightSlot) && (
            <section className="border-b border-white/[0.05] bg-[#0a0a0c]">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-end md:justify-between md:py-7 lg:px-10">
                <div className="min-w-0">
                  {pageEyebrow && (
                    <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      {pageEyebrow}
                    </p>
                  )}
                  {pageTitle && (
                    <h1 className="font-[var(--font-serif-display)] mt-2 text-[34px] italic leading-[1.02] tracking-tight text-foreground md:text-[44px]">
                      {pageTitle}
                    </h1>
                  )}
                </div>
                {rightSlot && <div className="shrink-0">{rightSlot}</div>}
              </div>
            </section>
          )}

          <div className="portal-canvas relative isolate">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(80%_60%_at_50%_0%,rgba(244,209,140,0.06),transparent_70%)]"
            />
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
    </PortalShellMountedContext.Provider>
  );
}
