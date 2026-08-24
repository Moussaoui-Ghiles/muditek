import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import { getRenderableTools } from "@/lib/acquisition/tool-registry";

export const metadata: Metadata = {
  title: "Free Outbound Tools | Muditek",
  description: "Use practical tools for outbound economics, list quality, email authentication, buyer signals, and meeting qualification.",
  alternates: { canonical: "https://muditek.com/tools" },
};

export default function ToolsPage() {
  const tools = getRenderableTools();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView asset="tools" lane="outbound" event="library_item_viewed" placement="tools-index" />
      <main id="main-content">
        <section className="mx-auto w-full max-w-[1180px] px-6 pb-16 pt-36 md:px-12 md:pb-24 md:pt-48">
          <p className="text-sm font-bold text-primary">Free outbound utilities</p>
          <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.035em] sm:text-6xl md:text-7xl">Check the system. Keep the inputs private.</h1>
          <p className="mt-7 max-w-[70ch] text-lg leading-8 text-foreground/75">Browser tools process data on this device. DNS and CMS tools send only the stated domain, selector, or public-data filters to stateless endpoints. Analytics never records inputs or results.</p>
        </section>
        <section className="border-t border-white/[0.07] py-16 md:py-24">
          <div className="mx-auto w-full max-w-[1180px] px-6 md:px-12">
            <h2 className="text-3xl font-black tracking-[-0.03em]">Available tools</h2>
            <div className="mt-8 grid gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-2">
              {tools.map((tool, index) => (
                <Link
                  key={tool.slug}
                  href={tool.canonicalPath}
                  className={`group min-h-52 bg-background p-6 hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary ${
                    tools.length % 2 === 1 && index === tools.length - 1 ? "md:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold text-primary">{tool.serverBacked ? "Public-data lookup" : "Runs in this browser"}</span>
                    {tool.status !== "published" ? <span className="text-xs text-foreground/50">Preview</span> : null}
                  </div>
                  <h3 className="mt-4 text-2xl font-black tracking-[-0.02em] group-hover:text-primary">{tool.title}</h3>
                  <p className="mt-4 max-w-[56ch] text-sm leading-6 text-foreground/62">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
