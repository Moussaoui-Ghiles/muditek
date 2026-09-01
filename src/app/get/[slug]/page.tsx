import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getLeadMagnet } from "@/lib/lead-magnets";
import { AssetEmailForm } from "@/components/asset-email-form";

const BASE_URL = "https://muditek.com";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) return {};
  const image = magnet.image
    ? magnet.image.startsWith("http")
      ? magnet.image
      : `${BASE_URL}${magnet.image}`
    : undefined;
  return {
    title: `${magnet.title} | Muditek`,
    description: magnet.subhead,
    robots: { index: false, follow: false },
    alternates: { canonical: `${BASE_URL}/get/${magnet.slug}` },
    openGraph: {
      title: magnet.headline,
      description: magnet.subhead,
      url: `${BASE_URL}/get/${magnet.slug}`,
      type: "website",
      images: image ? [image] : undefined,
    },
  };
}

export default async function GetMagnetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) notFound();

  const hasImage = Boolean(magnet.image);

  return (
    <>
      <Navbar />
      <main className="min-h-[100dvh] bg-background px-6 pb-24 pt-32 text-foreground md:px-12">
        <section
          className={`mx-auto w-full ${hasImage ? "max-w-[1180px] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14" : "max-w-[640px]"}`}
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
              Free from Ghiles
            </p>
            <h1 className="mt-5 text-4xl font-black leading-[0.98] tracking-tight md:text-5xl">
              {magnet.headline}
            </h1>
            {magnet.subhead ? (
              <p className="mt-5 text-base leading-7 text-foreground/75 md:text-lg">
                {magnet.subhead}
              </p>
            ) : null}

            {magnet.bullets.length > 0 ? (
              <ul className="mt-6 space-y-2.5">
                {magnet.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[15px] leading-6 text-foreground/85">
                    <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-8 rounded-xl border border-white/[0.08] bg-card/50 p-6 md:p-7">
              <p className="text-sm font-semibold leading-6 text-foreground/80">
                {magnet.mode === "page"
                  ? "Enter your email. It opens right here, and a copy lands in your inbox."
                  : "Enter your email and it lands in your inbox right away."}
              </p>
              <AssetEmailForm slug={magnet.slug} className="mt-4" />
            </div>
          </div>

          {hasImage ? (
            <figure className="mt-10 lg:mt-0">
              <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-white">
                <img
                  src={magnet.image as string}
                  alt={magnet.imageAlt}
                  className="block w-full"
                  loading="eager"
                />
              </div>
            </figure>
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  );
}
