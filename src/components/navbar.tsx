"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { TrackedBookingLink } from "@/components/acquisition-tracking";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const background = [document.querySelector("main"), document.querySelector("footer")].filter(
      (element): element is HTMLElement => element instanceof HTMLElement,
    );
    const previousBackgroundState = background.map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute("aria-hidden"),
    }));

    document.body.style.overflow = "hidden";
    background.forEach((element) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });

    const focusableInMenu = () => {
      const menuItems = Array.from(
        mobileNavigationRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])") ?? [],
      );
      return [menuButtonRef.current, ...menuItems].filter((element): element is HTMLElement => Boolean(element));
    };

    requestAnimationFrame(() => focusableInMenu()[1]?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = focusableInMenu();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      previousBackgroundState.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const navLinkClass = (href: string) =>
    `inline-flex min-h-11 items-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary ${
      isCurrent(pathname, href) ? "text-foreground" : "text-foreground/65 hover:text-foreground"
    }`;

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled ? "border-white/10 bg-background/94 backdrop-blur-lg" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex min-h-[72px] w-full max-w-[1500px] items-center justify-between gap-6 px-6 md:px-12">
          <Link href="/" className="flex min-h-11 shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary" aria-label="Muditek homepage">
            <Image src="/icon.svg" alt="" width={32} height={32} aria-hidden="true" />
            <span className="text-base font-extrabold tracking-[-0.01em] text-foreground">Muditek</span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass(item.href)} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <TrackedBookingLink asset="navigation" placement="desktop" className="inline-flex min-h-11 items-center rounded-[2px] bg-primary px-5 text-sm font-extrabold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-foreground motion-reduce:transform-none">
              Book a fit call
            </TrackedBookingLink>
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
            className="relative z-50 flex h-11 w-11 items-center justify-center border border-white/20 text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span aria-hidden="true" className="relative h-4 w-5">
              <span className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform motion-reduce:transition-none ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity motion-reduce:transition-none ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-[14px] h-px w-5 bg-current transition-transform motion-reduce:transition-none ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      <div
        ref={mobileNavigationRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal={mobileOpen ? "true" : undefined}
        aria-label="Site menu"
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-40 bg-background px-6 pb-10 pt-28 transition-opacity motion-reduce:transition-none lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="mx-auto flex h-full max-w-xl flex-col">
          <div className="border-t border-white/[0.08]">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} tabIndex={mobileOpen ? 0 : -1} onClick={() => setMobileOpen(false)} aria-current={isCurrent(pathname, item.href) ? "page" : undefined} className="flex min-h-16 items-center border-b border-white/[0.08] text-2xl font-black tracking-[-0.02em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto grid gap-3 sm:grid-cols-2">
            <TrackedBookingLink asset="navigation" placement="mobile" tabIndex={mobileOpen ? 0 : -1} onClick={() => setMobileOpen(false)} className="inline-flex min-h-14 items-center justify-center rounded-[2px] bg-primary px-5 text-center text-sm font-extrabold text-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-foreground">
              Book a fit call
            </TrackedBookingLink>
            <Link href={isSignedIn ? "/portal" : "/sign-in?redirect_url=/portal"} tabIndex={mobileOpen ? 0 : -1} onClick={() => setMobileOpen(false)} className="inline-flex min-h-14 items-center justify-center rounded-[2px] border border-white/15 px-5 text-center text-xs font-black uppercase tracking-[0.16em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {isSignedIn ? "Open workspace" : "Account"}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
