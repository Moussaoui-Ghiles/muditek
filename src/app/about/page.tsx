import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TrackedBookingLink } from "@/components/acquisition-tracking";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "About Muditek",
  description: "Muditek is run by Ghiles Moussaoui and provides B2B appointment setting and practical AI implementation.",
  alternates: { canonical: "https://muditek.com/about" },
  openGraph: {
    title: "About Muditek",
    description: "The operator, focus, and working principles behind Muditek.",
    url: "https://muditek.com/about",
    type: "profile",
  },
};

const PRINCIPLES = [
  ["01", "Start from the real work", "Fix the decision, owner, source data, constraints, and failure conditions before selecting a tool."],
  ["02", "Keep claims separate from examples", "A capability or application is not presented as client proof. Public results need a source before they become a claim."],
  ["03", "Build for operation", "The handoff includes how the system runs, how it fails, who reviews it, and what changes when evidence changes."],
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        url: "https://muditek.com/about",
        dateModified: "2026-08-23",
        mainEntity: { "@id": "https://muditek.com/#ghiles" },
      }} />

      <main id="main-content">
        <header className="relative overflow-hidden border-b border-white/[0.06] pb-20 pt-40 md:pb-28 md:pt-52">
          <div className="absolute left-[8%] top-40 h-72 w-72 rounded-full bg-primary/[0.06] blur-[120px]" aria-hidden="true" />
          <div className="relative mx-auto grid w-full max-w-[1300px] gap-12 px-6 md:px-12 lg:grid-cols-[1fr_300px] lg:items-end">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.22em] text-primary"><span className="h-px w-8 bg-primary" /> About Muditek</p>
              <h1 className="mt-7 max-w-[900px] text-5xl font-black leading-[0.93] tracking-[-0.04em] sm:text-6xl md:text-[80px]">Muditek is run by one operator: Ghiles Moussaoui.</h1>
              <p className="mt-8 max-w-[680px] text-base leading-8 text-foreground/72 md:text-lg">The commercial focus is B2B appointment setting. AI implementation covers workflows that need a deeper build.</p>
            </div>
            <div className="border-y border-white/[0.12] py-6">
              <Image src="/images/ghiles.jpg" alt="Ghiles Moussaoui" width={72} height={72} className="h-18 w-18 rounded-full border border-white/15 object-cover" />
              <p className="mt-4 text-sm font-semibold text-foreground">Ghiles Moussaoui</p>
              <p className="mt-1 text-xs text-foreground/55">Founder · Europe · Remote</p>
            </div>
          </div>
        </header>

        <section className="border-b border-white/[0.06] py-24 md:py-32">
          <div className="mx-auto grid w-full max-w-[1300px] gap-12 px-6 md:px-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">What Muditek does</p>
              <h2 className="mt-5 text-4xl font-black leading-none tracking-[-0.035em] md:text-5xl">One clear starting point. Deeper builds where needed.</h2>
            </div>
            <div className="border-t border-white/[0.1]">
              <div className="grid gap-3 border-b border-white/[0.1] py-7 sm:grid-cols-[190px_1fr]">
                <h3 className="font-semibold">Appointment Setting</h3>
                <p className="text-sm leading-6 text-foreground/65">Offer review, targeting, research, messaging, reply handling, qualification, and held-meeting handoff.</p>
              </div>
              <div className="grid gap-3 border-b border-white/[0.1] py-7 sm:grid-cols-[190px_1fr]">
                <h3 className="font-semibold">AI Implementation</h3>
                <p className="text-sm leading-6 text-foreground/65">Revenue operations, operational workflows, content systems, and agent systems that need to be scoped, built, tested, and handed over.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] py-24 md:py-32">
          <div className="mx-auto w-full max-w-[1300px] px-6 md:px-12">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Working principles</p>
            <div className="mt-8 border-t border-white/[0.1]">
              {PRINCIPLES.map(([number, title, text]) => (
                <div key={number} className="grid gap-3 border-b border-white/[0.1] py-7 sm:grid-cols-[55px_230px_1fr]">
                  <span className="font-mono text-xs text-primary">{number}</span>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="text-sm leading-6 text-foreground/65">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="mx-auto grid w-full max-w-[1100px] gap-10 px-6 text-center md:px-12">
            <h2 className="text-4xl font-black leading-none tracking-[-0.035em] md:text-6xl">Inspect the work before you contact us.</h2>
            <p className="mx-auto max-w-[650px] text-base leading-7 text-foreground/68">The public library shows the methods, tools, and technical material. If the appointment-setting offer fits, the qualification criteria are public too.</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/library" className="inline-flex min-h-14 items-center justify-center rounded-[2px] border border-white/15 px-7 text-xs font-black uppercase tracking-[0.17em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Open the library</Link>
              <TrackedBookingLink asset="about" lane="outbound" placement="about-final" className="inline-flex min-h-14 items-center justify-center rounded-[2px] bg-primary px-7 text-xs font-black uppercase tracking-[0.17em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">Discuss a fit</TrackedBookingLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
