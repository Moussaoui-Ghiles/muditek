import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import type { ContentItem } from "@/lib/content-item";

const SKILLS_DIR = join(process.cwd(), "content/skills");

const INCLUDED_SKILLS = new Set([
  "defuddle",
  "source-distill",
  "lead-magnets",
  "copywriting",
  "ai-seo",
]);

export interface PortalSkillFile {
  slug: string;
  name: string;
  description: string | null;
  markdown: string;
  dir: string;
  isIncluded: boolean;
  createdAt: string;
  updatedAt: string;
}

export function portalSkillToContentItem(skill: PortalSkillFile): ContentItem {
  return {
    id: `local-skill-${skill.slug}`,
    title: skill.name,
    slug: skill.slug,
    description: skill.description,
    category: "skill",
    download_url: `/api/portal/skills/${encodeURIComponent(skill.slug)}/download`,
    file_type: "md",
    thumbnail_url: null,
    is_new: false,
    is_free: skill.isIncluded,
    created_at: skill.createdAt,
    updated_at: skill.updatedAt,
  };
}

function titleFromSlug(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\s*([\s\S]*?)---/);
  if (!match) return {};

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key) data[key] = value;
  }
  return data;
}

function readSkill(slug: string): PortalSkillFile | null {
  const dir = join(SKILLS_DIR, slug);
  const file = join(dir, "SKILL.md");
  if (!existsSync(file)) return null;

  const markdown = readFileSync(file, "utf-8");
  const meta = parseFrontmatter(markdown);
  const stats = statSync(file);

  return {
    slug,
    name: meta.name || titleFromSlug(slug),
    description: meta.description || null,
    markdown,
    dir,
    isIncluded: INCLUDED_SKILLS.has(slug),
    createdAt: stats.birthtime.toISOString(),
    updatedAt: stats.mtime.toISOString(),
  };
}

export function listPortalSkills(): ContentItem[] {
  try {
    return readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => readSkill(entry.name))
      .filter((skill): skill is PortalSkillFile => skill !== null)
      .map(portalSkillToContentItem);
  } catch {
    return [];
  }
}

export function mergePortalSkills(dbSkills: ContentItem[]): ContentItem[] {
  const local = listPortalSkills();
  const bySlug = new Map<string, ContentItem>();

  for (const skill of local) bySlug.set(skill.slug, skill);
  for (const skill of dbSkills) bySlug.set(skill.slug, skill);

  return Array.from(bySlug.values()).sort((a, b) => {
    if (a.is_free !== b.is_free) return a.is_free ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function getPortalSkill(slug: string): PortalSkillFile | null {
  return readSkill(slug);
}

function listFilesRecursive(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFilesRecursive(path));
    } else if (entry.isFile()) {
      out.push(path);
    }
  }
  return out;
}

export function getPortalSkillArchiveFiles(slug: string): Array<{ path: string; data: Buffer }> {
  const skill = getPortalSkill(slug);
  if (!skill) return [];

  return listFilesRecursive(skill.dir).map((file) => ({
    path: `${skill.slug}/${relative(skill.dir, file)}`,
    data: readFileSync(file),
  }));
}
