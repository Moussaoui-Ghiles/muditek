"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookText,
  ChevronRight,
  Mail,
  Newspaper,
  Package,
  Search,
  Sparkles,
  Wand2,
  Wrench,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PortalAccess } from "@/lib/portal-access";

export interface ArchiveIssue {
  slug: string;
  subject: string;
  sent_at: string | null;
  preview: string | null;
  thumbnailUrl: string | null;
}

interface Props {
  email: string;
  displayName: string;
  access: PortalAccess;
  issues: ArchiveIssue[];
  preferencesHref: string | null;
}

function formatLong(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatMonthDay(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "2-digit",
  });
}

function fallbackCoverSrc(issue: ArchiveIssue): string {
  const safeSubject = issue.subject
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const shortSubject =
    safeSubject.length > 76 ? `${safeSubject.slice(0, 73).trim()}...` : safeSubject;
  const date = formatMonthDay(issue.sent_at).toUpperCase();
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="675" viewBox="0 0 900 675">
  <rect width="900" height="675" fill="#0a0a0c"/>
  <rect x="1" y="1" width="898" height="673" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
  <circle cx="760" cy="74" r="260" fill="rgba(245,158,11,0.16)"/>
  <circle cx="88" cy="660" r="220" fill="rgba(255,255,255,0.055)"/>
  <path d="M64 88H256" stroke="rgba(245,158,11,0.78)" stroke-width="4"/>
  <text x="64" y="150" fill="rgba(255,255,255,0.58)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="24" font-weight="800" letter-spacing="7">NEWSLETTER ARTICLE</text>
  <foreignObject x="64" y="208" width="720" height="230">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #f5f5f7; font-size: 54px; line-height: 1.02; letter-spacing: -1.6px; font-weight: 900;">${shortSubject}</div>
  </foreignObject>
  <text x="64" y="584" fill="rgba(255,255,255,0.46)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" font-weight="800" letter-spacing="6">${date || "MUDITEK"}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function IssueCover({ issue, compact = false }: { issue: ArchiveIssue; compact?: boolean }) {
  if (issue.thumbnailUrl) {
    return (
      <div className={compact ? "relative size-16 overflow-hidden rounded-md border border-white/[0.08]" : "relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.08]"}>
        <img src={issue.thumbnailUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
      </div>
    );
  }

  return (
    <div className={compact ? "relative size-16 overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.025]" : "relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]"}>
      <img src={fallbackCoverSrc(issue)} alt="" className="h-full w-full object-cover" loading="lazy" />
      <div className={compact ? "absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/65" : "absolute inset-0 flex flex-col justify-between p-5"}>
        {compact ? (
          <span className="rounded-full bg-black/45 px-2 py-1 backdrop-blur">Article</span>
        ) : (
          <>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/55">
              Newsletter article
            </span>
            <span className="line-clamp-3 text-[19px] font-black leading-[1.1] tracking-[-0.02em] text-foreground">
              {issue.subject}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function readTime(text: string | null): string | null {
  if (!text) return null;
  const words = text.trim().split(/\s+/).length;
  if (words < 8) return null;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min`;
}

type YearBucket = {
  year: string;
  count: number;
  items: ArchiveIssue[];
};

function bucketByYear(issues: ArchiveIssue[]): YearBucket[] {
  const map = new Map<string, ArchiveIssue[]>();
  for (const issue of issues) {
    const year = issue.sent_at ? new Date(issue.sent_at).getUTCFullYear().toString() : "Undated";
    const list = map.get(year);
    if (list) list.push(issue);
    else map.set(year, [issue]);
  }
  return Array.from(map.entries())
    .map(([year, items]) => ({
      year,
      count: items.length,
      items,
    }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

function FeaturedIssue({
  issue,
  total,
  index,
}: {
  issue: ArchiveIssue;
  total: number;
  index: number;
}) {
  const minutes = readTime(issue.preview);
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0f0f12]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(720px 360px at 100% -10%, rgba(255,255,255,0.06), transparent 60%), radial-gradient(560px 320px at -10% 90%, rgba(245,158,11,0.08), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(transparent 31px, rgba(255,255,255,0.6) 32px), linear-gradient(90deg, transparent 31px, rgba(255,255,255,0.6) 32px)",
          backgroundSize: "32px 32px",
        }}
      />

      <Link href={`/portal/newsletter/${encodeURIComponent(issue.slug)}`} className="group relative block">
        <div className="grid gap-8 px-6 py-10 sm:px-10 sm:py-14 md:grid-cols-[1.05fr_0.95fr] md:items-end">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <span className="relative inline-flex size-1.5 rounded-full bg-amber-200/95 shadow-[0_0_12px_rgba(252,211,77,0.5)]">
                <span
                  aria-hidden
                  className="absolute inset-0 animate-ping rounded-full bg-amber-200/60"
                />
              </span>
              Latest article · No. {String(total - index).padStart(3, "0")}
            </div>

            <h2 className="mt-4 max-w-[20ch] font-[family-name:var(--font-serif-display)] text-balance text-[36px] font-normal leading-[1.02] tracking-tight text-foreground transition-colors group-hover:text-white sm:text-[44px] md:text-[52px]">
              {issue.subject}
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-muted-foreground">
              {issue.sent_at && <span>{formatLong(issue.sent_at)}</span>}
              {issue.sent_at && minutes && <span aria-hidden className="text-muted-foreground/50">·</span>}
              {minutes && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-muted-foreground/40" />
                  {minutes} read
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <IssueCover issue={issue} />
            {issue.preview && (
              <p className="mt-5 line-clamp-3 max-w-[44ch] text-[15px] leading-7 text-muted-foreground/95">
                &ldquo;{issue.preview}&rdquo;
              </p>
            )}
            <div className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-foreground/85 transition-colors group-hover:text-white">
              Read article
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

function YearRail({
  buckets,
  active,
  onSelect,
}: {
  buckets: YearBucket[];
  active: string;
  onSelect: (year: string) => void;
}) {
  return (
    <nav className="sticky top-20 hidden self-start lg:block">
      <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Archive
      </p>
      <ol className="space-y-1.5 text-[12.5px]">
        <li>
          <button
            type="button"
            onClick={() => onSelect("all")}
            className={
              "group flex w-full items-baseline justify-between rounded-md px-2 py-1.5 text-left transition-colors " +
              (active === "all"
                ? "bg-white/[0.05] text-foreground"
                : "text-muted-foreground hover:bg-white/[0.025] hover:text-foreground")
            }
          >
            <span className="font-medium">All articles</span>
            <span className="font-mono tabular-nums text-[11px]">
              {buckets.reduce((acc, b) => acc + b.count, 0)}
            </span>
          </button>
        </li>
        {buckets.map((bucket) => (
          <li key={bucket.year}>
            <button
              type="button"
              onClick={() => onSelect(bucket.year)}
              className={
                "group flex w-full items-baseline justify-between rounded-md px-2 py-1.5 text-left transition-colors " +
                (active === bucket.year
                  ? "bg-white/[0.05] text-foreground"
                  : "text-muted-foreground hover:bg-white/[0.025] hover:text-foreground")
              }
            >
              <span className="font-mono tabular-nums">{bucket.year}</span>
              <span className="font-mono tabular-nums text-[11px]">{bucket.count}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function IssueRow({
  issue,
  index,
  total,
}: {
  issue: ArchiveIssue;
  index: number;
  total: number;
}) {
  const minutes = readTime(issue.preview);
  return (
    <Link
      href={`/portal/newsletter/${encodeURIComponent(issue.slug)}`}
      className="group relative grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-x-5 border-t border-white/[0.05] py-5 transition-colors hover:bg-white/[0.012] sm:grid-cols-[88px_minmax(0,1fr)_auto]"
    >
      <span
        aria-hidden
        className="absolute -left-px top-0 h-full w-px bg-foreground/0 transition-colors group-hover:bg-foreground/40"
      />
      <span className="flex flex-col gap-2">
        <IssueCover issue={issue} compact />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground/70 tabular-nums">
          {formatMonthDay(issue.sent_at)}
        </span>
      </span>

      <span className="min-w-0">
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55">
          Newsletter article · No. {String(total - index).padStart(3, "0")}
        </span>
        <span className="block text-balance text-[18px] font-semibold leading-snug tracking-[-0.005em] text-foreground transition-colors group-hover:text-white sm:text-[19px]">
          {issue.subject}
        </span>
        {issue.preview && (
          <span className="mt-2 line-clamp-2 max-w-[62ch] text-[13.5px] leading-6 text-muted-foreground">
            {issue.preview}
          </span>
        )}
      </span>

      <span className="flex flex-col items-end gap-2 self-center text-[11px] text-muted-foreground">
        {minutes && (
          <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 font-mono tabular-nums">
            {minutes}
          </span>
        )}
        <ArrowUpRight className="size-4 text-muted-foreground/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
      </span>
    </Link>
  );
}

function PointerCard({
  href,
  title,
  body,
  icon,
}: {
  href: string;
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] p-4 transition-colors hover:border-white/[0.14] hover:bg-white/[0.04]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.03] text-muted-foreground transition-colors group-hover:text-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-foreground">{title}</span>
        <span className="block text-[11.5px] leading-5 text-muted-foreground">{body}</span>
      </span>
      <ChevronRight className="mt-0.5 size-3.5 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}

function EmptyState() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.012] px-8 py-14 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
        <Sparkles className="size-5" />
      </div>
      <h2 className="text-[20px] font-semibold tracking-tight text-foreground">
        Archive will fill here
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-6 text-muted-foreground">
        Once the next article sends, you&rsquo;ll be able to browse it from this page.
      </p>
    </section>
  );
}

export default function NewsletterArchiveContent({
  email,
  displayName,
  access,
  issues,
  preferencesHref,
}: Props) {
  const [query, setQuery] = useState("");
  const [activeYear, setActiveYear] = useState<string>("all");

  const buckets = useMemo(() => bucketByYear(issues), [issues]);
  const total = issues.length;
  const latest = issues[0];

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return issues
      .map((issue, idx) => ({ issue, originalIndex: idx }))
      .filter(({ issue }) => {
        if (activeYear !== "all") {
          const y = issue.sent_at ? new Date(issue.sent_at).getUTCFullYear().toString() : "Undated";
          if (y !== activeYear) return false;
        }
        if (!needle) return true;
        const hay = `${issue.subject} ${issue.preview ?? ""}`.toLowerCase();
        return hay.includes(needle);
      });
  }, [issues, activeYear, query]);

  const filteredCount = filtered.length;
  const showSearch = total >= 6;

  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Past editions
            </p>
            <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-[34px]">
              Muditek{" "}
              <span className="font-[family-name:var(--font-serif-display)] italic font-normal text-foreground/85">
                newsletter
              </span>
            </h1>
            <p className="mt-2 max-w-xl text-[13.5px] leading-6 text-muted-foreground">
              Articles from the newsletter, cleaned into a portal archive so resources and internal links stay connected.
            </p>
          </div>
        </div>

        {total === 0 ? (
          <div className="mt-8">
            <EmptyState />
          </div>
        ) : (
          <>
            {latest && (
              <div className="mt-8">
                <FeaturedIssue issue={latest} total={total} index={0} />
              </div>
            )}

            <div className="mt-10 grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)]">
              <YearRail buckets={buckets} active={activeYear} onSelect={setActiveYear} />

              <section className="min-w-0">
                <header className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                      {activeYear === "all" ? "All articles" : activeYear}
                    </h2>
                    <span className="text-[11.5px] font-mono tabular-nums text-muted-foreground">
                      {filteredCount} of {total}
                    </span>
                  </div>
                  {showSearch && (
                    <div className="flex w-full items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 sm:w-72">
                      <Search className="size-3.5 shrink-0 text-muted-foreground" />
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search articles"
                        className="h-8 w-full border-0 bg-transparent px-0 text-[12.5px] focus-visible:ring-0"
                      />
                    </div>
                  )}
                </header>

                {filteredCount === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.012] px-6 py-10 text-center text-[13px] text-muted-foreground">
                    No articles match this filter.
                  </div>
                ) : (
                  <ol className="border-b border-white/[0.05]">
                    {filtered.map(({ issue, originalIndex }) => (
                      <li key={issue.slug}>
                        <IssueRow issue={issue} index={originalIndex} total={total} />
                      </li>
                    ))}
                  </ol>
                )}

                <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.012] p-5">
                  <header className="mb-3 flex items-center justify-between">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Library
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      Newsletter points back to the kit
                    </span>
                  </header>
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                    <PointerCard
                      href="/portal/skills"
                      title="Skills"
                      body="Operator skills on this account."
                      icon={<Wand2 className="size-4" />}
                    />
                    <PointerCard
                      href="/portal/playbooks"
                      title="Playbooks & guides"
                      body="Included systems and guides."
                      icon={<BookText className="size-4" />}
                    />
                    <PointerCard
                      href="/portal/tools"
                      title="Tools"
                      body="Calculators and scorecards."
                      icon={<Wrench className="size-4" />}
                    />
                    <PointerCard
                      href="/portal/mudikit"
                      title="MudiKit"
                      body="Paid library and access."
                      icon={<Package className="size-4" />}
                    />
                  </div>
                </section>
              </section>
            </div>
          </>
        )}

        {latest && (
          <section className="mt-10 flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.03] text-muted-foreground">
                <Mail className="size-4" />
              </span>
              <div className="min-w-0">
                <div className="break-all text-[13px] font-medium text-foreground">Subscribed as {email}</div>
                <p className="mt-0.5 text-[11.5px] leading-5 text-muted-foreground">
                  Next article lands in your inbox. Reading in-portal keeps everything in one place.
                </p>
              </div>
            </div>
            <Link
              href={preferencesHref ?? "/portal/account"}
              className="inline-flex items-center gap-1.5 self-start rounded-md border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-white/[0.045] sm:self-auto"
            >
              <Newspaper className="size-3.5" />
              Manage preferences
            </Link>
          </section>
        )}
      </main>
    </>
  );
}
