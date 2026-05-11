"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  ExternalLink,
  Lock,
  Terminal,
} from "lucide-react";
import { Logo } from "@/components/logo/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";

type AssetLabels = {
  kindSingular: string;
  kindPlural: string;
  backHref: string;
  backLabel: string;
  headerTitle: string;
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

function Shell({
  email,
  labels,
  children,
}: {
  email: string;
  labels: AssetLabels;
  children: React.ReactNode;
}) {
  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.07] bg-background/92 px-4 backdrop-blur md:px-6">
        <Link
          href={labels.backHref}
          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {labels.backLabel}
        </Link>
        <div className="flex flex-1 items-center justify-center gap-2">
          <Logo variant="mark" size={22} />
          <span className="text-[13px] font-semibold tracking-tight">{labels.headerTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden truncate text-[11px] text-muted-foreground sm:inline">{email}</span>
          <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

function NotFoundState({ email, labels }: { email: string; labels: AssetLabels }) {
  return (
    <Shell email={email} labels={labels}>
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-8">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {labels.kindPlural}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{labels.kindSingular} not found</h1>
        <p className="mt-2 max-w-lg text-[13.5px] leading-6 text-muted-foreground">
          {labels.notFoundBody}
        </p>
        <div className="mt-6">
          <Button render={<Link href={labels.backHref} />} nativeButton={false} variant="outline">
            <ArrowLeft className="size-4" />
            {labels.backLabel}
          </Button>
        </div>
      </div>
    </Shell>
  );
}

function LockedState({
  item,
  email,
  labels,
}: {
  item: ContentItem;
  email: string;
  labels: AssetLabels;
}) {
  return (
    <Shell email={email} labels={labels}>
      <div className="mb-7">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {labels.kindSingular}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-[28px]">{item.title}</h1>
          {item.is_new && (
            <Badge variant="default" className="rounded-md">
              New
            </Badge>
          )}
        </div>
        {item.description && (
          <p className="mt-2 max-w-2xl text-[13.5px] leading-6 text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="rounded-md">
          {labels.kindSingular}
        </Badge>
        <Badge variant="outline" className="rounded-md">
          <Lock className="size-3" />
          MudiKit
        </Badge>
      </div>

      <div className="mt-8 rounded-xl border border-white/[0.1] bg-white/[0.025] p-6">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-muted-foreground">
            <Lock className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-medium text-foreground">{labels.lockedTitle}</h2>
            <p className="mt-1 max-w-lg text-[13px] leading-6 text-muted-foreground">
              {labels.lockedBody}
            </p>
            <div className="mt-5">
              <Button render={<Link href="/buy" />} nativeButton={false} size="lg">
                Unlock MudiKit
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export default function AssetDetailContent({
  item,
  access,
  email,
  html,
  pageImages,
  downloadHref,
  labels,
}: {
  item: ContentItem | null;
  access: PortalAccess;
  email: string;
  html: { styles: string; body: string } | null;
  pageImages: string[];
  downloadHref: string | null;
  labels: AssetLabels;
}) {
  if (!item) return <NotFoundState email={email} labels={labels} />;

  const hasAccess = item.is_free || access.isMudikit || access.isAdmin;
  if (!hasAccess) return <LockedState item={item} email={email} labels={labels} />;

  const external = downloadHref ? isExternalHref(downloadHref) : false;
  const actionLabel = external ? `Open ${labels.kindSingular.toLowerCase()}` : downloadHref ? "Download" : null;
  const ActionIcon = external ? ExternalLink : Download;

  return (
    <Shell email={email} labels={labels}>
      <div className="mb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {labels.kindSingular}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-[28px]">{item.title}</h1>
          {item.is_new && (
            <Badge variant="default" className="rounded-md">
              New
            </Badge>
          )}
        </div>
        {item.description && (
          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-muted-foreground">
            {item.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="rounded-md">
            {labels.kindSingular}
          </Badge>
          <Badge variant={item.is_free ? "secondary" : "outline"} className="rounded-md">
            {item.is_free ? "Free" : "MudiKit"}
          </Badge>
          {item.file_type && (
            <Badge variant="outline" className="rounded-md uppercase tracking-[0.1em]">
              {fileTypeLabel(item.file_type)}
            </Badge>
          )}
        </div>
      </div>

      {downloadHref && actionLabel && (
        <div className="mb-8 rounded-xl border border-white/[0.1] bg-white/[0.03] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-muted-foreground">
                <Terminal className="size-4" />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">Ready to use</div>
                <p className="mt-0.5 text-[12.5px] leading-5 text-muted-foreground">
                  {external ? "Opens in a new tab." : "Direct download attached to this resource."}
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
        </div>
      )}

      {html ? (
        <>
          <style dangerouslySetInnerHTML={{ __html: html.styles }} />
          <style dangerouslySetInnerHTML={{ __html: playbookResponsiveStyles }} />
          <div
            className="portal-asset-html rounded-lg border border-white/[0.08] bg-white/[0.02] p-2 sm:p-4"
            dangerouslySetInnerHTML={{ __html: html.body }}
          />
        </>
      ) : pageImages.length > 0 ? (
        <div className="mx-auto flex max-w-[900px] flex-col gap-4 md:gap-6">
          {pageImages.map((src, index) => (
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
        !downloadHref && (
          <div className="rounded-lg border border-dashed border-white/[0.1] bg-white/[0.015] p-6 text-[13px] leading-6 text-muted-foreground">
            {labels.emptyAssetBody}
          </div>
        )
      )}

      <div className="mt-10 border-t border-white/[0.07] pt-5">
        <Button render={<Link href={labels.backHref} />} nativeButton={false} variant="outline" size="sm">
          <ArrowLeft className="size-3.5" />
          {labels.backLabel}
        </Button>
      </div>
    </Shell>
  );
}

export type { AssetLabels };
