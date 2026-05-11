"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo/logo";

interface Neighbor {
  slug: string;
  subject: string;
}

interface IssueData {
  subject: string;
  slug: string;
  html: string;
  sentAtIso: string | null;
  updatedAtIso: string | null;
  tldr: string | null;
  preview: string | null;
}

interface Props {
  email: string;
  issue: IssueData;
  prev: Neighbor | null;
  next: Neighbor | null;
}

function formatDateLong(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const PORTAL_ROUTE_REWRITES: Array<[RegExp, string]> = [
  [/^https?:\/\/(?:www\.)?muditek\.com\/newsletter\/([\w-]+)\/?(?:\?[^#]*)?(?:#.*)?$/i, "/portal/newsletter/$1"],
  [/^\/newsletter\/([\w-]+)\/?(?:\?[^#]*)?(?:#.*)?$/i, "/portal/newsletter/$1"],
  [/^https?:\/\/(?:www\.)?muditek\.com\/mudikit\/?(?:\?[^#]*)?(?:#.*)?$/i, "/portal/mudikit"],
  [/^\/mudikit\/?(?:\?[^#]*)?(?:#.*)?$/i, "/portal/mudikit"],
];

function rewritePortalLinks(html: string): string {
  if (!html) return "";
  return html.replace(/href=(["'])([^"']+)\1/gi, (match, quote: string, href: string) => {
    for (const [pattern, replacement] of PORTAL_ROUTE_REWRITES) {
      const swapped = href.replace(pattern, replacement);
      if (swapped !== href) {
        return `href=${quote}${swapped}${quote}`;
      }
    }
    return match;
  });
}

function PortalHeader({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.07] bg-background/92 px-4 backdrop-blur md:px-6">
      <Link
        href="/portal/newsletter"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Newsletter
      </Link>
      <div className="flex flex-1 items-center justify-center gap-2">
        <Logo variant="mark" size={22} />
        <span className="hidden text-[13px] font-semibold tracking-tight sm:inline">Muditek Portal</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden truncate text-[11px] text-muted-foreground sm:inline">{email}</span>
        <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
      </div>
    </header>
  );
}

export default function NewsletterDetailContent({ email, issue, prev, next }: Props) {
  const safeHtml = useMemo(() => rewritePortalLinks(issue.html), [issue.html]);
  const sentAt = formatDateLong(issue.sentAtIso);
  const updatedAt = formatDateLong(issue.updatedAtIso);
  const showUpdated = updatedAt && updatedAt !== sentAt;

  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      <PortalHeader email={email} />

      <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <Link
          href="/portal/newsletter"
          className="inline-flex items-center gap-1.5 text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
          Back to archive
        </Link>

        <header className="mt-6 mb-8">
          <h1 className="text-balance text-3xl font-semibold tracking-[-0.01em] leading-[1.1] text-foreground md:text-[34px]">
            {issue.subject}
          </h1>
          {(sentAt || showUpdated) && (
            <p className="mt-4 text-[12.5px] text-muted-foreground">
              {sentAt && <span>Sent {sentAt}</span>}
              {sentAt && showUpdated && <span className="mx-2 text-[#636366]">·</span>}
              {showUpdated && <span>Updated {updatedAt}</span>}
            </p>
          )}
        </header>

        {issue.tldr && (
          <aside className="mb-10 rounded-r-[2px] border-l-2 border-white/40 bg-white/[0.03] px-5 py-4">
            <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              TL;DR
            </p>
            <p className="text-[15px] leading-snug font-medium text-foreground">{issue.tldr}</p>
          </aside>
        )}

        {safeHtml ? (
          <div className="portal-newsletter-article overflow-hidden rounded-lg bg-white text-black">
            <div
              className="newsletter-body"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/[0.1] bg-white/[0.015] p-6 text-[13px] text-muted-foreground">
            This issue has no rendered body in storage.
          </div>
        )}

        <nav className="mt-12 grid gap-3 border-t border-white/[0.06] pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/portal/newsletter/${encodeURIComponent(prev.slug)}`}
              className="group flex items-start gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
            >
              <ChevronLeft className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5 group-hover:text-foreground" />
              <span className="min-w-0">
                <span className="block text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">Previous</span>
                <span className="mt-1 line-clamp-2 block text-[13.5px] font-medium text-foreground">{prev.subject}</span>
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={`/portal/newsletter/${encodeURIComponent(next.slug)}`}
              className="group flex items-start gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 text-right transition-colors hover:bg-white/[0.04] sm:text-right"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">Next</span>
                <span className="mt-1 line-clamp-2 block text-[13.5px] font-medium text-foreground">{next.subject}</span>
              </span>
              <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
        </nav>

        <section className="mt-10 flex items-start gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
            <Mail className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-medium text-foreground">Reading inside the portal</div>
            <p className="mt-0.5 text-[12px] leading-5 text-muted-foreground">
              The full library is in <Link href="/portal" className="text-foreground underline decoration-muted-foreground underline-offset-4 hover:decoration-foreground">your portal</Link>. MudiKit access lives in <Link href="/portal/mudikit" className="text-foreground underline decoration-muted-foreground underline-offset-4 hover:decoration-foreground">/portal/mudikit</Link>.
            </p>
          </div>
          <Link
            href={`/newsletter/${encodeURIComponent(issue.slug)}`}
            className="inline-flex items-center gap-1.5 self-start rounded-md border border-white/[0.1] bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-white/[0.05]"
            target="_blank"
            rel="noopener"
          >
            Public view
            <ArrowUpRight className="size-3.5" />
          </Link>
        </section>
      </article>

      <style jsx global>{`
        .portal-newsletter-article .newsletter-body {
          padding: 32px clamp(20px, 5vw, 56px) 40px;
          font: 16px/1.7 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: #1a1a1a;
        }
        .portal-newsletter-article .newsletter-body :where(p, ul, ol) {
          margin: 0 0 16px;
        }
        .portal-newsletter-article .newsletter-body :where(h1, h2, h3, h4) {
          color: #0c0c0e;
          line-height: 1.25;
          margin: 28px 0 12px;
        }
        .portal-newsletter-article .newsletter-body h1 {
          font-size: 28px;
          letter-spacing: -0.01em;
        }
        .portal-newsletter-article .newsletter-body h2 {
          font-size: 22px;
        }
        .portal-newsletter-article .newsletter-body h3 {
          font-size: 18px;
        }
        .portal-newsletter-article .newsletter-body a {
          color: #0c0c0e;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .portal-newsletter-article .newsletter-body img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .portal-newsletter-article .newsletter-body code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          background: #f3f3f5;
          padding: 0.15em 0.35em;
          border-radius: 4px;
          font-size: 0.92em;
        }
        .portal-newsletter-article .newsletter-body pre {
          background: #0c0c0e;
          color: #e8e8ec;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 0 0 18px;
        }
        .portal-newsletter-article .newsletter-body pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }
        .portal-newsletter-article .newsletter-body blockquote {
          border-left: 3px solid #d4d4d8;
          padding: 4px 0 4px 16px;
          margin: 0 0 18px;
          color: #3f3f46;
        }
        .portal-newsletter-article .newsletter-body hr {
          border: 0;
          border-top: 1px solid #e4e4e7;
          margin: 24px 0;
        }
      `}</style>
    </div>
  );
}
