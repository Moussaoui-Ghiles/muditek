"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  MailOpen,
  Package,
  CreditCard,
  Send,
  Upload,
  LogOut,
  MoreVertical,
  Newspaper,
} from "lucide-react";

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
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  {
    label: null,
    items: [{ href: "/admin", title: "Home", icon: LayoutDashboard }],
  },
  {
    label: "Audience",
    items: [
      { href: "/admin/newsletter", title: "Newsletter", icon: Newspaper },
      { href: "/admin/subscribers", title: "Paying customers", icon: CreditCard },
      { href: "/admin/leads", title: "Leads", icon: Users },
    ],
  },
  {
    label: "Acquisition",
    items: [
      { href: "/admin/campaigns", title: "Campaigns", icon: Megaphone },
      { href: "/admin/nurture", title: "Nurture", icon: MailOpen },
      { href: "/admin/content", title: "Lead magnets", icon: Package },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/emails", title: "Email log", icon: Send },
      { href: "/admin/import", title: "Import", icon: Upload },
    ],
  },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface Props {
  email?: string;
  method?: "clerk";
}

export function AdminSidebar({ email }: Props) {
  const pathname = usePathname();

  const identityLabel = email || "Signed in";
  const initials = (email || "A")
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader>
        <div className="flex h-12 items-center gap-2.5 px-2">
          <div className="relative flex size-7 items-center justify-center rounded-[7px] bg-foreground text-background text-[13px] font-bold tracking-tight">
            M
            <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-[var(--color-live)] shadow-[0_0_8px_var(--color-live)]" />
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-[13px] font-semibold tracking-tight leading-tight">
              Muditek
            </span>
            <span className="truncate text-[10px] text-muted-foreground leading-tight">
              Admin · Production
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {NAV.map((group, i) => (
          <SidebarGroup key={group.label ?? `group-${i}`} className="pb-0">
            {group.label && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-medium">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        tooltip={item.title}
                        className="relative h-8 gap-2.5 text-[13px] font-medium data-[active=true]:bg-secondary/80 data-[active=true]:text-foreground"
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r bg-foreground" />
                        )}
                        <item.icon className="size-[15px]" strokeWidth={1.75} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-border/60 px-1.5 py-1.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    tooltip={identityLabel}
                    className="h-auto gap-2.5 data-[state=open]:bg-accent"
                  />
                }
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-[11px] font-semibold text-foreground">
                  {initials}
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start text-left group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-[12px] font-medium leading-tight">
                    {identityLabel}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground leading-tight">
                    Owner
                  </span>
                </div>
                <MoreVertical className="size-3.5 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-56">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {identityLabel}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <SignOutButton redirectUrl="/admin">
                  <DropdownMenuItem>
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </SignOutButton>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
