"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Lock,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
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

function accessLabel(item: ContentItem): string | null {
  return item.is_free ? null : "MudiKit";
}

function formatLongDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" });
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-[10.5px] font-black uppercase tracking-[0.25em] text-foreground/55 transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-3" />
      {label}
    </Link>
  );
}

function NotFoundState({ labels }: { labels: AssetLabels }) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-10">
      <BackLink href={labels.backHref} label={labels.backLabel} />
      <div className="card-lift mt-8 overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-12 backdrop-blur-md">
        <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
          <span aria-hidden className="h-px w-6 bg-primary/50" />
          {labels.kindPlural}
        </p>
        <h1 className="mt-5 text-[34px] font-black leading-[0.95] tracking-[-0.03em] text-foreground md:text-[44px]">
          {labels.kindSingular} not found.
        </h1>
        <p className="mt-5 max-w-lg text-[14.5px] leading-7 text-foreground/65">
          {labels.notFoundBody}
        </p>
      </div>
    </main>
  );
}

function LockedState({ item, labels }: { item: ContentItem; labels: AssetLabels }) {
  const created = formatLongDate(item.created_at);
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
      <BackLink href={labels.backHref} label={labels.backLabel} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="reveal">
          <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
            <span aria-hidden className="h-px w-6 bg-primary/50" />
            {labels.kindSingular} · MudiKit
          </p>
          <h1 className="mt-6 text-[40px] font-black leading-[0.95] tracking-[-0.035em] text-foreground md:text-[60px]">
            {item.title}
          </h1>
          {item.description && (
            <p className="mt-6 max-w-2xl text-[15px] leading-[1.75] text-foreground/65">
              {item.description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-[2px] border border-white/[0.1] bg-white/[0.025] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-foreground/75">
              {labels.kindSingular}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-primary/30 bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              <Lock className="size-3" />
              MudiKit only
            </span>
            {created && (
              <span className="inline-flex items-center rounded-[2px] border border-white/[0.1] bg-white/[0.025] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-foreground/75">
                {created}
              </span>
            )}
          </div>
        </div>

        <aside className="reveal reveal-delay-1 card-lift relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-8 backdrop-blur-md">
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
          <span className="relative z-10 flex size-12 items-center justify-center rounded-[2px] border border-primary/30 bg-primary/10 text-primary">
            <Lock className="size-4" />
          </span>
          <h2 className="relative z-10 mt-6 text-[26px] font-black leading-[1] tracking-[-0.02em] text-foreground">
            {labels.lockedTitle}
          </h2>
          <p className="relative z-10 mt-3 text-[13.5px] leading-7 text-foreground/65">
            {labels.lockedBody}
          </p>
          <Link
            href="/portal/mudikit"
            className="group btn-press relative z-10 mt-8 inline-flex items-center justify-center overflow-hidden rounded-[2px] bg-foreground px-8 py-4 text-[11px] font-black uppercase tracking-[0.22em] text-background"
          >
            <span className="relative z-10 inline-flex items-center gap-3">
              Unlock MudiKit
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </span>
            <span className="absolute inset-0 z-0 w-0 bg-primary transition-all duration-500 ease-in-out group-hover:w-full" />
          </Link>
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
      {copied ? "Copied" : "Copy share link"}
    </Button>
  );
}

function HtmlAssetFrame({
  html,
  title,
}: {
  html: { document: string };
  title: string;
}) {
  const [height, setHeight] = useState(900);
  const frameId = useId();
  const srcDoc = useMemo(() => {
    const runtime = `<script>
      (() => {
        const id = ${JSON.stringify(frameId)};
        let last = 0;
        const measure = () => {
          if (!document.body) return;
          const height = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
          );
          if (Math.abs(height - last) > 4) {
            last = height;
            parent.postMessage({ type: "muditek:asset-height", id, height }, "*");
          }
        };
        if (window.ResizeObserver && document.body) {
          new ResizeObserver(measure).observe(document.body);
        }
        window.addEventListener("load", measure);
        setTimeout(measure, 80);
        setTimeout(measure, 500);
        setTimeout(measure, 1500);
      })();
    </script>`;

    if (/<\/body>/i.test(html.document)) {
      return html.document.replace(/<\/body>/i, `${runtime}</body>`);
    }

    if (/<\/html>/i.test(html.document)) {
      return html.document.replace(/<\/html>/i, `${runtime}</html>`);
    }

    return `${html.document}${runtime}`;
  }, [frameId, html.document]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (
        data &&
        data.type === "muditek:asset-height" &&
        data.id === frameId &&
        typeof data.height === "number"
      ) {
        setHeight(Math.min(Math.max(data.height, 420), 30000));
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [frameId]);

  return (
    <iframe
      title={title}
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
      className="block w-full rounded-[2px] border border-white/[0.08] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.32)]"
      style={{ height }}
    />
  );
}

export default function AssetDetailContent({
  item,
  access,
  html,
  pageImages,
  downloadHref,
  labels,
}: {
  item: ContentItem | null;
  access: PortalAccess;
  email?: string;
  displayName?: string;
  html: { document: string } | null;
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
  const accentClass = "text-primary";
  const accessText = accessLabel(item);
  const isHtml = (item.file_type || "").toLowerCase() === "html";
  const showDownloadCta = !!downloadHref && !!actionLabel && !(html && isHtml);

  return (
    <main className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="mesh-subtle pointer-events-none absolute inset-0 opacity-60" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 md:pb-20 md:pt-14 lg:px-10">
          <BackLink href={labels.backHref} label={labels.backLabel} />

          <div className="reveal mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                <span aria-hidden className="h-px w-6 bg-primary/50" />
                {labels.kindSingular}
                {accessText && (
                  <>
                    <span aria-hidden className="text-foreground/30">·</span>
                    <span className={accentClass}>{accessText}</span>
                  </>
                )}
                {item.is_new && (
                  <>
                    <span aria-hidden className="text-foreground/30">·</span>
                    <span className="text-emerald-300/90">New</span>
                  </>
                )}
              </p>
              <h1 className="mt-6 text-[40px] font-black leading-[0.92] tracking-[-0.04em] text-foreground md:text-[68px]">
                {item.title}
              </h1>
              {item.description && (
                <p className="mt-6 max-w-2xl text-[15px] leading-[1.75] text-foreground/65">
                  {item.description}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-[2px] border border-white/[0.1] bg-white/[0.025] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-foreground/75">
                  {labels.kindSingular}
                </span>
                {accessText && (
                  <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-primary/30 bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                    <span className="inline-block size-1.5 rounded-full bg-primary/80" />
                    {accessText}
                  </span>
                )}
                {item.file_type && (
                  <span className="inline-flex items-center rounded-[2px] border border-white/[0.1] bg-white/[0.025] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-foreground/75">
                    {fileTypeLabel(item.file_type)}
                  </span>
                )}
              </div>
            </div>

            <aside className="card-lift relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] backdrop-blur-md">
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-primary/5 blur-[60px]" />
              {item.thumbnail_url ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/[0.06]">
                  <img
                    src={item.thumbnail_url}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(10,10,12,0.7))]" />
                </div>
              ) : (
                <div className="flex aspect-[16/10] items-end border-b border-white/[0.06] bg-[radial-gradient(120%_120%_at_0%_0%,rgba(245,158,11,0.10),transparent_55%),linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-6">
                  <span className="flex size-11 items-center justify-center rounded-[2px] border border-white/[0.08] bg-black/30 text-foreground/55">
                    <FileText className="size-4" />
                  </span>
                </div>
              )}
              <dl className="relative divide-y divide-white/[0.06] px-5 text-[12px]">
                {created && (
                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <dt className="font-black uppercase tracking-[0.2em] text-foreground/55">Published</dt>
                    <dd className="font-mono text-foreground tnum">{created}</dd>
                  </div>
                )}
                {updated && updated !== created && (
                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <dt className="font-black uppercase tracking-[0.2em] text-foreground/55">Updated</dt>
                    <dd className="font-mono text-foreground tnum">{updated}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="font-black uppercase tracking-[0.2em] text-foreground/55">Format</dt>
                  <dd className="font-mono uppercase text-foreground">{fileTypeLabel(item.file_type) || "Asset"}</dd>
                </div>
                {accessText && (
                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <dt className="font-black uppercase tracking-[0.2em] text-foreground/55">Access</dt>
                    <dd className={`font-mono ${accentClass}`}>{accessText}</dd>
                  </div>
                )}
              </dl>
              {item.is_free && (
                <div className="relative border-t border-white/[0.06] px-5 py-4">
                  <p className="mb-3 text-[11.5px] leading-5 text-foreground/55">
                    Copy a share link. New visitors create an account before the resource opens.
                  </p>
                  <ShareResourceButton item={item} />
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        {showDownloadCta && downloadHref && actionLabel && (
          <ScrollReveal>
          <section className="mb-12">
            <div className="card-lift group relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] backdrop-blur-md">
              <div className="pointer-events-none absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-[1.2s] group-hover:via-primary/70" />
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-primary/5 blur-[60px]" />
              <div className="relative flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
                <div className="flex items-start gap-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-[2px] border border-white/[0.1] bg-white/[0.04] text-primary">
                    <Terminal className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                      Ready to use
                    </p>
                    <p className="mt-2 text-[18px] font-black leading-[1.2] tracking-[-0.02em] text-foreground">
                      {external ? `Open the ${labels.kindSingular.toLowerCase()}` : "Direct download"}
                    </p>
                    <p className="mt-1.5 text-[13px] leading-6 text-foreground/65">
                      {external
                        ? "Opens in a new tab."
                        : "Attached to this resource. Yours to keep."}
                    </p>
                  </div>
                </div>
                <Link
                  href={downloadHref}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group/btn btn-press relative inline-flex items-center justify-center overflow-hidden rounded-[2px] bg-foreground px-10 py-5 text-[11px] font-black uppercase tracking-[0.22em] text-background"
                >
                  <span className="relative z-10 inline-flex items-center gap-3">
                    <ActionIcon className="size-3.5" />
                    {actionLabel}
                  </span>
                  <span className="absolute inset-0 z-0 w-0 bg-primary transition-all duration-500 ease-in-out group-hover/btn:w-full" />
                </Link>
              </div>
            </div>
          </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
        <section>
          {html ? (
            <>
              <div className="mb-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/55">
                <span aria-hidden className="h-px w-6 bg-white/20" />
                Read in portal
              </div>
              <HtmlAssetFrame html={html} title={item.title} />
            </>
          ) : pageImages.length > 0 ? (
            <>
              <div className="mb-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/55">
                <span aria-hidden className="h-px w-6 bg-white/20" />
                Pages · {pageImages.length}
              </div>
              <div className="mx-auto flex max-w-[920px] flex-col gap-5 md:gap-7">
                {pageImages.map((src, index) => (
                  <div
                    key={src}
                    className="overflow-hidden rounded-[2px] border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.32)]"
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
            </>
          ) : (
            !showDownloadCta && (
              <div className="rounded-[2px] border border-dashed border-white/[0.1] bg-white/[0.01] p-10 text-[13.5px] leading-7 text-foreground/65">
                {labels.emptyAssetBody}
              </div>
            )
          )}
        </section>
        </ScrollReveal>

        <div className="mt-16 border-t border-white/[0.06] pt-8">
          <BackLink href={labels.backHref} label={labels.backLabel} />
        </div>
      </div>
    </main>
  );
}
