import Image from "next/image";
import Link from "next/link";

const STATS = [
  { label: "Operators", value: "5,365" },
  { label: "Editions", value: "29" },
  { label: "Playbooks", value: "14" },
];

const LATEST_DROP = "The only automation use case that pays you back.";

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
          Ops systems shipped to{" "}
          <span className="italic font-medium text-white/70">5,365 operators</span> every week.
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-white/55 max-w-[400px]">
          Create a free account to access 14 deployable playbooks, the full newsletter archive, and book a call with a human.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-px rounded-[6px] overflow-hidden border border-white/[0.06] bg-white/[0.05]">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#08080a] p-4">
              <div className="text-2xl lg:text-3xl font-black tracking-tight text-white">{s.value}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.22em] font-bold text-white/40">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-l-2 border-white/10 pl-4">
          <div className="text-[10px] uppercase tracking-[0.22em] font-black text-white/40 mb-1.5">Latest drop</div>
          <p className="text-[13px] text-white/70 leading-snug italic">&quot;{LATEST_DROP}&quot;</p>
        </div>
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
