"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import { PORTAL_TOOLS } from "./tools-catalog";
import type { ContentItem } from "@/lib/content-item";
import type { PortalAccess } from "@/lib/portal-access";

interface NewsletterIssue {
  slug: string;
  subject: string;
  sent_at: Date | string | null;
}

export interface UpcomingItem {
  date: string;
  type: string;
  title: string;
}

interface HomeContentProps {
  displayName: string;
  email: string;
  access: PortalAccess;
  freeItems: ContentItem[];
  paidItems: ContentItem[];
  playbookGuideItems: ContentItem[];
  issues: NewsletterIssue[];
  thisWeek: string;
  upcoming: UpcomingItem[];
}

const SKILL_CATEGORY = "skill";
const PLAYBOOK_GUIDE = new Set(["playbook", "guide"]);
const TOOL_CATEGORY = "tool";

const OFFERS = [
  {
    eyebrow: "PE & Finance",
    title: "Investor portals built in weeks.",
    desc: "Onboarding, KYC, fund operations. €50K platform delivered for a merchant bank.",
    href: "/pe-ops",
  },
  {
    eyebrow: "B2B SaaS",
    title: "Find €80-180K in revenue leaks.",
    desc: "5-day diagnostic, €2K. If I don't find €50K+ in annual leakage, you pay nothing.",
    href: "/revenue-leak-audit",
  },
  {
    eyebrow: "Compliance",
    title: "EU AI Act, automated.",
    desc: "Risk classification, documentation, and ongoing monitoring for companies deploying AI in the EU.",
    href: "/ai-act",
  },
];

function categoryHref(item: ContentItem): string {
  if (item.category === SKILL_CATEGORY) return `/portal/skills/${encodeURIComponent(item.slug)}`;
  if (item.category === TOOL_CATEGORY) return `/portal/tools/${encodeURIComponent(item.slug)}`;
  if (PLAYBOOK_GUIDE.has(item.category)) return `/portal/playbooks/${encodeURIComponent(item.slug)}`;
  return `/portal?view=resource&slug=${encodeURIComponent(item.slug)}`;
}

function categoryEyebrow(item: ContentItem): string {
  if (item.category === SKILL_CATEGORY) return "Skill";
  if (item.category === "guide") return "Guide";
  if (item.category === "playbook") return "Playbook";
  if (item.category === TOOL_CATEGORY) return "Tool";
  return item.category.charAt(0).toUpperCase() + item.category.slice(1);
}

function formatMonthDay(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ShelfItem({
  href,
  eyebrow,
  title,
  desc,
}: {
  href: string;
  eyebrow: string;
  title: string;
  desc?: string | null;
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[150px] w-[260px] shrink-0 snap-start flex-col justify-between rounded-xl border border-white/[0.06] bg-white/[0.012] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.025]"
    >
      <div>
        <p className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </p>
        <h3 className="mt-2 line-clamp-2 text-[14px] font-semibold leading-[1.3] tracking-tight text-foreground">
          {title}
        </h3>
        {desc ? (
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-muted-foreground">{desc}</p>
        ) : null}
      </div>
      <ArrowUpRight className="mt-3 size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
    </Link>
  );
}

function Shelf({
  eyebrow,
  seeAllHref,
  children,
  empty,
}: {
  eyebrow: string;
  seeAllHref?: string;
  children?: React.ReactNode;
  empty?: string;
}) {
  return (
    <section className="mt-14">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/85">
          {eyebrow}
        </h2>
        {seeAllHref && !empty ? (
          <Link
            href={seeAllHref}
            className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            See all
            <ChevronRight className="size-3.5" />
          </Link>
        ) : null}
      </div>
      {empty ? (
        <p className="text-[13px] text-muted-foreground">{empty}</p>
      ) : (
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {children}
        </div>
      )}
    </section>
  );
}

