import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { NewsletterInline } from "@/components/newsletter-inline";
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
        <header className="w-full">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12 pt-36 md:pt-48 pb-16 md:pb-20 grid gap-12 lg:grid-cols-12 lg:gap-16 items-end">
            <div className="lg:col-span-8">
              <Link href="/skills" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-foreground transition-colors mb-8">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M9.5 6H2.5M5 3.5L2.5 6L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                All skills
              </Link>
              <p className="text-base font-bold text-primary mb-6">Skill{item?.topic ? ` · ${item.topic}` : ""}</p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.92] tracking-[-0.04em] text-balance max-w-[16ch]">{title}</h1>
              <p className="mt-7 max-w-[60ch] text-lg md:text-xl leading-relaxed text-foreground/75">{summary}</p>
            </div>
            <aside className="lg:col-span-4">
              <div className="panel">
                <div className="panel-bar"><span>{slug}/</span><span>{bundle.fileCount} files</span></div>
                <div className="panel-body">
                  <ul className="space-y-1">
                    {bundle.files.slice(0, 8).map((file) => (
                      <li key={file.path} className="flex gap-2 break-all"><span className="panel-dim">├</span><span>{file.path}</span></li>
                    ))}
                    {bundle.files.length > 8 ? <li className="panel-dim">... {bundle.files.length - 8} more</li> : null}
                  </ul>
                  <a href={bundle.downloadUrl} className="btn btn-amber btn-sm w-full mt-6">Download package</a>
                  <p className="mt-3 text-xs text-foreground/60 font-sans">{bundle.is_free ? "Public download. No account required." : "Free with a portal account."}</p>
                </div>
              </div>
            </aside>
          </div>
        </header>

        {html ? (
          <section className="border-t border-white/[0.08] py-14 md:py-20">
            <article className="library-prose mx-auto w-full max-w-[900px] px-6 md:px-12" dangerouslySetInnerHTML={{ __html: html }} />
          </section>
        ) : null}
        <NewsletterInline source={`skill:${slug}`} headline="Get the next skill before it is published." />
      </main>
      <Footer />
    </div>
  );
}
