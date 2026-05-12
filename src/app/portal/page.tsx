import { auth, currentUser } from "@clerk/nextjs/server";
import { readFileSync, readdirSync } from "fs";
import { redirect } from "next/navigation";
import { join } from "path";
import { getDb } from "@/lib/db";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { withDerivedThumbnail, withDerivedThumbnails } from "@/lib/content-thumbnails";
import { buildPortalAccess } from "@/lib/portal-access";
import { categoryPortalPath } from "@/lib/content-item";
import PortalContent from "./portal-content";
import { PortalShell } from "@/components/portal/portal-shell";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  download_url: string;
  file_type: string;
  thumbnail_url: string | null;
  is_new: boolean;
  is_free: boolean;
  created_at: string;
  updated_at?: string | null;
}

interface NewsletterIssue {
  slug: string;
  subject: string;
  sent_at: Date | null;
}

const VALID_VIEWS = new Set([
  "home",
  "skills",
  "playbooks",
  "tools",
  "tool",
  "mudikit",
  "newsletter",
  "account",
  "resource",
]);

const LEGACY_VIEW_MAP: Record<string, string> = {
  overview: "home",
  start: "home",
  "free-library": "playbooks",
  client: "home",
};

const CONTENT_DIR = join(process.cwd(), "content/playbooks");
const BASE_URL = "https://muditek.com";

function normalizeView(value: unknown): string {
  const view = Array.isArray(value) ? value[0] : value;
  if (typeof view !== "string") return "home";
  if (VALID_VIEWS.has(view)) return view;
  return LEGACY_VIEW_MAP[view] ?? "home";
}

function normalizeSlug(value: unknown): string | null {
  const slug = Array.isArray(value) ? value[0] : value;
  if (typeof slug !== "string") return null;
  const normalized = slug.trim();
  return normalized ? normalized : null;
}

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

  const publicPath = `/resources/${item.slug}`;
  const portalPath = `/portal?view=resource&slug=${encodeURIComponent(item.slug)}`;
  if (href === publicPath || href === `${BASE_URL}${publicPath}` || href === portalPath) {
    return null;
  }

  return href;
}

export default async function PortalPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in?redirect_url=/portal");
  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/portal");
  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect("/sign-in?redirect_url=/portal");
  const params = searchParams ? await searchParams : {};
  const activeView = normalizeView(params.view);
  const activeSlug = normalizeSlug(params.slug);

  if (activeView === "mudikit") redirect("/portal/mudikit");
  if (activeView === "newsletter") redirect("/portal/newsletter");
  if (activeView === "skills") redirect("/portal/skills");
  if (activeView === "playbooks") redirect("/portal/playbooks");

  const sql = getDb();
  await ensureContentItemsSchema(sql);

  if (activeView === "resource" && activeSlug) {
    const legacyRows = (await sql`
      SELECT slug, category FROM content_items WHERE slug = ${activeSlug} LIMIT 1
    `) as Array<{ slug: string; category: string }>;
    if (legacyRows[0]) {
      const path = categoryPortalPath(legacyRows[0].category);
      redirect(`/portal/${path}/${encodeURIComponent(legacyRows[0].slug)}`);
    }
  }

  await sql`
    INSERT INTO newsletter_subscribers (email, source, topics, clerk_user_id)
    VALUES (${email}, 'portal', ARRAY['ai-agents','gtm-systems','solo-operator'], ${user.id})
    ON CONFLICT (email) DO UPDATE
    SET clerk_user_id = ${user.id}, status = 'active', unsub_at = NULL
    WHERE newsletter_subscribers.clerk_user_id IS NULL OR newsletter_subscribers.clerk_user_id = ${user.id}
  `;

  await sql`
    INSERT INTO portal_memberships (email, role)
    VALUES (${email}, 'free')
    ON CONFLICT (email, role) DO UPDATE
    SET status = 'active', updated_at = NOW()
  `;

  const subs = await sql`
    SELECT id, email, name, status, stripe_customer_id, clerk_user_id, created_at
    FROM subscribers WHERE email = ${email}
  `;
  const paidSub = subs[0];

  if (paidSub && !paidSub.clerk_user_id) {
    await sql`UPDATE subscribers SET clerk_user_id = ${user.id} WHERE id = ${paidSub.id}`;
  }

  const isPaid = !!paidSub && paidSub.status === "active";

  if (isPaid) {
    await sql`
      INSERT INTO portal_memberships (email, role)
      VALUES (${email}, 'mudikit')
      ON CONFLICT (email, role) DO UPDATE
      SET status = 'active', updated_at = NOW()
    `;
  }

  const membershipRows = await sql`
    SELECT role FROM portal_memberships
    WHERE email = ${email} AND status = 'active'
  `;

  const access = buildPortalAccess({
    email,
    membershipRoles: membershipRows.map((row) => String(row.role)),
    hasActiveSubscription: isPaid,
  });

  const freeItems = withDerivedThumbnails((await sql`
    SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
    FROM content_items
    WHERE is_free = true
    ORDER BY created_at DESC
  `) as ContentItem[]);

  const paidItems = access.isMudikit
    ? withDerivedThumbnails((await sql`
        SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
        FROM content_items
        WHERE is_free = false
        ORDER BY created_at DESC
      `) as ContentItem[])
    : [];

  const playbookGuideItems = withDerivedThumbnails((await sql`
    SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
    FROM content_items
    WHERE category IN ('playbook', 'guide')
    ORDER BY is_new DESC NULLS LAST, created_at DESC
  `) as ContentItem[]);

  const issues = (await sql`
    SELECT slug, subject, sent_at
    FROM newsletter_issues
    WHERE status = 'sent' AND slug IS NOT NULL
    ORDER BY sent_at DESC NULLS LAST
    LIMIT 40
  `) as NewsletterIssue[];

  const selectedRows = activeSlug
    ? ((await sql`
        SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
        FROM content_items
        WHERE slug = ${activeSlug}
        LIMIT 1
      `) as ContentItem[])
    : [];
  const selectedResource = selectedRows[0] ? withDerivedThumbnail(selectedRows[0]) : null;
  const canAccessSelectedResource =
    !!selectedResource && (selectedResource.is_free || access.isMudikit || access.isAdmin);
  const selectedResourceContent =
    selectedResource && canAccessSelectedResource
      ? {
          html: getHTMLContent(selectedResource.slug),
          pageImages: getPdfPageImages(selectedResource.slug),
          downloadHref: getDownloadHref(selectedResource),
        }
      : null;

  const displayName = user.firstName || (paidSub?.name as string | undefined) || email.split("@")[0];

  return (
    <PortalShell email={email} displayName={displayName} access={access}>
      <PortalContent
        displayName={displayName}
        email={email}
        access={access}
        freeItems={freeItems}
        paidItems={paidItems}
        playbookGuideItems={playbookGuideItems}
        issues={issues}
      />
    </PortalShell>
  );
}
