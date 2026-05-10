"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Archive,
  BookOpenText,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  FileText,
  Home,
  Lock,
  Menu,
  Newspaper,
  Package,
  Settings,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/logo/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { PortalAccess, PortalRole } from "@/lib/portal-access";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  download_url: string;
  file_type: string;
  is_new: boolean;
  is_free: boolean;
  created_at: string;
}

interface NewsletterIssue {
  slug: string;
  subject: string;
  sent_at: Date | null;
}

type ViewKey =
  | "overview"
  | "start"
  | "newsletter"
  | "free-library"
  | "mudikit"
  | "client"
  | "account";

const VIEW_LABEL: Record<ViewKey, string> = {
  overview: "Overview",
  start: "Start Here",
  newsletter: "Newsletter",
  "free-library": "Free Library",
  mudikit: "MudiKit",
  client: "Client Workspace",
  account: "Account",
};

const ROLE_LABEL: Record<PortalRole, string> = {
  free: "Free",
  mudikit: "MudiKit",
  client: "Client",
  admin: "Admin",
};

function viewHref(view: ViewKey): string {
  return view === "overview" ? "/portal" : `/portal?view=${view}`;
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
  if (access.isAdmin) return "Admin access";
  if (access.isClient && access.isMudikit) return "Client + MudiKit";
  if (access.isClient) return "Client access";
  if (access.isMudikit) return "MudiKit access";
  return "Free account";
}

function resourceHref(item: ContentItem): string {
  if (item.download_url.startsWith("http")) return item.download_url;
  if (item.download_url.endsWith(".pdf")) return `/resources/${item.slug}`;
  return item.download_url;
}

