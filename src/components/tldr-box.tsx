export function TldrBox({ tldr }: { tldr: string | null | undefined }) {
  if (!tldr) return null;
  return (
    <aside
      data-speakable="tldr"
      className="mb-10 border border-white/[0.08] bg-card/40 px-5 py-4 rounded-[4px]"
    >
      <p className="text-sm font-bold text-primary mb-2">In short</p>
      <p className="min-w-0 text-base font-bold leading-snug text-foreground [overflow-wrap:anywhere]">{tldr}</p>
    </aside>
  );
}
