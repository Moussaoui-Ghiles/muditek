import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { renderLibraryMarkdown } from "@/lib/library-markdown";
import {
  getPublicSkill,
  PUBLIC_SKILLS,
} from "@/lib/public-library";
import { getPortalSkillBundle } from "@/lib/portal-skills";

export const dynamicParams = false;

export function generateStaticParams() {
  return PUBLIC_SKILLS.map((skill) => ({ slug: skill.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = getPublicSkill(slug);
  if (!skill) return { title: "Skill not found | Muditek" };

  const url = `https://muditek.com/skills/${skill.slug}`;
  return {
    title: `${skill.title} | Muditek`,
    description: skill.summary,
    alternates: { canonical: url },
    openGraph: {
      title: skill.title,
      description: skill.summary,
      url,
      type: "article",
    },
  };
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function fileLabel(path: string): string {
  if (path === "SKILL.md") return "Main instructions";
  if (path.startsWith("references/")) return "Reference";
  if (path.startsWith("scripts/")) return "Script";
  if (path.startsWith("prompts/")) return "Prompt";
  if (path.startsWith("templates/")) return "Template";
  if (path.startsWith("assets/")) return "Asset";
  if (path.startsWith("agents/")) return "Agent configuration";
  return "File";
}

export default async function PublicSkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getPublicSkill(slug);
  const bundle = getPortalSkillBundle(slug);
  if (!skill || !bundle) notFound();

  const mainFile = bundle.files.find((file) => file.path === "SKILL.md");
  if (!mainFile?.raw) notFound();

  const { html, headings } = renderLibraryMarkdown(mainFile.raw);
  const url = `https://muditek.com/skills/${skill.slug}`;
  const updatedAt = formatDate(bundle.updatedAt);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: skill.title,
          description: skill.summary,
          dateModified: bundle.updatedAt,
          author: { "@id": "https://muditek.com/#organization" },
          publisher: { "@id": "https://muditek.com/#organization" },
          mainEntityOfPage: url,
          url,
          inLanguage: "en",
        }}
      />

      <main id="main-content">
        <header className="border-b border-white/[0.06] pb-16 pt-36 md:pb-24 md:pt-48">
          <div className="mx-auto w-full max-w-[1080px] px-6 md:px-12">
            <Link
              href="/library"
              className="inline-flex min-h-11 items-center text-sm font-bold uppercase tracking-[0.18em] text-foreground/55 hover:text-primary"
            >
              ← Public library
            </Link>
            <p className="mt-9 text-sm font-black uppercase tracking-[0.2em] text-primary">
              {skill.topic}
            </p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl">
              {skill.title}
            </h1>
            <p className="mt-8 max-w-[70ch] text-lg leading-8 text-foreground/70">
              {skill.summary}
            </p>

            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <a
                href={bundle.downloadUrl}
                className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-primary px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-background transition-colors hover:bg-primary/90"
              >
                Download the complete package
              </a>
              <p className="text-sm font-mono leading-6 text-foreground/50">
                Public download · {bundle.fileCount} {bundle.fileCount === 1 ? "file" : "files"} · Updated {updatedAt}
              </p>
            </div>
          </div>
        </header>

        <section className="border-b border-white/[0.06] py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1080px] px-6 md:px-12">
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Included files</p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.03em]">Everything in the download.</h2>
                <p className="mt-4 max-w-[42ch] text-base leading-7 text-foreground/60">
                  The package includes the operating instructions and every declared local reference, prompt, template, script, or asset.
                </p>
              </div>
              <ul className="overflow-hidden rounded-xl border border-white/[0.08] bg-card/25">
                {bundle.files.map((file) => (
                  <li
                    key={file.path}
                    className="flex min-h-14 items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-3 last:border-b-0"
                  >
                    <code className="min-w-0 break-all text-sm text-foreground/80">{file.path}</code>
                    <span className="shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-foreground/40">
                      {fileLabel(file.path)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1120px] px-6 md:px-12">
            {headings.length > 0 ? (
              <details className="mb-10 rounded-xl border border-white/[0.1] bg-card/30 p-5 md:p-6">
                <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.14em] text-foreground">
                  On this page
                </summary>
                <ol className="mt-5 grid gap-3 border-t border-white/[0.08] pt-5 sm:grid-cols-2">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className="inline-flex min-h-11 items-center text-sm leading-5 text-foreground/70 hover:text-primary"
                      >
                        {heading.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}

            <article
              className="library-prose [&_h2]:scroll-mt-28"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-14">
          <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-5 px-6 sm:flex-row sm:items-center sm:justify-between md:px-12">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Complete package</p>
              <p className="mt-2 text-base text-foreground/60">Download the same files listed above. No account is required.</p>
            </div>
            <a
              href={bundle.downloadUrl}
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-[2px] border border-primary/50 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-primary hover:bg-primary hover:text-background"
            >
              Download package
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
