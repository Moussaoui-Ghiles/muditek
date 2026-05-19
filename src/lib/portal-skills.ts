import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import type { ContentItem } from "@/lib/content-item";

const SKILL_DIRS = [
  join(process.cwd(), "content/skills"),
  ...(process.env.NODE_ENV === "production"
    ? []
    : [
        join(process.cwd(), "../../..", ".claude/skills"),
        join(process.cwd(), "../../..", ".agents/skills"),
        join(process.cwd(), "../../..", ".codex/skills"),
      ]),
];

export interface PortalSkillFile {
  slug: string;
  name: string;
  description: string | null;
  markdown: string;
  dir: string;
  is_free: boolean;
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
    is_free: skill.is_free,
    created_at: skill.createdAt,
    updated_at: skill.updatedAt,
  };
}

function titleFromSlug(slug: string): string {
  const acronyms: Record<string, string> = {
    ai: "AI",
    api: "API",
    b2b: "B2B",
    cli: "CLI",
    cro: "CRO",
    gtm: "GTM",
    json: "JSON",
    llm: "LLM",
    pdf: "PDF",
    seo: "SEO",
    sdr: "SDR",
    ux: "UX",
  };

  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => acronyms[part.toLowerCase()] ?? part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function displayNameFromMeta(slug: string, name?: string): string {
  if (slug === "free-tool-strategy") return "Tool Strategy";
  if (!name) return titleFromSlug(slug);
  const trimmed = name.trim();
  if (!trimmed || trimmed.toLowerCase() === slug.toLowerCase()) return titleFromSlug(slug);
  return trimmed;
}

function cleanDescription(description?: string): string | null {
  if (!description) return null;
  const compact = description
    .replace(/\s+/g, " ")
    .replace(/\bAlso use when\b[\s\S]*$/i, "")
    .replace(/\bUse when\b[\s\S]*$/i, "")
    .replace(/[—–]/g, "-")
    .replace(/\bfree tools\b/gi, "public tools")
    .replace(/\bfree tool\b/gi, "public tool")
    .replace(/\bfree resource\b/gi, "portal resource")
    .replace(/\bfree account\b/gi, "portal account")
    .replace(/\bfree trial\b/gi, "trial")
    .replace(/\bfree plan\b/gi, "portal plan")
    .trim();

  if (!compact) return null;
  if (compact.length <= 180) return compact;

  const sentence = compact.match(/^.{60,180}?[.!?](?:\s|$)/)?.[0]?.trim();
  return sentence || `${compact.slice(0, 177).trim()}...`;
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

function parseBooleanValue(raw: string | undefined): boolean | undefined {
  if (raw == null) return undefined;

  const v = raw.trim().toLowerCase();
  if (!v) return undefined;

  if (["true", "1", "yes", "y", "on", "free", "public"].includes(v)) return true;
  if (["false", "0", "no", "n", "off", "paid", "premium", "locked", "mudikit", "pro"].includes(v)) return false;

  return undefined;
}

function resolveSkillFreeFlag(meta: Record<string, string>): boolean {
  const direct = parseBooleanValue(meta.is_free) ?? parseBooleanValue(meta.free);

  if (direct !== undefined) return direct;

  const premiumKeywords = parseBooleanValue(meta.is_premium);
  if (premiumKeywords !== undefined) return !premiumKeywords;

  const paid = parseBooleanValue(meta.paid);
  if (paid !== undefined) return !paid;

  const tier = meta.tier?.toLowerCase();
  const access = meta.access?.toLowerCase();
  if (tier && ["mudikit", "paid", "pro", "premium"].includes(tier)) return false;
  if (access && ["mudikit", "paid", "pro", "premium", "paywalled", "private"].includes(access)) return false;

  return true;
}

function readSkillFromDir(baseDir: string, slug: string): PortalSkillFile | null {
  const dir = join(baseDir, slug);
  const file = join(dir, "SKILL.md");
  if (!existsSync(file)) return null;

  const markdown = readFileSync(file, "utf-8");
  const meta = parseFrontmatter(markdown);
  const stats = statSync(file);

  return {
    slug,
    name: displayNameFromMeta(slug, meta.name),
    description: cleanDescription(meta.description),
    markdown,
    dir,
    is_free: resolveSkillFreeFlag(meta),
    createdAt: stats.birthtime.toISOString(),
    updatedAt: stats.mtime.toISOString(),
  };
}

function readSkill(slug: string): PortalSkillFile | null {
  for (const baseDir of SKILL_DIRS) {
    const skill = readSkillFromDir(baseDir, slug);
    if (skill) return skill;
  }
  return null;
}

export function listPortalSkills(): ContentItem[] {
  return listPortalSkillsFromDirs(SKILL_DIRS);
}

export function listShippedPortalSkills(): ContentItem[] {
  return listPortalSkillsFromDirs([join(process.cwd(), "content/skills")]);
}

function listPortalSkillsFromDirs(skillDirs: string[]): ContentItem[] {
  const bySlug = new Map<string, PortalSkillFile>();

  for (const baseDir of skillDirs) {
    if (!existsSync(baseDir)) continue;
    try {
      for (const entry of readdirSync(baseDir, { withFileTypes: true })) {
        if (!entry.isDirectory() || bySlug.has(entry.name)) continue;
        const skill = readSkillFromDir(baseDir, entry.name);
        if (skill) bySlug.set(skill.slug, skill);
      }
    } catch {
      continue;
    }
  }

  return Array.from(bySlug.values()).map(portalSkillToContentItem);
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
