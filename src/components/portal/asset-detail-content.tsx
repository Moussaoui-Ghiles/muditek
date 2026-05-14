"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Lock,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resourceShareHref, type ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";

export type AssetLabels = {
  kindSingular: string;
  kindPlural: string;
  backHref: string;
  backLabel: string;
  notFoundBody: string;
  lockedTitle: string;
  lockedBody: string;
  emptyAssetBody: string;
};

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function fileTypeLabel(value: string): string {
  if (!value) return "";
  return value.toUpperCase();
}

function formatLongDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const playbookResponsiveStyles = `
  .portal-asset-html { max-width: 100%; overflow-x: hidden; }
  .portal-asset-html .page {
    margin: 0 auto 24px;
    max-width: 100% !important;
    box-shadow: 0 4px 32px rgba(0,0,0,0.18);
    border-radius: 12px;
  }
  @media (max-width: 850px) {
    .portal-asset-html .page {
      width: 100% !important;
      height: auto !important;
      min-height: unset !important;
      padding: 32px 24px !important;
      page-break-after: unset !important;
    }
    .portal-asset-html .page img { max-width: 100% !important; height: auto !important; }
    .portal-asset-html .page [style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
  }
`;

function NotFoundState({ labels }: { labels: AssetLabels }) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-10">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-10">
        <p className="mb-3 inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          <Sparkles className="size-3" />
          {labels.kindPlural}
        </p>
        <h1 className="font-serif text-3xl font-medium leading-[1.1] tracking-tight text-foreground md:text-4xl">
          {labels.kindSingular} not found
        </h1>
        <p className="mt-3 max-w-lg text-[14px] leading-7 text-muted-foreground">
          {labels.notFoundBody}
        </p>
        <div className="mt-7">
          <Button render={<Link href={labels.backHref} />} nativeButton={false} variant="outline">
            <ArrowLeft className="size-4" />
            {labels.backLabel}
          </Button>
        </div>
      </div>
    </main>
  );
}

function LockedState({
  item,
  labels,
}: {
  item: ContentItem;
  labels: AssetLabels;
}) {
  const created = formatLongDate(item.created_at);
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-10">
      <Link
        href={labels.backHref}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {labels.backLabel}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="reveal">
          <p className="mb-4 inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <span className="size-1 rounded-full bg-amber-300/70" />
            {labels.kindSingular} · MudiKit
          </p>
          <h1 className="font-serif text-[40px] font-medium leading-[1.05] tracking-tight text-foreground md:text-[52px]">
            {item.title}
          </h1>
          {item.description && (
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-foreground/65">
              {item.description}
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.16em]">
              {labels.kindSingular}
            </Badge>
            <Badge variant="outline" className="rounded-full border-amber-300/30 bg-amber-300/[0.05] px-3 py-1 text-[10.5px] uppercase tracking-[0.16em] text-amber-200">
              <Lock className="size-3" />
              MudiKit only
            </Badge>
            {created && (
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.16em]">
                <CalendarDays className="size-3" />
                {created}
              </Badge>
            )}
          </div>
        </div>

        <aside className="reveal reveal-delay-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(120%_120%_at_0%_0%,rgba(244,209,140,0.12),transparent_55%),linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-7">
          <span className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-amber-200">
            <Lock className="size-4" />
          </span>
          <h2 className="mt-5 font-serif text-2xl font-medium leading-tight tracking-tight text-foreground">
            {labels.lockedTitle}
          </h2>
          <p className="mt-2 text-[13.5px] leading-6 text-muted-foreground">{labels.lockedBody}</p>
          <Button render={<Link href="/portal/mudikit" />} nativeButton={false} size="lg" className="mt-7">
            Unlock MudiKit
            <ArrowUpRight className="size-4" />
          </Button>
        </aside>
      </div>
    </main>
  );
}

function ShareResourceButton({ item }: { item: ContentItem }) {
  const [copied, setCopied] = useState(false);
  const sharePath = resourceShareHref(item);

  async function copyShareLink() {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://muditek.com";
    const value = `${origin}${sharePath}`;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copyShareLink}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy lead-magnet link"}
    </Button>
  );
}

