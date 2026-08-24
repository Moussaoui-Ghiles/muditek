export type QualifiedMeetingInput = {
  companyFit: string;
  buyerRoles: string;
  requiredProblem: string;
  timing: string;
  attendance: "held" | "booked";
  exclusions: string;
  noShowPolicy: string;
  disputeWindow: string;
};

export function buildQualifiedMeetingSpecification(input: QualifiedMeetingInput): string | null {
  const required = [input.companyFit, input.buyerRoles, input.requiredProblem, input.timing, input.noShowPolicy, input.disputeWindow].map((value) => value.trim());
  if (required.some((value) => !value)) return null;
  return `# Qualified meeting specification

## A meeting is qualified only when

- Company fit: ${required[0]}
- Accepted buyer roles: ${required[1]}
- Required problem or project: ${required[2]}
- Timing requirement: ${required[3]}
- Attendance requirement: ${input.attendance === "held" ? "The named buyer attends the meeting." : "The named buyer books the meeting."}

## Exclusions

${input.exclusions.trim() || "No additional exclusions stated."}

## No-show and reschedule rule

${required[4]}

## Disputes

${required[5]}

Both parties must approve this specification before outreach starts. A public signal can prioritize an account, but it does not prove intent or make a meeting qualified.`;
}
