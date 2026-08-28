export type PublicPlaybook = {
  slug: string;
  title: string;
  summary: string;
  source: string;
  topic: string;
};

export type PublicSkill = {
  slug: string;
  title: string;
  summary: string;
  topic: string;
};

export const PUBLIC_PLAYBOOKS: PublicPlaybook[] = [
  {
    slug: "10000-cold-email-system",
    title: "How to Build a Cold Email System for 10,000 Sends a Day",
    summary:
      "Calculate and operate the infrastructure, list supply, reply workflow, recovery plan, and weekly controls behind a 10,000-send day.",
    source: "content/playbooks/10000-cold-email-system.md",
    topic: "Cold email infrastructure",
  },
  {
    slug: "google-maps-outbound",
    title: "How to Find Local Business Owners and Emails from Google Maps",
    summary:
      "Turn a reviewed local-business CSV into cited owner findings and public website emails without paid APIs or guessed data.",
    source: "content/playbooks/google-maps-outbound.md",
    topic: "Local business lead generation",
  },
];

export function getPublicPlaybook(slug: string): PublicPlaybook | undefined {
  return PUBLIC_PLAYBOOKS.find((playbook) => playbook.slug === slug);
}

export const PUBLIC_SKILLS: PublicSkill[] = [
  {
    slug: "audience-content-os",
    title: "Audience Content OS",
    summary:
      "Find a truthful topic, win attention with the hook, retain it with real curiosity, and deliver the promised reward without inventing experience.",
    topic: "Content strategy",
  },
  {
    slug: "linkedin-content-writer",
    title: "LinkedIn Content Writer",
    summary:
      "Turn one complete source or draft into a source-faithful LinkedIn post with a clear hook, readable structure, and no unsupported claims.",
    topic: "LinkedIn",
  },
  {
    slug: "x-content-writer",
    title: "X Content Writer",
    summary:
      "Choose the right native X format, surface the sharpest true hook, and produce a complete post that preserves the source's facts and meaning.",
    topic: "X publishing",
  },
  {
    slug: "newsletter",
    title: "Newsletter",
    summary:
      "Build a complete newsletter issue around one reader, one promise, and one argument, using evidence that the source can actually support.",
    topic: "Newsletter",
  },
  {
    slug: "tiktok-slideshow-machine",
    title: "TikTok Slideshow Machine",
    summary:
      "Turn a validated slideshow reference into editable 9:16 HTML slides, render local PNG files, and run a manual visual and posting check.",
    topic: "TikTok",
  },
  {
    slug: "lead-magnets",
    title: "Lead Magnets",
    summary:
      "Design a lead magnet that completely solves one narrow problem, reveals the next paid problem, and is useful enough to consume.",
    topic: "Lead generation",
  },
];

export function getPublicSkill(slug: string): PublicSkill | undefined {
  return PUBLIC_SKILLS.find((skill) => skill.slug === slug);
}

export const PUBLIC_LIBRARY_PATHS = [
  "/library",
  "/playbooks/10000-cold-email-system",
  "/playbooks/google-maps-outbound",
  "/tools/cold-email-capacity-calculator",
  "/skills/google-maps-owner-email-finder",
  ...PUBLIC_SKILLS.map((skill) => `/skills/${skill.slug}` as const),
] as const;
