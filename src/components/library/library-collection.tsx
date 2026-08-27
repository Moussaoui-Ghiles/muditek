import Link from "next/link";
import type { LibraryItem } from "@/lib/library-manifest";

const KIND_LABELS: Record<LibraryItem["kind"], string> = {
  skill: "Skill",
  playbook: "Playbook",
  tool: "Tool",
};

export function LibraryCollection({
  items,
  heading,
  description,
}: {
  items: LibraryItem[];
  heading: string;
  description: string;
}) {
  return (
    <section className="w-full border-t border-white/[0.06] py-14 md:py-20">
      <div className="mx-auto w-full max-w-[1180px] px-6 md:px-12">
        <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-end">
          <h2 className="text-3xl font-black leading-[1] tracking-[-0.03em] text-foreground md:text-5xl">
            {heading}
          </h2>
          <p className="max-w-[64ch] text-sm leading-7 text-foreground/70 md:justify-self-end md:text-base">
            {description}
          </p>
        </div>

        <div className="border-y border-white/[0.08]">
          {items.map((item) => (
            <Link
              key={`${item.kind}:${item.slug}`}
              href={`/${item.kind}s/${item.slug}`}
              className="group grid gap-4 border-b border-white/[0.06] px-1 py-6 transition-colors last:border-b-0 hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_120px] md:items-center md:px-5"
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  {KIND_LABELS[item.kind]} · {item.topic.replaceAll("-", " ")}
                </p>
                <h3 className="mt-2 text-xl font-black tracking-[-0.015em] text-foreground md:text-2xl">
                  {item.title}
                </h3>
              </div>
              <p className="max-w-[62ch] text-sm leading-6 text-foreground/65">{item.summary}</p>
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-foreground/75 group-hover:text-primary">
                {item.access === "account" ? "View bundle" : item.kind === "tool" ? "Use tool" : "Read asset"}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CommercialNextStep({ item }: { item: LibraryItem }) {
  const outbound = item.lane === "outbound";

  return (
    <section className="w-full border-t border-white/[0.06] py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-[1000px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center md:px-12">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">If you need implementation</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-black leading-[1.05] tracking-[-0.03em] text-foreground md:text-5xl">
            {outbound
              ? "Need this turned into a working appointment-setting system?"
              : "Need this turned into a working AI system?"}
          </h2>
          <p className="mt-5 max-w-[62ch] text-base leading-7 text-foreground/70">
            {outbound
              ? "Review the current appointment-setting offer, qualification rules, pricing, and held-meeting terms."
              : "Review how Muditek scopes, builds, tests, and hands over practical AI implementations."}
          </p>
        </div>
        <Link
          href={item.commercialTarget}
          className="btn-press inline-flex min-h-12 items-center justify-center bg-primary px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          {outbound ? "Review appointment setting" : "Review AI implementation"}
        </Link>
      </div>
    </section>
  );
}
