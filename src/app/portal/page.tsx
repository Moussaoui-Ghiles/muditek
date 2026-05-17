import { auth, currentUser } from "@clerk/nextjs/server";
import { readFileSync, readdirSync } from "fs";
import { redirect } from "next/navigation";
import { join } from "path";
import { getDb } from "@/lib/db";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { withDerivedThumbnail, withDerivedThumbnails } from "@/lib/content-thumbnails";
import { buildPortalAccess } from "@/lib/portal-access";
import { listPortalSkills } from "@/lib/portal-skills";
import { categoryPortalPath } from "@/lib/content-item";
import PortalContent, { type PortalHero, type UpcomingItem } from "./portal-content";

const PORTAL_CONTENT_DIR = join(process.cwd(), "content/portal");

function readThisWeek(): string {
  try {
    const raw = readFileSync(join(PORTAL_CONTENT_DIR, "this-week.md"), "utf-8");
    return raw.replace(/^---[\s\S]*?---\s*/m, "").trim();
  } catch {
    return "";
  }
}

function readUpcoming(): UpcomingItem[] {
  try {
    const raw = readFileSync(join(PORTAL_CONTENT_DIR, "upcoming.md"), "utf-8");
    const body = raw.replace(/^---[\s\S]*?---\s*/m, "");
    return body
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => {
        const parts = line.slice(2).split("|").map((p) => p.trim());
        if (parts.length < 3) return null;
        return { date: parts[0], type: parts[1], title: parts.slice(2).join(" | ") };
      })
      .filter((item): item is UpcomingItem => item !== null);
  } catch {
    return [];
  }
}

function readHero(): PortalHero | null {
  try {
    const raw = readFileSync(join(PORTAL_CONTENT_DIR, "hero.md"), "utf-8");
    const fmMatch = raw.match(/^---\s*([\s\S]*?)---\s*([\s\S]*)$/);
    if (!fmMatch) return null;
    const frontmatter: Record<string, string> = {};
    for (const line of fmMatch[1].split("\n")) {
      const m = line.match(/^([a-z_]+)\s*:\s*(.*)$/i);
      if (m) frontmatter[m[1].trim()] = m[2].trim();
    }
    return {
      eyebrow: frontmatter.eyebrow || "",
      title: frontmatter.title || "",
      body: fmMatch[2].trim(),
      ctaLabel: frontmatter.cta_label || "",
      ctaHref: frontmatter.cta_href || "",
    };
  } catch {
    return null;
  }
}

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
      .filter((file) => /^page-\d+\.jpe?g$/i.test(file))
      .sort((a, b) => {
        const numA = parseInt(a.replace(/^page-/, "").replace(/\.jpe?g$/i, ""), 10);
        const numB = parseInt(b.replace(/^page-/, "").replace(/\.jpe?g$/i, ""), 10);
        return numA - numB;
      })
      .map((file) => `/playbooks/${slug}/${file}`);
  } catch {
    return [];
  }
}

function getDownloadHref(item: ContentItem): string | null {
  if (item.file_type?.toLowerCase() === "html") return null;

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

  const dbFreeItems = withDerivedThumbnails((await sql`
    SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
    FROM content_items
    WHERE is_free = true
    ORDER BY created_at DESC
  `) as ContentItem[]);

  const dbPaidItems = access.isMudikit
    ? withDerivedThumbnails((await sql`
        SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
        FROM content_items
        WHERE is_free = false
        ORDER BY created_at DESC
      `) as ContentItem[])
    : [];

  const localSkills = listPortalSkills();
  const dbSlugs = new Set([...dbFreeItems, ...dbPaidItems].map((item) => item.slug));
  const localOnlySkills = localSkills.filter((item) => !dbSlugs.has(item.slug));
  const freeItems = [...dbFreeItems, ...localOnlySkills.filter((item) => item.is_free)];
  const paidItems = [
    ...dbPaidItems,
    ...(access.isMudikit ? localOnlySkills.filter((item) => !item.is_free) : []),
  ];

  const playbookGuideItems = withDerivedThumbnails((await sql`
    SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
    FROM content_items
    WHERE category IN ('playbook', 'guide')
    ORDER BY is_new DESC NULLS LAST, created_at DESC
  `) as ContentItem[]);

  const issues = (await sql`
    SELECT slug, subject, sent_at
    FROM newsletter_issues
    WHERE status = 'sent'
      AND slug IS NOT NULL
      AND html IS NOT NULL
      AND length(trim(html)) > 0
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

  const thisWeek = readThisWeek();
  const upcoming = readUpcoming();
  const hero = readHero();

  return (
    <PortalContent
      displayName={displayName}
      email={email}
      access={access}
      freeItems={freeItems}
      paidItems={paidItems}
      playbookGuideItems={playbookGuideItems}
      issues={issues}
      thisWeek={thisWeek}
      upcoming={upcoming}
      hero={hero}
    />
  );
}
