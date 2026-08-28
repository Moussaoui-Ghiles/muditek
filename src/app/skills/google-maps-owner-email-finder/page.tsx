import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { BOOKING_URL } from "@/lib/booking";
import { getPortalSkillBundle } from "@/lib/portal-skills";

const SLUG = "google-maps-owner-email-finder";

export const metadata: Metadata = {
  title: "Google Maps Owner and Email Finder | Muditek",
  description:
    "Download a local workflow that finds explicit owner evidence and public company emails without paid APIs or guessed data.",
  alternates: { canonical: `https://muditek.com/skills/${SLUG}` },
};

export default function GoogleMapsOwnerFinderPage() {
  const bundle = getPortalSkillBundle(SLUG);
  if (!bundle) notFound();
  const downloadHref = `/api/portal/skills/${SLUG}/download`;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: "Google Maps Owner and Email Finder",
            description: metadata.description,
            codeRepository: "https://github.com/Moussaoui-Ghiles/google-maps-owner-email-finder",
            programmingLanguage: "JavaScript",
            license: "https://opensource.org/license/mit",
            url: `https://muditek.com/skills/${SLUG}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Library", item: "https://muditek.com/library" },
              { "@type": "ListItem", position: 2, name: "Skills", item: "https://muditek.com/skills" },
              { "@type": "ListItem", position: 3, name: "Google Maps Owner and Email Finder", item: `https://muditek.com/skills/${SLUG}` },
            ],
          },
        ]}
      />
      <main id="main-content">
        <header className="border-b border-white/[0.06] pb-16 pt-36 md:pb-24 md:pt-48">
          <div className="mx-auto w-full max-w-[1080px] px-6 md:px-12">
            <Link href="/library" className="text-sm font-bold uppercase tracking-[0.18em] text-foreground/55 hover:text-primary">← Public library</Link>
            <p className="mt-10 text-sm font-black uppercase tracking-[0.2em] text-primary">Local business research</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl">Google Maps Owner and Email Finder</h1>
            <p className="mt-8 max-w-[68ch] text-lg leading-8 text-foreground/70">
              Check public company websites for explicit owner evidence and published emails. Unsupported owners stay unknown. No paid API is required.
            </p>
          </div>
        </header>

        <section className="border-b border-white/[0.06] py-12 md:py-16">
          <div className="mx-auto grid w-full max-w-[1080px] gap-8 px-6 md:px-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <h2 className="text-3xl font-black tracking-[-0.03em]">What you get</h2>
              <ul className="mt-7 grid gap-4 text-base leading-7 text-foreground/70 sm:grid-cols-2">
                <li className="border-l border-primary/50 pl-4">Website evidence saved per company</li>
                <li className="border-l border-primary/50 pl-4">Explicit owner or unknown status</li>
                <li className="border-l border-primary/50 pl-4">Evidence URL and supporting text</li>
                <li className="border-l border-primary/50 pl-4">Published, unverified website emails</li>
              </ul>
            </div>
            <aside className="rounded-xl border border-white/[0.08] bg-card/50 p-6">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Complete bundle</p>
              <p className="mt-3 text-4xl font-black">{bundle.fileCount} files</p>
              <p className="mt-4 text-sm leading-6 text-foreground/65">Public download. No account required.</p>
              <a href={downloadHref} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[2px] bg-primary px-5 py-3 text-center text-sm font-black uppercase tracking-[0.14em] text-background">
                Download package
              </a>
              <a href="https://github.com/Moussaoui-Ghiles/google-maps-owner-email-finder" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 w-full items-center justify-center border border-white/[0.14] px-5 py-3 text-center text-sm font-bold text-foreground/75 hover:border-primary/60 hover:text-primary">
                View GitHub repository
              </a>
            </aside>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-[900px] px-6 md:px-12">
            <h2 className="text-3xl font-black tracking-[-0.03em]">What is in the package</h2>
            <p className="mt-5 max-w-[65ch] text-base leading-7 text-foreground/65">
              The package contains the collector, the result auditor, CSV templates, review rules, and a worked example. Read the separate guide for the complete workflow and operating limits.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2" aria-label="Included files">
              {bundle.files.map((file) => (
                <li key={file.path} className="break-all rounded-[2px] border border-white/[0.08] px-3 py-2 font-mono text-sm text-foreground/60">{file.path}</li>
              ))}
            </ul>
            <Link href="/playbooks/google-maps-outbound" className="mt-8 inline-flex min-h-12 items-center justify-center border border-white/[0.14] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-foreground hover:border-primary/60 hover:text-primary">
              Read the implementation guide
            </Link>
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-16 text-center">
          <h2 className="text-3xl font-black tracking-[-0.03em]">Want Muditek to run the appointment-setting work?</h2>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[2px] bg-primary px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-background">Book a call</a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
