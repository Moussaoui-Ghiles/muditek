import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  buildLibraryHref,
  filterLibraryItems,
  LIBRARY_TASKS,
  LibraryCollection,
  resolveLibraryFilters,
} from "@/components/library/library-collection";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import { getPublishedLibraryItems } from "@/lib/library-manifest";

export const metadata: Metadata = {
  title: "Muditek Library | Outbound and AI Implementation",
  description: "Skills, playbooks, and browser-side tools for outbound and AI implementation work.",
  alternates: { canonical: "https://muditek.com/library" },
};

type LibrarySearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LibraryPage({ searchParams }: { searchParams: LibrarySearchParams }) {
  const filters = resolveLibraryFilters(await searchParams);
  const items = getPublishedLibraryItems();
  const topics = Array.from(new Set(items.map((item) => item.topic))).sort((a, b) => a.localeCompare(b));
  const filteredItems = filterLibraryItems(items, filters);
  const outbound = filteredItems.filter((item) => item.lane === "outbound");
  const ai = filteredItems.filter((item) => item.lane === "ai-implementation");
  const selectedTask = LIBRARY_TASKS.find((task) => task.value === filters.task);
  const hasActiveFilter = filters.lane !== "all" || filters.task !== "all" || filters.access !== "all" || filters.kind !== "all" || filters.topic !== "all" || Boolean(filters.query);
  const resultHeading = selectedTask?.label
    ?? (filters.lane === "ai-implementation" ? "AI implementation" : filters.lane === "outbound" ? "Outbound" : "Matching assets");
  const resultDescription = selectedTask?.description
    ?? (filters.lane === "ai-implementation"
      ? "Technical material for local AI, agent loops, data workflows, content systems, SEO, and GEO."
      : filters.lane === "outbound"
        ? "Methods and tools for offers, list research, list quality, funnel economics, and outbound operations."
        : "Results from the current search and access filters.");
  const nextStep = filters.lane === "ai-implementation" || selectedTask?.lane === "ai-implementation"
    ? {
        label: "AI implementation",
        title: "Have one workflow that is ready to scope?",
        text: "Review the implementation scope, working boundaries, and delivery path.",
        href: "/ai-implementation",
        action: "Review AI implementation",
      }
    : filters.lane === "outbound" || selectedTask?.lane === "outbound"
      ? {
          label: "Appointment setting",
          title: "Need the outbound system operated for you?",
          text: "Review the offer, qualification rules, pricing, and held-meeting terms.",
          href: "/appointment-setting",
          action: "Review appointment setting",
        }
      : {
          label: "Start here",
          title: "Find the first outbound failure.",
          text: "Use the diagnostic before changing copy, targeting, or sending volume.",
          href: "/playbooks/outbound-failure-diagnostic",
          action: "Open the diagnostic",
        };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView asset="library" lane={filters.lane === "ai-implementation" ? "ai-implementation" : "outbound"} event="library_item_viewed" placement="library-index" />

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/[0.06] pb-16 pt-36 md:pb-20 md:pt-44">
          <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-24 h-96 w-96 rounded-full bg-primary/[0.06] blur-[120px]" />
          <div className="relative mx-auto grid w-full max-w-[1180px] gap-10 px-6 md:px-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Muditek library</p>
              <h1 className="mt-6 max-w-4xl break-words text-[42px] font-black leading-[0.94] tracking-[-0.035em] text-foreground [overflow-wrap:anywhere] sm:text-6xl md:text-7xl">
                Start with the job in front of you.
              </h1>
              <p className="mt-7 max-w-[66ch] text-base leading-8 text-foreground/75 md:text-lg">
                Choose a task, read the method, or use the tool. Every page is public. Some advanced skill files need a free account.
              </p>
            </div>
            <div className="border-y border-white/[0.12] py-6">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">What you will find</p>
              <dl className="mt-5 grid grid-cols-3 gap-4 lg:grid-cols-1">
                <div><dt className="text-sm font-black text-foreground">Skills</dt><dd className="mt-1 text-xs leading-5 text-foreground/60">Working files and instructions</dd></div>
                <div><dt className="text-sm font-black text-foreground">Playbooks</dt><dd className="mt-1 text-xs leading-5 text-foreground/60">Complete operating methods</dd></div>
                <div><dt className="text-sm font-black text-foreground">Tools</dt><dd className="mt-1 text-xs leading-5 text-foreground/60">Private browser-side checks</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section aria-labelledby="task-paths-heading" className="border-b border-white/[0.06] py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1180px] px-6 md:px-12">
            <div className="flex flex-col gap-3 border-b border-white/[0.1] pb-7 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Choose a task</p>
                <h2 id="task-paths-heading" className="mt-3 text-3xl font-black tracking-[-0.03em] text-foreground md:text-4xl">Go straight to useful material.</h2>
              </div>
              <p className="max-w-[44ch] text-sm leading-6 text-foreground/65">Each path narrows the library to the skills, playbooks, and tools for that job.</p>
            </div>
            <ol className="grid md:grid-cols-2">
              {LIBRARY_TASKS.map((task, index) => (
                <li key={task.value} className="border-b border-white/[0.08] md:odd:border-r">
                  <Link
                    href={buildLibraryHref({ lane: task.lane, task: task.value })}
                    aria-current={filters.task === task.value ? "page" : undefined}
                    className="group grid min-h-32 grid-cols-[38px_1fr_auto] gap-3 px-1 py-6 transition-colors hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary md:px-6"
                  >
                    <span className="font-mono text-[11px] text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block text-lg font-black tracking-[-0.015em] text-foreground">{task.shortLabel}</span>
                      <span className="mt-2 block max-w-[44ch] text-sm leading-6 text-foreground/65">{task.description}</span>
                    </span>
                    <span aria-hidden="true" className="self-center text-lg text-foreground/45 transition-transform group-hover:translate-x-1 group-hover:text-primary">→</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="recommended-paths-heading" className="border-b border-white/[0.06] py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1180px] px-6 md:px-12">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Recommended paths</p>
            <h2 id="recommended-paths-heading" className="mt-3 text-3xl font-black tracking-[-0.03em] text-foreground md:text-4xl">Start with the first unresolved step.</h2>
            <div className="mt-8 grid gap-px overflow-hidden rounded-[2px] border border-white/[0.08] bg-white/[0.08] lg:grid-cols-2">
              <div className="bg-background p-6 md:p-8">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Outbound</p>
                <ol className="mt-5 space-y-1">
                  {[
                    ["Diagnose the first failure", "/playbooks/outbound-failure-diagnostic"],
                    ["Review the offer", "/skills/cold-offer-review"],
                    ["Check the target list", "/skills/buyer-signal-list-research"],
                    ["Run the cohort calculator", "/tools/outbound-funnel-economics-calculator"],
                  ].map(([label, href], index) => (
                    <li key={href}>
                      <Link href={href} className="grid min-h-12 grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-white/[0.06] text-sm font-bold text-foreground/75 hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-primary">
                        <span className="font-mono text-[10px] text-primary">{index + 1}</span><span>{label}</span><span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-background p-6 md:p-8">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">AI implementation</p>
                <ol className="mt-5 space-y-1">
                  {[
                    ["Set the data and hardware boundary", "/playbooks/local-ai-build-guide"],
                    ["Design the operating loop", "/playbooks/loop-design-playbook"],
                    ["Keep human review explicit", "/playbooks/judgment-moat"],
                  ].map(([label, href], index) => (
                    <li key={href}>
                      <Link href={href} className="grid min-h-12 grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-white/[0.06] text-sm font-bold text-foreground/75 hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-primary">
                        <span className="font-mono text-[10px] text-primary">{index + 1}</span><span>{label}</span><span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="library-filter-heading" className="border-b border-white/[0.06] bg-card/30 py-10">
          <div className="mx-auto w-full max-w-[1180px] px-6 md:px-12">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 id="library-filter-heading" className="text-sm font-black uppercase tracking-[0.18em] text-foreground">Filter the library</h2>
              {hasActiveFilter ? <Link href="/library" className="text-xs font-bold text-primary underline decoration-primary/50 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Clear all</Link> : null}
            </div>
            <form action="/library" method="get" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
              <label className="block text-xs font-bold text-foreground/75 lg:col-span-2">
                Search
                <input name="q" type="search" defaultValue={filters.query} placeholder="Title, topic, or problem" className="mt-2 min-h-12 w-full rounded-[2px] border border-white/[0.14] bg-background px-4 text-sm text-foreground outline-none placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/30" />
              </label>
              <label className="block text-xs font-bold text-foreground/75">
                Kind
                <select name="kind" defaultValue={filters.kind} className="mt-2 min-h-12 w-full rounded-[2px] border border-white/[0.14] bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/30">
                  <option value="all">All kinds</option>
                  <option value="skill">Skills</option>
                  <option value="playbook">Playbooks</option>
                  <option value="tool">Tools</option>
                </select>
              </label>
              <label className="block text-xs font-bold text-foreground/75">
                Topic
                <select name="topic" defaultValue={filters.topic} className="mt-2 min-h-12 w-full rounded-[2px] border border-white/[0.14] bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/30">
                  <option value="all">All topics</option>
                  {topics.map((topic) => <option key={topic} value={topic}>{topic.replaceAll("-", " ")}</option>)}
                </select>
              </label>
              <label className="block text-xs font-bold text-foreground/75">
                Lane
                <select name="lane" defaultValue={filters.lane} className="mt-2 min-h-12 w-full rounded-[2px] border border-white/[0.14] bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30">
                  <option value="all">All lanes</option>
                  <option value="outbound">Outbound</option>
                  <option value="ai-implementation">AI implementation</option>
                </select>
              </label>
              <label className="block text-xs font-bold text-foreground/75">
                Access
                <select name="access" defaultValue={filters.access} className="mt-2 min-h-12 w-full rounded-[2px] border border-white/[0.14] bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30">
                  <option value="all">All access</option>
                  <option value="public">Open access</option>
                  <option value="account">Free account for files</option>
                </select>
              </label>
              <label className="block text-xs font-bold text-foreground/75">
                Task
                <select name="task" defaultValue={filters.task} className="mt-2 min-h-12 w-full rounded-[2px] border border-white/[0.14] bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30">
                  <option value="all">All tasks</option>
                  {LIBRARY_TASKS.map((task) => <option key={task.value} value={task.value}>{task.shortLabel}</option>)}
                </select>
              </label>
              <button type="submit" className="min-h-12 rounded-[2px] bg-primary px-6 text-xs font-black uppercase tracking-[0.14em] text-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background">Show assets</button>
            </form>
          </div>
        </section>

        {hasActiveFilter ? (
          <LibraryCollection items={filteredItems} heading={resultHeading} description={resultDescription} showLane={filters.lane === "all" && !selectedTask} />
        ) : (
          <>
            <LibraryCollection
              items={outbound}
              heading="Outbound"
              description="Review offers, find buyer signals, check list quality, model funnel economics, and run outbound work."
            />
            <LibraryCollection
              items={ai}
              heading="AI implementation"
              description="Define local AI, agent loops, data workflows, content operations, SEO, and GEO with explicit controls."
            />
          </>
        )}

        <section className="border-t border-white/[0.06] py-16 md:py-20">
          <div className="mx-auto grid w-full max-w-[1000px] gap-8 px-6 md:grid-cols-[1fr_auto] md:items-end md:px-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">{nextStep.label}</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-black leading-[1.05] tracking-[-0.03em] text-foreground md:text-5xl">{nextStep.title}</h2>
              <p className="mt-5 max-w-[60ch] text-base leading-7 text-foreground/70">{nextStep.text}</p>
            </div>
            <Link href={nextStep.href} className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-primary px-7 py-4 text-center text-xs font-black uppercase tracking-[0.14em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background">{nextStep.action}</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
