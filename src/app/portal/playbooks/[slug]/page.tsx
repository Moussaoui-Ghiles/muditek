import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AssetDetailContent, { type AssetLabels } from "@/components/portal/asset-detail-content";
import {
  buildAssetAccess,
  getDownloadHref,
  getHTMLContent,
  getPdfPageImages,
  loadAssetBySlugAndCategories,
} from "@/lib/portal-asset-loader";

export const dynamic = "force-dynamic";

const PLAYBOOK_CATEGORIES = ["playbook", "guide"];

const LABELS: AssetLabels = {
  kindSingular: "Playbook",
  kindPlural: "Playbooks & guides",
  backHref: "/portal?view=playbooks",
  backLabel: "Playbooks",
  headerTitle: "Playbooks",
  notFoundBody: "No playbook or guide exists at this slug, or it is no longer published.",
  lockedTitle: "MudiKit unlocks this playbook",
  lockedBody: "MudiKit gives access to every paid playbook and guide, plus future drops.",
  emptyAssetBody:
    "This playbook exists in the library, but no asset has been attached yet.",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${slug} · Playbooks · Muditek Portal` };
}

export default async function PlaybookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();
  if (!slug) redirect("/portal?view=playbooks");

  const target = `/portal/playbooks/${encodeURIComponent(slug)}`;
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(target)}`;

  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect(signInHref);
  const user = await currentUser();
  if (!user) redirect(signInHref);
  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect(signInHref);

  const access = await buildAssetAccess(email, user.id);
  const item = await loadAssetBySlugAndCategories(slug, PLAYBOOK_CATEGORIES);

  if (!item) {
    return (
      <AssetDetailContent
        item={null}
        access={access}
        email={email}
        html={null}
        pageImages={[]}
        downloadHref={null}
        labels={LABELS}
      />
    );
  }

  const hasAccess = item.is_free || access.isMudikit || access.isAdmin;
  const html = hasAccess ? getHTMLContent(item.slug) : null;
  const pageImages = hasAccess ? getPdfPageImages(item.slug) : [];
  const downloadHref = hasAccess ? getDownloadHref(item) : null;

  return (
    <AssetDetailContent
      item={item}
      access={access}
      email={email}
      html={html}
      pageImages={pageImages}
      downloadHref={downloadHref}
      labels={LABELS}
    />
  );
}
