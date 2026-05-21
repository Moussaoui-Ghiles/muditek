"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Lock,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";
import { SHOW_MUDIKIT_IN_PORTAL } from "@/lib/portal-features";

type AccessFilter = "all" | "mudikit";

function isAccessible(skill: ContentItem, access: PortalAccess): boolean {
  if (skill.is_free) return true;
  return access.isMudikit || access.isAdmin;
}

function isRecent(skill: ContentItem, days = 30): boolean {
  if (!skill.created_at) return false;
  const created = new Date(skill.created_at).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < days * 24 * 60 * 60 * 1000;
}

function formatShortDate(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return typeof date === "string" ? date : "";
  return d.toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric" });
}

function accessLabel(skill: ContentItem, accessible: boolean): {
  text: string | null;
  tone: "included" | "mudikit" | "locked";
} {
  if (skill.is_free) return { text: null, tone: "included" };
  if (accessible) return { text: "MudiKit", tone: "mudikit" };
  return { text: "Locked", tone: "locked" };
}

function FeaturedSkill({
  skill,
  access,
}: {
  skill: ContentItem;
  access: PortalAccess;
}) {
  const accessible = isAccessible(skill, access);
  const label = accessLabel(skill, accessible);
  const isNew = isRecent(skill) && skill.is_new;

  return (
    <Link
      href={`/portal/skills/${encodeURIComponent(skill.slug)}`}
      className="group relative isolate flex flex-col gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-7 transition-all duration-300 hover:from-white/[0.06] md:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full bg-amber-400/[0.08] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-1/2 h-full bg-gradient-to-t from-amber-500/[0.05] via-transparent to-transparent"
      />

      <div className="relative flex items-center gap-2">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-amber-300/85">
          {isNew ? "New skill" : "Featured skill"}
        </span>
        {isNew && (
          <span className="relative inline-flex size-1.5 rounded-full bg-amber-400">
            <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-60" />
          </span>
        )}
      </div>

      <div className="relative">
        <h2 className="max-w-[20ch] text-[30px] font-semibold leading-[1.08] tracking-[-0.022em] text-white md:text-[38px]">
          {skill.title}
        </h2>
        {skill.description && (
          <p className="mt-3 max-w-[55ch] text-[14.5px] leading-[1.6] text-white/60">
            {skill.description}
          </p>
        )}
      </div>

      <div className="relative flex flex-wrap items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#0a0a0c] transition-all duration-200 group-hover:gap-3 group-hover:bg-amber-50">
          {accessible ? "Open skill" : "Preview"}
          <ArrowRight className="size-3.5" />
        </span>
        <div className="flex items-center gap-3 text-[12px] text-white/45">
          {skill.file_type && (
            <span className="font-mono uppercase tracking-[0.18em]">
              .{skill.file_type.toLowerCase()}
            </span>
          )}
          {label.text && (
            <span
              className={`font-mono uppercase tracking-[0.18em] ${
                label.tone === "mudikit" ? "text-amber-300/85" : "text-white/50"
              }`}
            >
              {label.text}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function EmptyFeatured() {
  return (
    <div className="relative isolate flex flex-col gap-4 overflow-hidden rounded-2xl bg-white/[0.02] p-7 md:p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full bg-amber-400/[0.06] blur-3xl"
      />
      <span className="relative font-mono text-[10.5px] uppercase tracking-[0.22em] text-amber-300/85">
        Skills
      </span>
      <h2 className="relative max-w-[20ch] text-[30px] font-semibold leading-[1.08] tracking-[-0.022em] text-white md:text-[38px]">
        The shelf opens with the first drop.
      </h2>
      <p className="relative max-w-[55ch] text-[14.5px] leading-[1.6] text-white/55">
        Each skill is a working asset for Claude, Codex, GTM, research, or
        outreach. When there is something ready to install, it lands here.
      </p>
    </div>
  );
}

function SkillCard({
  skill,
  access,
  index,
}: {
  skill: ContentItem;
  access: PortalAccess;
  index: number;
}) {
  const accessible = isAccessible(skill, access);
  const label = accessLabel(skill, accessible);
  const isNew = isRecent(skill) && skill.is_new;

  const accent =
    label.tone === "included"
      ? "from-emerald-400/[0.07]"
      : label.tone === "mudikit"
        ? "from-amber-400/[0.08]"
        : "from-sky-400/[0.06]";

  return (
    <Link
      href={`/portal/skills/${encodeURIComponent(skill.slug)}`}
      style={{ animationDelay: `${index * 45}ms` }}
      className={`skill-card-in group relative isolate flex h-full min-h-[196px] flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.035] md:p-7 ${accent} to-transparent`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-gradient-to-br ${accent} to-transparent blur-3xl`}
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/70 transition-colors group-hover:border-white/[0.16] group-hover:text-white">
            {accessible ? <Terminal className="size-4" /> : <Lock className="size-4" />}
          </span>
          <div className="flex items-center gap-2">
            {isNew && (
              <span className="relative inline-flex size-1.5 rounded-full bg-amber-400">
                <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-60" />
              </span>
            )}
            {label.text && (
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                  label.tone === "mudikit" ? "text-amber-300/85" : "text-white/45"
                }`}
              >
                {label.text}
              </span>
            )}
          </div>
        </div>

        <h3 className="mt-4 text-[17px] font-semibold leading-[1.25] tracking-[-0.015em] text-white">
          {skill.title}
        </h3>
        {skill.description && (
          <p className="mt-2 line-clamp-3 text-[13px] leading-[1.55] text-white/55">
            {skill.description}
          </p>
        )}
      </div>

      <div className="relative mt-6 flex items-center justify-between gap-3">
        <span className="min-w-0 truncate font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/30">
          skills/{skill.slug}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-medium text-white/70 transition-colors group-hover:text-amber-300/85">
          Open
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function RecentRow({
  skill,
  access,
}: {
  skill: ContentItem;
  access: PortalAccess;
}) {
  const accessible = isAccessible(skill, access);
  const label = accessLabel(skill, accessible);

  return (
    <li>
      <Link
        href={`/portal/skills/${encodeURIComponent(skill.slug)}`}
        className="group flex items-center justify-between gap-6 py-4 transition-colors hover:bg-white/[0.018]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[15px] font-medium leading-snug text-white">
              {skill.title}
            </p>
            {isRecent(skill) && skill.is_new && (
              <span className="relative inline-flex size-1.5 shrink-0 rounded-full bg-amber-400">
                <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-60" />
              </span>
            )}
          </div>
          <p className="mt-1 text-[12.5px] text-white/40">
            {label.text && <>{label.text} · </>}
            {skill.file_type ? `.${skill.file_type.toLowerCase()}` : "skill"}
            {skill.created_at ? ` · ${formatShortDate(skill.created_at)}` : ""}
          </p>
        </div>
        <ArrowRight className="size-4 shrink-0 text-white/25 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-amber-300/85" />
      </Link>
    </li>
  );
}

function LockedTeaser({ count }: { count: number }) {
  return (
    <Link
      href="/portal/mudikit"
      className="group relative isolate mt-14 flex flex-col gap-5 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400/[0.06] via-white/[0.02] to-transparent p-7 transition-all duration-300 hover:from-amber-400/[0.09] sm:flex-row sm:items-center sm:justify-between md:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-amber-400/[0.1] blur-3xl"
      />
      <div className="relative min-w-0">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-amber-300/85">
          MudiKit · locked
        </span>
        <h3 className="mt-2 max-w-[28ch] text-[22px] font-semibold leading-[1.15] tracking-[-0.015em] text-white">
          {count} {count === 1 ? "skill needs" : "skills need"} MudiKit.
        </h3>
        <p className="mt-2 max-w-md text-[13.5px] leading-[1.55] text-white/55">
          MudiKit drops every paid skill into your shelf, plus everything new as it ships.
          One subscription, no per-asset friction.
        </p>
      </div>
      <span className="relative inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#0a0a0c] transition-all duration-200 group-hover:gap-3 group-hover:bg-amber-50">
        Unlock MudiKit
        <ArrowUpRight className="size-3.5" />
      </span>
    </Link>
  );
}

const skillsKeyframes = `
  @keyframes skillCardIn {
    0% { opacity: 0; transform: translateY(8px) scale(0.985); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  .skill-card-in {
    opacity: 0;
    animation: skillCardIn 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @media (prefers-reduced-motion: reduce) {
    .skill-card-in { animation: none; opacity: 1; }
  }
`;

export default function SkillsContent({
  skills,
  access,
}: {
  skills: ContentItem[];
  access: PortalAccess;
  email: string;
  displayName: string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AccessFilter>("all");
  const visibleSkills = useMemo(
    () => (SHOW_MUDIKIT_IN_PORTAL ? skills : skills.filter((skill) => skill.is_free)),
    [skills]
  );

  const total = visibleSkills.length;
  const freeCount = useMemo(() => visibleSkills.filter((s) => s.is_free).length, [visibleSkills]);
  const paidCount = total - freeCount;
  const newCount = useMemo(
    () => visibleSkills.filter((s) => s.is_new && isRecent(s)).length,
    [visibleSkills]
  );
  const lockedCount = useMemo(
    () => visibleSkills.filter((s) => !s.is_free && !(access.isMudikit || access.isAdmin)).length,
    [visibleSkills, access]
  );

  const featured: ContentItem | null = useMemo(() => {
    if (access.isMudikit || access.isAdmin) {
      return visibleSkills.find((s) => isRecent(s) && s.is_new) ?? visibleSkills[0] ?? null;
    }
    return visibleSkills.find((s) => s.is_free) ?? visibleSkills[0] ?? null;
  }, [visibleSkills, access]);

  const newest = useMemo(() => {
    return [...visibleSkills]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .filter((s) => s.id !== featured?.id)
      .slice(0, 4);
  }, [visibleSkills, featured]);

  const showAccessFilter = freeCount > 0 && paidCount > 0;
  const showSearch = total >= 5;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return visibleSkills.filter((skill) => {
      if (filter === "mudikit" && skill.is_free) return false;
      if (!needle) return true;
      const haystack = [skill.title, skill.description, skill.file_type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [visibleSkills, filter, query]);

  // When idle (no search/filter), hide featured from the grid below to avoid duplication
  const gridSkills = useMemo(() => {
    if (query || filter !== "all" || !featured) return filtered;
    return filtered.filter((s) => s.id !== featured.id);
  }, [filtered, featured, query, filter]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: skillsKeyframes }} />

      <main className="relative">
        <div className="mx-auto w-full max-w-[1340px] px-6 pb-24 pt-10 md:px-10 md:pt-12 lg:px-14">
          {/* Header strip */}
          <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.06] pb-7">
            <div>
              <h1 className="text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[44px]">
                Skills
              </h1>
              <p className="mt-2 max-w-[60ch] text-[14px] text-white/45">
                Working assets you can drop into Claude, Codex, GTM motions, research and outreach.
                Open skills come with every portal account.
              </p>
            </div>
            <div className="flex items-center gap-5 text-[12px] text-white/40">
              <span className="flex items-baseline gap-1.5">
                <span className="text-[18px] font-semibold tabular-nums text-white/85">{total}</span>
                <span className="font-mono uppercase tracking-[0.16em]">Total</span>
              </span>
              {(access.isMudikit || access.isAdmin) && paidCount > 0 ? (
                <span className="flex items-baseline gap-1.5">
                  <span className="text-[18px] font-semibold tabular-nums text-amber-300/85">{paidCount}</span>
                  <span className="font-mono uppercase tracking-[0.16em]">MudiKit</span>
                </span>
              ) : (
                lockedCount > 0 && (
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-[18px] font-semibold tabular-nums text-amber-300/85">{lockedCount}</span>
                    <span className="font-mono uppercase tracking-[0.16em]">Locked</span>
                  </span>
                )
              )}
            </div>
          </header>

          {/* HERO */}
          <section className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] lg:gap-7">
            {featured ? <FeaturedSkill skill={featured} access={access} /> : <EmptyFeatured />}

            <aside className="flex flex-col gap-7 rounded-2xl bg-white/[0.018] p-7">
              <div>
                <h3 className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/40">
                  What&apos;s inside
                </h3>
                <p className="mt-3 text-[14px] leading-[1.6] text-white/75">
                  Each skill is a self-contained markdown asset with prompts, frameworks,
                  and rules, ready to install in any session.
                </p>
                {newCount > 0 && (
                  <p className="mt-3 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-amber-300/85">
                    <span className="relative inline-flex size-1.5 rounded-full bg-amber-400">
                      <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-60" />
                    </span>
                    {newCount} new in the last 30 days
                  </p>
                )}
              </div>

              {newest.length > 0 && (
                <div className="border-t border-white/[0.06] pt-6">
                  <h3 className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/40">
                    Newest
                  </h3>
                  <ul className="mt-4 space-y-3.5">
                    {newest.map((skill) => {
                      const accessible = isAccessible(skill, access);
                      return (
                        <li key={skill.id}>
                          <Link
                            href={`/portal/skills/${encodeURIComponent(skill.slug)}`}
                            className="group block"
                          >
                            <div className="flex items-center gap-1.5">
                              <p className="line-clamp-1 text-[14px] font-medium leading-snug text-white/85 transition-colors group-hover:text-white">
                                {skill.title}
                              </p>
                              {!accessible && <Lock className="size-3 shrink-0 text-white/35" />}
                            </div>
                            <p className="mt-0.5 text-[11.5px] text-white/40">
                              {!skill.is_free && (accessible ? "MudiKit · " : "Locked · ")}
                              {skill.created_at
                                ? formatShortDate(skill.created_at)
                                : ""}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </aside>
          </section>

          {/* CONTROLS */}
          {total > 0 && (showSearch || showAccessFilter) && (
            <section className="mt-14">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {showSearch ? (
                  <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/[0.018] px-4 transition-colors focus-within:bg-white/[0.03]">
                    <Search className="size-4 shrink-0 text-white/40" />
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search skills, file types, descriptions..."
                      className="h-11 w-full border-0 bg-transparent px-0 text-[14px] text-white placeholder:text-white/35 focus-visible:ring-0"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/40 transition-colors hover:text-white"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/40">
                    {total} {total === 1 ? "skill" : "skills"}
                  </span>
                )}
                {showAccessFilter && (
                  <div className="inline-flex max-w-full flex-wrap rounded-xl bg-white/[0.018] p-1">
                    {(["all", "mudikit"] as AccessFilter[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        className={`rounded-lg px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.12em] transition-all duration-200 ${
                          filter === f
                            ? "bg-white/[0.09] text-white"
                            : "text-white/45 hover:text-white/80"
                        }`}
                      >
                        {f === "all" ? "All" : "MudiKit only"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* GRID + RECENT LIST */}
          {total > 0 ? (
            filtered.length === 0 ? (
              <section className="mt-10 rounded-2xl bg-white/[0.012] p-10 text-center">
                <p className="text-[13.5px] text-white/55">
                  Nothing matches{" "}
                  {query ? (
                    <>
                      &ldquo;<span className="text-white">{query}</span>&rdquo;
                    </>
                  ) : (
                    "this filter"
                  )}
                  .
                </p>
              </section>
            ) : (
              <section className={total > 0 && (showSearch || showAccessFilter) ? "mt-6" : "mt-14"}>
                {gridSkills.length > 0 && (
                  <>
                    <div className="mb-5 flex items-baseline justify-between">
                      <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-white">
                        {query || filter !== "all" ? "Matches" : "All skills"}
                      </h2>
                      <p className="text-[13px] text-white/40">
                        {gridSkills.length} {gridSkills.length === 1 ? "skill" : "skills"}
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {gridSkills.map((skill, idx) => (
                        <SkillCard
                          key={skill.id}
                          skill={skill}
                          access={access}
                          index={idx}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Recent stream and activity aside */}
                {!query && filter === "all" && visibleSkills.length >= 4 && (
                  <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-10">
                    <div>
                      <div className="mb-4 flex items-baseline justify-between">
                        <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-white">
                          Recent
                        </h2>
                        <span className="text-[13px] text-white/40">By date</span>
                      </div>
                      <ul className="divide-y divide-white/[0.05]">
                        {[...visibleSkills]
                          .sort(
                            (a, b) =>
                              new Date(b.created_at).getTime() -
                              new Date(a.created_at).getTime()
                          )
                          .slice(0, 7)
                          .map((skill) => (
                            <RecentRow key={skill.id} skill={skill} access={access} />
                          ))}
                      </ul>
                    </div>

                    <aside className="self-start rounded-2xl bg-white/[0.018] p-7">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-3.5 text-amber-300/85" />
                        <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/40">
                          Activity
                        </h2>
                      </div>
                      <ul className="mt-5 space-y-4">
                        <li>
                          <p className="text-[14px] font-medium leading-snug text-white/85">
                            {total} {total === 1 ? "skill" : "skills"} on the shelf
                          </p>
                          <p className="mt-0.5 text-[12px] text-white/40">
                            {SHOW_MUDIKIT_IN_PORTAL ? `${freeCount} open · ${paidCount} MudiKit` : `${freeCount} open`}
                          </p>
                        </li>
                        {newCount > 0 && (
                          <li>
                            <p className="text-[14px] font-medium leading-snug text-white/85">
                              {newCount} {newCount === 1 ? "drop" : "drops"} in the last 30 days
                            </p>
                            <p className="mt-0.5 text-[12px] text-white/40">
                              Fresh additions marked with an amber dot
                            </p>
                          </li>
                        )}
                        {!access.isMudikit && !access.isAdmin && lockedCount > 0 && (
                          <li>
                            <p className="text-[14px] font-medium leading-snug text-white/85">
                              {lockedCount} {lockedCount === 1 ? "is" : "are"} sitting behind MudiKit
                            </p>
                            <p className="mt-0.5 text-[12px] text-white/40">
                              One unlock, every paid skill, plus future drops
                            </p>
                          </li>
                        )}
                      </ul>
                    </aside>
                  </div>
                )}
              </section>
            )
          ) : null}

          {!access.isMudikit && !access.isAdmin && lockedCount > 0 && (
            <LockedTeaser count={lockedCount} />
          )}
        </div>
      </main>
    </>
  );
}
