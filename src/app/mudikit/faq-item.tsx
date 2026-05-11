"use client";

import { useState } from "react";

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-6 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-base md:text-lg text-[#e8e8ec] font-medium">{q}</span>
        <span
          className="text-[#636366] text-xl shrink-0 mt-0.5 transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && (
        <p className="text-[#a0a0a6] text-[15px] leading-relaxed pb-6 pr-10 max-w-2xl">
          {a}
        </p>
      )}
    </div>
  );
}