export default function AssetDetailContent({
  item,
  access,
  email = "",
  displayName = "",
  html,
  pageImages,
  downloadHref,
  labels,
}: {
  item: ContentItem | null;
  access: PortalAccess;
  email?: string;
  displayName?: string;
  html: { styles: string; body: string } | null;
  pageImages: string[];
  downloadHref: string | null;
  labels: AssetLabels;
}) {
  if (!item) {
    return <NotFoundState labels={labels} />;
  }

  const hasAccess = item.is_free || access.isMudikit || access.isAdmin;
  if (!hasAccess) {
    return <LockedState item={item} labels={labels} />;
  }

  const external = downloadHref ? isExternalHref(downloadHref) : false;
  const actionLabel = external
    ? `Open ${labels.kindSingular.toLowerCase()}`
    : downloadHref
      ? "Download"
      : null;
  const ActionIcon = external ? ExternalLink : Download;
  const created = formatLongDate(item.created_at);
  const updated = formatLongDate(item.updated_at ?? null);

  return (
    <>
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <Link
        href={labels.backHref}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {labels.backLabel}
      </Link>

      <header className="reveal mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <span
              className={`size-1.5 rounded-full ${
                item.is_free ? "bg-emerald-300/80" : "bg-amber-300/80"
              }`}
            />
            {labels.kindSingular}
            <span aria-hidden className="text-muted-foreground/40">·</span>
            {item.is_free ? "Free" : "MudiKit"}
            {item.is_new && (
              <>
                <span aria-hidden className="text-muted-foreground/40">·</span>
                <span className="text-amber-200">New</span>
              </>
            )}
          </p>
          <h1 className="font-serif text-[40px] font-medium leading-[1.05] tracking-tight text-foreground md:text-[52px]">
            {item.title}
          </h1>
          {item.description && (
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-foreground/65">
              {item.description}
            </p>
          )}
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.16em]">
              {labels.kindSingular}
            </Badge>
            <Badge
              variant={item.is_free ? "secondary" : "outline"}
              className={
                item.is_free
                  ? "rounded-full bg-emerald-500/12 px-3 py-1 text-[10.5px] uppercase tracking-[0.16em] text-emerald-200 ring-1 ring-emerald-500/30"
                  : "rounded-full bg-amber-500/10 px-3 py-1 text-[10.5px] uppercase tracking-[0.16em] text-amber-200 ring-1 ring-amber-400/30"
              }
            >
              {item.is_free ? "Free" : "MudiKit"}
            </Badge>
            {item.file_type && (
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.16em]">
                {fileTypeLabel(item.file_type)}
              </Badge>
            )}
          </div>
        </div>

        <aside className="reveal reveal-delay-1 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          {item.thumbnail_url ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/[0.06]">
              <img
                src={item.thumbnail_url}
                alt=""
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(10,10,12,0.6))]" />
            </div>
          ) : (
            <div className="flex aspect-[16/10] items-end border-b border-white/[0.06] bg-[radial-gradient(120%_120%_at_0%_0%,rgba(244,209,140,0.10),transparent_55%),linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-6">
              <span className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-black/30 text-muted-foreground">
                <FileText className="size-4" />
              </span>
            </div>
          )}
          <dl className="divide-y divide-white/[0.06] px-5 text-[12.5px]">
            {created && (
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-muted-foreground">Published</dt>
                <dd className="font-mono text-foreground">{created}</dd>
              </div>
            )}
            {updated && updated !== created && (
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-muted-foreground">Updated</dt>
                <dd className="font-mono text-foreground">{updated}</dd>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-muted-foreground">Format</dt>
              <dd className="font-mono uppercase text-foreground">{fileTypeLabel(item.file_type) || "Asset"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-muted-foreground">Access</dt>
              <dd className="font-mono text-foreground">{item.is_free ? "Free" : "MudiKit"}</dd>
            </div>
          </dl>
          {item.is_free && (
            <div className="border-t border-white/[0.06] px-5 py-4">
              <p className="mb-3 text-[11.5px] leading-5 text-muted-foreground">
                Share this as a lead magnet. New visitors create a free account before it opens.
              </p>
              <ShareResourceButton item={item} />
            </div>
          )}
        </aside>
      </header>

      {downloadHref && actionLabel && (
        <section className="reveal reveal-delay-2 mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-foreground/80">
                <Terminal className="size-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[14.5px] font-medium tracking-tight text-foreground">Ready to use</div>
                <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                  {external
                    ? "Opens in a new tab."
                    : "Direct download attached to this resource."}
                </p>
              </div>
            </div>
            <Button
              render={
                <Link
                  href={downloadHref}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                />
              }
              nativeButton={false}
              size="lg"
            >
              <ActionIcon className="size-4" />
              {actionLabel}
            </Button>
          </div>
        </section>
      )}

      <section className="reveal reveal-delay-3 mt-10">
        {html ? (
          <>
            <style dangerouslySetInnerHTML={{ __html: html.styles }} />
            <style dangerouslySetInnerHTML={{ __html: playbookResponsiveStyles }} />
            <div
              className="portal-asset-html rounded-2xl border border-white/[0.06] bg-white/[0.015] p-3 sm:p-5"
              dangerouslySetInnerHTML={{ __html: html.body }}
            />
          </>
        ) : pageImages.length > 0 ? (
          <div className="mx-auto flex max-w-[920px] flex-col gap-5 md:gap-7">
            {pageImages.map((src, index) => (
              <div
                key={src}
                className="w-full overflow-hidden rounded-2xl border border-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.32)]"
              >
                <img
                  src={src}
                  alt={`${item.title} — Page ${index + 1}`}
                  className="block h-auto w-full"
                  loading={index < 3 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        ) : (
          !downloadHref && (
            <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.01] p-8 text-[13.5px] leading-7 text-muted-foreground">
              {labels.emptyAssetBody}
            </div>
          )
        )}
      </section>

      <div className="mt-12 border-t border-white/[0.06] pt-6">
        <Button render={<Link href={labels.backHref} />} nativeButton={false} variant="outline" size="sm">
          <ArrowLeft className="size-3.5" />
          {labels.backLabel}
        </Button>
      </div>
    </main>
    </>
  );
}
