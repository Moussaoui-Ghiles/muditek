import { describe, expect, it } from "vitest";
import { buildOutboundBrief } from "./outbound-brief";

describe("buildOutboundBrief", () => {
  it("exports the same normalized brief as Markdown and JSON", () => {
    const result = buildOutboundBrief({
      name: "DACH founder-led SaaS",
      decision: "Test whether the offer earns qualified conversations.",
      offer: "Appointment setting for founder-led B2B companies.",
      companyFit: "B2B SaaS, 10 to 100 employees, founder-led sales.",
      buyerRoles: "Founder, CEO, Head of Sales",
      geography: "Germany, Austria, Switzerland",
      signals: "Hiring first sales lead\nNew market launch",
      exclusions: "Current clients\nCompanies without a clear B2B offer",
      qualification: "Authority, relevant problem, timing, and willingness to review the process.",
      proof: "Use only evidence listed in the approved claim ledger.",
      channels: "Cold email\nLinkedIn",
      constraints: "Do not contact excluded accounts.",
    });

    expect(result).not.toBeNull();
    expect(JSON.parse(result?.json ?? "{}")).toEqual(result?.data);
    expect(result?.data).toMatchObject({
      schemaVersion: "1.0",
      name: "DACH founder-led SaaS",
      signals: ["Hiring first sales lead", "New market launch"],
      exclusions: ["Current clients", "Companies without a clear B2B offer"],
      channels: ["Cold email", "LinkedIn"],
    });
    expect(result?.markdown).toContain("# Outbound brief: DACH founder-led SaaS");
    expect(result?.markdown).toContain("## Decision\n\nTest whether the offer earns qualified conversations.");
    expect(result?.markdown).toContain("- Hiring first sales lead\n- New market launch");
  });

  it("rejects a brief without the decision, offer, or company fit", () => {
    const valid = {
      name: "Pilot",
      decision: "Test a motion.",
      offer: "A defined offer.",
      companyFit: "A defined company profile.",
      buyerRoles: "Founder",
      geography: "France",
      signals: "Hiring",
      exclusions: "Clients",
      qualification: "Authority and timing",
      proof: "Approved proof only",
      channels: "Email",
      constraints: "None",
    };

    expect(buildOutboundBrief({ ...valid, decision: "" })).toBeNull();
    expect(buildOutboundBrief({ ...valid, offer: "" })).toBeNull();
    expect(buildOutboundBrief({ ...valid, companyFit: "" })).toBeNull();
  });
});
