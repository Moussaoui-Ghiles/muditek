import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { renderLibraryMarkdown } from "@/lib/library-markdown";
import { getPublicSkill, PUBLIC_SKILLS } from "@/lib/public-library";
import { getPortalSkillBundle } from "@/lib/portal-skills";

export function generateStaticParams() {
  return PUBLIC_SKILLS.map((skill) => ({ slug: skill.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getPublicSkill(slug);
  const bundle = getPortalSkillBundle(slug);
  if (!bundle) return { title: "Skill not found | Muditek" };
  const title = item?.title ?? bundle.name;
  const description = item?.summary ?? bundle.description ?? `Download the ${title} workflow.`;
  const url = `https://muditek.com/skills/${slug}`;
  return {
    title: `${title} | Muditek Skill`,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function PublicSkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPublicSkill(slug);
  const bundle = getPortalSkillBundle(slug);
  if (!bundle) notFound();
  const title = item?.title ?? bundle.name;
  const summary = item?.summary ?? bundle.description ?? `Download the ${title} workflow.`;
  const instructions = bundle.files.find((file) => file.path === "SKILL.md")?.raw;
  const { html } = instructions ? renderLibraryMarkdown(instructions) : { html: "" };
  const url = `https://muditek.com/skills/${slug}`;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: title,
          description: summary,
          programmingLanguage: "Markdown",
          url,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Library", item: "https://muditek.com/library" },
            { "@type": "ListItem", position: 2, name: "Skills", item: "https://muditek.com/skills" },
            { "@type": "ListItem", position: 3, name: title, item: url },
          ],
        },
      ]} />
      <main id="main-content">
        <header className="border-b border-white/[0.06] pb-16 pt-36 md:pb-24 md:pt-48">
          <div className="mx-auto w-full max-w-[1080px] px-6 md:px-12">
            <Link href="/skills" className="text-sm font-bold uppercase tracking-[0.18em] text-foreground/55 hover:text-primary">← All skills</Link>
            <p className="mt-10 text-sm font-black uppercase tracking-[0.2em] text-primary">Downloadable workflow</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl">{title}</h1>
            <p className="mt-8 max-w-[68ch] text-lg leading-8 text-foreground/70">{summary}</p>
          </div>
        </header>

        <section className="border-b border-white/[0.06] py-12 md:py-16">
          <div className="mx-auto grid w-full max-w-[1080px] gap-8 px-6 md:px-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <h2 className="text-3xl font-black tracking-[-0.03em]">Included files</h2>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {bundle.files.map((file) => (
                  <li key={file.path} className="break-all rounded-[2px] border border-white/[0.08] px-3 py-2 font-mono text-sm text-foreground/60">{file.path}</li>
                ))}
              </ul>
            </div>
            <aside className="rounded-xl border border-white/[0.08] bg-card/50 p-6">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Package</p>
              <p className="mt-3 text-4xl font-black">{bundle.fileCount} files</p>
              <p className="mt-4 text-sm leading-6 text-foreground/65">{bundle.is_free ? "Public download. No account required." : "Available with MudiKit access."}</p>
              <a href={bundle.downloadUrl} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[2px] bg-primary px-5 py-3 text-center text-sm font-black uppercase tracking-[0.14em] text-background">Download package</a>
            </aside>
          </div>
        </section>

        {html ? (
          <section className="py-14 md:py-20">
            <article className="library-prose mx-auto w-full max-w-[900px] px-6 md:px-12" dangerouslySetInnerHTML={{ __html: html }} />
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
