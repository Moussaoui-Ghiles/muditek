export type SignalEvidenceInput = {
  sourceUrl: string;
  observedDate: string;
  namedAccount: boolean;
  directSource: boolean;
  factIsExplicit: boolean;
  withinResearchWindow: boolean;
  contradictoryEvidence: boolean;
};

export function gradeSignalEvidence(input: SignalEvidenceInput) {
  const missing: string[] = [];
  if (!/^https?:\/\//i.test(input.sourceUrl.trim())) missing.push("a public source URL");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.observedDate)) missing.push("the observation date");
  if (!input.namedAccount) missing.push("a confirmed account match");
  if (!input.directSource) missing.push("the original or authoritative source");
  if (!input.factIsExplicit) missing.push("an explicit fact instead of an inference");
  if (!input.withinResearchWindow) missing.push("a fact inside your stated research window");
  if (input.contradictoryEvidence) missing.push("resolution of contradictory evidence");
  const status = missing.length === 0 ? "usable-for-prioritization" : missing.length <= 2 ? "incomplete" : "not-usable";
  return {
    status,
    missing,
    statement: status === "usable-for-prioritization"
      ? "The evidence can prioritize account research. It does not prove buying intent, budget, timing, or qualification."
      : "Do not use this evidence to prioritize outreach until the missing facts are resolved.",
  } as const;
}

export type FunnelCohort = {
  qualifiedContactsReached: number;
  delivered: number;
  positiveReplies: number;
  callsBooked: number;
  callsHeld: number;
  qualifiedCallsHeld: number;
  proposals: number;
  clients: number;
};

const STAGES: Array<{ key: keyof FunnelCohort; label: string }> = [
  { key: "qualifiedContactsReached", label: "qualified contacts reached" },
  { key: "delivered", label: "delivered messages" },
  { key: "positiveReplies", label: "positive replies" },
  { key: "callsBooked", label: "calls booked" },
  { key: "callsHeld", label: "calls held" },
  { key: "qualifiedCallsHeld", label: "qualified calls held" },
  { key: "proposals", label: "proposals" },
  { key: "clients", label: "clients" },
];

export function diagnoseOutboundCohort(cohort: FunnelCohort) {
  for (const stage of STAGES) {
    if (!Number.isFinite(cohort[stage.key]) || cohort[stage.key] < 0) return { error: `Enter a valid count for ${stage.label}.` } as const;
  }
  for (let index = 1; index < STAGES.length; index += 1) {
    const previous = STAGES[index - 1];
    const current = STAGES[index];
    if (cohort[current.key] > cohort[previous.key]) return { error: `${current.label} cannot exceed ${previous.label} in one fixed cohort.` } as const;
  }
  const firstZero = STAGES.findIndex((stage) => cohort[stage.key] === 0);
  if (firstZero === 0) return { stage: "reach", finding: "No qualified contacts were reached. The cohort cannot test delivery, replies, or sales conversion." } as const;
  if (firstZero > 0) {
    const previous = STAGES[firstZero - 1];
    const current = STAGES[firstZero];
    return {
      stage: current.key,
      finding: `The first complete break is ${previous.label} to ${current.label}. Inspect this transition before changing later stages.`,
      transitionRate: 0,
    } as const;
  }
  const transitions = STAGES.slice(1).map((stage, index) => ({
    label: `${STAGES[index].label} → ${stage.label}`,
    rate: cohort[stage.key] / cohort[STAGES[index].key],
  }));
  return { stage: "no-complete-break", finding: "Every stage has at least one outcome. Compare these cohort rates with another fixed cohort before choosing a change.", transitions } as const;
}

export const QUOTE_AUDIT_ITEMS = [
  "The billing unit is stated.",
  "The qualification rule is written and testable.",
  "Booked, held, and qualified meetings are distinct.",
  "No-show and reschedule treatment is stated.",
  "Exclusions and duplicate-account rules are stated.",
  "The dispute evidence and deadline are stated.",
  "Setup, fixed, usage, and third-party costs are separated.",
  "Contract term, renewal, cancellation, and payment timing are stated.",
] as const;

export function auditQuoteContract(selected: boolean[]) {
  return QUOTE_AUDIT_ITEMS.filter((_, index) => !selected[index]);
}
