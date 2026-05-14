"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Lock,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";

type AccessFilter = "all" | "free" | "mudikit";

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

function SkillThumb({
  skill,
  accessible,
  size = "md",
}: {
  skill: ContentItem;
  accessible: boolean;
  size?: "md" | "lg";
}) {
  const sizing = size === "lg" ? "h-32 sm:h-40" : "h-24";
  if (skill.thumbnail_url) {
    return (
      <div className={`relative ${sizing} w-full overflow-hidden rounded-md border border-white/[0.06]`}>
        <img
          src={skill.thumbnail_url}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.03]"
          loading="lazy"
        />
        {!accessible && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
            <Lock className="size-4 text-white/85" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative ${sizing} w-full overflow-hidden rounded-md border border-white/[0.06]`}
      style={{
        background:
          "radial-gradient(120% 90% at 18% 12%, rgba(255,255,255,0.10), transparent 52%), linear-gradient(135deg, rgba(255,255,255,0.045), rgba(255,255,255,0.005))",
      }}
    >
      <div className="absolute inset-0 opacity-[0.18] mix-blend-overlay [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.5)_0px,rgba(255,255,255,0.5)_1px,transparent_1px,transparent_3px)]" />
      <div className="absolute bottom-3 left-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
          {skill.file_type ? `.${skill.file_type.toLowerCase()}` : "skill"}
        </span>
      </div>
      <div className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full border border-white/[0.10] bg-black/35 text-white/70">
        {accessible ? <Terminal className="size-3.5" /> : <Lock className="size-3.5" />}
      </div>
    </div>
  );
}

function SkillCard({
  skill,
  access,
  index,
  variant = "standard",
}: {
  skill: ContentItem;
  access: PortalAccess;
  index: number;
  variant?: "feature" | "standard" | "compact";
}) {
  const accessible = isAccessible(skill, access);
  const new30d = isRecent(skill) && skill.is_new;

  if (variant === "compact") {
    return (
      <Link
        href={`/portal/skills/${encodeURIComponent(skill.slug)}`}
        style={{ animationDelay: `${index * 55}ms` }}
        className="group/card skill-card-in relative flex items-center gap-3.5 rounded-lg border border-white/[0.06] bg-white/[0.018] p-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.035]"
      >
        <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/[0.06] bg-white/[0.02]">
          {skill.thumbnail_url ? (
            <img src={skill.thumbnail_url} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : accessible ? (
            <Terminal className="size-4 text-white/65" />
          ) : (
            <Lock className="size-4 text-white/55" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[13.5px] font-medium text-foreground">{skill.title}</h3>
            {new30d && (
              <span className="relative inline-flex size-1.5 shrink-0 rounded-full bg-amber-400">
                <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-60" />
              </span>
            )}
          </div>
          {skill.description && (
            <p className="mt-0.5 line-clamp-1 text-[12px] leading-5 text-muted-foreground">
              {skill.description}
            </p>
          )}
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          {skill.file_type && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
              .{skill.file_type.toLowerCase()}
            </span>
          )}
          {!skill.is_free && !accessible && (
            <Lock className="size-3.5 text-white/45" />
          )}
        </div>
      </Link>
    );
  }

  const isFeature = variant === "feature";

  return (
    <Link
      href={`/portal/skills/${encodeURIComponent(skill.slug)}`}
      style={{ animationDelay: `${index * 65}ms` }}
      className={`group/card skill-card-in relative flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.018] p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.035] ${
        isFeature ? "min-h-72" : "min-h-56"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(640px circle at var(--mx,50%) var(--my,0%), rgba(245,158,11,0.07), transparent 42%)",
        }}
      />
      <SkillThumb skill={skill} accessible={accessible} size={isFeature ? "lg" : "md"} />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`truncate font-semibold tracking-tight text-foreground ${
                isFeature ? "text-[18px]" : "text-[15px]"
              }`}
            >
              {skill.title}
            </h3>
            {new30d && (
              <span className="relative inline-flex size-1.5 shrink-0 rounded-full bg-amber-400">
                <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-60" />
              </span>
            )}
          </div>
          {skill.description && (
            <p
              className={`mt-1.5 leading-5 text-muted-foreground ${
                isFeature ? "line-clamp-3 text-[13.5px]" : "line-clamp-2 text-[12.5px]"
              }`}
            >
              {skill.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          {skill.file_type && (
            <span className="rounded-md border border-white/[0.08] bg-black/20 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65">
              .{skill.file_type.toLowerCase()}
            </span>
          )}
          <span
            className={`text-[10.5px] font-medium uppercase tracking-[0.16em] ${
              skill.is_free
                ? "text-emerald-300/85"
                : accessible
                  ? "text-amber-300/85"
                  : "text-white/45"
            }`}
          >
            {skill.is_free ? "Free" : accessible ? "MudiKit" : "Locked"}
          </span>
        </div>
        <span className="flex size-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-white/55 transition-all duration-300 group-hover/card:border-white/[0.22] group-hover/card:bg-white/[0.06] group-hover/card:text-foreground group-hover/card:translate-x-0.5">
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] p-10">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(60% 70% at 20% 0%, rgba(255,255,255,0.05), transparent 55%)",
        }}
      />
      <div className="relative max-w-md">
        <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/70">
          <Sparkles className="size-4" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          The shelf is empty — for now
        </h3>
        <p className="mt-2 text-[13.5px] leading-6 text-muted-foreground">
          Skills land here as they ship. Nothing fake gets seeded — when there is
          something real to install, it shows up.
        </p>
      </div>
    </div>
  );
}