export default function PortalHomeContent({
  displayName,
  access,
  freeItems,
  paidItems,
  playbookGuideItems,
  issues,
  thisWeek,
  upcoming,
}: HomeContentProps) {
  const isFreeOnly = !access.isMudikit && !access.isAdmin;

  const skills = useMemo(
    () => freeItems.filter((i) => i.category === SKILL_CATEGORY),
    [freeItems]
  );
  const tools = PORTAL_TOOLS;
  const resources = useMemo(
    () =>
      (isFreeOnly ? playbookGuideItems.filter((i) => i.is_free) : playbookGuideItems).slice(0, 8),
    [playbookGuideItems, isFreeOnly]
  );

  const featured: ContentItem | null = useMemo(() => {
    if (access.isMudikit && paidItems[0]) return paidItems[0];
    return freeItems[0] ?? null;
  }, [access.isMudikit, paidItems, freeItems]);

  const latestIssue = issues[0];

  return (
    <main className="relative">
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-10 lg:pt-14">
        {/* 1. Greeting */}
        <h1 className="font-[var(--font-serif-display)] text-[40px] leading-[0.98] tracking-tight text-foreground md:text-[56px]">
          Welcome back, <span className="italic">{displayName}</span>.
        </h1>

        {/* 2. Featured */}
        {featured ? (
          <Link
            href={categoryHref(featured)}
            className="group relative mt-10 flex min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.18] md:min-h-[320px] md:p-10"
            style={
              featured.thumbnail_url
                ? {
                    backgroundImage: `linear-gradient(180deg, rgba(10,10,12,0.55) 0%, rgba(10,10,12,0.94) 100%), url(${featured.thumbnail_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <div
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 size-[320px] bg-[radial-gradient(closest-side,rgba(245,158,11,0.10),transparent_70%)]"
            />
            <div className="relative flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-foreground/65">
              <Sparkles className="size-3" />
              <span>Newest {categoryEyebrow(featured).toLowerCase()}</span>
              {featured.is_new && (
                <span className="ml-1 inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-400/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-emerald-100">
                  New
                </span>
              )}
            </div>
            <h2 className="font-[var(--font-serif-display)] relative mt-3 max-w-[28ch] text-[30px] italic leading-[1.05] tracking-tight text-foreground md:text-[44px]">
              {featured.title}
            </h2>
            {featured.description && (
              <p className="relative mt-3 max-w-[58ch] text-[13.5px] leading-6 text-muted-foreground">
                {featured.description}
              </p>
            )}
            <div className="relative mt-6 inline-flex items-center gap-2 text-[12px] font-medium tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-1">
              Open {categoryEyebrow(featured).toLowerCase()}
              <ArrowUpRight className="size-3.5" />
            </div>
          </Link>
        ) : latestIssue ? (
          <Link
            href={`/portal/newsletter/${latestIssue.slug}`}
            className="group relative mt-10 flex min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018] p-7 backdrop-blur-md transition-all duration-300 hover:border-white/[0.18] md:min-h-[320px] md:p-10"
          >
            <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-foreground/65">
              Newest issue
            </p>
            <h2 className="font-[var(--font-serif-display)] mt-3 text-[30px] italic leading-[1.05] tracking-tight text-foreground md:text-[44px]">
              {latestIssue.subject}
            </h2>
            <div className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium tracking-tight text-foreground transition-transform group-hover:translate-x-1">
              Read issue
              <ArrowUpRight className="size-3.5" />
            </div>
          </Link>
        ) : null}

        {/* 3. This week + Get in touch */}
        <section className="mt-14 grid gap-6 md:grid-cols-[1.55fr_1fr] md:gap-10">
          <article>
            <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              This week
            </p>
            <p className="font-[var(--font-serif-display)] mt-3 text-[22px] italic leading-[1.3] tracking-tight text-foreground md:text-[26px]">
              {thisWeek}
            </p>
          </article>
          <aside className="rounded-2xl border border-white/[0.07] bg-white/[0.012] p-6 md:p-7">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Sounds like your business?
            </p>
            <h3 className="mt-2.5 text-[15px] font-semibold leading-snug text-foreground">
              Reply directly. No call needed.
            </h3>
            <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
              Tell me what you&apos;re solving. I&apos;ll send back what I&apos;d build.
            </p>
            <a
              href="mailto:biz@ghiless.com?subject=Muditek%20portal%20%E2%80%94%20what%20I%27m%20solving"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/[0.08] px-4 py-2 text-[12.5px] font-medium tracking-tight text-amber-100 transition-all hover:border-amber-300/55 hover:bg-amber-400/[0.14]"
            >
              Get in touch
              <ArrowRight className="size-3.5" />
            </a>
          </aside>
        </section>

        {/* 4. Features (the offers) */}
        <section className="mt-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                What I build
              </p>
              <h2 className="font-[var(--font-serif-display)] mt-2 text-[26px] italic leading-tight tracking-tight text-foreground md:text-[32px]">
                The systems behind this portal.
              </h2>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {OFFERS.map((offer) => (
              <Link
                key={offer.href}
                href={offer.href}
                className="group relative flex h-full flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.012] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.025]"
              >
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-amber-200/85">
                    {offer.eyebrow}
                  </p>
                  <h3 className="mt-3 text-[16.5px] font-semibold leading-[1.3] tracking-tight text-foreground">
                    {offer.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-6 text-muted-foreground">{offer.desc}</p>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.18em] text-foreground/70 transition-colors group-hover:text-foreground">
                  See the work
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Tools */}
        <Shelf
          eyebrow="Tools"
          seeAllHref="/portal/tools"
          empty={tools.length === 0 ? "Tools arrive soon." : undefined}
        >
          {tools.map((tool) => (
            <ShelfItem
              key={tool.slug}
              href={`/portal/tools/${tool.slug}`}
              eyebrow={tool.category}
              title={tool.title}
              desc={tool.short}
            />
          ))}
        </Shelf>

        {/* 6. Skills */}
        <Shelf
          eyebrow="Skills"
          seeAllHref="/portal/skills"
          empty={skills.length === 0 ? "Skills arrive soon." : undefined}
        >
          {skills.slice(0, 8).map((item) => (
            <ShelfItem
              key={item.id}
              href={categoryHref(item)}
              eyebrow="Skill"
              title={item.title}
              desc={item.description}
            />
          ))}
        </Shelf>

        {/* 7. Resources */}
        <Shelf
          eyebrow="Resources"
          seeAllHref="/portal/playbooks"
          empty={resources.length === 0 ? "Resources arrive soon." : undefined}
        >
          {resources.map((item) => (
            <ShelfItem
              key={item.id}
              href={categoryHref(item)}
              eyebrow={categoryEyebrow(item)}
              title={item.title}
              desc={item.description}
            />
          ))}
        </Shelf>

        {/* 8. Upcoming */}
        {upcoming.length > 0 && (
          <section className="mt-16">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Coming next
            </p>
            <ul className="mt-4 divide-y divide-white/[0.06] border-t border-white/[0.06]">
              {upcoming.map((item, idx) => (
                <li
                  key={`${item.date}-${idx}`}
                  className="flex items-baseline gap-4 py-3.5"
                >
                  <span className="w-20 shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {formatMonthDay(item.date)}
                  </span>
                  <span className="w-20 shrink-0 text-[10px] uppercase tracking-[0.18em] text-amber-200/75">
                    {item.type}
                  </span>
                  <span className="flex-1 text-[13.5px] text-foreground">{item.title}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </main>
  );
}
