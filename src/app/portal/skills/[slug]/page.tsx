import { auth, currentUser } from "@clerk/nextjs/server";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { withDerivedThumbnail } from "@/lib/content-thumbnails";
import { buildPortalAccess } from "@/lib/portal-access";
import type { ContentItem } from "@/lib/content-item";
import SkillDetailContent from "./skill-detail-content";

export const dynamic = "force-dynamic";

const CONTENT_DIR = join(process.cwd(), "content/playbooks");
const BASE_URL = "https://muditek.com";

function getHTMLContent(slug: string): { styles: string; body: string } | null {
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

function getPdfPageImages(slug: string): string[] {
  try {
    const dir = join(process.cwd(), "public/playbooks", slug);
    return readdirSync(dir)
      .filter((file) => file.startsWith("page-") && file.endsWith(".jpg"))
      .sort((a, b) => {
        const numA = parseInt(a.replace("page-", "").replace(".jpg", ""), 10);
        const numB = parseInt(b.replace("page-", "").replace(".jpg", ""), 10);
        return numA - numB;
      })
      .map((file) => `/playbooks/${slug}/${file}`);
  } catch {
    return [];
  }
}

function getDownloadHref(item: ContentItem): string | null {
  const href = item.download_url?.trim();
  if (!href) return null;

  const portalPath = `/portal?view=resource&slug=${encodeURIComponent(item.slug)}`;
  const skillPath = `/portal/skills/${encodeURIComponent(item.slug)}`;
  const publicResourcePath = `/resources/${item.slug}`;

  if (
    href === portalPath ||
    href === skillPath ||
    href === publicResourcePath ||
    href === `${BASE_URL}${publicResourcePath}`
  ) {
    return null;
  }

  return href;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: `${slug} · Skills · Muditek Portal`,
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();
  if (!slug) redirect("/portal/skills");

  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect(`/sign-in?redirect_url=/portal/skills/${encodeURIComponent(slug)}`);

  const user = await currentUser();
  if (!user) redirect(`/sign-in?redirect_url=/portal/skills/${encodeURIComponent(slug)}`);

  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect(`/sign-in?redirect_url=/portal/skills/${encodeURIComponent(slug)}`);

  const sql = getDb();
  await ensureContentItemsSchema(sql);

  const subs = await sql`
    SELECT id, status FROM subscribers WHERE email = ${email}
  `;
  const isPaid = !!subs[0] && subs[0].status === "active";

  const membershipRows = await sql`
    SELECT role FROM portal_memberships
    WHERE email = ${email} AND status = 'active'
  `;

  const access = buildPortalAccess({
    email,
    membershipRoles: membershipRows.map((row) => String(row.role)),
    hasActiveSubscription: isPaid,
  });

  const rows = (await sql`
    SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
    FROM content_items
    WHERE slug = ${slug} AND category = 'skill'
    LIMIT 1
  `) as ContentItem[];

  const skill = rows[0] ? withDerivedThumbnail(rows[0]) : null;

  if (!skill) {
    return <SkillDetailContent skill={null} access={access} email={email} html={null} pageImages={[]} downloadHref={null} />;
  }

  const hasAccess = skill.is_free || access.isMudikit || access.isAdmin;

  const html = hasAccess ? getHTMLContent(skill.slug) : null;
  const pageImages = hasAccess ? getPdfPageImages(skill.slug) : [];
  const downloadHref = hasAccess ? getDownloadHref(skill) : null;

  return (
    <SkillDetailContent
      skill={skill}
      access={access}
      email={email}
      html={html}
      pageImages={pageImages}
      downloadHref={downloadHref}
    />
  );
}
