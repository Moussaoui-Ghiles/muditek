"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookText,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Home,
  ImageIcon,
  Lock,
  Mail,
  Menu,
  Newspaper,
  Package,
  Search,
  Settings,
  Sparkles,
  Wand2,
  Wrench,
} from "lucide-react";
import { PORTAL_TOOLS, getPortalTool, type PortalTool } from "./tools-catalog";
import { RevenueLeakWorkbench } from "@/components/portal/revenue-leak-workbench";
import { Logo } from "@/components/logo/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PortalAccess, PortalRole } from "@/lib/portal-access";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  download_url: string;
  file_type: string;
  thumbnail_url: string | null;
  is_new: boolean;
  is_free: boolean;
  created_at: string;
  updated_at?: string | null;
}

interface NewsletterIssue {
  slug: string;
  subject: string;
  sent_at: Date | null;
}

interface ResourceContent {
  html: { styles: string; body: string } | null;
  pageImages: string[];
  downloadHref: string | null;
}

type ViewKey =
  | "home"
  | "skills"
  | "playbooks"
  | "tools"
  | "tool"
  | "mudikit"
  | "newsletter"
  | "account"
  | "resource";

const VIEW_LABEL: Record<ViewKey, string> = {
  home: "Home",
  skills: "Skills",
  playbooks: "Playbooks & Guides",
  tools: "Tools",
  tool: "Tool",
  mudikit: "MudiKit",
  newsletter: "Newsletter",
  account: "Account",
  resource: "Resource",
};

const ROLE_LABEL: Record<PortalRole, string> = {
  free: "Free",
  mudikit: "MudiKit",
  client: "Client",
  admin: "Admin",
};

const SKILL_CATEGORY = "skill";
const PLAYBOOK_GUIDE_CATEGORIES = new Set(["playbook", "guide"]);
const TOOL_CATEGORY = "tool";

function viewHref(view: ViewKey): string {
  switch (view) {
    case "home":
      return "/portal";
    case "skills":
      return "/portal/skills";
    case "playbooks":
      return "/portal/playbooks";
    case "tools":
      return "/portal/tools";
    case "mudikit":
      return "/portal/mudikit";
    case "newsletter":
      return "/portal/newsletter";
    default:
      return `/portal?view=${view}`;
  }
}

function portalResourceHref(item: Pick<ContentItem, "slug">): string {
  return `/portal?view=resource&slug=${encodeURIComponent(item.slug)}`;
}

function resourceShareHref(item: Pick<ContentItem, "slug">): string {
  return `/r/${item.slug}`;
}

function toolHref(slug: string): string {
  return `/portal?view=tool&slug=${encodeURIComponent(slug)}`;
}

