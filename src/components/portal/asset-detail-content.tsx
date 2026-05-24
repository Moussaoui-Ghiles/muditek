"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import { ScrollReveal } from "@/components/scroll-reveal";
import { categoryLabel, resourceShareHref, type ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";
import { SHOW_MUDIKIT_IN_PORTAL } from "@/lib/portal-features";

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
  if (!SHOW_MUDIKIT_IN_PORTAL) return null;
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
            {labels.kindSingular}
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
              Not available
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
            href={labels.backHref}
            className="group btn-press relative z-10 mt-8 inline-flex items-center justify-center overflow-hidden rounded-[2px] bg-foreground px-8 py-4 text-[11px] font-black uppercase tracking-[0.22em] text-background"
          >
            <span className="relative z-10 inline-flex items-center gap-3">
              Back to library
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
    <button
      type="button"
      onClick={copyShareLink}
      className="inline-flex items-center gap-2 rounded-[3px] border border-white/15 bg-white/[0.06] px-4 py-2.5 text-[13px] font-bold uppercase tracking-[0.04em] text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : "Copy share link"}
    </button>
  );
}

function HtmlAssetFrame({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const src = `/api/portal/resources/${encodeURIComponent(slug)}/html`;

  useEffect(() => {
    const maybeHost = hostRef.current;
    if (!maybeHost) return;
    const currentHost: HTMLDivElement = maybeHost;

    const shadow = currentHost.shadowRoot ?? currentHost.attachShadow({ mode: "open" });
    let cancelled = false;
    const cleanup: Array<() => void> = [];
    setError(null);
    shadow.innerHTML = `
      <style>
        :host { display: block; min-height: 70vh; background: #0a0a0a; }
        .muditek-html-loading {
          min-height: 70vh;
          display: grid;
          place-items: center;
          color: rgba(255,255,255,.55);
          font: 700 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
          letter-spacing: .22em;
          text-transform: uppercase;
        }
      </style>
      <div class="muditek-html-loading">Loading ${title}</div>
    `;

    async function loadHtml() {
      const response = await fetch(src, { credentials: "same-origin" });
      if (!response.ok) throw new Error("Unable to load this resource.");
      const html = await response.text();
      if (cancelled) return;

      const documentHtml = new DOMParser().parseFromString(html, "text/html");
      const headNodes = Array.from(documentHtml.head.children)
        .filter((node) => !["SCRIPT", "BASE"].includes(node.tagName))
        .map((node) => {
          if (node.tagName !== "STYLE") return node.outerHTML;
          return `<style>${node.textContent?.replace(/:root/g, ":host") ?? ""}</style>`;
        })
        .join("");
      const body = documentHtml.body.innerHTML;

      // Light-themed docs declare their page background/text on <body>, which is
      // dropped when only body.innerHTML is injected — leaving them on the dark
      // host. Read those values (read-only) and override the host background so
      // the doc paints its own surface. Dark docs resolve to their own dark
      // background here, so nothing changes for them.
      const bodyStyleText = Array.from(documentHtml.querySelectorAll("style"))
        .map((node) => node.textContent || "")
        .join("\n");
      const bodyRule = bodyStyleText.match(/(?:^|[^-\w])body\s*\{([^}]*)\}/i)?.[1] ?? "";
      const docBg = bodyRule.match(/background(?:-color)?\s*:\s*([^;]+)/i)?.[1]?.trim();
      const docFg = bodyRule.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i)?.[1]?.trim();
      const surfaceStyle = docBg
        ? `<style id="muditek-surface">:host{background:${docBg} !important;}${docFg ? `:host{color:${docFg};}` : ""}</style>`
        : "";

      shadow.innerHTML = `
        ${headNodes}
        <style id="muditek-shadow-reader">
          :host {
            display: block;
            background: #0a0a0a;
            contain: content;
          }
          :host *, :host *::before, :host *::after {
            box-sizing: border-box;
          }
          img, svg, video, canvas {
            max-width: 100%;
            height: auto;
          }
          pre, table {
            max-width: 100%;
            overflow-x: auto;
          }
          .muditek-fixed-pages {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: clamp(14px, 2vw, 28px);
            padding: clamp(12px, 2vw, 28px) 0 56px;
            background: #0a0a0a;
          }
          .muditek-page-shell {
            position: relative;
            flex: none;
            max-width: calc(100vw - 24px);
            overflow: visible;
          }
          .muditek-page-shell > .page {
            margin: 0 !important;
            transform-origin: top left !important;
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
          }
          @media (max-width: 640px) {
            :where(.toc ol) {
              columns: 1 !important;
            }
            :where(.g2, .g3, .cmp, .stats, .layers-grid, .toc-grid) {
              grid-template-columns: 1fr !important;
            }
            :where(.stats) {
              flex-direction: column !important;
            }
            :where(pre, code) {
              white-space: pre-wrap !important;
              overflow-wrap: anywhere;
            }
          }
        </style>
        ${surfaceStyle}
        ${body}
      `;

      const pages = Array.from(shadow.querySelectorAll(".page")).filter((page) => {
        if (!(page instanceof HTMLElement)) return false;
        const rect = page.getBoundingClientRect();
        const w = rect.width || page.offsetWidth;
        const h = rect.height || page.offsetHeight;
        // Only scale genuine fixed-size deck pages (portrait-ish). A long,
        // continuous document that uses .page must render at full flow.
        return w > 0 && h > 0 && h / w < 2.2;
      });
      if (pages.length > 0) {
        const wrapper = document.createElement("div");
        wrapper.className = "muditek-fixed-pages";
        const firstPage = pages[0];
        firstPage.parentNode?.insertBefore(wrapper, firstPage);
        for (const page of pages) {
          if (page.parentElement?.classList.contains("muditek-page-shell")) continue;
          const shell = document.createElement("div");
          shell.className = "muditek-page-shell";
          page.parentNode?.insertBefore(shell, page);
          shell.appendChild(page);
          wrapper.appendChild(shell);
        }

        const scalePages = () => {
          for (const shell of Array.from(shadow.querySelectorAll(".muditek-page-shell"))) {
            const page = shell.firstElementChild;
            if (!(page instanceof HTMLElement) || !(shell instanceof HTMLElement)) continue;
            page.style.transform = "";
            shell.style.width = "";
            shell.style.height = "";
            const rect = page.getBoundingClientRect();
            const naturalWidth = rect.width || page.offsetWidth || 794;
            const naturalHeight = rect.height || page.offsetHeight || 1123;
            const available = Math.max(280, currentHost.clientWidth - 24);
            const scale = Math.min(1, available / naturalWidth);
            shell.style.width = `${naturalWidth * scale}px`;
            shell.style.height = `${naturalHeight * scale}px`;
            page.style.transform = `scale(${scale})`;
          }
        };

        scalePages();
        const resizeObserver = new ResizeObserver(scalePages);
        resizeObserver.observe(currentHost);
        window.addEventListener("resize", scalePages);
        cleanup.push(() => resizeObserver.disconnect());
        cleanup.push(() => window.removeEventListener("resize", scalePages));
        setTimeout(scalePages, 250);
        setTimeout(scalePages, 1000);
      }
    }

    loadHtml().catch(() => {
      if (!cancelled) {
        setError("This resource could not be loaded.");
        shadow.innerHTML = "";
      }
    });

    return () => {
      cancelled = true;
      cleanup.forEach((fn) => fn());
    };
  }, [src, title]);

  return (
    <>
      <div ref={hostRef} aria-label={title} className="block w-full min-w-0 [overflow-x:clip] bg-[#0a0a0a]" />
      {error && (
        <div className="mx-auto max-w-3xl rounded-[2px] border border-dashed border-white/[0.12] bg-white/[0.02] p-8 text-[13.5px] leading-7 text-foreground/65">
          {error}
        </div>
      )}
    </>
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
  const showDownloadCta = !!downloadHref && !!actionLabel && !html;
  // HTML playbooks render their full content inline below, so the hero is kept
  // compact (no oversized side card) to surface the content immediately.
  const compact = !!html;

  if (compact) {
    return (
      <main className="relative">
        {/* Minimal reader header — type, format, share, download. Title/description
            live in the embedded content below, so they are not repeated here. */}
        <section className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#0a0a0c]/90 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={labels.backHref}
                className="inline-flex items-center gap-2 text-[14px] font-bold tracking-[-0.01em] text-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="size-4" />
                Back
              </Link>
              <span aria-hidden className="h-4 w-px bg-white/20" />
              <span className="inline-flex items-center rounded-[3px] border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.04em] text-foreground">
                {categoryLabel(item.category)}
              </span>
              {item.file_type && (
                <span className="inline-flex items-center rounded-[3px] border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.04em] text-foreground">
                  {fileTypeLabel(item.file_type)}
                </span>
              )}
              {accessText && (
                <span className="inline-flex items-center rounded-[3px] border border-primary/40 bg-primary/15 px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.04em] text-primary">
                  {accessText}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              {item.is_free && <ShareResourceButton item={item} />}
              <a
                href={`/api/portal/resources/${encodeURIComponent(item.slug)}/download`}
                download={`${item.slug}.html`}
                className="inline-flex items-center gap-2 rounded-[3px] border border-white/15 bg-white/[0.06] px-4 py-2.5 text-[13px] font-bold uppercase tracking-[0.04em] text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Download className="size-4" />
                Download
              </a>
            </div>
          </div>
        </section>
        <HtmlAssetFrame slug={item.slug} title={item.title} />
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
          <BackLink href={labels.backHref} label={labels.backLabel} />
        </div>
      </main>
    );
  }

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

            {!compact && (
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
            )}
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className={html ? "w-full pb-24 pt-4" : "mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-10"}>
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
              <div className="mx-auto mb-4 flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/55">
                  <span aria-hidden className="h-px w-6 bg-white/20" />
                  Read in portal
                </div>
                <div className="flex items-center gap-2">
                  {item.is_free && <ShareResourceButton item={item} />}
                  <a
                    href={`/api/portal/resources/${encodeURIComponent(item.slug)}/download`}
                    download={`${item.slug}.html`}
                    className="inline-flex items-center gap-2 rounded-[2px] border border-white/[0.12] bg-white/[0.03] px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Download className="size-3.5" />
                    Download HTML
                  </a>
                </div>
              </div>
              <HtmlAssetFrame slug={item.slug} title={item.title} />
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
