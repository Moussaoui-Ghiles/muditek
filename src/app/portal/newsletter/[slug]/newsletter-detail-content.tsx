"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Mail } from "lucide-react";

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
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const PORTAL_ROUTE_REWRITES: Array<[RegExp, string]> = [
  [/^https?:\/\/(?:www\.)?muditek\.com\/newsletter\/([\w-]+)\/?(?:\?[^#]*)?(?:#.*)?$/i, "/portal/newsletter/$1"],
  [/^\/newsletter\/([\w-]+)\/?(?:\?[^#]*)?(?:#.*)?$/i, "/portal/newsletter/$1"],
  [/^https?:\/\/(?:www\.)?muditek\.com\/resources\/([\w-]+)\/?(?:\?[^#]*)?(?:#.*)?$/i, "/r/$1"],
  [/^\/resources\/([\w-]+)\/?(?:\?[^#]*)?(?:#.*)?$/i, "/r/$1"],
  [/^https?:\/\/(?:www\.)?muditek\.com\/r\/([\w-]+)\/?(?:\?[^#]*)?(?:#.*)?$/i, "/r/$1"],
  [/^https?:\/\/(?:www\.)?muditek\.com\/playbooks\/([\w-]+)\.pdf(?:\?[^#]*)?(?:#.*)?$/i, "/r/$1"],
  [/^\/playbooks\/([\w-]+)\.pdf(?:\?[^#]*)?(?:#.*)?$/i, "/r/$1"],
  [/^https?:\/\/(?:www\.)?muditek\.com\/playbooks\/([\w-]+)\.html(?:\?[^#]*)?(?:#.*)?$/i, "/r/$1"],
  [/^\/playbooks\/([\w-]+)\.html(?:\?[^#]*)?(?:#.*)?$/i, "/r/$1"],
  [/^https?:\/\/(?:www\.)?muditek\.com\/tools\/revenue-leak-calculator\/?(?:\?[^#]*)?(?:#.*)?$/i, "/portal/tools/revenue-leak-calculator"],
  [/^\/tools\/revenue-leak-calculator\/?(?:\?[^#]*)?(?:#.*)?$/i, "/portal/tools/revenue-leak-calculator"],
  [/^https?:\/\/(?:www\.)?muditek\.com\/mudikit\/?(?:\?[^#]*)?(?:#.*)?$/i, "/portal"],
  [/^\/mudikit\/?(?:\?[^#]*)?(?:#.*)?$/i, "/portal"],
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

export default function NewsletterDetailContent({ issue, prev, next }: Props) {
  const safeHtml = useMemo(() => rewritePortalLinks(issue.html), [issue.html]);
  const sentAt = formatDateLong(issue.sentAtIso);
  const updatedAt = formatDateLong(issue.updatedAtIso);
  const showUpdated = updatedAt && updatedAt !== sentAt;

  return (
    <article className="mx-auto w-full max-w-2xl px-4 pb-20 pt-10 sm:px-6">
      <Link
        href="/portal/newsletter"
        className="inline-flex items-center gap-1.5 text-[11.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" />
        Back to archive
      </Link>

      <header className="reveal mt-7">
        <p className="mb-4 inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-amber-300/70" />
          Newsletter article
          {sentAt && (
            <>
              <span aria-hidden className="text-muted-foreground/40">·</span>
              <span>{sentAt}</span>
            </>
          )}
        </p>
        <h1 className="font-[family-name:var(--font-serif-display)] text-balance text-[40px] font-normal leading-[1.02] tracking-tight text-foreground md:text-[54px]">
          {issue.subject}
        </h1>
        {showUpdated && (
          <p className="mt-3 text-[12px] text-muted-foreground">
            Updated {updatedAt}
          </p>
        )}
      </header>

      {issue.tldr && (
        <aside className="reveal reveal-delay-1 mt-9 rounded-r-md border-l-2 border-amber-300/60 bg-amber-300/[0.04] px-5 py-4">
          <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-amber-200/90">
            TL;DR
          </p>
          <p className="text-[15px] font-medium leading-snug text-foreground">{issue.tldr}</p>
        </aside>
      )}

      <div className="reveal reveal-delay-2 mt-10">
        {safeHtml ? (
          <div className="portal-newsletter-article overflow-hidden rounded-2xl border border-white/[0.06] bg-white text-black shadow-[0_8px_40px_rgba(0,0,0,0.32)]">
            <div className="newsletter-body" dangerouslySetInnerHTML={{ __html: safeHtml }} />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.01] p-8 text-[13.5px] leading-7 text-muted-foreground">
            This article has no rendered body in storage.
          </div>
        )}
      </div>

      <nav className="reveal reveal-delay-3 mt-12 grid gap-3 border-t border-white/[0.06] pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/portal/newsletter/${encodeURIComponent(prev.slug)}`}
            className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
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
            className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-right transition-colors hover:bg-white/[0.04] sm:text-right"
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

      <section className="mt-10 flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
          <Mail className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-medium text-foreground">Reading inside the portal</div>
          <p className="mt-0.5 text-[12px] leading-5 text-muted-foreground">
            The full library is in <Link href="/portal" className="text-foreground underline decoration-muted-foreground underline-offset-4 hover:decoration-foreground">your portal</Link>. Skills, resources, tools, and newsletter articles stay in one account.
          </p>
        </div>
      </section>

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
        .portal-newsletter-article .newsletter-body h2 { font-size: 22px; }
        .portal-newsletter-article .newsletter-body h3 { font-size: 18px; }
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
    </article>
  );
}