function formatDate(date: Date | string | null): string {
  if (!date) return "Unsent";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusText(access: PortalAccess): string {
  if (access.isAdmin) return "Admin";
  if (access.isMudikit) return "MudiKit";
  return "Free";
}

function accessLine(access: PortalAccess, email: string): string {
  if (access.isAdmin) return `Admin · ${email}`;
  if (access.isMudikit) return `MudiKit · ${email}`;
  return `Free account · ${email}`;
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function categoryLabel(category: string): string {
  return category
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function itemKind(item: ContentItem): string {
  if (item.file_type) return item.file_type.toUpperCase();
  return categoryLabel(item.category);
}

function filterSkills(items: ContentItem[]): ContentItem[] {
  return items.filter((item) => item.category === SKILL_CATEGORY);
}

function filterPlaybooks(items: ContentItem[]): ContentItem[] {
  return items.filter((item) => PLAYBOOK_GUIDE_CATEGORIES.has(item.category));
}

function combinedRecent(
  freeItems: ContentItem[],
  paidItems: ContentItem[],
  limit: number
): ContentItem[] {
  return [...paidItems, ...freeItems]
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

function SidebarNav({
  activeView,
  access,
  email,
}: {
  activeView: ViewKey;
  access: PortalAccess;
  email: string;
}) {
  const libraryItems: Array<{
    view: ViewKey;
    title: string;
    icon: typeof Wand2;
    matches?: ViewKey[];
    locked?: boolean;
  }> = [
    { view: "skills", title: "Skills", icon: Wand2 },
    { view: "playbooks", title: "Playbooks & Guides", icon: BookText },
    { view: "tools", title: "Tools", icon: Wrench, matches: ["tools", "tool"] },
    { view: "mudikit", title: "MudiKit", icon: Package, locked: !access.isMudikit },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-white/[0.07]">
      <SidebarHeader>
        <Link
          href={viewHref("home")}
          className="flex h-14 items-center gap-2.5 rounded-md px-2 outline-none transition-colors hover:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-white/30"
        >
          <Logo variant="mark" size={28} />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-[13px] font-semibold tracking-tight text-foreground">
              Muditek Portal
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {statusText(access)} access
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
                  render={<Link href={viewHref("home")} />}
                  isActive={activeView === "home"}
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
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.14em]">
            Library
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => {
                const isActive = item.matches
                  ? item.matches.includes(activeView)
                  : activeView === item.view;
                return (
                  <SidebarMenuItem key={item.view}>
                    <SidebarMenuButton
                      render={<Link href={viewHref(item.view)} />}
                      isActive={isActive}
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
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.14em]">
            Updates
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href={viewHref("newsletter")} />}
                  isActive={activeView === "newsletter"}
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
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.14em]">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href={viewHref("account")} />}
                  isActive={activeView === "account"}
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
      <SidebarFooter className="border-t border-white/[0.07]">
        <div className="flex min-w-0 items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-[12px] font-medium text-foreground">{email}</div>
            <div className="truncate text-[10px] text-muted-foreground">
              {statusText(access)} access
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function PageShell({
  title,
  eyebrow,
  description,
  action,
  back,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: React.ReactNode;
  back?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-white/[0.07] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          {back ? (
            <Link
              href={back.href}
              className="mb-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              {back.label}
            </Link>
          ) : eyebrow ? (
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-48 flex-col items-start justify-center rounded-lg border border-dashed border-white/[0.1] bg-white/[0.015] p-6">
      <div className="mb-4 flex size-10 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
        <Sparkles className="size-4" />
      </div>
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function ResourceVisual({ item, compact = false }: { item: ContentItem; compact?: boolean }) {
  if (item.thumbnail_url) {
    return (
      <div className={compact ? "h-24 overflow-hidden rounded-md" : "aspect-[16/10] overflow-hidden rounded-md"}>
        <img
          src={item.thumbnail_url}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <div
      className={
        compact
          ? "flex h-24 items-end rounded-md border border-white/[0.08] bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.12),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))] p-3"
          : "flex aspect-[16/10] items-end rounded-md border border-white/[0.08] bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.12),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))] p-4"
      }
    >
      <div>
        <span className="mb-2 flex size-8 items-center justify-center rounded-md border border-white/[0.1] bg-black/20 text-muted-foreground">
          <ImageIcon className="size-4" />
        </span>
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {categoryLabel(item.category)}
        </p>
      </div>
    </div>
  );
}

function CopyUnlockButton({ item }: { item: ContentItem }) {
  const [copied, setCopied] = useState(false);
  const href = resourceShareHref(item);

  async function handleCopy() {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://muditek.com";
    await navigator.clipboard.writeText(`${origin}${href}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleCopy}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy unlock link"}
    </Button>
  );
}

function ResourceCard({
  item,
  compact = false,
  access,
}: {
  item: ContentItem;
  compact?: boolean;
  access: PortalAccess;
}) {
  const locked = !item.is_free && !access.isMudikit && !access.isAdmin;
  return (
    <article
      className={
        locked
          ? "group relative flex h-full flex-col rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.015] p-3 transition-colors hover:border-white/[0.2] hover:from-white/[0.06]"
          : "group flex h-full flex-col rounded-lg border border-white/[0.08] bg-white/[0.025] p-3 transition-colors hover:border-white/[0.18] hover:bg-white/[0.045]"
      }
    >
      <Link href={portalResourceHref(item)} className="block min-w-0 flex-1">
        <div className="relative">
          <ResourceVisual item={item} compact={compact} />
          {locked && (
            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border border-white/[0.12] bg-black/45 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground backdrop-blur">
              <Lock className="size-3" />
              MudiKit
            </span>
          )}
          {item.is_new && !locked && (
            <span className="absolute left-2 top-2 inline-flex items-center rounded-md border border-emerald-300/30 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-200">
              New
            </span>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-medium leading-5 text-foreground">
            {item.title}
          </h3>
          <Badge variant="outline" className="shrink-0 rounded-md text-[10px] uppercase tracking-[0.12em]">
            {itemKind(item)}
          </Badge>
        </div>
        {!compact && item.description && (
          <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-muted-foreground">
            {item.description}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{item.is_free ? "Free" : locked ? "MudiKit · Locked" : "MudiKit"}</span>
          {locked ? (
            <Lock className="size-3.5" />
          ) : (
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
          )}
        </div>
      </Link>
      {access.isAdmin && item.is_free && (
        <div className="mt-3 border-t border-white/[0.07] pt-3">
          <CopyUnlockButton item={item} />
        </div>
      )}
    </article>
  );
}

function SectionTile({
  view,
  title,
  description,
  count,
  icon,
  locked,
  upsellLabel,
}: {
  view: ViewKey;
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
  locked?: boolean;
  upsellLabel?: string;
}) {
  return (
    <Link
      href={viewHref(view)}
      className="group relative flex h-full flex-col justify-between rounded-lg border border-white/[0.08] bg-white/[0.025] p-4 transition-colors hover:border-white/[0.2] hover:bg-white/[0.05]"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="flex size-9 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-foreground/80">
            {locked ? <Lock className="size-4" /> : icon}
          </span>
          <Badge
            variant="outline"
            className="rounded-md text-[10px] uppercase tracking-[0.12em]"
          >
            {locked ? upsellLabel ?? "Locked" : count === 0 ? "Empty" : `${count}`}
          </Badge>
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-[13px] leading-5 text-muted-foreground">{description}</p>
      </div>
      <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>{locked ? "Upgrade required" : "Open"}</span>
        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
      </div>
    </Link>
  );
}

function Hero({
  displayName,
  access,
  email,
}: {
  displayName: string;
  access: PortalAccess;
  email: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-white/[0.07] pb-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {accessLine(access, email)}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Hi {displayName}.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Your workspace for the Muditek skills, playbooks, tools, and newsletter attached to this account.
        </p>
      </div>
      <Badge variant="outline" className="self-start rounded-md text-[11px] uppercase tracking-[0.14em] md:self-auto">
        {statusText(access)} access
      </Badge>
    </div>
  );
}

function HomeNextAction({
  freeItems,
  paidItems,
  issues,
  access,
}: {
  freeItems: ContentItem[];
  paidItems: ContentItem[];
  issues: NewsletterIssue[];
  access: PortalAccess;
}) {
  const latestIssue = issues[0];
  const latestPaid = paidItems[0];
  const latestFree = freeItems[0];

  let primary: { href: string; label: string; meta: string } | null = null;
  if (access.isMudikit && latestPaid) {
    primary = {
      href: portalResourceHref(latestPaid),
      label: latestPaid.title,
      meta: `Newest MudiKit drop · ${formatDate(latestPaid.created_at)}`,
    };
  } else if (latestIssue) {
    primary = {
      href: `/newsletter/${latestIssue.slug}`,
      label: latestIssue.subject,
      meta: `Latest issue · ${formatDate(latestIssue.sent_at)}`,
    };
  } else if (latestFree) {
    primary = {
      href: portalResourceHref(latestFree),
      label: latestFree.title,
      meta: `Newest free drop · ${formatDate(latestFree.created_at)}`,
    };
  }

  if (!primary) return null;

  return (
    <Link
      href={primary.href}
      className="group mb-6 flex items-center gap-4 rounded-lg border border-white/[0.1] bg-white/[0.04] p-4 transition-colors hover:border-white/[0.2] hover:bg-white/[0.06]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.05] text-foreground">
        <ArrowUpRight className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Open now
        </p>
        <p className="truncate text-sm font-medium text-foreground">{primary.label}</p>
        <p className="truncate text-[12px] text-muted-foreground">{primary.meta}</p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}

function RecentDrops({
  freeItems,
  paidItems,
  access,
}: {
  freeItems: ContentItem[];
  paidItems: ContentItem[];
  access: PortalAccess;
}) {
  const items =
    access.isMudikit && paidItems.length > 0
      ? combinedRecent(freeItems, paidItems, 4)
      : freeItems.slice(0, 4);

  if (items.length === 0) {
    return (
      <EmptyState
        title="No drops yet"
        body="Skills, playbooks, and tools will appear here as they are published."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <ResourceCard key={item.id} item={item} compact access={access} />
      ))}
    </div>
  );
}

function MudikitUpsellRow({ isFreeOnly }: { isFreeOnly: boolean }) {
  if (!isFreeOnly) return null;
  return (
    <Link
      href="/mudikit"
      className="group mt-6 flex flex-col gap-3 rounded-lg border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-5 transition-colors hover:border-white/[0.2] hover:from-white/[0.06] md:flex-row md:items-center md:justify-between"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.04] text-foreground/90">
          <Package className="size-4" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            MudiKit
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            Unlock the paid library
          </p>
          <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
            Paid playbooks, tools, and operating systems attached to your portal account.
          </p>
        </div>
      </div>
      <div className="inline-flex items-center gap-2 self-start rounded-md border border-white/[0.12] bg-white/[0.05] px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors group-hover:border-white/[0.25] group-hover:bg-white/[0.08] md:self-auto">
        See what&apos;s inside
        <ArrowUpRight className="size-3.5" />
      </div>
    </Link>
  );
}

function HomeView({
  displayName,
  email,
  access,
  freeItems,
  paidItems,
  playbookGuideItems,
  issues,
}: {
  displayName: string;
  email: string;
  access: PortalAccess;
  freeItems: ContentItem[];
  paidItems: ContentItem[];
  playbookGuideItems: ContentItem[];
  issues: NewsletterIssue[];
}) {
  const skills = filterSkills(freeItems);
  const tools = PORTAL_TOOLS;
  const latestIssue = issues[0];
  const isFreeOnly = !access.isMudikit && !access.isAdmin;
  const playbooksVisible = isFreeOnly
    ? playbookGuideItems.filter((item) => item.is_free)
    : playbookGuideItems;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
      <Hero displayName={displayName} access={access} email={email} />

      <HomeNextAction
        freeItems={freeItems}
        paidItems={paidItems}
        issues={issues}
        access={access}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SectionTile
          view="skills"
          title="Skills"
          description="Reusable Claude Code skills for operators."
          count={skills.length}
          icon={<Wand2 className="size-4" />}
        />
        <SectionTile
          view="playbooks"
          title="Playbooks & Guides"
          description="Step-by-step systems and operating guides."
          count={playbooksVisible.length}
          icon={<BookText className="size-4" />}
        />
        <SectionTile
          view="tools"
          title="Tools"
          description="Interactive calculators and scorecards."
          count={tools.length}
          icon={<Wrench className="size-4" />}
        />
        <SectionTile
          view="mudikit"
          title="MudiKit"
          description={
            access.isMudikit
              ? "Paid systems attached to this account."
              : "Paid library — locked on this account."
          }
          count={paidItems.length}
          icon={<Package className="size-4" />}
          locked={!access.isMudikit}
          upsellLabel="Locked"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/[0.08] bg-white/[0.025]">
          <CardHeader>
            <CardTitle className="text-base">Recent drops</CardTitle>
            <CardDescription>
              {access.isMudikit
                ? "Newest items across MudiKit and the free library."
                : "Newest free items added to the library."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentDrops freeItems={freeItems} paidItems={paidItems} access={access} />
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-white/[0.025]">
          <CardHeader>
            <CardTitle className="text-base">Newsletter</CardTitle>
            <CardDescription>
              {latestIssue
                ? `Latest issue · ${formatDate(latestIssue.sent_at)}`
                : "No issues sent yet."}
            </CardDescription>
            <CardAction>
              <Button render={<Link href={viewHref("newsletter")} />} nativeButton={false} size="sm" variant="outline">
                Archive
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {latestIssue ? (
              <Link
                href={`/newsletter/${latestIssue.slug}`}
                className="group block rounded-md border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.18] hover:bg-white/[0.045]"
              >
                <h3 className="line-clamp-3 text-sm font-medium text-foreground">
                  {latestIssue.subject}
                </h3>
                <div className="mt-3 inline-flex items-center gap-2 text-[12px] font-medium text-muted-foreground group-hover:text-foreground">
                  Read issue
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            ) : (
              <EmptyState
                title="No issues yet"
                body="The archive fills here once the first issue is sent."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <MudikitUpsellRow isFreeOnly={isFreeOnly} />
    </div>
  );
}

function ToolStatusBadge({ tool, access }: { tool: PortalTool; access: PortalAccess }) {
  if (tool.access === "free") {
    return (
      <Badge variant="outline" className="rounded-md text-[10px] uppercase tracking-[0.12em]">
        Free
      </Badge>
    );
  }
  const unlocked = access.isMudikit;
  return (
    <Badge
      variant="outline"
      className={
        unlocked
          ? "rounded-md text-[10px] uppercase tracking-[0.12em]"
          : "rounded-md border-white/[0.12] text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
      }
    >
      {unlocked ? "MudiKit" : "MudiKit only"}
    </Badge>
  );
}

function ToolCard({ tool, access }: { tool: PortalTool; access: PortalAccess }) {
  const locked = tool.access === "mudikit" && !access.isMudikit;
  return (
    <Link
      href={toolHref(tool.slug)}
      className="group flex h-full flex-col rounded-lg border border-white/[0.08] bg-white/[0.025] p-4 transition-colors hover:border-white/[0.18] hover:bg-white/[0.045]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="flex size-9 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-muted-foreground">
          {locked ? <Lock className="size-4" /> : <Wrench className="size-4" />}
        </span>
        <ToolStatusBadge tool={tool} access={access} />
      </div>
      <h3 className="text-sm font-medium leading-5 text-foreground">{tool.title}</h3>
      <p className="mt-1.5 line-clamp-3 text-[13px] leading-5 text-muted-foreground">{tool.short}</p>
      <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>{tool.category}</span>
        <span className="inline-flex items-center gap-1 transition-colors group-hover:text-foreground">
          {locked ? "View details" : "Open tool"}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

function ToolsList({ access }: { access: PortalAccess }) {
  const free = PORTAL_TOOLS.filter((tool) => tool.access === "free");
  const paid = PORTAL_TOOLS.filter((tool) => tool.access === "mudikit");

  return (
    <PageShell
      eyebrow="Library"
      title="Tools"
      description="Interactive utilities you can run inside the portal. Only live tools are listed."
      action={
        <Badge variant="outline" className="rounded-md">
          {PORTAL_TOOLS.length} {PORTAL_TOOLS.length === 1 ? "tool" : "tools"}
        </Badge>
      }
    >
      {PORTAL_TOOLS.length === 0 ? (
        <EmptyState
          title="No tools yet"
          body="Tools will appear here as they are added."
        />
      ) : (
        <div className="space-y-8">
          {free.length > 0 && (
            <section>
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Free
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {free.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} access={access} />
                ))}
              </div>
            </section>
          )}
          {paid.length > 0 && (
            <section>
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                MudiKit
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {paid.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} access={access} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </PageShell>
  );
}

function ToolSurface({ tool }: { tool: PortalTool }) {
  if (tool.slug === "revenue-leak-calculator") {
    return <RevenueLeakWorkbench />;
  }
  return (
    <EmptyState
      title="Tool surface unavailable"
      body="This tool is listed in the catalog but has no rendered surface yet."
    />
  );
}

function ToolLocked({ tool }: { tool: PortalTool }) {
  return (
    <Card className="border-white/[0.08] bg-white/[0.025]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lock className="size-4 text-muted-foreground" />
          MudiKit unlocks {tool.title}
        </CardTitle>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button render={<Link href={viewHref("mudikit")} />} nativeButton={false}>
          Upgrade to MudiKit
          <ArrowUpRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function ToolDetail({ slug, access }: { slug: string | null; access: PortalAccess }) {
  const tool = getPortalTool(slug);

  if (!tool) {
    return (
      <PageShell
        title="Tool not available"
        description="This tool either does not exist or is not attached to this account."
        back={{ href: viewHref("tools"), label: "Tools" }}
      >
        <EmptyState
          title="Nothing to open"
          body="Open the Tools list to see what is currently available."
        />
      </PageShell>
    );
  }

  const locked = tool.access === "mudikit" && !access.isMudikit;

  return (
    <PageShell
      title={tool.title}
      description={tool.description}
      back={{ href: viewHref("tools"), label: "Tools" }}
      action={
        <div className="flex flex-wrap items-center gap-2">
          {tool.publicHref && !locked && (
            <Button
              render={<Link href={tool.publicHref} target="_blank" rel="noopener noreferrer" />}
              nativeButton={false}
              variant="outline"
            >
              Standalone version
              <ExternalLink className="size-4" />
            </Button>
          )}
          <ToolStatusBadge tool={tool} access={access} />
        </div>
      }
    >
      {locked ? <ToolLocked tool={tool} /> : <ToolSurface tool={tool} />}
    </PageShell>
  );
}

function NewsletterFallback({ issues }: { issues: NewsletterIssue[] }) {
  const latest = issues[0];
  return (
    <PageShell
      eyebrow="Updates"
      title="Newsletter"
      description="Sent issues from the Muditek newsletter."
      action={
        <Badge variant="outline" className="rounded-md">
          {issues.length} {issues.length === 1 ? "issue" : "issues"}
        </Badge>
      }
    >
      {issues.length === 0 ? (
        <EmptyState
          title="No newsletter issues yet"
          body="The archive fills here once the first issue is sent."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          {latest && (
            <Card className="border-white/[0.08] bg-white/[0.025]">
              <CardHeader>
                <CardTitle className="text-base">Latest issue</CardTitle>
                <CardDescription>{formatDate(latest.sent_at)}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/newsletter/${latest.slug}`} className="group block">
                  <h2 className="text-xl font-semibold leading-tight tracking-tight text-foreground group-hover:text-white">
                    {latest.subject}
                  </h2>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground">
                    Read issue
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card className="border-white/[0.08] bg-white/[0.025]">
            <CardHeader>
              <CardTitle className="text-base">All issues</CardTitle>
              <CardDescription>Ordered by sent date.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.08] hover:bg-transparent">
                    <TableHead>Subject</TableHead>
                    <TableHead className="w-36">Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow key={issue.slug} className="border-white/[0.06] hover:bg-white/[0.025]">
                      <TableCell className="min-w-[260px] py-3">
                        <Link href={`/newsletter/${issue.slug}`} className="group inline-flex max-w-full items-center gap-2">
                          <span className="truncate font-medium text-foreground group-hover:text-white">
                            {issue.subject}
                          </span>
                          <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                        </Link>
                      </TableCell>
                      <TableCell className="py-3 text-muted-foreground">{formatDate(issue.sent_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </PageShell>
  );
}

const playbookResponsiveStyles = `
  .portal-playbook {
    max-width: 100%;
    overflow-x: hidden;
  }
  .portal-playbook .page {
    margin: 0 auto 24px;
    max-width: 100% !important;
    box-shadow: 0 4px 32px rgba(0,0,0,0.18);
    border-radius: 12px;
  }
  @media (max-width: 850px) {
    .portal-playbook .page {
      width: 100% !important;
      height: auto !important;
      min-height: unset !important;
      padding: 32px 24px !important;
      page-break-after: unset !important;
    }
    .portal-playbook .page img {
      max-width: 100% !important;
      height: auto !important;
    }
    .portal-playbook .page [style*="grid-template-columns"] {
      grid-template-columns: 1fr !important;
    }
    .portal-playbook .page h1,
    .portal-playbook .page [style*="font-size: 82px"],
    .portal-playbook .page [style*="font-size: 68px"] {
      font-size: 42px !important;
    }
    .portal-playbook .page h2,
    .portal-playbook .page [style*="font-size: 64px"],
    .portal-playbook .page [style*="font-size: 58px"],
    .portal-playbook .page [style*="font-size: 54px"],
    .portal-playbook .page [style*="font-size: 52px"] {
      font-size: 32px !important;
    }
    .portal-playbook .page .foot {
      position: relative !important;
      bottom: unset !important;
      left: unset !important;
      right: unset !important;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid rgba(128,128,128,0.15);
    }
  }
`;

function backViewForItem(item: ContentItem): ViewKey {
  if (!item.is_free) return "mudikit";
  if (item.category === SKILL_CATEGORY) return "skills";
  if (item.category === TOOL_CATEGORY) return "tools";
  if (PLAYBOOK_GUIDE_CATEGORIES.has(item.category)) return "playbooks";
  return "home";
}

function ResourceDetail({
  item,
  content,
  access,
}: {
  item: ContentItem | null;
  content: ResourceContent | null;
  access: PortalAccess;
}) {
  if (!item || !content) {
    return (
      <PageShell
        title="Resource not available"
        description="This resource either does not exist or is not attached to this account."
        back={{ href: viewHref("home"), label: "Home" }}
      >
        <EmptyState
          title="Nothing to open"
          body="Use the library sections to open resources connected to your account."
        />
      </PageShell>
    );
  }

  const external = content.downloadHref ? isExternalHref(content.downloadHref) : false;
  const backView = backViewForItem(item);

  return (
    <PageShell
      title={item.title}
      description={item.description ?? `${categoryLabel(item.category)} resource.`}
      back={{ href: viewHref(backView), label: VIEW_LABEL[backView] }}
      action={
        <div className="flex flex-wrap gap-2">
          {access.isAdmin && item.is_free && <CopyUnlockButton item={item} />}
          {content.downloadHref && (
            <Button
              render={
                <Link
                  href={content.downloadHref}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                />
              }
              nativeButton={false}
            >
              {external ? <ExternalLink className="size-4" /> : <Download className="size-4" />}
              {external ? "Open asset" : "Download"}
            </Button>
          )}
        </div>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="rounded-md">
          {categoryLabel(item.category)}
        </Badge>
        <Badge variant="outline" className="rounded-md">
          {itemKind(item)}
        </Badge>
        {item.is_new && <Badge className="rounded-md">New</Badge>}
        <Badge variant="outline" className="rounded-md">
          {item.is_free ? "Free" : "MudiKit"}
        </Badge>
      </div>

      {item.thumbnail_url && !content.html && content.pageImages.length === 0 && (
        <div className="mb-6 overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.025]">
          <img src={item.thumbnail_url} alt="" className="max-h-[420px] w-full object-cover" />
        </div>
      )}

      {content.html ? (
        <>
          <style dangerouslySetInnerHTML={{ __html: content.html.styles }} />
          <style dangerouslySetInnerHTML={{ __html: playbookResponsiveStyles }} />
          <div
            className="portal-playbook rounded-lg border border-white/[0.08] bg-white/[0.02] p-2 sm:p-4"
            dangerouslySetInnerHTML={{ __html: content.html.body }}
          />
        </>
      ) : content.pageImages.length > 0 ? (
        <div className="mx-auto flex max-w-[900px] flex-col gap-4 md:gap-6">
          {content.pageImages.map((src, index) => (
            <div
              key={src}
              className="w-full overflow-hidden rounded-xl border border-white/[0.08] shadow-[0_4px_32px_rgba(0,0,0,0.2)]"
            >
              <img
                src={src}
                alt={`${item.title} - Page ${index + 1}`}
                className="block h-auto w-full"
                loading={index < 3 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={content.downloadHref ? "Asset attached" : "No asset attached"}
          body={
            content.downloadHref
              ? "Use the action above to open or download the attached resource."
              : "This item exists in the CMS, but no downloadable asset has been attached yet."
          }
        />
      )}
    </PageShell>
  );
}

function AccountLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

function AccountView({
  email,
  access,
  stripeCustomerId,
}: {
  email: string;
  access: PortalAccess;
  stripeCustomerId?: string | null;
}) {
  return (
    <PageShell
      eyebrow="Settings"
      title="Account"
      description="Identity, roles, access state, and billing availability."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="border-white/[0.08] bg-white/[0.025]">
          <CardHeader>
            <CardTitle className="text-base">Account details</CardTitle>
            <CardDescription>Current portal state for this signed-in user.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
              <AccountLine label="Email" value={email} />
              <AccountLine label="Access" value={statusText(access)} />
              <AccountLine label="Newsletter" value="Active" />
              <AccountLine label="Billing" value={stripeCustomerId ? "Available" : "No paid billing"} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-white/[0.025]">
          <CardHeader>
            <CardTitle className="text-base">Roles</CardTitle>
            <CardDescription>Resolved from memberships and admin email settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {access.roles.map((role) => (
                <Badge key={role} variant="outline" className="rounded-md">
                  {ROLE_LABEL[role]}
                </Badge>
              ))}
            </div>
            <Separator className="my-5" />
            {stripeCustomerId ? (
              <Button render={<Link href="/api/portal/billing" prefetch={false} />} nativeButton={false} variant="outline">
                Manage billing
                <CreditCard className="size-4" />
              </Button>
            ) : access.isMudikit ? (
              <p className="text-sm leading-6 text-muted-foreground">
                Billing portal is not available for this account.
              </p>
            ) : (
              <Button render={<Link href="/mudikit" />} nativeButton={false} variant="outline">
                <Mail className="size-4" />
                See MudiKit
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

export default function PortalContent({
  activeView,
  activeSlug,
  displayName,
  email,
  access,
  freeItems,
  paidItems,
  playbookGuideItems,
  issues,
  selectedResource,
  selectedResourceContent,
  stripeCustomerId,
}: {
  activeView: string;
  activeSlug?: string | null;
  displayName: string;
  email: string;
  access: PortalAccess;
  freeItems: ContentItem[];
  paidItems: ContentItem[];
  playbookGuideItems?: ContentItem[];
  issues: NewsletterIssue[];
  selectedResource?: ContentItem | null;
  selectedResourceContent?: ResourceContent | null;
  stripeCustomerId?: string | null;
}) {
  const view = (activeView in VIEW_LABEL ? activeView : "home") as ViewKey;
  const playbooksSource = playbookGuideItems ?? filterPlaybooks(freeItems);

  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      <SidebarProvider>
        <SidebarNav activeView={view} access={access} email={email} />
        <SidebarInset className="min-h-svh bg-background">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.07] bg-background/92 px-4 backdrop-blur md:px-6">
            <SidebarTrigger className="md:hidden">
              <Menu className="size-4" />
            </SidebarTrigger>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{VIEW_LABEL[view]}</div>
              <div className="truncate text-xs text-muted-foreground">
                {displayName} · {statusText(access)}
              </div>
            </div>
            <Badge variant="outline" className="hidden rounded-md sm:inline-flex">
              {statusText(access)}
            </Badge>
          </header>

          {view === "home" && (
            <HomeView
              displayName={displayName}
              email={email}
              access={access}
              freeItems={freeItems}
              paidItems={paidItems}
              playbookGuideItems={playbooksSource}
              issues={issues}
            />
          )}
          {view === "tools" && <ToolsList access={access} />}
          {view === "tool" && <ToolDetail slug={activeSlug ?? null} access={access} />}
          {view === "newsletter" && <NewsletterFallback issues={issues} />}
          {view === "resource" && (
            <ResourceDetail
              item={selectedResource ?? null}
              content={selectedResourceContent ?? null}
              access={access}
            />
          )}
          {view === "account" && (
            <AccountView email={email} access={access} stripeCustomerId={stripeCustomerId} />
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
