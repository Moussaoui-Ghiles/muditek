import Link from "next/link";
import Image from "next/image";
import { BOOK_PATH } from "@/lib/booking";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.06] bg-background" role="contentinfo">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 py-16">

        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div>
            <Link href="/" className="group flex items-center gap-2.5 mb-4" aria-label="Muditek homepage">
              <Image src="/icon.svg" alt="" width={24} height={24} aria-hidden="true" />
              <span className="text-sm font-black tracking-[0.2em] text-foreground/70 uppercase">MUDITEK</span>
            </Link>
            <p className="text-sm text-foreground/50 max-w-[30ch] leading-relaxed">
              AI transformation partner and outbound systems for B2B companies. Audit first, build second, you own the result.
            </p>
            <p className="text-sm text-foreground/50 max-w-[30ch] leading-relaxed mt-3">
              Outbound pricing lives at{" "}
              <a href="https://meetingsheld.com" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground underline underline-offset-4 decoration-white/20">meetingsheld.com</a>.
            </p>
          </div>

          <nav className="flex flex-wrap gap-12 md:gap-16" aria-label="Footer navigation">
            <div>
              <span className="block text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-4">Services</span>
              <Link href="/ai-transformation" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">AI transformation</Link>
              <Link href="/outbound" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Outbound</Link>
              <Link href="/ma-origination" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">M&amp;A origination</Link>
              <a href={BOOK_PATH} className="block text-sm text-foreground/60 hover:text-foreground transition-colors font-medium">Book a call</a>
            </div>
            <div>
              <span className="block text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-4">Library</span>
              <Link href="/skills" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Skills</Link>
              <Link href="/playbooks" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Resources</Link>
              <Link href="/tools" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Tools</Link>
              <Link href="/newsletter" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Newsletter</Link>
              <Link href="/library" className="block text-sm text-foreground/60 hover:text-foreground transition-colors font-medium">Everything</Link>
            </div>
            <div>
              <span className="block text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-4">Portal</span>
              <Link href="/sign-up" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Create an account</Link>
              <Link href="/sign-in?redirect_url=/portal" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Sign in</Link>
              <Link href="/portal/skills" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Skill downloads</Link>
              <Link href="/portal/tools" className="block text-sm text-foreground/60 hover:text-foreground transition-colors font-medium">Portal tools</Link>
            </div>
            <div>
              <span className="block text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-4">Company</span>
              <Link href="/about" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">About</Link>
              <a href={BOOK_PATH} className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Contact</a>
              <a href="https://www.linkedin.com/in/ghiles-moussaoui-b36218250/" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground/60 hover:text-foreground transition-colors font-medium">LinkedIn</a>
            </div>
          </nav>
        </div>

        <div className="h-px bg-white/[0.06] mb-6" />
        <p className="text-sm text-foreground/50 font-mono tracking-wider">&copy; {new Date().getFullYear()} Muditek. All rights reserved.</p>
      </div>
    </footer>
  );
}
