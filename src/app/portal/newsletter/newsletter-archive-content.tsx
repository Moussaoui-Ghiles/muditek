"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookText, Mail, Package, Sparkles, Wand2, Wrench } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo/logo";

export interface ArchiveIssue {
  slug: string;
  subject: string;
  sent_at: string | null;
  preview: string | null;
}

function formatDateLong(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function groupByYear(issues: ArchiveIssue[]): Array<{ year: string; items: ArchiveIssue[] }> {
  const groups = new Map<string, ArchiveIssue[]>();
  for (const issue of issues) {
    const year = issue.sent_at
      ? new Date(issue.sent_at).getFullYear().toString()
      : "Undated";
    const list = groups.get(year);
    if (list) list.push(issue);
    else groups.set(year, [issue]);
  }
  return Array.from(groups.entries()).map(([year, items]) => ({ year, items }));
}

function PortalHeader({ email }: { email: string }) {
  return (
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
        <span className="text-[13px] font-semibold tracking-tight">Newsletter</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden truncate text-[11px] text-muted-foreground sm:inline">{email}</span>
        <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
      </div>
    </header>
  );
}

function IssueRow({ issue, latest }: { issue: ArchiveIssue; latest?: boolean }) {
  return (
    <Link
      href={`/portal/newsletter/${encodeURIComponent(issue.slug)}`}
      className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 border-b border-white/[0.06] py-5 last:border-b-0 sm:grid-cols-[120px_minmax(0,1fr)_auto]"
    >
      <span className="order-2 text-[11.5px] uppercase tracking-[0.15em] text-muted-foreground sm:order-1 sm:pt-1">
        {formatDateShort(issue.sent_at) || "—"}
      </span>
      <span className="order-1 min-w-0 sm:order-2">
        <span className="flex flex-wrap items-baseline gap-2">
          <span className="text-[15px] font-medium leading-snug text-foreground group-hover:text-white">
            {issue.subject}
          </span>
          {latest && (
            <span className="rounded-md border border-white/[0.12] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Latest
            </span>
          )}
        </span>
        {issue.preview && (
          <span className="mt-1 line-clamp-2 max-w-2xl text-[13px] leading-5 text-muted-foreground">
            {issue.preview}
          </span>
        )}
      </span>
      <ArrowUpRight className="order-3 size-4 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
    </Link>
  );
}

function PointerRow({
  href,
  icon,
  title,
  body,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-medium text-foreground">{title}</span>
        <span className="mt-0.5 block text-[12px] leading-5 text-muted-foreground">{body}</span>
      </span>
      <ArrowUpRight className="mt-1 size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
    </Link>
  );
}

export default function NewsletterArchiveContent({
  email,
  issues,
}: {
  email: string;
  issues: ArchiveIssue[];
}) {
  const latest = issues[0];
  const groups = groupByYear(issues);

  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      <PortalHeader email={email} />
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <div className="mb-10">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Archive
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">
            Newsletter
          </h1>
          <p className="mt-2 max-w-xl text-[14px] leading-6 text-muted-foreground">
            Past Muditek newsletter issues, ordered by sent date.
          </p>
        </div>

        {issues.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/[0.1] bg-white/[0.015] p-6">
            <div className="mb-3 flex size-9 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
              <Sparkles className="size-4" />
            </div>
            <h2 className="text-sm font-medium text-foreground">No issues sent yet</h2>
            <p className="mt-1 max-w-lg text-[13px] leading-6 text-muted-foreground">
              The archive will fill once issues start sending. Free and paid content lives in the
              library in the meantime.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {groups.map((group, gIndex) => (
              <section key={group.year}>
                {groups.length > 1 && (
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {group.year}
                    </span>
                    <span className="h-px flex-1 bg-white/[0.06]" />
                    <span className="text-[11px] text-muted-foreground">
                      {group.items.length} issue{group.items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                )}
                <div>
                  {group.items.map((issue) => (
                    <IssueRow
                      key={issue.slug}
                      issue={issue}
                      latest={gIndex === 0 && issue.slug === latest?.slug}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <section className="mt-16 border-t border-white/[0.06] pt-10">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Library
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <PointerRow
              href="/portal/skills"
              icon={<Wand2 className="size-4" />}
              title="Skills"
              body="Operator skills attached to your account."
            />
            <PointerRow
              href="/portal/playbooks"
              icon={<BookText className="size-4" />}
              title="Playbooks & guides"
              body="Free playbooks and guides."
            />
            <PointerRow
              href="/portal/tools"
              icon={<Wrench className="size-4" />}
              title="Tools"
              body="Free portal tools."
            />
            <PointerRow
              href="/portal/mudikit"
              icon={<Package className="size-4" />}
              title="MudiKit"
              body="Paid library and access."
            />
          </div>
        </section>

        {latest && (
          <section className="mt-10 flex flex-col gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
                <Mail className="size-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[13.5px] font-medium text-foreground">
                  Latest issue
                </div>
                <p className="mt-0.5 text-[12px] leading-5 text-muted-foreground">
                  {latest.subject}
                  {latest.sent_at ? ` · ${formatDateLong(latest.sent_at)}` : ""}
                </p>
              </div>
            </div>
            <Link
              href={`/portal/newsletter/${encodeURIComponent(latest.slug)}`}
              className="inline-flex items-center gap-1.5 self-start rounded-md border border-white/[0.1] bg-white/[0.03] px-3 py-1.5 text-[12.5px] font-medium text-foreground transition-colors hover:bg-white/[0.05] sm:self-auto"
            >
              Open
              <ArrowUpRight className="size-3.5" />
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
