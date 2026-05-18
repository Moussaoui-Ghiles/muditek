import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { getDb } from "@/lib/db";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { withDerivedThumbnail } from "@/lib/content-thumbnails";
import { categoryPortalPath, type ContentItem } from "@/lib/content-item";
import { buildPortalAccess, type PortalAccess } from "@/lib/portal-access";

const CONTENT_DIR = join(process.cwd(), "content/playbooks");
const BASE_URL = "https://muditek.com";

export function getHTMLContent(slug: string): { styles: string; body: string } | null {
  try {
    const html = readFileSync(join(CONTENT_DIR, `${slug}.html`), "utf-8");
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    return {
      styles: styleMatch ? styleMatch[1] : "",
      body: bodyMatch ? bodyMatch[1].replace(/<script[\s\S]*?<\/script>/g, "") : "",
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
