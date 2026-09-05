import Link from "next/link";
import type { PublicLibraryItem } from "@/lib/public-library";

const KIND_PATH: Record<PublicLibraryItem["kind"], string> = {
  playbook: "playbooks",
  skill: "skills",
  tool: "tools",
};

export function libraryHref(item: PublicLibraryItem): string {
  return `/${KIND_PATH[item.kind]}/${item.slug}`;
}

/** Hairline rows. Title left, topic right. No cards. */
export function LibraryList({ items, showKind = false }: { items: PublicLibraryItem[]; showKind?: boolean }) {
  return (
    <ul className="border-t border-white/[0.08]">
      {items.map((item) => (
        <li key={`${item.kind}-${item.slug}`} className="border-b border-white/[0.08]">
          <Link
            href={libraryHref(item)}
            className="group grid gap-2 md:grid-cols-12 md:gap-8 py-6 md:py-7 transition-colors"
          >
            <div className="md:col-span-8">
              <h3 className="text-xl md:text-2xl font-black tracking-[-0.02em] leading-tight text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-foreground/70 max-w-[62ch]">{item.summary}</p>
            </div>
            <div className="md:col-span-4 flex md:justify-end md:text-right">
              <p className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors">
                {showKind ? `${item.kind === "playbook" ? "Resource" : item.kind === "skill" ? "Skill" : "Tool"} · ` : ""}
                {item.topic}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function LibraryHeader({
  back,
  kicker,
  title,
  lead,
}: {
  back?: { href: string; label: string };
  kicker: string;
  title: string;
  lead: string;
}) {
  return (
    <header className="w-full">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12 pt-36 md:pt-48 pb-16 md:pb-20">
        {back ? (
          <Link href={back.href} className="inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-foreground transition-colors mb-8">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M9.5 6H2.5M5 3.5L2.5 6L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {back.label}
          </Link>
        ) : null}
        <p className="text-base font-bold text-primary mb-6">{kicker}</p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.92] tracking-[-0.04em] text-balance max-w-[14ch]">{title}</h1>
        <p className="mt-7 max-w-[60ch] text-lg md:text-xl leading-relaxed text-foreground/75">{lead}</p>
      </div>
    </header>
  );
}
