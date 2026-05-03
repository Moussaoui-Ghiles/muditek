export interface DataPoint {
  n: number;
  source: string;
  lastUpdated: string;
}

export const DATA_POINTS = {
  newsletterSubscribers: {
    n: 5000,
    source: "Muditek newsletter list, May 2026",
    lastUpdated: "2026-05-04",
  },
  linkedinFollowers: {
    n: 35000,
    source: "LinkedIn /in/ghiles-moussaoui-b36218250",
    lastUpdated: "2026-05-04",
  },
  systemsDeployed: {
    n: 35,
    source: "Muditek client engagement log, 2024-2026",
    lastUpdated: "2026-05-04",
  },
  issuesShipped: {
    n: 29,
    source: "newsletter_issues table where status='sent'",
    lastUpdated: "2026-05-04",
  },
} as const satisfies Record<string, DataPoint>;

export type DataPointKey = keyof typeof DATA_POINTS;
