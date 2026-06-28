import Link from "next/link";
import Image from "next/image";
import { EmailCapture } from "./email-capture";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.06] bg-background" role="contentinfo">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 py-16">
        {/* Newsletter row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-12 border-b border-white/[0.06]">
          <div className="shrink-0">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70 block mb-1">
              B2B Agents
            </span>
            <span className="text-sm text-foreground/50 font-light">
              One deployable system per week for B2B operators.
            </span>
          </div>
          <EmailCapture
            tags={["source:footer"]}
            buttonText="Subscribe"
            successMessage="You're in."
            compact
            className="w-full md:max-w-md"
          />
        </div>

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

          <nav className="flex flex-wrap gap-12 md:gap-16" aria-label="Footer navigation">
            <div>
              <span className="block text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-4">Free Tools</span>
              <Link href="/tools" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">All Tools</Link>
              <Link href="/tools/google-maps-lead-finder" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Google Maps Lead Finder</Link>
              <Link href="/tools/linkedin-lead-finder" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">LinkedIn Lead Finder</Link>
              <Link href="/tools/find-agency-leads" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Find Agency Leads</Link>
              <Link href="/tools/find-b2b-saas-leads" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Find B2B SaaS Leads</Link>
              <Link href="/tools/revenue-leak-calculator" className="block text-sm text-foreground/60 hover:text-foreground transition-colors font-medium">Revenue Leak Calculator</Link>
            </div>
            <div>
              <span className="block text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-4">Learn</span>
              <Link href="/playbooks" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Playbooks</Link>
              <Link href="/skills" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">AI Skills</Link>
              <Link href="/case-studies" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Case Studies</Link>
              <Link href="/newsletter" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Newsletter</Link>
              <Link href="/sign-up" className="block text-sm text-foreground/60 hover:text-foreground transition-colors font-medium">Portal</Link>
            </div>
            <div>
              <span className="block text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-4">Company</span>
              <Link href="/about" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">About</Link>
              <a href="mailto:biz@ghiless.com" className="block text-sm text-foreground/60 hover:text-foreground transition-colors mb-2.5 font-medium">Contact</a>
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
