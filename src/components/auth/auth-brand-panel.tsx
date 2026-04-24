import Image from "next/image";
import Link from "next/link";

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden md:flex flex-col justify-between overflow-hidden border-r border-white/[0.05] bg-[#08080a] p-10 lg:p-14 min-h-[100dvh]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[160px] opacity-40"
        style={{ background: "radial-gradient(circle, rgba(232,232,236,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10">
        <Link href="/" aria-label="Muditek home" className="inline-flex items-center gap-3 group">
          <Image
            src="/icon.svg"
            alt=""
            width={40}
            height={40}
            aria-hidden="true"
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="text-base font-black tracking-[0.2em] uppercase text-white">MUDITEK</span>
        </Link>
      </div>

      <div className="relative z-10 max-w-[440px]">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-black text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Weekly drops
        </div>
        <h1 className="text-[clamp(2.2rem,4vw,3.2rem)] font-black leading-[1.02] tracking-[-0.03em] text-white">
          One deployable system.{" "}
          <span className="italic font-medium text-white/70">Every week.</span>
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-white/55 max-w-[400px]">
          Free account, no card. Here's what's inside.
        </p>

        <ul className="mt-10 space-y-5 max-w-[400px]">
          <li className="flex items-start gap-4">
            <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-white/[0.08] bg-white/[0.03] font-mono text-[11px] font-black text-white/70">01</span>
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-white leading-tight">Playbooks library</div>
              <div className="mt-1 text-[13px] text-white/45 leading-relaxed">Every deployable system I've shipped, indexed and ready to copy.</div>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-white/[0.08] bg-white/[0.03] font-mono text-[11px] font-black text-white/70">02</span>
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-white leading-tight">Newsletter archive</div>
              <div className="mt-1 text-[13px] text-white/45 leading-relaxed">Every weekly edition on one page — read on-site, no email gate.</div>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-white/[0.08] bg-white/[0.03] font-mono text-[11px] font-black text-white/70">03</span>
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-white leading-tight">Book a call</div>
              <div className="mt-1 text-[13px] text-white/45 leading-relaxed">PE Ops, Revenue Leak Audit, or MudiAgent demo — straight to calendar.</div>
            </div>
          </li>
        </ul>
      </div>

      <div className="relative z-10 flex items-center gap-4 text-[11px] text-white/40 font-mono uppercase tracking-[0.2em]">
        <Link href="/" className="hover:text-white/70 transition-colors">← muditek.com</Link>
        <span className="text-white/20">·</span>
        <Link href="/newsletter" className="hover:text-white/70 transition-colors">Newsletter</Link>
        <span className="text-white/20">·</span>
        <Link href="/resources" className="hover:text-white/70 transition-colors">Resources</Link>
      </div>
    </aside>
  );
}
