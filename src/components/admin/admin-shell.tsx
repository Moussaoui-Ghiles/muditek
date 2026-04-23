"use client";

import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "./admin-sidebar";

interface Props {
  children: React.ReactNode;
  email?: string;
  method?: "clerk";
}

const TITLES: Record<string, string> = {
  "/admin": "Home",
  "/admin/newsletter": "Newsletter",
  "/admin/subscribers": "Paying customers",
  "/admin/leads": "Leads",
  "/admin/campaigns": "Campaigns",
  "/admin/nurture": "Nurture",
  "/admin/content": "Lead magnets",
  "/admin/emails": "Email log",
  "/admin/import": "Import",
};

function resolveTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "admin" && segments.length >= 2) {
    const parent = `/${segments[0]}/${segments[1]}`;
    if (TITLES[parent]) return TITLES[parent];
  }
  return "Admin";
}

export function AdminShell({ children, email, method }: Props) {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <SidebarProvider>
      <AdminSidebar email={email} method={method} />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b border-border/60 bg-background/70 backdrop-blur-xl px-3">
          <SidebarTrigger className="-ml-1 size-7" />
          <Separator orientation="vertical" className="mr-1 h-3.5 bg-border/60" />
          <nav className="flex items-center gap-1.5 text-[12px]">
            <span className="text-muted-foreground">Muditek</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground">{title}</span>
          </nav>
          <div className="ml-auto flex items-center gap-2 pr-1">
            <span className="flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              <span className="relative flex size-1.5 items-center justify-center text-[var(--color-live)]">
                <span className="size-1.5 rounded-full bg-current" />
                <span className="pulse-dot" />
              </span>
              <span className="tnum">Live</span>
            </span>
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
