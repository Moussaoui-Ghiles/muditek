import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="max-w-xl w-full text-center">
          <p className="text-sm font-mono tracking-[0.3em] uppercase text-foreground/50 mb-6">
            404
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.95] mb-6 text-balance">
            This page doesn&apos;t <span className="text-primary italic font-medium">exist.</span>
          </h1>
          <p className="text-base text-foreground/60 mb-10 max-w-md mx-auto">
            The link may be stale or the page was moved. Jump back to the homepage or browse the newsletter archive.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-foreground text-background text-sm font-black uppercase tracking-[0.2em] rounded-[2px] hover:scale-[1.02] transition-transform"
            >
              Home
            </Link>
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/[0.12] text-foreground/80 text-sm font-black uppercase tracking-[0.2em] rounded-[2px] hover:bg-card/[0.5] transition-colors"
            >
              Newsletter
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
