export function TldrBox({ tldr }: { tldr: string | null | undefined }) {
  if (!tldr) return null;
  return (
    <aside
      data-speakable="tldr"
      className="mb-10 border-l-2 border-primary/40 bg-card/30 px-5 py-4 rounded-r-[2px]"
    >
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">
        TL;DR
      </p>
      <p className="text-base font-bold leading-snug text-foreground">{tldr}</p>
    </aside>
  );
}
