import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AssetDetailContent, { type AssetLabels } from "@/components/portal/asset-detail-content";
import { SkillMarkdownDetailContent } from "@/components/portal/skill-markdown-detail-content";
import { getPortalSkillBundle } from "@/lib/portal-skills";
import type { ContentItem } from "@/lib/content-item";
import {
  buildAssetAccess,
  getDownloadHref,
  getPdfPageImages,
  itemHasHtmlAsset,
  loadAssetBySlugAndCategories,
} from "@/lib/portal-asset-loader";

export const dynamic = "force-dynamic";

const LABELS: AssetLabels = {
  kindSingular: "Skill",
  kindPlural: "Skills",
  backHref: "/portal/skills",
  backLabel: "All skills",
  notFoundBody: "No skill exists at this slug, or it is no longer published.",
  lockedTitle: "MudiKit unlocks this skill",
  lockedBody:
    "MudiKit gives access to every paid Claude Code skill, plus future drops.",
  emptyAssetBody: "This skill exists in the library, but no asset has been attached yet.",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${slug} · Skills · Muditek Portal` };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();
  if (!slug) redirect("/portal/skills");

  const target = `/portal/skills/${encodeURIComponent(slug)}`;
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(target)}`;

  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect(signInHref);
  const user = await currentUser();
  if (!user) redirect(signInHref);
  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect(signInHref);

  const access = await buildAssetAccess(email, user.id);
  const item = await loadAssetBySlugAndCategories(slug, ["skill"]);
  const bundle = getPortalSkillBundle(slug);

  const displayName = user.firstName || email.split("@")[0];

  if (bundle) {
    const mergedItem = {
      id: item?.id ?? `local-skill-${bundle.slug}`,
      title: item?.title ?? bundle.name,
      slug: bundle.slug,
      description: item?.description ?? bundle.description,
      category: "skill",
      topic: item?.topic ?? null,
      download_url: bundle.downloadUrl,
      file_type: "md",
      thumbnail_url: item?.thumbnail_url ?? null,
      is_new: item?.is_new ?? false,
      is_free: item?.is_free ?? bundle.is_free,
      created_at: item?.created_at ?? bundle.createdAt,
      updated_at: item?.updated_at ?? bundle.updatedAt,
    } satisfies ContentItem;

    return (
      <SkillMarkdownDetailContent
        item={mergedItem}
        files={bundle.files}
        downloadUrl={bundle.downloadUrl}
        access={access}
      />
    );
  }

  if (!item) {
    return (
      <AssetDetailContent
        item={null}
        access={access}
        email={email}
        displayName={displayName}
        html={null}
        pageImages={[]}
        downloadHref={null}
        labels={LABELS}
      />
    );
  }

  const hasAccess = item.is_free || access.isMudikit || access.isAdmin;
  const html = hasAccess && itemHasHtmlAsset(item) ? { document: "" } : null;
  const pageImages = hasAccess ? getPdfPageImages(item.slug) : [];
  const downloadHref = hasAccess ? getDownloadHref(item) : null;

  return (
    <AssetDetailContent
      item={item}
      access={access}
      email={email}
      displayName={displayName}
      html={html}
      pageImages={pageImages}
      downloadHref={downloadHref}
      labels={LABELS}
    />
  );
}
