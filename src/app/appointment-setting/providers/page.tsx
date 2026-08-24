import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getVisibleProviderProfiles, isAcquisitionPreview } from "@/lib/acquisition/provider-profiles";

export const metadata: Metadata = {
  title: "Appointment-setting provider profiles | Muditek",
  description: "Source-linked provider pricing, billing models, terms, channels, and qualification language.",
  alternates: { canonical: "https://muditek.com/appointment-setting/providers" },
  robots: isAcquisitionPreview() ? { index: false, follow: false } : undefined,
};

export default function ProviderProfilesPage() {
  const profiles = getVisibleProviderProfiles();
  if (profiles.length === 0) notFound();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <main id="main-content" className="px-6 pb-24 pt-36 md:px-12 md:pb-32 md:pt-44">
        <div className="mx-auto max-w-[1120px]">
          <p className="font-semibold text-primary">Source-linked provider research</p>
          <h1 className="mt-5 max-w-[900px] text-balance text-5xl font-black leading-[0.96] tracking-[-0.035em] md:text-7xl">
            Read the terms before you compare the pitch.
          </h1>
          <p className="mt-7 max-w-[720px] text-lg leading-8 text-foreground/70">
            Each profile records what the provider states publicly. Missing terms stay missing. Muditek does not rank providers or infer unpublished conditions.
          </p>
          <div className="mt-14 border-t border-white/16">
            {profiles.map((profile) => (
              <Link
                key={profile.slug}
                href={profile.canonicalPath}
                className="group grid min-h-28 gap-3 border-b border-white/16 py-7 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary md:grid-cols-[260px_1fr_auto] md:items-center"
              >
                <strong className="text-xl text-white">{profile.providerName}</strong>
                <span className="leading-7 text-foreground/66">Pricing, terms, channels, qualification, and source.</span>
                <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
