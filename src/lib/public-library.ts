export type PublicLibraryKind = "playbook" | "skill" | "tool";

export type PublicLibraryItem = {
  slug: string;
  title: string;
  summary: string;
  kind: PublicLibraryKind;
  topic: string;
  source?: string;
};

export type PublicPlaybook = PublicLibraryItem & {
  kind: "playbook";
  source: string;
};

export const PUBLIC_PLAYBOOKS: PublicPlaybook[] = [
  {
    slug: "10000-cold-email-system",
    title: "How to Build a Cold Email System for 10,000 Sends a Day",
    summary:
      "Calculate and operate the infrastructure, list supply, reply workflow, recovery plan, and weekly controls behind a 10,000-send day.",
    kind: "playbook",
    topic: "Cold email infrastructure",
    source: "content/playbooks/10000-cold-email-system.md",
  },
  {
    slug: "google-maps-outbound",
    title: "How to Find Local Business Owners and Emails from Google Maps",
    summary:
      "Turn a reviewed local-business CSV into cited owner findings and public website emails without paid APIs or guessed data.",
    kind: "playbook",
    topic: "Local business lead generation",
    source: "content/playbooks/google-maps-outbound.md",
  },
  {
    slug: "claude-code-lead-gen-guide",
    title: "Claude Code Lead Generation",
    summary: "Build and operate a code-assisted lead-research workflow.",
    kind: "playbook",
    topic: "Lead generation",
    source: "content/playbooks/claude-code-lead-gen-guide.html",
  },
  {
    slug: "hermes-outbound-gtm-agent",
    title: "Hermes Outbound GTM Agent",
    summary: "Run a structured outbound workflow through an agent with explicit controls.",
    kind: "playbook",
    topic: "Outbound agents",
    source: "content/playbooks/hermes-outbound-gtm-agent.html",
  },
  {
    slug: "chatgpt-work-self-improving-outbound",
    title: "Self-Improving Outbound with ChatGPT Work",
    summary: "Use explicit review loops to improve an outbound operating workflow.",
    kind: "playbook",
    topic: "Outbound agents",
    source: "content/playbooks/chatgpt-work-self-improving-outbound.html",
  },
  {
    slug: "cold-email-claude-code-blueprint",
    title: "Cold Email with Claude Code",
    summary: "Set up a cold-email workflow with code-based research and clear handoffs.",
    kind: "playbook",
    topic: "Cold email",
    source: "content/playbooks/cold-email-claude-code-blueprint.html",
  },
  {
    slug: "slack-outbound-agent-playbook",
    title: "Slack Outbound Agent",
    summary: "Coordinate an outbound agent through a Slack-based operating loop.",
    kind: "playbook",
    topic: "Outbound agents",
    source: "content/playbooks/slack-outbound-agent-playbook.html",
  },
  {
    slug: "local-ai-build-guide",
    title: "Local AI Build Guide",
    summary: "Plan a local AI system around data boundaries, hardware, and operations.",
    kind: "playbook",
    topic: "Local AI",
    source: "content/playbooks/local-ai-build-guide.html",
  },
  {
    slug: "loop-design-playbook",
    title: "Loop Design Playbook for AI Agents",
    summary: "Design an agent loop with explicit state, review, and completion boundaries.",
    kind: "playbook",
    topic: "Agent systems",
    source: "content/playbooks/loop-design-playbook.html",
  },
  {
    slug: "mudiagent-operator-guide",
    title: "MudiAgent Operator Guide",
    summary: "Operate a local knowledge agent with defined data and maintenance controls.",
    kind: "playbook",
    topic: "Local AI",
    source: "content/playbooks/mudiagent-operator-guide.html",
  },
  {
    slug: "ai-marketing-team-playbook",
    title: "AI Marketing Team",
    summary: "Design a source-led marketing workflow with clear agent roles and approvals.",
    kind: "playbook",
    topic: "Content systems",
    source: "content/playbooks/ai-marketing-team-playbook.html",
  },
  {
    slug: "coding-agent-seo-playbook",
    title: "Coding Agent SEO",
    summary: "Use coding agents to implement a defined technical SEO change safely.",
    kind: "playbook",
    topic: "SEO",
    source: "content/playbooks/coding-agent-seo-playbook.html",
  },
  {
    slug: "geo-playbook",
    title: "GEO Playbook",
    summary: "Structure useful source-backed content for retrieval and answer engines.",
    kind: "playbook",
    topic: "GEO",
    source: "content/playbooks/geo-playbook.html",
  },
  {
    slug: "judgment-moat",
    title: "The Judgment Moat",
    summary: "Design agent systems so human judgment remains explicit and reviewable.",
    kind: "playbook",
    topic: "Agent systems",
    source: "content/playbooks/judgment-moat.html",
  },
];

