"use client";

import Link from "next/link";
import { LogoIcon } from "./logo-icon";

export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 md:px-12 py-8 w-full max-w-[1800px] mx-auto"
      role="navigation"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className="group flex items-center gap-3 liquid-glass px-4 py-2 rounded-[4px] hover:bg-white/[0.05] transition-colors"
        aria-label="Muditek homepage"
      >
        <LogoIcon size={22} />
        <span className="text-[12px] font-black tracking-[0.2em] text-foreground uppercase pt-[1px]">
          MUDITEK
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-12">
        <div className="relative group">
          <button className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors font-bold cursor-pointer">
            Solutions
          </button>
          <div className="absolute top-full left-0 mt-3 w-52 py-3 bg-card border border-white/[0.05] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-50 rounded-[4px]">
            <Link href="/mudiagent" className="block px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] font-bold text-foreground/60 hover:text-foreground hover:bg-white/[0.03] transition-colors">
              mudiAgent
            </Link>
            <Link href="/revenue-machine" className="block px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] font-bold text-foreground/60 hover:text-foreground hover:bg-white/[0.03] transition-colors">
              Pipeline Diagnostic
            </Link>
            <Link href="/pe-ops" className="block px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] font-bold text-foreground/60 hover:text-foreground hover:bg-white/[0.03] transition-colors">
              Operational Infrastructure
            </Link>
          </div>
        </div>
        <Link href="/#proof" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors font-bold">
          About
        </Link>
      </div>

      <Link
        href="#contact"
        className="hidden md:flex px-6 py-2.5 rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] bg-foreground text-background hover:scale-[1.03] transition-transform btn-press"
      >
        Book a Call
      </Link>
    </nav>
  );
}
