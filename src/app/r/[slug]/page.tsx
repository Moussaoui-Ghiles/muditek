import type { Metadata } from "next";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ArrowRight, FileText } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { categoryLabel, formatContentDate, resourceDetailHref } from "@/lib/content-item";
import { getContentItemBySlug } from "@/lib/content-library";
import { trackResourceLead } from "@/lib/resource-leads";

const BASE_URL = "https://muditek.com";

export const dynamic = "force-dynamic";

function publicPreviewImage(slug: string, thumbnailUrl: string | null): string | null {
  if (!thumbnailUrl) return null;
  if (thumbnailUrl.startsWith("/playbooks/")) return `/api/portal/covers/${slug}`;
  if (thumbnailUrl.startsWith("/api/portal/")) return `/api/portal/covers/${slug}`;
  return thumbnailUrl;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getContentItemBySlug(slug);
  if (!item || !item.is_free) return {};
  const image = publicPreviewImage(item.slug, item.thumbnail_url);
  const imageUrl = image?.startsWith("/") ? `${BASE_URL}${image}` : image;

  return {
    title: `${item.title} | Muditek Resource`,
    description:
      item.description ?? "Create a Muditek account to unlock this resource.",
    robots: { index: false, follow: false },
    openGraph: {
      title: item.title,
      description:
        item.description ?? "Create a Muditek account to unlock this resource.",
      url: `${BASE_URL}/r/${slug}`,
      type: "website",
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: `${BASE_URL}/r/${slug}`,
    },
  };
}

export default async function ResourceUnlockPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getContentItemBySlug(slug);
  if (!item || !item.is_free) notFound();
  const image = publicPreviewImage(item.slug, item.thumbnail_url);

  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();

    if (email) {
      await trackResourceLead({
        email,
        name: user?.firstName || user?.fullName || null,
        clerkUserId: user?.id ?? null,
        resourceSlug: slug,
        source: "resource-share",
      });
    }

    redirect(resourceDetailHref(item));
  }

  const redirectUrl = `/r/${slug}`;
  const encodedRedirect = encodeURIComponent(redirectUrl);

  return (
    <>
      <Navbar />
      <main className="min-h-[100dvh] bg-background px-6 pb-24 pt-32 text-foreground md:px-12">
        <section className="mx-auto grid max-w-[1120px] gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-foreground/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">
                {categoryLabel(item.category)}
              </span>
              <span className="text-xs text-foreground/35">
                {formatContentDate(item.created_at)}
              </span>
            </div>

            <h1 className="max-w-[760px] text-4xl font-black uppercase leading-[0.94] tracking-tight md:text-6xl">
              {item.title}
            </h1>

            {item.description && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-foreground/55 md:text-lg">
                {item.description}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/sign-up?redirect_url=${encodedRedirect}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-foreground px-6 text-sm font-black uppercase tracking-[0.16em] text-background transition-transform hover:scale-[1.02]"
              >
                Create account
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
              <Link
                href={`/sign-in?redirect_url=${encodedRedirect}`}
                className="inline-flex h-12 items-center justify-center rounded-[4px] border border-white/[0.1] px-6 text-sm font-black uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:border-white/[0.22] hover:text-foreground"
              >
                Sign in
              </Link>
            </div>

            <p className="mt-4 max-w-xl text-xs leading-5 text-foreground/35">
              Included portal account. Unlock this resource and the Muditek library.
            </p>
          </div>

          <div className="border-y border-white/[0.06] py-8 md:py-12">
            {image && (
              <div className="mb-8 overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03]">
                <img src={image} alt="" className="aspect-[16/10] w-full object-cover" />
              </div>
            )}
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-foreground/50">
                <FileText className="size-5" strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Inside the portal
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/50">
                  <li>Open this resource immediately after signup.</li>
                  <li>Access the rest of the included resource library.</li>
                  <li>Get future Muditek drops through the newsletter.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
