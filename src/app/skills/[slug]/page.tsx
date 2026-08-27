import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { CommercialNextStep } from "@/components/library/library-collection";
import {
  AcquisitionPageView,
  FunnelEventOnView,
  TrackedAccountLink,
  TrackedDownloadLink,
} from "@/components/acquisition-tracking";
import { formatLibraryDate, getLibraryItem, getPublishedLibraryItems } from "@/lib/library-manifest";
import { renderLibraryMarkdown } from "@/lib/library-markdown";
import { getPortalSkillBundle, isSkillBundleAccountGateEligible } from "@/lib/portal-skills";

export function generateStaticParams() {
  return getPublishedLibraryItems("skill").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getLibraryItem("skill", slug);
  if (!item || item.status !== "published") return { title: "Skill not found | Muditek" };
  const url = `https://muditek.com/skills/${item.slug}`;

  return {
    title: `${item.title} | Muditek Skill`,
    description: item.summary,
    alternates: { canonical: url },
    openGraph: { title: item.title, description: item.summary, url, type: "article" },
  };
}

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getLibraryItem("skill", slug);
  if (!item) notFound();
  if (item.status === "redirected" && item.redirectTarget) permanentRedirect(item.redirectTarget);
  if (item.status !== "published") notFound();

  const bundle = getPortalSkillBundle(item.slug);
  if (!bundle) notFound();
  const accountGateEligible = isSkillBundleAccountGateEligible(item.slug);
  const requiresAccount = item.access === "account" && accountGateEligible;
  const { isAuthenticated } = await auth();
  const skillFile = bundle.files.find((file) => file.path === "SKILL.md");
  const { html } = skillFile?.raw ? renderLibraryMarkdown(skillFile.raw) : { html: "" };
  const url = `https://muditek.com/skills/${item.slug}`;
  const downloadHref = `/api/portal/skills/${encodeURIComponent(item.slug)}/download`;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView asset={item.slug} lane={item.lane} event="library_item_viewed" placement="skill-page" />
      {requiresAccount && !isAuthenticated ? (
        <FunnelEventOnView event="skill_gate_viewed" asset={item.slug} lane={item.lane} placement="download-panel" />
      ) : null}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: item.title,
          description: item.summary,
          dateModified: item.updatedAt,
          datePublished: item.updatedAt,
          author: { "@type": "Person", name: "Ghiles Moussaoui", url: "https://muditek.com/about" },
          publisher: { "@id": "https://muditek.com/#organization" },
          mainEntityOfPage: url,
          url,
          inLanguage: "en",
        }}
      />

      <main id="main-content">
        <header className="relative overflow-hidden border-b border-white/[0.06] pb-16 pt-36 md:pb-24 md:pt-48">
          <div aria-hidden="true" className="pointer-events-none absolute right-[12%] top-28 h-80 w-80 rounded-full bg-primary/[0.06] blur-[110px]" />
          <div className="relative mx-auto w-full max-w-[1100px] px-6 md:px-12">
            <Link href="/skills" className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/55 hover:text-primary">← All skills</Link>
            <div className="mt-9 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.16em]">
              <span className="text-primary">{item.topic.replaceAll("-", " ")}</span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">Updated {formatLibraryDate(item.updatedAt)}</span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">Version {item.version}</span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">{bundle.fileCount} {bundle.fileCount === 1 ? "file" : "files"}</span>
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.035em] sm:text-6xl md:text-7xl">{item.title}</h1>
            <p className="mt-7 max-w-[68ch] text-lg leading-8 text-foreground/80">{item.answer}</p>
          </div>
        </header>

        <section className="border-b border-white/[0.06] py-12 md:py-16">
          <div className="mx-auto grid w-full max-w-[1100px] gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_340px] md:px-12">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.02em]">Before you run it</h2>
              <div className="mt-7 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Inputs</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/70">
                    {item.inputs.map((input) => <li key={input} className="border-l border-white/[0.12] pl-4">{input}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Outputs</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/70">
                    {item.outputs.map((output) => <li key={output} className="border-l border-white/[0.12] pl-4">{output}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Prerequisites</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/70">
                    {item.prerequisites.map((prerequisite) => <li key={prerequisite} className="border-l border-white/[0.12] pl-4">{prerequisite}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Example and validation</h3>
                  <p className="mt-4 break-all font-mono text-xs leading-5 text-foreground/65">{item.examplePath}</p>
                  {item.validationCommand ? <code className="mt-3 block overflow-x-auto rounded-[2px] border border-white/[0.08] bg-background p-3 text-xs leading-5 text-foreground/65">{item.validationCommand}</code> : null}
                </div>
              </div>
            </div>

            <aside className="rounded-xl border border-white/[0.08] bg-card/60 p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Bundle</p>
              <p className="mt-3 text-3xl font-black">{bundle.fileCount} files</p>
              <p className="mt-3 text-sm leading-6 text-foreground/65">
                {!requiresAccount
                  ? "The complete bundle is public. No account is required."
                  : "The page and SKILL.md are public. A free account unlocks the tested examples and working files."}
              </p>
              <div className="mt-6">
                {!requiresAccount ? (
                  <TrackedDownloadLink href={downloadHref} asset={item.slug} lane={item.lane} placement="skill-header" className="inline-flex min-h-12 w-full items-center justify-center rounded-[2px] bg-primary px-5 py-3 text-center text-sm font-black uppercase tracking-[0.14em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
                    Download complete bundle
                  </TrackedDownloadLink>
                ) : (
                  isAuthenticated ? (
                      <TrackedDownloadLink href={downloadHref} asset={item.slug} lane={item.lane} placement="skill-header" className="inline-flex min-h-12 w-full items-center justify-center rounded-[2px] bg-primary px-5 py-3 text-center text-sm font-black uppercase tracking-[0.14em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
                        Download advanced bundle
                      </TrackedDownloadLink>
                  ) : (
                      <TrackedAccountLink href={`/sign-up?redirect_url=${encodeURIComponent(`/skills/${item.slug}`)}`} asset={item.slug} lane={item.lane} placement="skill-download-gate" className="inline-flex min-h-12 w-full items-center justify-center rounded-[2px] bg-primary px-5 py-3 text-center text-sm font-black uppercase tracking-[0.14em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
                        Create account to download
                      </TrackedAccountLink>
                  )
                )}
              </div>
              <div className="mt-6 border-t border-white/[0.08] pt-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-foreground/50">Source</p>
                {item.sourceLinks.map((sourceLink) => (
                  <a key={sourceLink.href} href={sourceLink.href} className="mt-2 inline-flex min-h-11 items-center text-sm font-bold text-foreground/70 underline decoration-white/20 underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary">
                    {sourceLink.label}
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-[900px] px-6 md:px-12">
            <details id="instructions" className="group scroll-mt-28 rounded-xl border border-white/[0.1] bg-card/30 p-5 open:bg-card/45 md:p-8">
              <summary className="cursor-pointer list-none text-lg font-black tracking-[-0.02em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 [&::-webkit-details-marker]:hidden">
                <span className="flex min-h-11 items-center justify-between gap-4">
                  Open the full instructions and file list
                  <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <div className="mt-8 border-t border-white/[0.08] pt-8">
                <h2 className="text-xs font-black uppercase tracking-[0.18em] text-primary">Included files</h2>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2" aria-label="Bundle files">
                  {bundle.files.map((file) => (
                    <li key={file.path} className="break-all font-mono text-xs leading-5 text-foreground/55">{file.path}</li>
                  ))}
                </ul>
                <article className="library-prose mt-12 min-w-0 border-t border-white/[0.08] pt-10" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </details>
          </div>
        </section>

        <CommercialNextStep item={item} />
      </main>
      <Footer />
    </div>
  );
}
