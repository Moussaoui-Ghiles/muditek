import { describe, expect, it } from "vitest";
import { calculateColdEmailCapacity, type ColdEmailCapacityInputs } from "./cold-email-capacity-calculator";

const WORKED_EXAMPLE: ColdEmailCapacityInputs = {
  dailySends: 10_000,
  sendingDays: 22,
  sendsPerMailbox: 20,
  mailboxesPerDomain: 3,
  dailySequenceStarts: 4_000,
  averageMessagesPerContact: 2.5,
  positiveReplyRate: 0.001,
  bookingRate: 0.25,
  showRate: 0.7,
  qualificationRate: 0.8,
  closeRate: 0.2,
  mailboxMonthlyCost: 0,
  domainAnnualCost: 0,
  sequencerMonthlyCost: 0,
  dataMonthlyCost: 0,
  otherMonthlyCost: 0,
};

describe("calculateColdEmailCapacity", () => {
  it("calculates the worked example without turning it into a result claim", () => {
    const result = calculateColdEmailCapacity(WORKED_EXAMPLE);

    expect(result).not.toBeNull();
    expect(result).toMatchObject({
      monthlySends: 220_000,
      monthlyNewContacts: 88_000,
      requiredMailboxes: 500,
      requiredDomains: 167,
      projectedPositiveReplies: 220,
      projectedMeetingsBooked: 55,
      projectedMeetingsHeld: 38.5,
      projectedQualifiedMeetings: 30.8,
      projectedDeals: 6.16,
      maxDailySequenceStarts: 4_000,
      plannedSequenceDailySends: 10_000,
      sequenceCapacityUtilization: 1,
    });
  });

  it("rounds infrastructure up and calculates only supplied costs", () => {
    const result = calculateColdEmailCapacity({
      ...WORKED_EXAMPLE,
      dailySends: 101,
      dailySequenceStarts: 40,
      sendsPerMailbox: 20,
      mailboxesPerDomain: 2,
      mailboxMonthlyCost: 3,
      domainAnnualCost: 12,
      sequencerMonthlyCost: 99,
      dataMonthlyCost: 50,
      otherMonthlyCost: 25,
    });

    expect(result?.requiredMailboxes).toBe(6);
    expect(result?.requiredDomains).toBe(3);
    expect(result?.mailboxMonthlyCost).toBe(18);
    expect(result?.domainMonthlyCost).toBe(3);
    expect(result?.totalMonthlyCost).toBe(195);
  });

  it("keeps ratios unavailable when a projection is zero", () => {
    const result = calculateColdEmailCapacity({
      ...WORKED_EXAMPLE,
      positiveReplyRate: 0,
      mailboxMonthlyCost: 2,
    });

    expect(result?.costPerQualifiedMeeting).toBeNull();
    expect(result?.costPerProjectedDeal).toBeNull();
  });

  it("rejects empty, fractional, negative, or impossible inputs", () => {
    expect(calculateColdEmailCapacity({ ...WORKED_EXAMPLE, dailySends: 0 })).toBeNull();
    expect(calculateColdEmailCapacity({ ...WORKED_EXAMPLE, sendingDays: 32 })).toBeNull();
    expect(calculateColdEmailCapacity({ ...WORKED_EXAMPLE, mailboxesPerDomain: 1.5 })).toBeNull();
    expect(calculateColdEmailCapacity({ ...WORKED_EXAMPLE, averageMessagesPerContact: 0.99 })).toBeNull();
    expect(calculateColdEmailCapacity({ ...WORKED_EXAMPLE, dailySequenceStarts: 4_001 })).toBeNull();
    expect(calculateColdEmailCapacity({ ...WORKED_EXAMPLE, closeRate: 1.01 })).toBeNull();
    expect(calculateColdEmailCapacity({ ...WORKED_EXAMPLE, domainAnnualCost: -1 })).toBeNull();
  });
});
