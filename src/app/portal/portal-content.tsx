"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, FileText, Newspaper, Package } from "lucide-react";
import { Logo } from "@/components/logo/logo";
import type { PortalAccess } from "@/lib/portal-access";

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

function formatDate(date: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function resourceHref(item: ContentItem): string {
  if (item.download_url.startsWith("http")) return item.download_url;
  if (item.download_url.endsWith(".pdf")) return `/resources/${item.slug}`;
  return item.download_url;
}

function statusLine(access: PortalAccess): string {
  const parts: string[] = [];
  if (access.isAdmin) parts.push("Admin");
  if (access.isClient) parts.push("Client");
  if (access.isMudikit) parts.push("MudiKit");
  if (parts.length === 0) parts.push("Free");
  return parts.join(" · ");
}

function Row({
  href,
  title,
  meta,
  description,
  icon,
  external,
}: {
  href: string;
  title: string;
  meta?: string;
  description?: string | null;
  icon?: React.ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 py-4 transition-colors hover:bg-white/[0.02] -mx-2 px-2 rounded-md"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-500 group-hover:text-zinc-200">
        {icon ?? <FileText className="size-4" strokeWidth={1.8} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[15px] font-medium text-zinc-100 group-hover:text-white">
            {title}
          </span>
          {meta && (
            <span className="shrink-0 text-xs text-zinc-500">{meta}</span>
          )}
        </span>
        {description && (
          <span className="mt-0.5 line-clamp-2 block text-[13px] text-zinc-400">
            {description}
          </span>
        )}
      </span>
      {external ? (
        <ArrowUpRight className="size-4 shrink-0 text-zinc-600 group-hover:text-zinc-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 spring" strokeWidth={1.8} />
      ) : (
        <ChevronRight className="size-4 shrink-0 text-zinc-600 group-hover:text-zinc-200 group-hover:translate-x-0.5 spring" strokeWidth={1.8} />
      )}
    </Link>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-zinc-300">{title}</h2>
      <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
        {children}
      </div>
    </section>
  );
}

export default function PortalContent({
  displayName,
  email,
  access,
  freeItems,
  paidItems,
  issues,
  stripeCustomerId,
}: {
  activeView?: string;
  displayName: string;
  email: string;
  access: PortalAccess;
  freeItems: ContentItem[];
  paidItems: ContentItem[];
  issues: NewsletterIssue[];
  stripeCustomerId?: string | null;
}) {
  const showMudikit = access.isMudikit && paidItems.length > 0;
  const showNewsletter = issues.length > 0;
  const showLibrary = freeItems.length > 0;

  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 spring hover:opacity-80">
            <Logo variant="mark" size={24} />
            <span className="text-sm font-semibold tracking-tight text-zinc-100">
              Muditek
            </span>
          </Link>
          <UserButton
            appearance={{
              elements: { avatarBox: "w-7 h-7" },
            }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16 space-y-12 pb-24">
        {/* Greeting */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.025em] text-zinc-50">
            Hi {displayName}.
          </h1>
          <p className="text-sm text-zinc-400">
            {statusLine(access)} account · {email}
          </p>
        </div>

        {/* Newsletter */}
        {showNewsletter && (
          <Section title="Newsletter">
            {issues.map((issue) => (
              <Row
                key={issue.slug}
                href={`/newsletter/${issue.slug}`}
                title={issue.subject}
                meta={formatDate(issue.sent_at)}
                icon={<Newspaper className="size-4" strokeWidth={1.8} />}
              />
            ))}
          </Section>
        )}

        {/* MudiKit (paid) */}
        {showMudikit && (
          <Section title="MudiKit">
            {paidItems.map((item) => (
              <Row
                key={item.id}
                href={item.download_url}
                title={item.title}
                meta={item.category}
                description={item.description}
                icon={<Package className="size-4" strokeWidth={1.8} />}
                external={item.download_url.startsWith("http")}
              />
            ))}
          </Section>
        )}

        {/* Free library */}
        {showLibrary && (
          <Section title="Resources">
            {freeItems.map((item) => (
              <Row
                key={item.id}
                href={resourceHref(item)}
                title={item.title}
                meta={item.category}
                description={item.description}
                icon={<FileText className="size-4" strokeWidth={1.8} />}
                external={item.download_url.startsWith("http")}
              />
            ))}
          </Section>
        )}

        {/* Empty fallback — only if literally nothing real to show */}
        {!showNewsletter && !showLibrary && !showMudikit && (
          <div className="border-y border-white/[0.06] py-16 text-center">
            <p className="text-zinc-300 text-base">Nothing here yet.</p>
            <p className="mt-1 text-sm text-zinc-500">
              The first newsletter issue and resources will appear here.
            </p>
          </div>
        )}

        {/* Account */}
        <section className="space-y-3 pt-4">
          <h2 className="text-sm font-semibold text-zinc-300">Account</h2>
          <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            <div className="flex items-center justify-between py-3.5 text-sm">
              <span className="text-zinc-500">Email</span>
              <span className="text-zinc-100 font-medium">{email}</span>
            </div>
            <div className="flex items-center justify-between py-3.5 text-sm">
              <span className="text-zinc-500">Access</span>
              <span className="text-zinc-100 font-medium">{statusLine(access)}</span>
            </div>
            {stripeCustomerId && (
              <Link
                href="/api/portal/billing"
                prefetch={false}
                className="group flex items-center justify-between py-3.5 text-sm hover:bg-white/[0.02] -mx-2 px-2 rounded-md spring"
              >
                <span className="text-zinc-500 group-hover:text-zinc-300">Billing</span>
                <span className="flex items-center gap-1.5 text-zinc-100 font-medium">
                  Manage
                  <ArrowUpRight className="size-3.5 text-zinc-400 group-hover:text-zinc-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 spring" strokeWidth={2} />
                </span>
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
