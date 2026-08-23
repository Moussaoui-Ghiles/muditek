"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Activity, Download, Home, Mail, Settings, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { PortalAccess } from "@/lib/portal-access";

const NAV = [
  { href: "/portal", title: "Workspace", icon: Home },
  { href: "/portal/skills", title: "Advanced Skills", icon: Sparkles },
  { href: "/portal/activity", title: "Recent Activity", icon: Activity },
  { href: "/portal/downloads", title: "Downloads and Versions", icon: Download },
  { href: "/portal/newsletter", title: "Newsletter Preferences", icon: Mail },
  { href: "/portal/account", title: "Account", icon: Settings },
] as const;

export function PortalSidebar({
  displayName,
}: {
  access: PortalAccess;
  displayName: string;
}) {
  const pathname = usePathname() || "/portal";
  const { setOpenMobile } = useSidebar();
  const closeMobile = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="icon" className="border-r border-white/[0.06]">
      <SidebarHeader>
        <Link href="/portal" onClick={closeMobile} className="flex h-14 items-center gap-2.5 rounded-md px-2 outline-none transition-colors hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-primary">
          <Logo variant="mark" size={28} />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-[13px] font-semibold text-foreground">Muditek</div>
            <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Member workspace</div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em]">Account layer</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = item.href === "/portal" ? pathname === "/portal" : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton render={<Link href={item.href} onClick={closeMobile} />} isActive={active} tooltip={item.title} className="h-9 text-[13px]">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/[0.06]">
        <div className="flex min-w-0 items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <UserButton appearance={{ elements: { avatarBox: "h-7 w-7" } }} />
          <span className="truncate text-[12px] font-medium text-foreground group-data-[collapsible=icon]:hidden">{displayName}</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
