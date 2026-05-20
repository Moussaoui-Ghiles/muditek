"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  BookText,
  Home,
  Lock,
  Newspaper,
  Package,
  Settings,
  Wand2,
  Wrench,
} from "lucide-react";
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { PortalAccess } from "@/lib/portal-access";


type NavItem = {
  href: string;
  title: string;
  icon: typeof Home;
  matchPrefix?: string;
  matchExact?: string;
  locked?: boolean;
};

function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.matchExact && pathname === item.matchExact) return true;
  if (item.matchPrefix) return pathname === item.matchPrefix || pathname.startsWith(`${item.matchPrefix}/`);
  return pathname === item.href;
}

export function PortalSidebar({
  access,
  displayName,
}: {
  access: PortalAccess;
  displayName: string;
}) {
  const pathname = usePathname() || "/portal";
  const search = useSearchParams();
  const legacyView = search?.get("view");
  const { setOpenMobile } = useSidebar();
  const closeMobile = () => setOpenMobile(false);

  const homeActive = pathname === "/portal" && !legacyView;

  const libraryItems: NavItem[] = [
    { href: "/portal/skills", title: "Skills", icon: Wand2, matchPrefix: "/portal/skills" },
    { href: "/portal/playbooks", title: "Resources", icon: BookText, matchPrefix: "/portal/playbooks" },
    { href: "/portal/tools", title: "Tools", icon: Wrench, matchPrefix: "/portal/tools" },
    {
      href: "/portal/mudikit",
      title: "MudiKit",
      icon: Package,
      matchPrefix: "/portal/mudikit",
      locked: !access.isMudikit,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-white/[0.06]">
      <SidebarHeader>
        <Link
          href="/portal"
          onClick={closeMobile}
          className="flex h-14 items-center gap-2.5 rounded-md px-2 outline-none transition-colors hover:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-white/30"
        >
          <Logo variant="mark" size={28} />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-[13px] font-semibold tracking-tight text-foreground">
              Muditek
            </div>
            <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Portal
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/portal" onClick={closeMobile} />}
                  isActive={homeActive}
                  tooltip="Home"
                  className="h-8 text-[13px]"
                >
                  <Home className="size-4" />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em]">
            Library
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} onClick={closeMobile} />}
                    isActive={isItemActive(item, pathname)}
                    tooltip={item.title}
                    className="h-8 text-[13px]"
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.locked && (
                    <SidebarMenuBadge>
                      <Lock className="size-3 text-muted-foreground" />
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em]">
            Updates
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/portal/newsletter" onClick={closeMobile} />}
                  isActive={pathname === "/portal/newsletter" || pathname.startsWith("/portal/newsletter/")}
                  tooltip="Newsletter"
                  className="h-8 text-[13px]"
                >
                  <Newspaper className="size-4" />
                  <span>Newsletter</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em]">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/portal/account" onClick={closeMobile} />}
                  isActive={pathname === "/portal/account"}
                  tooltip="Account"
                  className="h-8 text-[13px]"
                >
                  <Settings className="size-4" />
                  <span>Account</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/[0.06]">
        <div className="flex min-w-0 items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-[12px] font-medium text-foreground">{displayName}</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
