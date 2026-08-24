import { describe, expect, it } from "vitest";
import { buildQualifiedMeetingSpecification } from "./qualified-meeting";

describe("qualified meeting specification", () => {
  it("requires all billable rules and distinguishes held from booked", () => {
    expect(buildQualifiedMeetingSpecification({ companyFit: "", buyerRoles: "CEO", requiredProblem: "A project", timing: "90 days", attendance: "held", exclusions: "", noShowPolicy: "Replace", disputeWindow: "Five days" })).toBeNull();
    const result = buildQualifiedMeetingSpecification({ companyFit: "B2B software", buyerRoles: "CEO", requiredProblem: "An active sales project", timing: "90 days", attendance: "held", exclusions: "Competitors", noShowPolicy: "No-show meetings are replaced", disputeWindow: "Dispute within five days" });
    expect(result).toContain("The named buyer attends the meeting.");
    expect(result).toContain("does not prove intent");
  });
});
