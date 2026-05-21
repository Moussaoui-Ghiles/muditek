"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { marked } from "marked";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Download,
  Eye,
  File as FileIcon,
  FileCode2,
  FileText,
  Folder,
  FolderOpen,
  Lock,
  Terminal,
} from "lucide-react";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";
import { SHOW_MUDIKIT_IN_PORTAL } from "@/lib/portal-features";
import type { PortalSkillFileEntry, SkillFileKind } from "@/lib/portal-skills";

/* ---------- helpers ---------- */

function stripFrontmatter(markdown: string): string {
  return markdown.replace(/^---[\s\S]*?---\s*/, "").trim();
}

function renderMarkdown(markdown: string): string {
  return marked.parse(stripFrontmatter(markdown), {
    async: false,
    gfm: true,
    breaks: false,
  }) as string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function countLines(text: string): number {
  if (!text) return 0;
  return text.split("\n").length;
}

function formatLongDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" });
}

function downloadTextFile(name: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function fileIcon(kind: SkillFileKind, className: string) {
  if (kind === "markdown") return <FileText className={className} />;
  if (kind === "code") return <FileCode2 className={className} />;
  return <FileIcon className={className} />;
}

/* ---------- file tree model ---------- */

type TreeFile = { type: "file"; name: string; path: string; entry: PortalSkillFileEntry };
type TreeDir = { type: "dir"; name: string; path: string; children: TreeNode[] };
type TreeNode = TreeFile | TreeDir;

function buildTree(files: PortalSkillFileEntry[]): TreeNode[] {
  const root: TreeDir = { type: "dir", name: "", path: "", children: [] };

  for (const entry of files) {
    const segments = entry.path.split("/");
    let cursor = root;
    for (let i = 0; i < segments.length; i += 1) {
      const segment = segments[i];
      const isLeaf = i === segments.length - 1;
      if (isLeaf) {
        cursor.children.push({ type: "file", name: segment, path: entry.path, entry });
      } else {
        const dirPath = segments.slice(0, i + 1).join("/");
        let dir = cursor.children.find(
          (node): node is TreeDir => node.type === "dir" && node.path === dirPath
        );
        if (!dir) {
          dir = { type: "dir", name: segment, path: dirPath, children: [] };
          cursor.children.push(dir);
        }
        cursor = dir;
      }
    }
  }

  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      if (a.path === "SKILL.md") return -1;
      if (b.path === "SKILL.md") return 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
    for (const node of nodes) if (node.type === "dir") sortNodes(node.children);
    return nodes;
  };

  return sortNodes(root.children);
}

function FileTree({
  nodes,
  selected,
  onSelect,
  depth = 0,
}: {
  nodes: TreeNode[];
  selected: string;
  onSelect: (path: string) => void;
  depth?: number;
}) {
  return (
    <ul className={depth === 0 ? "space-y-0.5" : "mt-0.5 space-y-0.5"}>
      {nodes.map((node) =>
        node.type === "dir" ? (
          <TreeDirRow key={node.path} node={node} selected={selected} onSelect={onSelect} depth={depth} />
        ) : (
          <li key={node.path}>
            <button
              type="button"
              onClick={() => onSelect(node.path)}
              style={{ paddingLeft: `${10 + depth * 14}px` }}
              className={`group flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-[13px] transition-colors ${
                selected === node.path
                  ? "bg-amber-400/10 text-amber-100"
                  : "text-white/60 hover:bg-white/[0.04] hover:text-white/90"
              }`}
            >
              {fileIcon(
                node.entry.kind,
                `size-3.5 shrink-0 ${selected === node.path ? "text-amber-300/90" : "text-white/40 group-hover:text-white/70"}`
              )}
              <span className="truncate">{node.name}</span>
            </button>
          </li>
        )
      )}
    </ul>
  );
}

function TreeDirRow({
  node,
  selected,
  onSelect,
  depth,
}: {
  node: TreeDir;
  selected: string;
  onSelect: (path: string) => void;
  depth: number;
}) {
  const [open, setOpen] = useState(true);
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{ paddingLeft: `${10 + depth * 14}px` }}
        className="group flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-left text-[13px] font-medium text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
      >
        <ChevronRight className={`size-3 shrink-0 text-white/40 transition-transform ${open ? "rotate-90" : ""}`} />
        {open ? (
          <FolderOpen className="size-3.5 shrink-0 text-amber-300/70" />
        ) : (
          <Folder className="size-3.5 shrink-0 text-white/45" />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {open && <FileTree nodes={node.children} selected={selected} onSelect={onSelect} depth={depth + 1} />}
    </li>
  );
}

