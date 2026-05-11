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

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function fileTypeLabel(value: string): string {
  if (!value) return "";
  return value.toUpperCase();
}

const playbookResponsiveStyles = `
  .skill-playbook { max-width: 100%; overflow-x: hidden; }
  .skill-playbook .page {
    margin: 0 auto 24px;
    max-width: 100% !important;
    box-shadow: 0 4px 32px rgba(0,0,0,0.18);
    border-radius: 12px;
  }
  @media (max-width: 850px) {
    .skill-playbook .page {
      width: 100% !important;
      height: auto !important;
      min-height: unset !important;
      padding: 32px 24px !important;
      page-break-after: unset !important;
    }
    .skill-playbook .page img { max-width: 100% !important; height: auto !important; }
    .skill-playbook .page [style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
  }
`;

function Shell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.07] bg-background/92 px-4 backdrop-blur md:px-6">
        <Link
          href="/portal/skills"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Skills
        </Link>
        <div className="flex flex-1 items-center justify-center gap-2">
          <Logo variant="mark" size={22} />
          <span className="text-[13px] font-semibold tracking-tight">Muditek</span>
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

function NotFoundState({ email }: { email: string }) {
  return (
    <Shell email={email}>
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-8">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Skills
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Skill not found</h1>
        <p className="mt-2 max-w-lg text-[13.5px] leading-6 text-muted-foreground">
          No skill exists at this slug, or it is no longer published.
        </p>
        <div className="mt-6">
          <Button render={<Link href="/portal/skills" />} nativeButton={false} variant="outline">
            <ArrowLeft className="size-4" />
            Back to skills
          </Button>
        </div>
      </div>
    </Shell>
  );
}

function LockedState({
  skill,
  email,
}: {
  skill: ContentItem;
  email: string;
}) {
  return (
    <Shell email={email}>
      <div className="mb-7">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Skill
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-[28px]">{skill.title}</h1>
          {skill.is_new && (
            <Badge variant="default" className="rounded-md">
              New
            </Badge>
          )}
        </div>
        {skill.description && (
          <p className="mt-2 max-w-2xl text-[13.5px] leading-6 text-muted-foreground">
            {skill.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="rounded-md">
          Skill
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
            <h2 className="text-base font-medium text-foreground">MudiKit unlocks this skill</h2>
            <p className="mt-1 max-w-lg text-[13px] leading-6 text-muted-foreground">
              MudiKit gives access to every paid skill, including this one, plus future drops.
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

export default function SkillDetailContent({
  skill,
  access,
  email,
  html,
  pageImages,
  downloadHref,
}: {
  skill: ContentItem | null;
  access: PortalAccess;
  email: string;
  html: { styles: string; body: string } | null;
  pageImages: string[];
  downloadHref: string | null;
}) {
  if (!skill) return <NotFoundState email={email} />;

  const hasAccess = skill.is_free || access.isMudikit || access.isAdmin;
  if (!hasAccess) return <LockedState skill={skill} email={email} />;

  const external = downloadHref ? isExternalHref(downloadHref) : false;
  const actionLabel = external ? "Open skill" : downloadHref ? "Download" : null;
  const ActionIcon = external ? ExternalLink : Download;

  return (
    <Shell email={email}>
      <div className="mb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Skill
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-[28px]">{skill.title}</h1>
          {skill.is_new && (
            <Badge variant="default" className="rounded-md">
              New
            </Badge>
          )}
        </div>
        {skill.description && (
          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-muted-foreground">
            {skill.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="rounded-md">
            Skill
          </Badge>
          <Badge variant={skill.is_free ? "secondary" : "outline"} className="rounded-md">
            {skill.is_free ? "Free" : "MudiKit"}
          </Badge>
          {skill.file_type && (
            <Badge variant="outline" className="rounded-md uppercase tracking-[0.1em]">
              {fileTypeLabel(skill.file_type)}
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
                  {external ? "Opens in a new tab." : "Direct download attached to this skill."}
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
            className="skill-playbook rounded-lg border border-white/[0.08] bg-white/[0.02] p-2 sm:p-4"
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
                alt={`${skill.title} - Page ${index + 1}`}
                className="block h-auto w-full"
                loading={index < 3 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      ) : (
        !downloadHref && (
          <div className="rounded-lg border border-dashed border-white/[0.1] bg-white/[0.015] p-6 text-[13px] leading-6 text-muted-foreground">
            This skill exists in the library, but no asset has been attached yet.
          </div>
        )
      )}

      <div className="mt-10 border-t border-white/[0.07] pt-5">
        <Button render={<Link href="/portal/skills" />} nativeButton={false} variant="outline" size="sm">
          <ArrowLeft className="size-3.5" />
          Back to skills
        </Button>
      </div>
    </Shell>
  );
}
