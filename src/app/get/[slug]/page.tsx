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
  return {
    title: `${magnet.title} | Muditek`,
    description: magnet.promise,
    robots: { index: false, follow: false },
    alternates: { canonical: `${BASE_URL}/get/${magnet.slug}` },
    openGraph: {
      title: magnet.title,
      description: magnet.promise,
      url: `${BASE_URL}/get/${magnet.slug}`,
      type: "website",
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

  return (
    <>
      <Navbar />
      <main className="min-h-[100dvh] bg-background px-6 pb-24 pt-32 text-foreground md:px-12">
        <section className="mx-auto w-full max-w-[640px]">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
            Free from Ghiles
          </p>
          <h1 className="mt-5 text-4xl font-black uppercase leading-[0.94] tracking-tight md:text-5xl">
            {magnet.title}
          </h1>
          {magnet.promise ? (
            <p className="mt-5 text-base leading-7 text-foreground/70 md:text-lg">
              {magnet.promise}
            </p>
          ) : null}

          <div className="mt-10 rounded-xl border border-white/[0.08] bg-card/50 p-6 md:p-8">
            <p className="text-sm leading-6 text-foreground/70">
              {magnet.mode === "page"
                ? "Put your email in and it opens right here. A copy lands in your inbox too, with the systems I publish next."
                : "Put your email in and I send it to your inbox right away, with the systems I publish next."}
            </p>
            <AssetEmailForm slug={magnet.slug} className="mt-5" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