export const PUBLIC_SKILLS: PublicLibraryItem[] = [
  {
    slug: "cold-offer-review",
    title: "Cold Offer Review",
    summary: "Review an outbound offer before list building or copy begins.",
    kind: "skill",
    topic: "Offer",
  },
  {
    slug: "buyer-signal-list-research",
    title: "Buyer Signal List Research",
    summary: "Build a source-backed account list around buyer fit and timing signals.",
    kind: "skill",
    topic: "Targeting",
  },
  {
    slug: "outbound-funnel-economics",
    title: "Outbound Funnel Economics",
    summary: "Audit a fixed outbound cohort without replacing unknowns with benchmarks.",
    kind: "skill",
    topic: "Economics",
  },
  {
    slug: "list-builder",
    title: "List Builder",
    summary: "Build qualified company and contact lists through explicit research lanes.",
    kind: "skill",
    topic: "List building",
  },
  {
    slug: "list-expander",
    title: "List Expander",
    summary: "Expand a narrow seed list into a larger set of similar companies.",
    kind: "skill",
    topic: "List building",
  },
  {
    slug: "google-maps-owner-email-finder",
    title: "Google Maps Owner and Email Finder",
    summary: "Download the local package that collects owner evidence and public website emails.",
    kind: "skill",
    topic: "Local outbound",
  },
  {
    slug: "audience-content-os",
    title: "Audience Content OS",
    summary: "Run a source-led content workflow across research, drafting, review, and filing.",
    kind: "skill",
    topic: "Content systems",
  },
  {
    slug: "linkedin-content-writer",
    title: "LinkedIn Content Writer",
    summary: "Draft source-faithful LinkedIn content with explicit approval boundaries.",
    kind: "skill",
    topic: "Content systems",
  },
  {
    slug: "x-content-writer",
    title: "X Content Writer",
    summary: "Route source-backed ideas into the right native X format.",
    kind: "skill",
    topic: "Content systems",
  },
  {
    slug: "newsletter",
    title: "Newsletter",
    summary: "Turn one approved source into a concise newsletter issue with a clear next step.",
    kind: "skill",
    topic: "Content systems",
  },
  {
    slug: "tiktok-slideshow-machine",
    title: "TikTok Slideshow Machine",
    summary: "Build a repeatable slideshow workflow from source selection through rendered assets.",
    kind: "skill",
    topic: "Content systems",
  },
  {
    slug: "lead-magnets",
    title: "Lead Magnets",
    summary: "Design a useful lead magnet around an evidenced problem and a relevant next step.",
    kind: "skill",
    topic: "Content systems",
  },
];

export const PUBLIC_TOOLS: PublicLibraryItem[] = [
  {
    slug: "cold-email-capacity-calculator",
    title: "Cold Email Capacity Calculator",
    summary: "Model mailboxes, domains, contact supply, funnel assumptions, and your entered costs.",
    kind: "tool",
    topic: "Cold email",
  },
  {
    slug: "revenue-leak-calculator",
    title: "Revenue Leak Calculator",
    summary: "Estimate annual pipeline leakage across five operating categories.",
    kind: "tool",
    topic: "Revenue operations",
  },
];

export const PUBLIC_LIBRARY_ITEMS = [
  ...PUBLIC_PLAYBOOKS,
  ...PUBLIC_SKILLS,
  ...PUBLIC_TOOLS,
];

export function getPublicPlaybook(slug: string) {
  return PUBLIC_PLAYBOOKS.find((playbook) => playbook.slug === slug);
}

export function getPublicSkill(slug: string) {
  return PUBLIC_SKILLS.find((skill) => skill.slug === slug);
}

export function getPublicTool(slug: string) {
  return PUBLIC_TOOLS.find((tool) => tool.slug === slug);
}

export const PUBLIC_LIBRARY_PATHS = [
  "/library",
  "/playbooks",
  "/skills",
  "/tools",
  ...PUBLIC_PLAYBOOKS.map((item) => `/playbooks/${item.slug}`),
  ...PUBLIC_SKILLS.map((item) => `/skills/${item.slug}`),
  ...PUBLIC_TOOLS.map((item) => `/tools/${item.slug}`),
] as const;
