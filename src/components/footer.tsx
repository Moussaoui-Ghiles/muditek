import Link from "next/link";
import Image from "next/image";

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
            <p className="text-sm text-foreground/50 max-w-[28ch] leading-relaxed">
              AI systems that eliminate operational waste.
            </p>
          </div>

          <nav className="flex gap-16 md:gap-20" aria-label="Footer navigation">
            <div>
              <span className="block text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-4">Solutions</span>
              <Link href="/mudiagent" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">mudiAgent</Link>
              <Link href="/revenue-leak-audit" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Revenue Leak Audit</Link>
              <Link href="/pe-ops" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Operational Infrastructure</Link>
              <Link href="/tools/revenue-leak-calculator" className="block text-sm text-foreground/60 hover:text-foreground transition-colors font-medium">Revenue Leak Calculator</Link>
            </div>
            <div>
              <span className="block text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-4">Company</span>
              <Link href="/about" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">About</Link>
              <Link href="/newsletter" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Newsletter</Link>
              <a href="https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Contact</a>
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
