type Accent = "primary" | "emerald" | "sky" | "neutral";

interface Stat {
  value: string;
  label: string;
}

interface StatStripProps {
  stats: [Stat, Stat, Stat];
  accentColor?: Accent;
  className?: string;
}

const ACCENT: Record<Accent, { value: string; rule: string }> = {
  primary: { value: "text-primary", rule: "bg-primary/40" },
  emerald: { value: "text-emerald-400", rule: "bg-emerald-400/40" },
  sky: { value: "text-sky-400", rule: "bg-sky-400/40" },
  neutral: { value: "text-foreground", rule: "bg-white/20" },
};

export function StatStrip({
  stats,
  accentColor = "primary",
  className = "",
}: StatStripProps) {
  const a = ACCENT[accentColor];
  return (
    <div
      className={`grid grid-cols-3 border-y border-white/[0.06] bg-card/[0.2] backdrop-blur-sm ${className}`}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          className={`px-4 sm:px-6 py-6 sm:py-8 ${i < 2 ? "border-r border-white/[0.06]" : ""}`}
        >
          <div className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none ${a.value}`}>
            {s.value}
          </div>
          <div className="mt-3 text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-foreground/60 leading-snug">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
