export type PublicPlaybook = {
  slug: string;
  title: string;
  summary: string;
  source: string;
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

export const PUBLIC_LIBRARY_PATHS = [
  "/library",
  "/playbooks/10000-cold-email-system",
  "/playbooks/google-maps-outbound",
  "/tools/cold-email-capacity-calculator",
  "/skills/google-maps-owner-email-finder",
] as const;
