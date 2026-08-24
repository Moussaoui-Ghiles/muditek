import { describe, expect, it } from "vitest";
import { parseMessageHeaders } from "./email-header";
import { extractMxHost, identifyMailProvider } from "./mail-provider";
import { calculateMarketRunway, planColdEmailInfrastructure } from "./planners";
import { auditQuoteContract, diagnoseOutboundCohort, gradeSignalEvidence, QUOTE_AUDIT_ITEMS } from "./diagnostics";
import { buildEmailAuthenticationSetup } from "./email-setup";

describe("email header parser", () => {
  it("reports receiver verdicts and ignores message body text", () => {
    const input = "Authentication-Results: mx.google.com;\r\n dkim=pass header.d=example.com; spf=fail; dmarc=pass\r\nReceived-SPF: neutral client-ip=1.2.3.4\r\n\r\nBody says spf=pass";
    expect(parseMessageHeaders(input).map(({ mechanism, verdict }) => [mechanism, verdict])).toEqual([
      ["dkim", "pass"], ["spf", "fail"], ["dmarc", "pass"], ["received-spf", "neutral"],
    ]);
  });
  it("returns no verdict when supported headers are absent", () => expect(parseMessageHeaders("From: a@example.com\n\nspf=pass")).toEqual([]));
});

describe("mail provider lookup", () => {
  it("normalizes MX records and identifies only transparent matches", () => {
    expect(extractMxHost("10 ASPMX.L.GOOGLE.COM.")).toBe("aspmx.l.google.com");
    expect(identifyMailProvider(["10 example-com.mail.protection.outlook.com."])?.provider).toBe("Microsoft 365");
    expect(identifyMailProvider(["10 mx.private-host.example."])).toBeNull();
  });
});

describe("cold email infrastructure planner", () => {
  it("uses only buyer inputs and keeps spare capacity explicit", () => {
    expect(planColdEmailInfrastructure({ dailyNewProspects: 100, sequenceSteps: 3, sendingDaysPerMonth: 20, safeEmailsPerMailboxPerDay: 30, spareCapacityPercent: 20, inboxesPerDomain: 3, mailboxMonthlyPrice: 5, domainAnnualPrice: 12 })).toEqual({
      monthlyEmails: 6000, averageDailyEmails: 300, requiredDailyCapacity: 375, mailboxes: 13, domains: 5, estimatedMonthlyCost: 70,
    });
  });
  it("rejects impossible capacity", () => expect(planColdEmailInfrastructure({ dailyNewProspects: 1, sequenceSteps: 1, sendingDaysPerMonth: 1, safeEmailsPerMailboxPerDay: 1, spareCapacityPercent: 100, inboxesPerDomain: 1, mailboxMonthlyPrice: 0, domainAnnualPrice: 0 })).toBeNull());
});

describe("market runway", () => {
  it("subtracts exclusions and previously activated accounts", () => expect(calculateMarketRunway({ totalEligibleAccounts: 1000, excludedAccounts: 100, accountsAlreadyActivated: 300, newAccountsActivatedPerPeriod: 200 })).toEqual({ reachableAccounts: 600, fullPeriods: 3, exactPeriods: 3, finalPeriodAccounts: 0 }));
  it("rejects overlapping counts that exceed the market", () => expect(calculateMarketRunway({ totalEligibleAccounts: 10, excludedAccounts: 8, accountsAlreadyActivated: 8, newAccountsActivatedPerPeriod: 1 })).toBeNull());
});

describe("signal evidence grader", () => {
  it("labels complete evidence without inventing an intent score", () => expect(gradeSignalEvidence({ sourceUrl: "https://example.com/filing", observedDate: "2026-08-24", namedAccount: true, directSource: true, factIsExplicit: true, withinResearchWindow: true, contradictoryEvidence: false })).toMatchObject({ status: "usable-for-prioritization", missing: [] }));
  it("names missing facts", () => expect(gradeSignalEvidence({ sourceUrl: "", observedDate: "", namedAccount: false, directSource: false, factIsExplicit: false, withinResearchWindow: false, contradictoryEvidence: true }).missing).toHaveLength(7));
});

describe("outbound cohort diagnostic", () => {
  const base = { qualifiedContactsReached: 100, delivered: 90, positiveReplies: 5, callsBooked: 0, callsHeld: 0, qualifiedCallsHeld: 0, proposals: 0, clients: 0 };
  it("finds the first complete break", () => expect(diagnoseOutboundCohort(base)).toMatchObject({ stage: "callsBooked", transitionRate: 0 }));
  it("rejects counts that increase downstream", () => expect(diagnoseOutboundCohort({ ...base, delivered: 101 })).toHaveProperty("error"));
});

describe("email setup and quote audit", () => {
  it("builds provider-documented records", () => expect(buildEmailAuthenticationSetup("google-workspace", "none", "reports@example.com")).toMatchObject({ spf: "v=spf1 include:_spf.google.com ~all", dmarc: "v=DMARC1; p=none; pct=100; rua=mailto:reports@example.com;" }));
  it("returns every unchecked contract item", () => expect(auditQuoteContract(QUOTE_AUDIT_ITEMS.map((_, index) => index === 0))).toHaveLength(QUOTE_AUDIT_ITEMS.length - 1));
});