/* ---------- locked state (title + description + upgrade only) ---------- */

function LockedState({ item }: { item: ContentItem }) {
  return (
    <main className="relative">
      <div className="mx-auto w-full max-w-[1340px] px-6 pb-24 pt-10 md:px-10 md:pt-12 lg:px-14">
        <Link
          href="/portal/skills"
          className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3" />
          All skills
        </Link>

        <section className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] lg:gap-7">
          <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400/[0.06] via-white/[0.02] to-transparent p-7 md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full bg-amber-400/[0.08] blur-3xl"
            />
            <span className="relative font-mono text-[10.5px] uppercase tracking-[0.22em] text-amber-300/85">
              Skill
            </span>
            <h1 className="relative text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-white md:text-[46px]">
              {item.title}
            </h1>
            {item.description && (
              <p className="relative max-w-[60ch] text-[15px] leading-[1.6] text-white/60">
                {item.description}
              </p>
            )}
          </div>

          <aside className="relative isolate flex flex-col gap-4 overflow-hidden rounded-2xl bg-white/[0.018] p-7">
            <span className="flex size-11 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-400/10 text-amber-300">
              <Lock className="size-4" />
            </span>
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-white">
              Not available right now
            </h2>
            <p className="text-[13.5px] leading-[1.6] text-white/55">
              Open skills stay visible in the library. Anything unpublished or reserved is hidden
              until it is ready.
            </p>
            <Link
              href="/portal/skills"
              className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#0a0a0c] transition-all duration-200 hover:gap-3 hover:bg-amber-50"
            >
              Back to skills
              <ArrowUpRight className="size-3.5" />
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}

/* ---------- main ---------- */

