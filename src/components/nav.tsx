"use client";

import Link from "next/link";

export function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 md:pt-5 px-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between w-full max-w-6xl px-4 md:px-6 py-3 rounded-full bg-base-900/60 backdrop-blur-2xl border border-white/[0.03] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Muditek homepage"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fg-dim/40 to-base-600 flex items-center justify-center border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500">
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 0L14 4V10L7 14L0 10V4L7 0Z"
                fill="white"
                fillOpacity="0.4"
              />
            </svg>
          </div>
          <span className="font-display font-extrabold text-[13px] tracking-[0.22em] text-fg-muted group-hover:text-fg transition-colors duration-500">
            MUDITEK
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7">
          <Link
            href="#solutions"
            className="text-[13px] font-medium text-fg-dim hover:text-fg-muted transition-colors duration-300"
          >
            Solutions
          </Link>
          <Link
            href="#proof"
            className="text-[13px] font-medium text-fg-dim hover:text-fg-muted transition-colors duration-300"
          >
            About
          </Link>
          <button
            className="text-[13px] font-medium text-fg-faint hover:text-fg-dim transition-colors duration-300 cursor-pointer"
            aria-label="Switch language to French"
          >
            FR
          </button>
        </div>

        {/* CTA */}
        <Link
          href="#contact"
          className="btn group flex items-center gap-2 pl-4 md:pl-5 pr-1.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.05] hover:bg-white/[0.1] hover:border-white/[0.08]"
        >
          <span className="text-[12px] md:text-[13px] font-semibold text-fg-muted group-hover:text-fg transition-colors duration-300">
            Book a Call
          </span>
          <span
            className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/[0.06] group-hover:bg-white/[0.1] flex items-center justify-center transition-all duration-500 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    </nav>
  );
}
