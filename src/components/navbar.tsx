"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

const ADMIN_EMAIL = "ghiles@muditek.com";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = email === ADMIN_EMAIL;

  useEffect(() => {
    setMobileOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 md:px-12 py-6 w-full max-w-[1800px] mx-auto transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl shadow-lg" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <Link href="/" className="group flex items-center gap-3 relative z-50" aria-label="Muditek homepage">
          <Image src="/icon.svg" alt="" width={36} height={36} aria-hidden="true" />
          <span className="text-base font-black tracking-[0.2em] text-foreground uppercase">MUDITEK</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors font-bold">
            Home
          </Link>

          {/* Solutions dropdown */}
          <div className="relative group">
            <button className="text-sm uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors font-bold cursor-pointer flex items-center gap-1.5">
              Solutions
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="opacity-40 group-hover:opacity-70 transition-opacity mt-[1px]">
                <path d="M2 3L4 5L6 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-3 w-72 py-3 bg-card/95 backdrop-blur-xl border border-white/[0.06] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl z-50 rounded-[6px]">
              <Link href="/mudiagent" className="block px-5 py-2.5 text-sm uppercase tracking-[0.15em] font-bold text-foreground/60 hover:text-foreground hover:bg-white/[0.04] transition-colors">
                mudiAgent
              </Link>
              <Link href="/revenue-leak-audit" className="block px-5 py-2.5 text-sm uppercase tracking-[0.15em] font-bold text-foreground/60 hover:text-foreground hover:bg-white/[0.04] transition-colors">
                Revenue Leak Audit
              </Link>
              <Link href="/pe-ops" className="block px-5 py-2.5 text-sm uppercase tracking-[0.15em] font-bold text-foreground/60 hover:text-foreground hover:bg-white/[0.04] transition-colors">
                Operational Infrastructure
              </Link>
              <div className="h-px bg-white/[0.04] mx-5 my-2" />
              <Link href="/tools/revenue-leak-calculator" className="flex items-center justify-between px-5 py-2.5 text-sm uppercase tracking-[0.15em] font-bold text-foreground/60 hover:text-foreground hover:bg-white/[0.04] transition-colors">
                Revenue Leak Calculator
                <span className="text-[10px] font-black tracking-[0.15em] text-emerald-400/70 uppercase">Free</span>
              </Link>
            </div>
          </div>

          <Link href="/about" className="text-sm uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors font-bold">
            About
          </Link>
          <Link href="/newsletter" className="text-sm uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors font-bold">
            Newsletter
          </Link>
          <Link href="/resources" className="text-sm uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors font-bold">
            Resources
          </Link>

          {isLoaded && isSignedIn && (
            <>
              <Link href="/portal" className="text-sm uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors font-bold">
                Portal
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm uppercase tracking-[0.2em] text-amber-400/80 hover:text-amber-300 transition-colors font-bold">
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* Desktop CTA + user */}
        <div className="hidden md:flex items-center gap-3">
          {isLoaded && isSignedIn && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 ring-1 ring-white/[0.08]",
                },
              }}
            />
          )}
          {isLoaded && !isSignedIn && (
            <Link
              href="/sign-in?redirect_url=/portal"
              className="px-4 py-2.5 text-sm uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground transition-colors font-bold"
            >
              Sign in
            </Link>
          )}
          {isLoaded && !isSignedIn && (
            <Link
              href="/sign-up"
              className="px-5 py-2.5 rounded-[2px] text-sm font-black uppercase tracking-[0.18em] bg-primary text-background hover:scale-[1.03] transition-transform btn-press"
            >
              Join Free
            </Link>
          )}
          <a
            href="https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-[2px] text-sm font-black uppercase tracking-[0.18em] bg-foreground text-background hover:scale-[1.03] transition-transform btn-press"
          >
            Book a Call
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span className={`block w-5 h-[1.5px] bg-foreground transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`block w-5 h-[1.5px] bg-foreground transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : "opacity-100"}`} />
          <span className={`block w-5 h-[1.5px] bg-foreground transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-start justify-center h-full px-10 gap-1">
          <Link
            href="/"
            className={`text-2xl font-black uppercase tracking-[0.05em] text-foreground/80 hover:text-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              mobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: mobileOpen ? "60ms" : "0ms" }}
          >
            Home
          </Link>

          <button
            onClick={() => setSolutionsOpen(!solutionsOpen)}
            className={`text-2xl font-black uppercase tracking-[0.05em] text-foreground/80 hover:text-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3 ${
              mobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: mobileOpen ? "120ms" : "0ms" }}
          >
            Solutions
            <svg width="14" height="14" viewBox="0 0 8 8" fill="none" className={`transition-transform duration-300 ${solutionsOpen ? "rotate-180" : ""}`}>
              <path d="M2 3L4 5L6 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${solutionsOpen ? "max-h-64 opacity-100 mb-4" : "max-h-0 opacity-0"}`}>
            <div className="pl-4 pt-3 flex flex-col gap-3 border-l border-white/[0.06]">
              <Link href="/mudiagent" className="text-sm font-medium text-foreground/50 hover:text-foreground transition-colors">mudiAgent</Link>
              <Link href="/revenue-leak-audit" className="text-sm font-medium text-foreground/50 hover:text-foreground transition-colors">Revenue Leak Audit</Link>
              <Link href="/pe-ops" className="text-sm font-medium text-foreground/50 hover:text-foreground transition-colors">Operational Infrastructure</Link>
              <Link href="/tools/revenue-leak-calculator" className="text-sm font-medium text-emerald-400/70 hover:text-emerald-400 transition-colors">Revenue Leak Calculator</Link>
            </div>
          </div>

          <Link
            href="/about"
            className={`text-2xl font-black uppercase tracking-[0.05em] text-foreground/80 hover:text-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              mobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: mobileOpen ? "200ms" : "0ms" }}
          >
            About
          </Link>

          <Link
            href="/newsletter"
            className={`text-2xl font-black uppercase tracking-[0.05em] text-foreground/80 hover:text-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              mobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: mobileOpen ? "260ms" : "0ms" }}
          >
            Newsletter
          </Link>

          <Link
            href="/resources"
            className={`text-2xl font-black uppercase tracking-[0.05em] text-foreground/80 hover:text-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              mobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: mobileOpen ? "320ms" : "0ms" }}
          >
            Resources
          </Link>

          {isLoaded && !isSignedIn && (
            <>
              <Link
                href="/sign-up"
                className={`text-2xl font-black uppercase tracking-[0.05em] text-primary hover:text-primary/80 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  mobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: mobileOpen ? "380ms" : "0ms" }}
              >
                Join Free
              </Link>
              <Link
                href="/sign-in?redirect_url=/portal"
                className={`text-xl font-bold uppercase tracking-[0.05em] text-foreground/60 hover:text-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  mobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: mobileOpen ? "420ms" : "0ms" }}
              >
                Sign in
              </Link>
            </>
          )}
          {isLoaded && isSignedIn && (
            <>
              <Link
                href="/portal"
                className={`text-2xl font-black uppercase tracking-[0.05em] text-foreground/80 hover:text-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  mobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: mobileOpen ? "380ms" : "0ms" }}
              >
                Portal
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`text-2xl font-black uppercase tracking-[0.05em] text-amber-400/90 hover:text-amber-300 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    mobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: mobileOpen ? "440ms" : "0ms" }}
                >
                  Admin
                </Link>
              )}
            </>
          )}

          <a
            href="https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink"
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-8 px-8 py-4 bg-foreground text-background text-sm font-black uppercase tracking-[0.2em] rounded-[2px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] btn-press ${
              mobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: mobileOpen ? "500ms" : "0ms" }}
          >
            Book a Call
          </a>
        </div>
      </div>
    </>
  );
}
