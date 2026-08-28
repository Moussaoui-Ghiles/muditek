"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Lock, Search, Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";
import { SHOW_MUDIKIT_IN_PORTAL } from "@/lib/portal-features";
import {
  groupPortalSkills,
  PORTAL_SKILL_SECTIONS,
} from "@/lib/portal-skill-catalog";

type AccessFilter = "all" | "open" | "mudikit";

function isAccessible(skill: ContentItem, access: PortalAccess): boolean {
  return skill.is_free || access.isMudikit || access.isAdmin;
}

function SkillCard({
  skill,
  access,
  position,
}: {
  skill: ContentItem;
  access: PortalAccess;
  position: number;
}) {
  const accessible = isAccessible(skill, access);

  return (
    <Link
      href={`/portal/skills/${encodeURIComponent(skill.slug)}`}
      className="group flex min-h-[220px] flex-col rounded-xl border border-white/[0.08] bg-white/[0.018] p-5 outline-none transition-colors hover:border-white/[0.16] hover:bg-white/[0.028] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b0f] sm:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] tracking-[0.18em] text-white/30">
          {String(position).padStart(2, "0")}
        </span>
        <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/45">
          {accessible ? <Terminal className="size-3" /> : <Lock className="size-3" />}
          {skill.is_free ? "Included" : accessible ? "Available" : "Locked"}
        </span>
      </div>

      <div className="mt-6 min-w-0 flex-1">
        <h3 className="text-[19px] font-semibold leading-[1.2] tracking-[-0.015em] text-white">
          {skill.title}
        </h3>
        {skill.description ? (
          <p className="mt-3 line-clamp-4 text-[13.5px] leading-[1.6] text-white/52">
            {skill.description}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
        <span className="min-w-0 truncate font-mono text-[10px] tracking-[0.08em] text-white/28">
          {skill.slug}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-medium text-white/65 transition-colors group-hover:text-amber-300">
          {accessible ? "Open" : "Preview"}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export default function SkillsContent({
  skills,
  access,
}: {
  skills: ContentItem[];
  access: PortalAccess;
}) {
  const [query, setQuery] = useState("");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("all");

  const visibleSkills = useMemo(
    () => (SHOW_MUDIKIT_IN_PORTAL ? skills : skills.filter((skill) => skill.is_free)),
    [skills],
  );

  const paidCount = visibleSkills.filter((skill) => !skill.is_free).length;
  const showAccessFilter = SHOW_MUDIKIT_IN_PORTAL && paidCount > 0;

  const filteredSkills = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return visibleSkills.filter((skill) => {
      if (accessFilter === "open" && !isAccessible(skill, access)) return false;
      if (accessFilter === "mudikit" && skill.is_free) return false;
      if (!needle) return true;

      return [skill.title, skill.description, skill.slug, skill.topic]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [access, accessFilter, query, visibleSkills]);

  const sections = useMemo(() => groupPortalSkills(filteredSkills), [filteredSkills]);

  return (
    <main>
      <div className="mx-auto w-full max-w-[1280px] px-5 pb-24 pt-10 sm:px-7 md:px-10 md:pt-12 lg:px-12">
        <header className="border-b border-white/[0.07] pb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-300/85">
            Portal library
          </p>
          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-[36px] font-semibold leading-none tracking-[-0.025em] text-white md:text-[44px]">
                Skills
              </h1>
              <p className="mt-3 max-w-[62ch] text-[14px] leading-[1.6] text-white/52">
                Complete packages organized by the work they help you finish. Open a skill to read its instructions, inspect every included file, or download the bundle.
              </p>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/38">
              {visibleSkills.length} approved packages
            </p>
          </div>
        </header>

        <nav
          aria-label="Skill sections"
          className="mt-7 grid gap-3 sm:grid-cols-2"
        >
          {PORTAL_SKILL_SECTIONS.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group flex min-h-20 items-center justify-between gap-5 rounded-xl border border-white/[0.07] bg-white/[0.015] px-5 py-4 outline-none transition-colors hover:border-white/[0.14] hover:bg-white/[0.025] focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-white/88">
                  {section.title}
                </span>
                <span className="mt-1 block text-[12px] leading-snug text-white/42">
                  {section.description}
                </span>
              </span>
              <span className="shrink-0 font-mono text-[11px] text-white/35">
                0{index + 1}
              </span>
            </a>
          ))}
        </nav>

        <section aria-label="Filter skills" className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.018] px-4 transition-colors focus-within:border-white/[0.15]">
              <Search className="size-4 shrink-0 text-white/38" aria-hidden="true" />
              <span className="sr-only">Search skills</span>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the approved skills"
                className="h-11 border-0 bg-transparent px-0 text-[14px] text-white placeholder:text-white/32 focus-visible:ring-0"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="min-h-11 shrink-0 px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 hover:text-white"
                >
                  Clear
                </button>
              ) : null}
            </label>

            {showAccessFilter ? (
              <div className="flex min-h-11 items-center rounded-xl border border-white/[0.07] bg-white/[0.018] p-1">
                {(["all", "open", "mudikit"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setAccessFilter(filter)}
                    className={`min-h-9 rounded-lg px-3 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors ${
                      accessFilter === filter
                        ? "bg-white/[0.09] text-white"
                        : "text-white/42 hover:text-white/75"
                    }`}
                  >
                    {filter === "mudikit" ? "MudiKit" : filter}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {sections.length > 0 ? (
          <div className="mt-12 space-y-16">
            {sections.map((section, sectionIndex) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
                aria-labelledby={`${section.id}-title`}
              >
                <div className="mb-6 grid gap-3 border-b border-white/[0.07] pb-5 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] md:items-end">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/32">
                      0{sectionIndex + 1} / {section.items.length} skills
                    </p>
                    <h2
                      id={`${section.id}-title`}
                      className="mt-2 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-white md:text-[31px]"
                    >
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-[13.5px] leading-[1.6] text-white/48 md:text-right">
                    {section.description}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {section.items.map((skill, skillIndex) => (
                    <SkillCard
                      key={skill.slug}
                      skill={skill}
                      access={access}
                      position={skillIndex + 1}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <section className="mt-12 rounded-xl border border-white/[0.07] px-6 py-14 text-center">
            <h2 className="text-[18px] font-semibold text-white">No matching skills</h2>
            <p className="mt-2 text-[13px] text-white/45">
              Clear the search or choose another access filter.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