export function SkillMarkdownDetailContent({
  item,
  files,
  downloadUrl,
  access,
}: {
  item: ContentItem;
  files: PortalSkillFileEntry[];
  downloadUrl: string;
  access: PortalAccess;
}) {
  const hasAccess = item.is_free || access.isMudikit || access.isAdmin;

  const tree = useMemo(() => buildTree(files), [files]);
  const readme = useMemo(() => files.find((file) => file.path === "SKILL.md") ?? files[0], [files]);
  const [selectedPath, setSelectedPath] = useState<string>(readme?.path ?? "");
  const [viewMode, setViewMode] = useState<"rendered" | "raw">("rendered");
  const [copied, setCopied] = useState(false);

  const current = useMemo(
    () => files.find((file) => file.path === selectedPath) ?? readme,
    [files, selectedPath, readme]
  );

  const renderedHtml = useMemo(() => {
    if (!current || current.kind !== "markdown" || !current.raw) return "";
    return renderMarkdown(current.raw);
  }, [current]);

  if (!hasAccess) {
    return <LockedState item={item} />;
  }

  const updated = formatLongDate(item.updated_at ?? item.created_at ?? null);
  const referenceCount = files.length - 1;

  async function copyCurrent() {
    if (!current?.raw) return;
    await navigator.clipboard.writeText(current.raw);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const showRawToggle = current?.kind === "markdown" && !!current.raw;
  const effectiveView: "rendered" | "raw" =
    current?.kind === "markdown" ? viewMode : "raw";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SKILL_MD_CSS }} />
      <main className="relative">
        <div className="mx-auto w-full max-w-[1340px] px-6 pb-24 pt-10 md:px-10 md:pt-12 lg:px-14">
          {/* Back */}
          <Link
            href="/portal/skills"
            className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3" />
            All skills
          </Link>

          {/* Header strip */}
          <header className="mt-7 flex flex-col gap-6 border-b border-white/[0.06] pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em]">
                <Terminal className="size-3.5 text-amber-300/80" />
                <span className="text-amber-300/85">Skill</span>
                <span className="text-white/30">/</span>
                <span className="text-white/55">
                  {item.is_free || !SHOW_MUDIKIT_IN_PORTAL ? "Included" : "MudiKit"}
                </span>
              </div>
              <h1 className="mt-3 text-[34px] font-semibold leading-[1.04] tracking-[-0.025em] text-white md:text-[46px]">
                {item.title}
              </h1>
              {item.description && (
                <p className="mt-3 max-w-[68ch] text-[14.5px] leading-[1.6] text-white/55">
                  {item.description}
                </p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                <span>
                  {files.length} {files.length === 1 ? "file" : "files"}
                </span>
                {referenceCount > 0 && (
                  <span>
                    {referenceCount} {referenceCount === 1 ? "reference" : "references"}
                  </span>
                )}
                {updated && <span>Updated {updated}</span>}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={copyCurrent}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#0a0a0c] transition-all duration-200 hover:bg-amber-50"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy markdown"}
              </button>
              <a
                href={downloadUrl}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.02] px-5 py-2.5 text-[13px] font-semibold text-white/85 transition-colors hover:border-white/[0.22] hover:bg-white/[0.05]"
              >
                <Download className="size-3.5" />
                Download folder
              </a>
            </div>
          </header>

          {/* Repository view */}
          <section className="mt-8 grid gap-5 lg:grid-cols-[clamp(220px,22vw,300px)_minmax(0,1fr)]">
            {/* File tree */}
            <aside className="self-start overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.012]">
              <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/45">
                  Files
                </span>
                <span className="font-mono text-[10.5px] tabular-nums text-white/35">
                  {files.length}
                </span>
              </div>
              <div className="max-h-[320px] overflow-auto p-2 lg:max-h-[70vh]">
                <FileTree nodes={tree} selected={current?.path ?? ""} onSelect={setSelectedPath} />
              </div>
            </aside>

            {/* Viewer */}
            <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.012]">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-white/[0.015] px-4 py-2.5">
                <div className="flex min-w-0 items-center gap-2 font-mono text-[12px] text-white/55">
                  {current && fileIcon(current.kind, "size-3.5 shrink-0 text-white/45")}
                  <span className="truncate text-white/80">{current?.path}</span>
                  {current && (
                    <span className="hidden shrink-0 text-white/30 sm:inline">
                      · {formatBytes(current.size)}
                      {current.raw ? ` · ${countLines(current.raw)} lines` : ""}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {showRawToggle && (
                    <div className="inline-flex rounded-lg bg-white/[0.04] p-0.5">
                      <button
                        type="button"
                        onClick={() => setViewMode("rendered")}
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                          effectiveView === "rendered"
                            ? "bg-white/[0.1] text-white"
                            : "text-white/50 hover:text-white/80"
                        }`}
                      >
                        <Eye className="size-3" />
                        Rendered
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("raw")}
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                          effectiveView === "raw"
                            ? "bg-white/[0.1] text-white"
                            : "text-white/50 hover:text-white/80"
                        }`}
                      >
                        <Code2 className="size-3" />
                        Raw
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={copyCurrent}
                    disabled={!current?.raw}
                    title="Copy file"
                    className="inline-flex size-7 items-center justify-center rounded-md text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
                  >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => current?.raw && downloadTextFile(current.name, current.raw)}
                    disabled={!current?.raw}
                    title="Download file"
                    className="inline-flex size-7 items-center justify-center rounded-md text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
                  >
                    <Download className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="overflow-auto">
                {!current ? (
                  <div className="p-10 text-[13.5px] text-white/55">No files in this skill.</div>
                ) : current.kind === "binary" || current.raw === null ? (
                  <div className="flex flex-col items-start gap-4 p-10">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/55">
                      <FileIcon className="size-4" />
                    </span>
                    <p className="text-[13.5px] leading-6 text-white/55">
                      Preview not available for this file type. Download the folder to get it.
                    </p>
                    <a
                      href={downloadUrl}
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.02] px-4 py-2 text-[12.5px] font-semibold text-white/85 transition-colors hover:border-white/[0.22] hover:bg-white/[0.05]"
                    >
                      <Download className="size-3.5" />
                      Download folder
                    </a>
                  </div>
                ) : effectiveView === "rendered" && current.kind === "markdown" ? (
                  <div
                    className="skill-md px-6 py-7 sm:px-9 sm:py-9"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                ) : (
                  <pre className="overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.7] text-white/80 sm:px-7">
                    <code>{current.raw}</code>
                  </pre>
                )}
              </div>
            </div>
          </section>

          <div className="mt-12 border-t border-white/[0.06] pt-7">
            <Link
              href="/portal/skills"
              className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-3" />
              All skills
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

