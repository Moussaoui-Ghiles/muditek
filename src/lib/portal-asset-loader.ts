import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { getDb } from "@/lib/db";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { withDerivedThumbnail } from "@/lib/content-thumbnails";
import { categoryPortalPath, type ContentItem } from "@/lib/content-item";
import { buildPortalAccess, type PortalAccess } from "@/lib/portal-access";

const CONTENT_DIR = join(process.cwd(), "content/playbooks");
const BASE_URL = "https://muditek.com";

export type HtmlContent = {
  document: string;
  styles: string;
  body: string;
};

const LOCAL_HTML_PLAYBOOK_SLUGS = new Set([
  "claude-code-self-evolving",
  "claude-code-tips",
  "clawchief-blueprint",
  "coding-agent-seo-playbook",
  "google-maps-outbound",
  "judgment-moat",
  "mudiagent-operator-guide",
  "skill-creator-blueprint",
]);

export function itemHasHtmlAsset(item: Pick<ContentItem, "slug" | "file_type">): boolean {
  return item.file_type?.toLowerCase() === "html" || LOCAL_HTML_PLAYBOOK_SLUGS.has(item.slug);
}

export function ensureHtmlBaseHref(html: string, baseHref = BASE_URL): string {
  if (/<base\b/i.test(html)) return html;

  const base = `<base href="${baseHref.replace(/\/$/, "")}/" />`;
  if (/<head\b[^>]*>/i.test(html)) {
    return html.replace(/<head\b([^>]*)>/i, `<head$1>\n${base}`);
  }

  if (/<html\b[^>]*>/i.test(html)) {
    return html.replace(/<html\b([^>]*)>/i, `<html$1>\n<head>${base}</head>`);
  }

  return `<!doctype html><html><head>${base}</head><body>${html}</body></html>`;
}

export function getHTMLContent(slug: string): HtmlContent | null {
  try {
    const rawHtml = readFileSync(join(CONTENT_DIR, `${slug}.html`), "utf-8");
    const document = ensureHtmlBaseHref(rawHtml);
    const styleMatch = document.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    const bodyMatch = document.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    return {
      document,
      styles: styleMatch ? styleMatch[1] : "",
      body: bodyMatch ? bodyMatch[1] : "",
    };
  } catch {
    return null;
  }
}

export function getPdfPageImages(slug: string): string[] {
  try {
    const dir = join(process.cwd(), "content/downloads/playbooks", slug);
    return readdirSync(dir)
      .filter((file) => /^page-\d+\.jpe?g$/i.test(file))
      .sort((a, b) => {
        const numA = parseInt(a.replace(/^page-/, "").replace(/\.jpe?g$/i, ""), 10);
        const numB = parseInt(b.replace(/^page-/, "").replace(/\.jpe?g$/i, ""), 10);
        return numA - numB;
      })
      .map((file) => `/api/portal/resources/${slug}/page/${file}`);
  } catch {
    return [];
  }
}

export function getDownloadHref(item: ContentItem): string | null {
  if (item.file_type?.toLowerCase() === "html") return null;

  const href = item.download_url?.trim();
  if (!href) return null;

  if (href.startsWith("/playbooks/") || href.startsWith(`${BASE_URL}/playbooks/`)) {
    return `/api/portal/resources/${encodeURIComponent(item.slug)}/download`;
  }

  const portalPaths = [
    `/portal?view=resource&slug=${encodeURIComponent(item.slug)}`,
    `/portal/${categoryPortalPath(item.category)}/${encodeURIComponent(item.slug)}`,
  ];
  const publicResourcePath = `/resources/${item.slug}`;

  if (
    portalPaths.includes(href) ||
    href === publicResourcePath ||
    href === `${BASE_URL}${publicResourcePath}`
  ) {
    return null;
  }

  return href;
}

export async function buildAssetAccess(email: string, clerkUserId: string): Promise<PortalAccess> {
  const sql = getDb();
  const subs = await sql`
    SELECT id, status, stripe_customer_id, clerk_user_id
    FROM subscribers WHERE email = ${email}
  `;
  const paidSub = subs[0];
  const isPaid = !!paidSub && paidSub.status === "active";

  if (paidSub && !paidSub.clerk_user_id) {
    await sql`UPDATE subscribers SET clerk_user_id = ${clerkUserId} WHERE id = ${paidSub.id}`;
  }

  const membershipRows = await sql`
    SELECT role FROM portal_memberships
    WHERE email = ${email} AND status = 'active'
  `;

  return buildPortalAccess({
    email,
    membershipRoles: membershipRows.map((row) => String(row.role)),
    hasActiveSubscription: isPaid,
  });
}

export async function loadAssetBySlugAndCategories(
  slug: string,
  categories: string[]
): Promise<ContentItem | null> {
  const sql = getDb();
  await ensureContentItemsSchema(sql);
  const rows = (await sql`
    SELECT id, title, slug, description, category, topic, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
    FROM content_items
    WHERE slug = ${slug} AND category = ANY(${categories})
    LIMIT 1
  `) as ContentItem[];
  return rows[0] ? withDerivedThumbnail(rows[0]) : null;
}
