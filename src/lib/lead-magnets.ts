import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";
import { assetDownloadToken } from "@/lib/asset-email";

/**
 * Lead magnet registry. One markdown file per magnet in content/lead-magnets/.
 *
 * Frontmatter:
 *   title          shown on the /get page and used in the email
 *   promise        one-line reason to opt in
 *   mode           page  = asset unlocks on the page AND a copy is emailed
 *                  email = asset is delivered by email only
 *   asset          where the asset lives. Either a full URL, a site path
 *                  (/playbooks/x), or the shorthand skill:<slug> which
 *                  becomes a signed package download link per recipient.
 *   button         label of the unlock button (page mode)
 *   email_subject  subject of the delivery email
 * Body: the delivery email in markdown. {{ASSET_URL}} is replaced per recipient.
 */

export type MagnetMode = "page" | "email";

export interface LeadMagnet {
  slug: string;
  title: string;
  promise: string;
  mode: MagnetMode;
  asset: string;
  button: string;
  emailSubject: string;
  emailMarkdown: string;
}

const MAGNET_DIR = join(process.cwd(), "content", "lead-magnets");

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (key) meta[key] = value;
  }
  return { meta, body: match[2].trim() };
}

export function listLeadMagnetSlugs(): string[] {
  if (!existsSync(MAGNET_DIR)) return [];
  return readdirSync(MAGNET_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getLeadMagnet(slug: string): LeadMagnet | null {
  const safe = slug.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]*$/.test(safe)) return null;
  const file = join(MAGNET_DIR, `${safe}.md`);
  if (!existsSync(file)) return null;
  const { meta, body } = parseFrontmatter(readFileSync(file, "utf8"));
  if (!meta.title || !meta.asset) return null;
  const mode: MagnetMode = meta.mode === "email" ? "email" : "page";
  return {
    slug: safe,
    title: meta.title,
    promise: meta.promise ?? "",
    mode,
    asset: meta.asset,
    button: meta.button ?? "Open it",
    emailSubject: meta.email_subject ?? `Your ${meta.title}`,
    emailMarkdown: body,
  };
}

/** Resolve the asset to an absolute URL for one recipient. */
export function resolveMagnetAssetUrl(
  magnet: LeadMagnet,
  email: string,
  baseUrl: string,
): string {
  const base = baseUrl.replace(/\/$/, "");
  const asset = magnet.asset.trim();
  if (asset.startsWith("skill:")) {
    const skillSlug = asset.slice(6).trim();
    const token = assetDownloadToken(skillSlug, email);
    return `${base}/api/portal/skills/${encodeURIComponent(skillSlug)}/download?e=${encodeURIComponent(email)}&t=${token}`;
  }
  if (asset.startsWith("http://") || asset.startsWith("https://")) return asset;
  return `${base}${asset.startsWith("/") ? "" : "/"}${asset}`;
}

/** Render the custom delivery email body to HTML for one recipient. */
export function renderMagnetEmailHtml(magnet: LeadMagnet, assetUrl: string): string {
  const markdown = magnet.emailMarkdown.replace(/\{\{ASSET_URL\}\}/g, assetUrl);
  const html = marked.parse(markdown, { async: false }) as string;
  return html;
}
