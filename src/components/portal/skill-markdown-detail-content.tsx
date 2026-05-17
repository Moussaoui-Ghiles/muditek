"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Copy, Download, Lock, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";

function accessText(item: ContentItem): string {
  return item.is_free ? "Open" : "MudiKit";
}

function stripFrontmatter(markdown: string): string {
  return markdown.replace(/^---[\s\S]*?---\s*/, "").trim();
}

export function SkillMarkdownDetailContent({
  item,
  markdown,
  access,
}: {
  item: ContentItem;
  markdown: string;
  access: PortalAccess;
}) {
  const [copied, setCopied] = useState(false);
  const body = useMemo(() => stripFrontmatter(markdown), [markdown]);
  const hasAccess = item.is_free || access.isMudikit || access.isAdmin;

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  if (!hasAccess) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
        <Link
          href="/portal/skills"
          className="inline-flex items-center gap-2 text-[10.5px] font-black uppercase tracking-[0.25em] text-foreground/55 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          All skills
        </Link>
        <section className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.8fr]">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
              <span aria-hidden className="h-px w-6 bg-primary/50" />
              Skill · MudiKit
            </p>
            <h1 className="mt-6 text-[40px] font-black leading-[0.95] tracking-[-0.035em] text-foreground md:text-[64px]">
              {item.title}
            </h1>
            {item.description && (
              <p className="mt-6 max-w-2xl text-[15px] leading-[1.75] text-foreground/65">
                {item.description}
              </p>
            )}
          </div>
          <aside className="card-lift relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-8 backdrop-blur-md">
            <Lock className="size-5 text-primary" />
            <h2 className="mt-5 text-[26px] font-black leading-[1] tracking-[-0.02em] text-foreground">
              Unlock this skill with MudiKit.
            </h2>
            <p className="mt-3 text-[13.5px] leading-7 text-foreground/65">
              This skill is part of the paid operator library.
            </p>
            <Link
              href="/portal/mudikit"
              className="group btn-press mt-8 inline-flex items-center justify-center overflow-hidden rounded-[2px] bg-foreground px-8 py-4 text-[11px] font-black uppercase tracking-[0.22em] text-background"
            >
              <span className="inline-flex items-center gap-3">
                Open MudiKit
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main className="relative">
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="mesh-subtle pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 md:pb-20 md:pt-14 lg:px-10">
          <Link
            href="/portal/skills"
            className="inline-flex items-center gap-2 text-[10.5px] font-black uppercase tracking-[0.25em] text-foreground/55 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            All skills
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.35fr_0.85fr] lg:items-start">
            <div>
              <p className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                <span aria-hidden className="h-px w-6 bg-primary/50" />
                Skill
                <span aria-hidden className="text-foreground/30">·</span>
                <span className={item.is_free ? "text-emerald-300" : "text-primary"}>
                  {accessText(item)}
                </span>
              </p>
              <h1 className="mt-6 text-[40px] font-black leading-[0.92] tracking-[-0.04em] text-foreground md:text-[68px]">
                {item.title}
              </h1>
              {item.description && (
                <p className="mt-6 max-w-2xl text-[15px] leading-[1.75] text-foreground/65">
                  {item.description}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-[2px] border border-white/[0.1] bg-white/[0.025] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-foreground/75">
                  Markdown skill
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">
                  <span aria-hidden className="inline-block size-1.5 rounded-full bg-emerald-300/80" />
                  Copy ready
                </span>
              </div>
            </div>

            <aside className="card-lift relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-card/[0.4] p-7 backdrop-blur-md">
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-primary/5 blur-[60px]" />
              <span className="flex size-12 items-center justify-center rounded-[2px] border border-white/[0.1] bg-white/[0.04] text-primary">
                <Terminal className="size-4" />
              </span>
              <h2 className="mt-5 text-[24px] font-black leading-[1] tracking-[-0.02em] text-foreground">
                Use this in your agent.
              </h2>
              <p className="mt-3 text-[13.5px] leading-7 text-foreground/65">
                Copy the markdown into a skill file, or download the full folder with its references.
              </p>
              <div className="mt-7 flex flex-col gap-3">
                <Button type="button" onClick={copyMarkdown}>
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "Copied" : "Copy Markdown"}
                </Button>
                <Button
                  render={<Link href={item.download_url} prefetch={false} />}
                  nativeButton={false}
                  variant="outline"
                >
                  <Download className="size-4" />
                  Download folder
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        <div className="mb-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/55">
          <span aria-hidden className="h-px w-6 bg-white/20" />
          Skill markdown
        </div>
        <pre className="max-h-[760px] overflow-auto rounded-[2px] border border-white/[0.08] bg-black/40 p-5 text-[12.5px] leading-6 text-foreground/80 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-7">
          <code>{body}</code>
        </pre>
      </section>
    </main>
  );
}
