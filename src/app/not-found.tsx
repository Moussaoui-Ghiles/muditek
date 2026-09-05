import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="max-w-xl w-full text-center">
          <p className="font-mono text-sm text-primary mb-6">404</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.95] mb-6 text-balance">
            This page does not <span className="text-primary">exist.</span>
          </h1>
          <p className="text-lg text-foreground/80 mb-10 max-w-md mx-auto leading-relaxed">
            The link may be stale or the page was moved. Start from the homepage or the library.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="btn btn-solid"
            >
              Home
            </Link>
            <Link href="/library" className="btn btn-outline">
              Library
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
