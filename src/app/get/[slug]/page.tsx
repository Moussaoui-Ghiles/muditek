import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getPortalSkillBundle } from "@/lib/portal-skills";
import { getPublicPlaybook } from "@/lib/public-library";
import { AssetEmailForm } from "@/components/asset-email-form";

const BASE_URL = "https://muditek.com";

interface ResolvedAsset {
  slug: string;
  title: string;
  description: string;
  kind: "skill" | "playbook";
  fileCount?: number;
}

function resolveAsset(slug: string): ResolvedAsset | null {
  const skill = getPortalSkillBundle(slug);
  if (skill) {
    return {
      slug,
      title: skill.name,
      description: skill.description ?? "A downloadable Muditek workflow.",
      kind: "skill",
      fileCount: skill.fileCount,
    };
  }
  const playbook = getPublicPlaybook(slug);
  if (playbook) {
    return {
      slug,
      title: playbook.title,
      description: playbook.summary ?? "A Muditek playbook.",
      kind: "playbook",
    };
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const asset = resolveAsset(slug);
  if (!asset) return {};
  return {
    title: `Get ${asset.title} | Muditek`,
    description: asset.description,
    robots: { index: false, follow: false },
    alternates: { canonical: `${BASE_URL}/get/${slug}` },
    openGraph: {
      title: asset.title,
      description: asset.description,
      url: `${BASE_URL}/get/${slug}`,
      type: "website",
    },
  };
}

export default async function GetAssetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const asset = resolveAsset(slug);
  if (!asset) notFound();

  const noun = asset.kind === "skill" ? "skill package" : "playbook";

  return (
    <>
      <Navbar />
      <main className="min-h-[100dvh] bg-background px-6 pb-24 pt-32 text-foreground md:px-12">
        <section className="mx-auto w-full max-w-[640px]">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
            Free {noun}
          </p>
          <h1 className="mt-5 text-4xl font-black uppercase leading-[0.94] tracking-tight md:text-5xl">
            {asset.title}
          </h1>
          <p className="mt-5 text-base leading-7 text-foreground/60 md:text-lg">
            {asset.description}
          </p>
          {asset.kind === "skill" && asset.fileCount ? (
            <p className="mt-3 text-sm text-foreground/40">
              {asset.fileCount} files, packaged to run in Claude Code.
            </p>
          ) : null}

          <div className="mt-10 rounded-xl border border-white/[0.08] bg-card/50 p-6 md:p-8">
            <p className="text-sm leading-6 text-foreground/65">
              Put your email in and I send you the {noun} right away, plus the
              systems I publish next. Unsubscribe any time.
            </p>
            <AssetEmailForm slug={slug} label="" className="mt-5" />
          </div>

          <p className="mt-6 text-xs leading-5 text-foreground/35">
            Prefer to browse instead? Everything lives in the free Muditek
            portal at{" "}
            <a href="/library" className="underline hover:text-foreground/60">
              muditek.com/library
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
