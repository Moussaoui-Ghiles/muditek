import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { AcquisitionPageView, TrackedBookingLink, TrackedSourceLink } from "@/components/acquisition-tracking";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import {
  getProviderProfile,
  getProviderRecord,
  getVisibleProviderProfiles,
} from "@/lib/acquisition/provider-profiles";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getVisibleProviderProfiles().map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const profile = getProviderProfile((await params).slug);
  if (!profile) return {};

  return {
    title: profile.title,
    description: profile.description,
    alternates: { canonical: `https://muditek.com${profile.canonicalPath}` },
    robots: profile.status === "published" ? undefined : { index: false, follow: false },
  };
}

function Missing({ children }: { children?: React.ReactNode }) {
  return <span className="text-foreground/52">{children ?? "Not publicly stated on the checked source."}</span>;
}

export default async function ProviderProfilePage({ params }: PageProps) {
  const profile = getProviderProfile((await params).slug);
  if (!profile) notFound();
  const provider = getProviderRecord(profile.providerName);
  if (!provider) notFound();

  const rows = [
    ["Public price", provider.price],
    ["Billing model", provider.model],
    ["Billing unit", provider.billingUnit],
    ["Contract term", provider.contractTerm],
    ["Channels", provider.channels.join(", ")],
    ["Qualification language", provider.qualification],
    ["No-show treatment", provider.noShowPolicy],
  ] as const;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <AcquisitionPageView
        asset={`provider-${profile.slug}`}
        event="organic_landing_viewed"
        pageFamily="provider-profile"
        queryCluster="appointment-setting-providers"
        releaseWave={profile.releaseWave}
      />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: profile.title,
        dateModified: profile.lastChecked,
        mainEntityOfPage: `https://muditek.com${profile.canonicalPath}`,
        citation: provider.sourceUrl,
        publisher: { "@id": "https://muditek.com/#organization" },
      }} />
      <Navbar />
      <main id="main-content">
        <article className="px-6 pb-24 pt-36 md:px-12 md:pb-32 md:pt-44">
          <div className="mx-auto max-w-[1120px]">
            <Link href="/appointment-setting/providers" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
              All provider profiles
            </Link>
            <h1 className="mt-5 max-w-[940px] text-balance text-5xl font-black leading-[0.96] tracking-[-0.035em] md:text-7xl">
              {provider.name}: public pricing and appointment-setting terms
            </h1>
            <p className="mt-7 max-w-[760px] text-lg leading-8 text-foreground/70">
              This profile reports the checked source. It does not score the provider, fill missing terms, or treat marketing language as a contractual promise.
            </p>

            <dl className="mt-14 border-t border-white/16">
              {rows.map(([label, value]) => (
                <div key={label} className="grid gap-3 border-b border-white/16 py-7 md:grid-cols-[240px_1fr]">
                  <dt className="font-bold text-white">{label}</dt>
                  <dd className="max-w-[720px] leading-7 text-foreground/72">{value || <Missing />}</dd>
                </div>
              ))}
            </dl>

            <section className="mt-14 border-l-2 border-primary pl-6">
              <h2 className="text-2xl font-black text-white">Source</h2>
              <p className="mt-3 leading-7 text-foreground/68">Last checked {profile.lastChecked}. Public terms can change. Confirm the current quote and acceptance rule directly with the provider.</p>
              <TrackedSourceLink href={provider.sourceUrl} asset={`provider-${profile.slug}`} placement="provider-source" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                {provider.sourceLabel} <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </TrackedSourceLink>
            </section>

            <section className="mt-24 border-t border-white/16 pt-12">
              <h2 className="max-w-[680px] text-balance text-4xl font-black leading-[1] tracking-[-0.03em] md:text-5xl">Compare the quote using one written meeting rule.</h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/tools/appointment-setting-quote-calculator" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[2px] border border-white/25 px-7 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                  Run the quote calculator <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <TrackedBookingLink asset={`provider-${profile.slug}`} placement="provider-profile" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[2px] bg-primary px-7 text-sm font-extrabold text-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white">
                  Book a fit call <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </TrackedBookingLink>
              </div>
            </section>

            <nav aria-label="Related appointment-setting resources" className="mt-16 border-t border-white/16 pt-10">
              <p className="font-bold text-white">Use this profile with</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/appointment-setting-pricing" className="inline-flex min-h-11 items-center border border-white/20 px-4 text-sm font-semibold text-foreground/74 hover:border-primary hover:text-primary">Provider pricing index</Link>
                <Link href="/appointment-setting/appointment-setting-quote-and-contract" className="inline-flex min-h-11 items-center border border-white/20 px-4 text-sm font-semibold text-foreground/74 hover:border-primary hover:text-primary">Quote and contract checklist</Link>
                <Link href="/templates/qualified-meeting-agreement" className="inline-flex min-h-11 items-center border border-white/20 px-4 text-sm font-semibold text-foreground/74 hover:border-primary hover:text-primary">Qualified-meeting template</Link>
              </div>
            </nav>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
