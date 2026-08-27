"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { href: "/appointment-setting", label: "Appointment Setting" },
  { href: "/ai-implementation", label: "AI Implementation" },
  { href: "/library", label: "Library" },
  { href: "/about", label: "About" },
] as const;

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useUser();
  const isAiRoute = pathname === "/ai-implementation" || pathname.startsWith("/ai-implementation/");
  const commercialAction = isAiRoute
    ? { href: "/ai-implementation#build-review", label: "Discuss an AI build" }
    : { href: "/appointment-setting#fit-review", label: "Check if you qualify" };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const menuItems = Array.from(
        mobileNavigationRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]') ?? [],
      );
      const focusable = [menuButtonRef.current, ...menuItems].filter((item): item is HTMLElement => Boolean(item));
      if (focusable.length === 0) return;
      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
      const nextIndex = event.shiftKey
        ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
        : (currentIndex === focusable.length - 1 ? 0 : currentIndex + 1);
      event.preventDefault();
      focusable[nextIndex]?.focus();
    };
    requestAnimationFrame(() => {
      mobileNavigationRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
    });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const navLinkClass = (href: string) =>
    `text-[12px] font-bold uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      isCurrent(pathname, href) ? "text-foreground" : "text-foreground/65 hover:text-foreground"
    }`;

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled ? "border-white/[0.06] bg-background/90 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex min-h-20 w-full max-w-[1500px] items-center justify-between gap-6 px-6 md:px-12">
          <Link href="/" className="flex shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Muditek homepage">
            <Image src="/icon.svg" alt="" width={32} height={32} aria-hidden="true" />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Muditek</span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass(item.href)} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href={commercialAction.href}
              className="inline-flex min-h-11 items-center rounded-[2px] bg-primary px-5 text-[11px] font-black uppercase tracking-[0.16em] text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground motion-reduce:transform-none"
            >
              {commercialAction.label}
            </Link>
            {isLoaded && isSignedIn ? (
              <div className="flex items-center gap-3">
                <Link href="/portal" className={navLinkClass("/portal")}>Workspace</Link>
                <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 ring-1 ring-white/15" } }} />
              </div>
            ) : (
              <Link href="/sign-in?redirect_url=/portal" className={navLinkClass("/portal")}>Account</Link>
            )}
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="relative z-50 flex h-11 w-11 items-center justify-center border border-white/10 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span aria-hidden="true" className="relative h-4 w-5">
              <span className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-[14px] h-px w-5 bg-current transition-transform ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      <div
        ref={mobileNavigationRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-40 bg-background px-6 pb-10 pt-28 transition-opacity lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="mx-auto flex h-full max-w-xl flex-col">
          <div className="border-t border-white/[0.08]">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} tabIndex={mobileOpen ? 0 : -1} onClick={() => setMobileOpen(false)} className="flex min-h-16 items-center border-b border-white/[0.08] text-2xl font-black tracking-[-0.02em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto grid gap-3 sm:grid-cols-2">
            <Link href={commercialAction.href} tabIndex={mobileOpen ? 0 : -1} onClick={() => setMobileOpen(false)} className="inline-flex min-h-14 items-center justify-center rounded-[2px] bg-primary px-5 text-center text-xs font-black uppercase tracking-[0.16em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
              {commercialAction.label}
            </Link>
            <Link href={isSignedIn ? "/portal" : "/sign-in?redirect_url=/portal"} tabIndex={mobileOpen ? 0 : -1} onClick={() => setMobileOpen(false)} className="inline-flex min-h-14 items-center justify-center rounded-[2px] border border-white/15 px-5 text-center text-xs font-black uppercase tracking-[0.16em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {isSignedIn ? "Open workspace" : "Account"}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