function LockedTeaser({ count }: { count: number }) {
  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(40% 80% at 95% 50%, rgba(245,158,11,0.10), transparent 55%)",
        }}
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-300/85">
            MudiKit · locked
          </span>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
            {count} {count === 1 ? "skill is" : "skills are"} sitting behind the
            membrane.
          </h3>
          <p className="mt-1.5 max-w-md text-[13px] leading-6 text-muted-foreground">
            MudiKit drops every paid skill into your shelf, plus everything new
            as it ships. One subscription, no per-asset friction.
          </p>
        </div>
        <Button render={<Link href="/buy" />} nativeButton={false} size="lg">
          Unlock MudiKit
          <ArrowUpRight className="size-4" />
        </Button>
      </div>
    </div>
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
  email,
  displayName,
}: {
  skills: ContentItem[];
  access: PortalAccess;
  email: string;
  displayName: string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AccessFilter>("all");

  const total = skills.length;
  const freeCount = useMemo(() => skills.filter((s) => s.is_free).length, [skills]);
  const paidCount = total - freeCount;
  const newCount = useMemo(
    () => skills.filter((s) => s.is_new && isRecent(s)).length,
    [skills]
  );
  const lockedCount = useMemo(
    () => skills.filter((s) => !s.is_free && !(access.isMudikit || access.isAdmin)).length,
    [skills, access]
  );

  const showAccessFilter = freeCount > 0 && paidCount > 0;
  const showSearch = total >= 5;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return skills.filter((skill) => {
      if (filter === "free" && !skill.is_free) return false;
      if (filter === "mudikit" && skill.is_free) return false;
      if (!needle) return true;
      const haystack = [skill.title, skill.description, skill.file_type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [skills, filter, query]);

  // Bento split: when 6+ items and no active filter, feature first 1, grid next 4, list the rest
  const showBento = filtered.length >= 6 && !query && filter === "all";
  const featured = showBento ? filtered[0] : null;
  const gridItems = showBento ? filtered.slice(1, 5) : filtered.slice(0, 8);
  const remaining = showBento ? filtered.slice(5) : filtered.slice(8);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: skillsKeyframes }} />

      <main className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Hero */}
        <section className="relative mb-9 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] px-5 py-7 sm:px-8 sm:py-9">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 100% at 12% 0%, rgba(245,158,11,0.08), transparent 55%), radial-gradient(40% 80% at 90% 100%, rgba(255,255,255,0.04), transparent 60%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay [background-image:repeating-linear-gradient(45deg,#fff_0px,#fff_1px,transparent_1px,transparent_4px)]" />
          <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-300/85">
                <span className="relative inline-flex size-1.5 rounded-full bg-amber-400">
                  <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-60" />
                </span>
                Operator Shelf
              </div>
              <h1 className="mt-3 text-[34px] font-semibold leading-[0.95] tracking-[-0.035em] text-foreground sm:text-[44px] md:text-5xl">
                Skills you can drop
                <br className="hidden sm:block" />
                into any session.
              </h1>
              <p className="mt-4 max-w-xl text-[14px] leading-6 text-muted-foreground">
                Each skill is a working asset — for Claude, Codex, GTM motions,
                research and outreach. Free skills come with every portal account.
                MudiKit unlocks the rest.
              </p>
            </div>

            {total > 0 && (
              <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]">
                <StatCell label="Total" value={total} />
                <StatCell label="Free" value={freeCount} accent="emerald" />
                <StatCell
                  label={access.isMudikit || access.isAdmin ? "MudiKit" : "Locked"}
                  value={access.isMudikit || access.isAdmin ? paidCount : lockedCount}
                  accent="amber"
                />
                {newCount > 0 && (
                  <div className="col-span-3 border-t border-white/[0.06] bg-black/15 px-4 py-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300/85">
                      {newCount} new in the last 30 days
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {total === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Controls */}
            {(showSearch || showAccessFilter) && (
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {showSearch ? (
                  <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.018] px-3 transition-colors focus-within:border-white/[0.18]">
                    <Search className="size-4 shrink-0 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search skills, file types, descriptions…"
                      className="h-10 w-full border-0 bg-transparent px-0 text-[13.5px] focus-visible:ring-0"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {total} {total === 1 ? "skill" : "skills"}
                  </span>
                )}
                {showAccessFilter && (
                  <div className="inline-flex rounded-lg border border-white/[0.07] bg-white/[0.015] p-0.5">
                    {(["all", "free", "mudikit"] as AccessFilter[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        className={`rounded-md px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.12em] transition-all duration-200 ${
                          filter === f
                            ? "bg-white/[0.09] text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {f === "all" ? "All" : f === "free" ? "Free" : "MudiKit"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.012] p-10 text-center">
                <p className="text-[13.5px] text-muted-foreground">
                  Nothing matches{" "}
                  {query ? (
                    <>
                      “<span className="text-foreground">{query}</span>”
                    </>
                  ) : (
                    "this filter"
                  )}
                  .
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Featured + bento */}
                {showBento && featured && (
                  <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                    <SkillCard skill={featured} access={access} index={0} variant="feature" />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                      {gridItems.slice(0, 2).map((skill, idx) => (
                        <SkillCard
                          key={skill.id}
                          skill={skill}
                          access={access}
                          index={idx + 1}
                          variant="standard"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {showBento && gridItems.length > 2 && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {gridItems.slice(2).map((skill, idx) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        access={access}
                        index={idx + 3}
                        variant="standard"
                      />
                    ))}
                  </div>
                )}

                {!showBento && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {gridItems.map((skill, idx) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        access={access}
                        index={idx}
                        variant="standard"
                      />
                    ))}
                  </div>
                )}

                {remaining.length > 0 && (
                  <section>
                    <div className="mb-3 flex items-end justify-between border-b border-white/[0.06] pb-3">
                      <h2 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                        More on the shelf
                      </h2>
                      <span className="font-mono text-[10.5px] tabular-nums text-muted-foreground/70">
                        {remaining.length}
                      </span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {remaining.map((skill, idx) => (
                        <SkillCard
                          key={skill.id}
                          skill={skill}
                          access={access}
                          index={idx + gridItems.length + 1}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {!access.isMudikit && !access.isAdmin && lockedCount > 0 && filter !== "free" && (
              <LockedTeaser count={lockedCount} />
            )}
          </>
        )}
      </main>
    </>
  );
}

function StatCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "emerald" | "amber";
}) {
  const accentClass =
    accent === "emerald"
      ? "text-emerald-300/90"
      : accent === "amber"
        ? "text-amber-300/90"
        : "text-foreground";
  return (
    <div className="bg-black/15 px-4 py-3">
      <div className={`text-[22px] font-semibold tabular-nums leading-none tracking-tight ${accentClass}`}>
        {value}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