function SidebarNav({
  activeView,
  access,
  email,
}: {
  activeView: string;
  access: PortalAccess;
  email: string;
}) {
  const productItems = [
    { view: "newsletter" as ViewKey, title: "Newsletter", icon: Newspaper },
    { view: "free-library" as ViewKey, title: "Free Library", icon: Archive },
    { view: "mudikit" as ViewKey, title: "MudiKit", icon: Package, locked: !access.isMudikit },
  ];
  const workspaceItems = access.isClient
    ? [{ view: "client" as ViewKey, title: "Client Workspace", icon: BriefcaseBusiness }]
    : [];

  return (
    <Sidebar collapsible="icon" className="border-r border-white/[0.06]">
      <SidebarHeader>
        <div className="flex h-12 items-center gap-2.5 px-2">
          <Logo variant="mark" size={26} />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-[13px] font-semibold tracking-tight">Muditek</div>
            <div className="truncate text-[10px] text-muted-foreground">Account portal</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href={viewHref("overview")} />}
                  isActive={activeView === "overview"}
                  tooltip="Overview"
                  className="h-8 text-[13px]"
                >
                  <Home className="size-4" />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href={viewHref("start")} />}
                  isActive={activeView === "start"}
                  tooltip="Start Here"
                  className="h-8 text-[13px]"
                >
                  <BookOpenText className="size-4" />
                  <span>Start Here</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.12em]">
            Product
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {productItems.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton
                    render={<Link href={viewHref(item.view)} />}
                    isActive={activeView === item.view}
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

        {workspaceItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.12em]">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {workspaceItems.map((item) => (
                  <SidebarMenuItem key={item.view}>
                    <SidebarMenuButton
                      render={<Link href={viewHref(item.view)} />}
                      isActive={activeView === item.view}
                      tooltip={item.title}
                      className="h-8 text-[13px]"
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.12em]">
            Settings
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
      <SidebarFooter className="border-t border-white/[0.06]">
        <div className="flex min-w-0 items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center">
          <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-[12px] font-medium">{email}</div>
            <div className="truncate text-[10px] text-muted-foreground">{statusText(access)}</div>
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
  children,
}: {
  title: string;
  eyebrow: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-7">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function RowLink({
  href,
  title,
  meta,
  description,
  icon,
  locked,
  external,
}: {
  href: string;
  title: string;
  meta?: string;
  description?: string | null;
  icon?: React.ReactNode;
  locked?: boolean;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 border-b border-white/[0.06] py-4 transition-colors hover:bg-white/[0.025]"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.02] text-muted-foreground">
        {locked ? <Lock className="size-4" /> : icon ?? <FileText className="size-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-sm font-medium text-foreground">{title}</h3>
          {meta && (
            <span className="shrink-0 text-[11px] font-mono uppercase tracking-[0.12em] text-muted-foreground">
              {meta}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function Overview({
  access,
  freeItems,
  paidItems,
  issues,
}: {
  access: PortalAccess;
  freeItems: ContentItem[];
  paidItems: ContentItem[];
  issues: NewsletterIssue[];
}) {
  const latest = issues[0];
  return (
    <PageShell
      eyebrow="Account"
      title="Overview"
      description="Your account is split into free resources, newsletter access, MudiKit access, and client workspace access."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="border-t border-white/[0.08]">
            <RowLink
              href={viewHref("start")}
              title="Start with the recommended path"
              description="Use the portal from top to bottom: newsletter, free library, then MudiKit or client workspace if your account has access."
              icon={<CheckCircle2 className="size-4" />}
            />
            <RowLink
              href={latest ? `/newsletter/${latest.slug}` : viewHref("newsletter")}
              title={latest ? latest.subject : "Newsletter archive"}
              meta={latest ? formatDate(latest.sent_at) : undefined}
              description="The newsletter is the public source of truth for systems, playbooks, and operator notes."
              icon={<Newspaper className="size-4" />}
            />
            <RowLink
              href={viewHref("mudikit")}
              title={access.isMudikit ? "Open MudiKit systems library" : "MudiKit systems library"}
              description={
                access.isMudikit
                  ? "Your paid systems library lives here."
                  : "Locked until the paid promise, assets, and pricing are finalized."
              }
              icon={<Package className="size-4" />}
              locked={!access.isMudikit}
            />
            {access.isClient && (
              <RowLink
                href={viewHref("client")}
                title="Open client workspace"
                description="A clean client area is available on your account. Project records are intentionally not faked."
                icon={<BriefcaseBusiness className="size-4" />}
              />
            )}
          </div>
        </section>
        <aside>
          <div className="border-t border-white/[0.08]">
            <StatLine label="Account" value={statusText(access)} />
            <StatLine label="Free resources" value={`${freeItems.length}`} />
            <StatLine label="Newsletter issues" value={`${issues.length}`} />
            <StatLine label="MudiKit items" value={access.isMudikit ? `${paidItems.length}` : "Locked"} />
            <StatLine label="Client workspace" value={access.isClient ? "Available" : "Not assigned"} />
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function StartHere({ access }: { access: PortalAccess }) {
  const steps = [
    {
      title: "Read the latest newsletter issue",
      body: "Start with the thinking and systems already published before jumping into assets.",
      href: viewHref("newsletter"),
    },
    {
      title: "Use one free playbook",
      body: "Pick one resource from the free library and apply it. Do not browse forever.",
      href: viewHref("free-library"),
    },
    access.isMudikit
      ? {
          title: "Open the MudiKit library",
          body: "Use paid systems only when the library is attached to your account.",
          href: viewHref("mudikit"),
        }
      : {
          title: "Request MudiKit access when ready",
          body: "No price is shown yet because the paid promise is still being finalized.",
          href: "mailto:ghiles@muditek.com?subject=MudiKit access",
          external: true,
        },
    access.isClient
      ? {
          title: "Check your client workspace",
          body: "Use the client area for project context once records are assigned.",
          href: viewHref("client"),
        }
      : {
          title: "Book work separately",
          body: "Service-client access is separate from free newsletter and MudiKit access.",
          href: "/revenue-leak-audit",
        },
  ];

  return (
    <PageShell
      eyebrow="Orientation"
      title="Start Here"
      description="No wizard for v1. One short path, clear access states, and no fake product steps."
    >
      <div className="border-t border-white/[0.08]">
        {steps.map((step, index) => (
          <RowLink
            key={step.title}
            href={step.href}
            title={`${index + 1}. ${step.title}`}
            description={step.body}
            icon={<CircleDashed className="size-4" />}
            external={"external" in step ? step.external : false}
          />
        ))}
      </div>
    </PageShell>
  );
}

function Newsletter({ issues }: { issues: NewsletterIssue[] }) {
  return (
    <PageShell
      eyebrow="Owned audience"
      title="Newsletter"
      description="The public archive. Issues are listed chronologically so subscribers can scan what has been shipped."
    >
      <div className="border-t border-white/[0.08]">
        {issues.length === 0 ? (
          <EmptyState title="No newsletter issues yet" body="The archive will fill after the first issue is sent." />
        ) : (
          issues.map((issue) => (
            <RowLink
              key={issue.slug}
              href={`/newsletter/${issue.slug}`}
              title={issue.subject}
              meta={formatDate(issue.sent_at)}
              icon={<Newspaper className="size-4" />}
            />
          ))
        )}
      </div>
    </PageShell>
  );
}

function Library({ items }: { items: ContentItem[] }) {
  return (
    <PageShell
      eyebrow="Free account"
      title="Free Library"
      description="Free playbooks and resources. This is the trust layer, not the paid product."
    >
      <div className="border-t border-white/[0.08]">
        {items.length === 0 ? (
          <EmptyState title="No free resources yet" body="Free resources will appear here once published." />
        ) : (
          items.map((item) => (
            <RowLink
              key={item.id}
              href={resourceHref(item)}
              title={item.title}
              meta={item.category}
              description={item.description}
              icon={<FileText className="size-4" />}
              external={item.download_url.startsWith("http")}
            />
          ))
        )}
      </div>
    </PageShell>
  );
}

function MudiKit({
  access,
  items,
}: {
  access: PortalAccess;
  items: ContentItem[];
}) {
  if (!access.isMudikit) {
    return (
      <PageShell
        eyebrow="Locked"
        title="MudiKit"
        description="The paid systems library is not public yet. Pricing and assets stay hidden until the product promise is locked."
      >
        <div className="border-t border-white/[0.08]">
          <RowLink
            href="mailto:ghiles@muditek.com?subject=MudiKit access"
            title="Request access"
            description="Use this if you want to be notified when the systems library is ready."
            icon={<Lock className="size-4" />}
            external
          />
          <RowLink
            href={viewHref("free-library")}
            title="Use free resources first"
            description="The free library remains available while the paid product is being shaped."
            icon={<Archive className="size-4" />}
          />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Paid access"
      title="MudiKit"
      description="Systems, skills, templates, and operating assets attached to your MudiKit account."
    >
      <div className="border-t border-white/[0.08]">
        {items.length === 0 ? (
          <EmptyState
            title="No paid systems published yet"
            body="Your access is active, but the first approved systems have not been published to the library."
          />
        ) : (
          items.map((item) => (
            <RowLink
              key={item.id}
              href={item.download_url}
              title={item.title}
              meta={item.category}
              description={item.description}
              icon={<Package className="size-4" />}
              external
            />
          ))
        )}
      </div>
    </PageShell>
  );
}

function ClientWorkspace({ access }: { access: PortalAccess }) {
  if (!access.isClient) {
    return (
      <PageShell
        eyebrow="Not assigned"
        title="Client Workspace"
        description="This section appears only for service clients. Your account does not currently have a client workspace."
      >
        <div className="border-t border-white/[0.08]">
          <RowLink
            href="/revenue-leak-audit"
            title="Explore service work"
            description="Client workspace access is created after an engagement is active."
            icon={<BriefcaseBusiness className="size-4" />}
          />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Client"
      title="Client Workspace"
      description="This is the client shell. Real project records, files, milestones, and messages should be added only after the client data model is designed."
    >
      <div className="border-t border-white/[0.08]">
        <StatLine label="Workspace status" value="Assigned" />
        <StatLine label="Project records" value="Not configured" />
        <StatLine label="Documents" value="Not configured" />
        <StatLine label="Milestones" value="Not configured" />
      </div>
      <div className="mt-8 border-t border-white/[0.08]">
        <RowLink
          href="mailto:ghiles@muditek.com?subject=Client workspace"
          title="Contact Muditek"
          description="Use email for now. We are not pretending this is a full project tracker yet."
          icon={<BriefcaseBusiness className="size-4" />}
          external
        />
      </div>
    </PageShell>
  );
}

function Account({
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
      description="Your identity, roles, and access state."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="border-t border-white/[0.08]">
          <StatLine label="Email" value={email} />
          <StatLine label="Access" value={statusText(access)} />
          <StatLine label="Billing" value={stripeCustomerId ? "Available" : "No paid billing"} />
          <StatLine label="Newsletter" value="Active" />
        </section>
        <aside>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Roles
          </div>
          <div className="flex flex-wrap gap-2">
            {access.roles.map((role) => (
              <Badge key={role} variant="outline" className="rounded-md">
                {ROLE_LABEL[role]}
              </Badge>
            ))}
          </div>
          <Separator className="my-5" />
          {stripeCustomerId ? (
            <Button render={<Link href="/api/portal/billing" prefetch={false} />} variant="outline">
              Manage billing
            </Button>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              No billing link is shown because this account does not have an active paid subscription.
            </p>
          )}
        </aside>
      </div>
    </PageShell>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-12">
      <div className="mb-3 flex size-10 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.02] text-muted-foreground">
        <Sparkles className="size-4" />
      </div>
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}

export default function PortalContent({
  activeView,
  displayName,
  email,
  access,
  freeItems,
  paidItems,
  issues,
  stripeCustomerId,
}: {
  activeView: string;
  displayName: string;
  email: string;
  access: PortalAccess;
  freeItems: ContentItem[];
  paidItems: ContentItem[];
  issues: NewsletterIssue[];
  stripeCustomerId?: string | null;
}) {
  const view = (activeView in VIEW_LABEL ? activeView : "overview") as ViewKey;

  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      <SidebarProvider>
        <SidebarNav activeView={view} access={access} email={email} />
        <SidebarInset className="min-h-svh bg-background">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.06] bg-background/90 px-4 backdrop-blur md:px-6">
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

          {view === "overview" && (
            <Overview access={access} freeItems={freeItems} paidItems={paidItems} issues={issues} />
          )}
          {view === "start" && <StartHere access={access} />}
          {view === "newsletter" && <Newsletter issues={issues} />}
          {view === "free-library" && <Library items={freeItems} />}
          {view === "mudikit" && <MudiKit access={access} items={paidItems} />}
          {view === "client" && <ClientWorkspace access={access} />}
          {view === "account" && (
            <Account email={email} access={access} stripeCustomerId={stripeCustomerId} />
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
