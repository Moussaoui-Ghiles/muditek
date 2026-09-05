"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { BOOK_PATH } from "@/lib/booking";

const SERVICES = [
  { href: "/ai-transformation", label: "AI transformation", note: "Audit, systems built for you, coaching for your team" },
  { href: "/outbound", label: "Outbound", note: "Signal-based, built and run for you, or coached" },
  { href: "/ma-origination", label: "M&A origination", note: "Owner meetings for advisors, brokers, and buyers" },
];

const PRIMARY = [
  { href: "/library", label: "Library" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  const servicesActive = SERVICES.some((s) => isActive(pathname, s.href));

  // Close both menus when the route changes. Adjusting state during render
  // avoids the extra commit an effect would cost.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!servicesOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setServicesOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [servicesOpen]);

  const linkClass = (active: boolean) =>
    `text-[15px] font-bold tracking-[-0.01em] transition-colors ${active ? "text-foreground" : "text-foreground/65 hover:text-foreground"}`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 md:px-12 py-5 w-full transition-[background-color,box-shadow] duration-300 ${scrolled || mobileOpen ? "bg-background/85 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex items-center gap-3 relative z-50" aria-label="Muditek homepage">
          <Image src="/icon.svg" alt="" width={34} height={34} aria-hidden="true" />
          <span className="text-base font-black tracking-[0.2em] text-foreground uppercase">MUDITEK</span>
        </Link>

        {/* Desktop */}
        <div className="hidden xl:flex items-center gap-9">
          <div
            ref={servicesRef}
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={servicesOpen}
              aria-controls="services-menu"
              onClick={() => setServicesOpen((v) => !v)}
              className={`${linkClass(servicesActive || servicesOpen)} inline-flex items-center gap-1.5 py-2`}
            >
              Services
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className={`transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div
              id="services-menu"
              role="menu"
              className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-[opacity,transform] duration-200 ease-out ${servicesOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-1 invisible pointer-events-none"}`}
            >
              <div className="w-[22rem] bg-card border border-white/[0.1] border-t-2 border-t-primary shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] overflow-hidden">
                {SERVICES.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    role="menuitem"
                    className="block px-5 py-4 border-b border-white/[0.06] hover:bg-white/[0.04] transition-colors group"
                  >
                    <span className={`block text-[15px] font-black tracking-[-0.01em] ${isActive(pathname, s.href) ? "text-primary" : "text-foreground group-hover:text-primary"} transition-colors`}>{s.label}</span>
                    <span className="block mt-0.5 text-sm text-foreground/65 leading-snug">{s.note}</span>
                  </Link>
                ))}
                <Link href={BOOK_PATH} role="menuitem" className="block px-5 py-3.5 text-sm font-bold text-foreground/75 hover:text-foreground hover:bg-white/[0.04] transition-colors">
                  Not sure which? Book a call and we say which one fits.
                </Link>
              </div>
            </div>
          </div>

          {PRIMARY.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(isActive(pathname, item.href))}>
              {item.label}
            </Link>
          ))}

          {isLoaded && isSignedIn && (
            <Link href="/portal" className={linkClass(isActive(pathname, "/portal"))}>
              Portal
            </Link>
          )}
        </div>

        <div className="hidden xl:flex items-center gap-3">
          {isLoaded && isSignedIn && (
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 ring-1 ring-white/[0.08]" } }} />
          )}
          {isLoaded && !isSignedIn && (
            <>
              <Link href="/sign-in?redirect_url=/portal" className="px-3 py-2.5 text-[15px] font-bold text-foreground/65 hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Link href="/sign-up" className="btn btn-outline btn-sm">
                Join the portal
              </Link>
            </>
          )}
          <Link href={BOOK_PATH} className="btn btn-solid btn-sm">
            Book a call
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="xl:hidden relative z-50 w-11 h-11 -mr-2 flex flex-col items-center justify-center gap-[5px]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block w-5 h-[1.5px] bg-foreground transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`block w-5 h-[1.5px] bg-foreground transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : "opacity-100"}`} />
          <span className={`block w-5 h-[1.5px] bg-foreground transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-30 overflow-y-auto overscroll-contain bg-background transition-opacity duration-300 ease-out xl:hidden ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex min-h-full flex-col px-6 pt-28 pb-12">
          <p className="text-sm font-bold text-primary mb-3">Services</p>
          <ul className="border-t border-white/[0.08] mb-8">
            {SERVICES.map((s, i) => (
              <li key={s.href} className="border-b border-white/[0.08]">
                <Link
                  href={s.href}
                  className={`block py-4 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                  style={{ transitionDelay: mobileOpen ? `${60 + i * 50}ms` : "0ms" }}
                >
                  <span className="block text-2xl font-black tracking-[-0.02em] text-foreground">{s.label}</span>
                  <span className="block mt-1 text-sm text-foreground/65">{s.note}</span>
                </Link>
              </li>
            ))}
          </ul>

          <ul className="border-t border-white/[0.08] mb-10">
            {[...PRIMARY, ...(isLoaded && isSignedIn ? [{ href: "/portal", label: "Portal" }] : [])].map((item, i) => (
              <li key={item.href} className="border-b border-white/[0.08]">
                <Link
                  href={item.href}
                  className={`block py-4 text-2xl font-black tracking-[-0.02em] text-foreground transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                  style={{ transitionDelay: mobileOpen ? `${240 + i * 50}ms` : "0ms" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            className={`mt-auto flex flex-col gap-3 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            style={{ transitionDelay: mobileOpen ? "420ms" : "0ms" }}
          >
            <Link href={BOOK_PATH} className="btn btn-solid w-full">Book a call</Link>
            {isLoaded && !isSignedIn && (
              <>
                <Link href="/sign-up" className="btn btn-outline w-full">Join the portal</Link>
                <Link href="/sign-in?redirect_url=/portal" className="py-3 text-center text-base font-bold text-foreground/70 hover:text-foreground">Sign in</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
