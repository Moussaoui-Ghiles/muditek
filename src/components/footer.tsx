import Link from "next/link";
import { LogoIcon } from "./logo-icon";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.03] bg-background" role="contentinfo">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div>
            <Link href="/" className="group flex items-center gap-2.5 mb-4" aria-label="Muditek homepage">
              <LogoIcon size={18} />
              <span className="text-[10px] font-black tracking-[0.2em] text-foreground/40 uppercase">MUDITEK</span>
            </Link>
            <p className="text-[11px] text-foreground/25 max-w-[28ch] leading-relaxed font-light">
              AI systems that eliminate operational waste.
            </p>
          </div>

          <nav className="flex gap-16 md:gap-20" aria-label="Footer navigation">
            <div>
              <span className="block text-[9px] font-black tracking-[0.25em] uppercase text-foreground/25 mb-4">Solutions</span>
              <Link href="/mudiagent" className="block text-[11px] text-foreground/40 hover:text-foreground/70 transition-colors mb-2.5 font-medium">mudiAgent</Link>
              <Link href="/revenue-machine" className="block text-[11px] text-foreground/40 hover:text-foreground/70 transition-colors mb-2.5 font-medium">Pipeline Diagnostic</Link>
              <Link href="/pe-ops" className="block text-[11px] text-foreground/40 hover:text-foreground/70 transition-colors font-medium">Operational Infrastructure</Link>
            </div>
            <div>
              <span className="block text-[9px] font-black tracking-[0.25em] uppercase text-foreground/25 mb-4">Company</span>
              <Link href="/about" className="block text-[11px] text-foreground/40 hover:text-foreground/70 transition-colors mb-2.5 font-medium">About</Link>
              <Link href="/newsletter" className="block text-[11px] text-foreground/40 hover:text-foreground/70 transition-colors mb-2.5 font-medium">Newsletter</Link>
              <a href="mailto:ghiles@muditek.com" className="block text-[11px] text-foreground/40 hover:text-foreground/70 transition-colors mb-2.5 font-medium">Contact</a>
              <a href="https://www.linkedin.com/in/ghiles-moussaoui-b36218250/" target="_blank" rel="noopener noreferrer" className="block text-[11px] text-foreground/40 hover:text-foreground/70 transition-colors font-medium">LinkedIn</a>
            </div>
            <div>
              <span className="block text-[9px] font-black tracking-[0.25em] uppercase text-foreground/25 mb-4">Legal</span>
              <Link href="#" className="block text-[11px] text-foreground/40 hover:text-foreground/70 transition-colors mb-2.5 font-medium">Privacy</Link>
              <Link href="#" className="block text-[11px] text-foreground/40 hover:text-foreground/70 transition-colors font-medium">Imprint</Link>
            </div>
          </nav>
        </div>

        <div className="h-px bg-white/[0.03] mb-6" />
        <p className="text-[10px] text-foreground/20 font-mono tracking-wider">&copy; {new Date().getFullYear()} Muditek. All rights reserved.</p>
      </div>
    </footer>
  );
}