/* ---------- GitHub-style markdown CSS (dark) ---------- */

const SKILL_MD_CSS = `
.skill-md { color: rgba(255,255,255,0.78); font-size: 14.5px; line-height: 1.72; word-wrap: break-word; }
.skill-md > *:first-child { margin-top: 0 !important; }
.skill-md > *:last-child { margin-bottom: 0 !important; }
.skill-md h1, .skill-md h2, .skill-md h3, .skill-md h4, .skill-md h5, .skill-md h6 {
  color: #fff; font-weight: 650; line-height: 1.25; letter-spacing: -0.01em;
  margin-top: 1.9em; margin-bottom: 0.7em; scroll-margin-top: 80px;
}
.skill-md h1 { font-size: 1.85em; letter-spacing: -0.022em; padding-bottom: 0.35em; border-bottom: 1px solid rgba(255,255,255,0.08); }
.skill-md h2 { font-size: 1.42em; letter-spacing: -0.018em; padding-bottom: 0.3em; border-bottom: 1px solid rgba(255,255,255,0.07); }
.skill-md h3 { font-size: 1.18em; }
.skill-md h4 { font-size: 1.02em; }
.skill-md h5, .skill-md h6 { font-size: 0.9em; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.08em; }
.skill-md p { margin: 0 0 1.1em; }
.skill-md a { color: #fcd34d; text-decoration: none; border-bottom: 1px solid rgba(252,211,77,0.35); transition: border-color .15s; }
.skill-md a:hover { border-bottom-color: rgba(252,211,77,0.9); }
.skill-md strong { color: #fff; font-weight: 650; }
.skill-md em { color: rgba(255,255,255,0.85); }
.skill-md ul, .skill-md ol { margin: 0 0 1.1em; padding-left: 1.55em; }
.skill-md li { margin: 0.35em 0; }
.skill-md li > ul, .skill-md li > ol { margin: 0.35em 0; }
.skill-md ul { list-style: disc; }
.skill-md ul ul { list-style: circle; }
.skill-md ol { list-style: decimal; }
.skill-md li::marker { color: rgba(255,255,255,0.4); }
.skill-md blockquote {
  margin: 0 0 1.1em; padding: 0.4em 0 0.4em 1.1em;
  border-left: 3px solid rgba(252,211,77,0.5); color: rgba(255,255,255,0.62);
}
.skill-md blockquote > *:last-child { margin-bottom: 0; }
.skill-md code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.87em; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.06);
  padding: 0.14em 0.42em; border-radius: 5px; color: #f3d68c;
}
.skill-md pre {
  margin: 0 0 1.25em; padding: 1.05em 1.2em; overflow-x: auto;
  background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
}
.skill-md pre code {
  background: none; border: none; padding: 0; color: rgba(255,255,255,0.82);
  font-size: 12.6px; line-height: 1.65;
}
.skill-md hr { margin: 2em 0; border: 0; border-top: 1px solid rgba(255,255,255,0.08); }
.skill-md table { width: 100%; margin: 0 0 1.25em; border-collapse: collapse; font-size: 13.5px; display: block; overflow-x: auto; }
.skill-md th, .skill-md td { padding: 0.55em 0.9em; border: 1px solid rgba(255,255,255,0.1); text-align: left; }
.skill-md th { background: rgba(255,255,255,0.04); color: #fff; font-weight: 600; }
.skill-md tr:nth-child(even) td { background: rgba(255,255,255,0.015); }
.skill-md img { max-width: 100%; height: auto; border-radius: 10px; margin: 0.5em 0; }
.skill-md kbd {
  font-family: ui-monospace, monospace; font-size: 0.82em; background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14); border-bottom-width: 2px; border-radius: 5px; padding: 0.1em 0.45em;
}
@media (prefers-reduced-motion: reduce) { .skill-md a { transition: none; } }
`;
