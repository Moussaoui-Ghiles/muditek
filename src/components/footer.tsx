import Image from "next/image";
import Link from "next/link";

const GROUPS = [
  {
    title: "Appointment setting",
    links: [
      ["Appointment Setting", "/appointment-setting"],
      ["Provider Pricing", "/appointment-setting-pricing"],
      ["Quote Calculator", "/tools/appointment-setting-quote-calculator"],
    ],
  },
  {
    title: "Muditek",
    links: [
      ["AI Implementation", "/ai-implementation"],
      ["Public Library", "/library"],
      ["About", "/about"],
      ["Data and Privacy", "/privacy"],
    ],
  },
  {
    title: "Library",
    links: [
      ["Skills", "/skills"],
      ["Playbooks", "/playbooks"],
      ["Tools", "/tools"],
      ["Newsletter", "/newsletter"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-background" role="contentinfo">
      <div className="mx-auto grid w-full max-w-[1500px] gap-14 px-6 py-16 md:grid-cols-[1fr_1.4fr] md:px-12 md:py-20">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Muditek homepage">
            <Image src="/icon.svg" alt="" width={28} height={28} aria-hidden="true" />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Muditek</span>
          </Link>
          <p className="mt-5 max-w-[36ch] text-sm leading-6 text-foreground/65">
            Qualified B2B meetings and practical AI implementation.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="grid gap-10 sm:grid-cols-3">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">{group.title}</h2>
              <ul className="mt-5 space-y-3">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="inline-flex min-h-11 items-center text-sm text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-2 px-6 py-6 text-xs text-foreground/55 sm:flex-row sm:items-center sm:justify-between md:px-12">
          <span>© {new Date().getFullYear()} Muditek</span>
          <span>Newsletter subscription is separate from account creation.</span>
        </div>
      </div>
    </footer>
  );
}
