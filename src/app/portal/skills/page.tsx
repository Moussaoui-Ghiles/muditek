import Link from "next/link";
import { getPublishedLibraryItems } from "@/lib/library-manifest";

export const metadata = { title: "Advanced Skills · Muditek" };

export default function PortalSkillsPage() {
  const skills = getPublishedLibraryItems("skill").filter((item) => item.access === "account");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <header className="border-b border-white/[0.07] pb-7">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Member downloads</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em]">Advanced Skills</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/60">These pages are public. Your free membership unlocks each complete dependency bundle.</p>
      </header>
      <div className="divide-y divide-white/[0.07]">
        {skills.map((skill) => (
          <Link key={skill.slug} href={`/skills/${skill.slug}`} className="grid gap-3 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:grid-cols-[190px_1fr_auto] sm:items-center">
            <span className="text-xs font-semibold capitalize text-primary">{skill.topic.replaceAll("-", " ")}</span>
            <span><strong className="block text-sm font-medium text-foreground">{skill.title}</strong><span className="mt-1 block text-xs leading-5 text-foreground/50">{skill.summary}</span></span>
            <span className="text-[11px] text-foreground/45">{skill.updatedAt} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
