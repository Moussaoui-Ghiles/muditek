import Link from "next/link";
import type {
  LibraryAccess,
  LibraryItem,
  LibraryLane,
} from "@/lib/library-manifest";

const KIND_LABELS: Record<LibraryItem["kind"], string> = {
  skill: "Skill",
  playbook: "Playbook",
  tool: "Tool",
};

const ACCESS_LABELS: Record<LibraryAccess, string> = {
  public: "Open access",
  account: "Free account for files",
  none: "Unavailable",
};

export const LIBRARY_TASKS = [
  {
    value: "diagnose-outbound",
    label: "Find an outbound failure",
    shortLabel: "Diagnose outbound",
    description: "Find the first failing stage before changing copy or volume.",
    lane: "outbound",
    topics: ["diagnosis", "offer", "economics"],
  },
  {
    value: "build-lead-list",
    label: "Build or check a lead list",
    shortLabel: "Build or check a list",
    description: "Research accounts, check fit, and catch list problems before sending.",
    lane: "outbound",
    topics: ["targeting", "list-building", "list-quality", "local-outbound", "qualification"],
  },
  {
    value: "run-outbound",
    label: "Run an outbound workflow",
    shortLabel: "Run outbound",
    description: "Set up research, handoffs, agents, and review points.",
    lane: "outbound",
    topics: ["lead-generation", "outbound-agents", "cold-email", "demand-capture", "planning"],
  },
  {
    value: "design-ai-workflow",
    label: "Design an AI workflow",
    shortLabel: "Design an AI workflow",
    description: "Define data, state, permissions, review, and completion rules.",
    lane: "ai-implementation",
    topics: ["local-ai", "agent-systems", "data-agents"],
  },
  {
    value: "operate-content-system",
    label: "Run a content system",
    shortLabel: "Run a content system",
    description: "Keep sources, drafting, review, and approval in one operating path.",
    lane: "ai-implementation",
    topics: ["content-systems", "content-quality"],
  },
  {
    value: "improve-search-discovery",
    label: "Improve SEO or GEO",
    shortLabel: "Improve SEO or GEO",
    description: "Make a defined technical change or improve retrieval-ready content.",
    lane: "ai-implementation",
    topics: ["seo", "geo"],
  },
] as const;

export type LibraryTask = (typeof LIBRARY_TASKS)[number]["value"];
export type LibraryLaneFilter = LibraryLane | "all";
export type LibraryAccessFilter = Extract<LibraryAccess, "public" | "account"> | "all";

export interface LibraryFilters {
  lane: LibraryLaneFilter;
  task: LibraryTask | "all";
  access: LibraryAccessFilter;
  query: string;
}

type SearchParamValue = string | string[] | undefined;

function firstParam(value: SearchParamValue): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function resolveLibraryFilters(params: Record<string, SearchParamValue>): LibraryFilters {
  const laneValue = firstParam(params.lane);
  const taskValue = firstParam(params.task);
  const accessValue = firstParam(params.access);
  const query = firstParam(params.q).trim().slice(0, 100);

  return {
    lane: laneValue === "outbound" || laneValue === "ai-implementation" ? laneValue : "all",
    task: LIBRARY_TASKS.some((task) => task.value === taskValue)
      ? taskValue as LibraryTask
      : "all",
    access: accessValue === "public" || accessValue === "account" ? accessValue : "all",
    query,
  };
}

export function filterLibraryItems(
  items: LibraryItem[],
  filters: LibraryFilters,
): LibraryItem[] {
  const selectedTask = LIBRARY_TASKS.find((task) => task.value === filters.task);
  const query = filters.query.toLocaleLowerCase();

  return items.filter((item) => {
    if (filters.lane !== "all" && item.lane !== filters.lane) return false;
    if (filters.access !== "all" && item.access !== filters.access) return false;
    if (selectedTask && (item.lane !== selectedTask.lane || !selectedTask.topics.some((topic) => topic === item.topic))) return false;

    if (query) {
      const searchable = [
        item.title,
        item.summary,
        item.topic.replaceAll("-", " "),
        KIND_LABELS[item.kind],
      ].join(" ").toLocaleLowerCase();
      if (!searchable.includes(query)) return false;
    }

    return true;
  });
}

export function buildLibraryHref(filters: Partial<LibraryFilters>): string {
  const params = new URLSearchParams();
  if (filters.lane && filters.lane !== "all") params.set("lane", filters.lane);
  if (filters.task && filters.task !== "all") params.set("task", filters.task);
  if (filters.access && filters.access !== "all") params.set("access", filters.access);
  if (filters.query?.trim()) params.set("q", filters.query.trim());
  const query = params.toString();
  return query ? `/library?${query}` : "/library";
}

export function LibraryCollection({
  items,
  heading,
  description,
  showLane = false,
}: {
  items: LibraryItem[];
  heading: string;
  description: string;
  showLane?: boolean;
}) {
  return (
    <section className="w-full border-t border-white/[0.06] py-14 md:py-20">
      <div className="mx-auto w-full max-w-[1180px] px-6 md:px-12">
        <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-end">
          <div>
            <h2 className="text-3xl font-black leading-[1] tracking-[-0.03em] text-foreground md:text-5xl">
              {heading}
            </h2>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              {items.length} {items.length === 1 ? "asset" : "assets"}
            </p>
          </div>
          <p className="max-w-[64ch] text-sm leading-7 text-foreground/70 md:justify-self-end md:text-base">
            {description}
          </p>
        </div>

        {items.length > 0 ? (
          <div className="border-y border-white/[0.08]">
            {items.map((item) => (
              <Link
                key={`${item.kind}:${item.slug}`}
                href={`/${item.kind}s/${item.slug}`}
                className="group grid gap-4 border-b border-white/[0.06] px-1 py-6 transition-colors last:border-b-0 hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_150px] md:items-center md:px-5"
              >
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                    {showLane ? `${item.lane === "outbound" ? "Outbound" : "AI implementation"} · ` : ""}
                    {KIND_LABELS[item.kind]} · {item.topic.replaceAll("-", " ")}
                  </p>
                  <h3 className="mt-2 text-xl font-black tracking-[-0.015em] text-foreground md:text-2xl">
                    {item.title}
                  </h3>
                </div>
                <div>
                  <p className="max-w-[62ch] text-sm leading-6 text-foreground/70">{item.summary}</p>
                  <p className="mt-2 text-xs font-semibold text-foreground/55">{ACCESS_LABELS[item.access]}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-foreground/75 group-hover:text-primary">
                  {item.access === "account" ? "View files" : item.kind === "tool" ? "Use tool" : "Read asset"}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border-y border-white/[0.08] py-12">
            <p className="text-lg font-bold text-foreground">No asset matches these filters.</p>
            <p className="mt-2 text-sm leading-6 text-foreground/65">Clear the filters or try a broader search term.</p>
            <Link href="/library" className="mt-5 inline-flex min-h-11 items-center text-xs font-black uppercase tracking-[0.15em] text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Clear filters
            </Link>
          </div>
        )}
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
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Relevant offer</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-black leading-[1.05] tracking-[-0.03em] text-foreground md:text-5xl">
            {outbound
              ? "Need Muditek to run the appointment-setting work?"
              : "Need Muditek to build this AI workflow?"}
          </h2>
          <p className="mt-5 max-w-[62ch] text-base leading-7 text-foreground/70">
            {outbound
              ? "Review the current appointment-setting offer, qualification rules, pricing, and held-meeting terms."
              : "Review the scope, controls, delivery path, and technical material behind the AI implementation offer."}
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
