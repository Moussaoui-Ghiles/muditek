import { describe, expect, it } from "vitest";
import { calculateOutboundFunnel } from "./outbound-funnel-calculator";

describe("calculateOutboundFunnel", () => {
  it("calculates rates and economics from one fixed cold-email cohort", () => {
    const result = calculateOutboundFunnel({
      entries: 1000,
      accepted: 900,
      positiveEngagements: 45,
      qualifiedConversations: 30,
      meetingsBooked: 20,
      meetingsHeld: 16,
      qualifiedOpportunities: 8,
      customers: 2,
      acquisitionCost: 6000,
      grossProfitPerCustomer: 5000,
    });

    expect(result).not.toBeNull();
    expect(result?.rates).toEqual({
      acceptedMessage: 0.9,
      positiveReply: 0.05,
      qualifiedConversation: 1 / 30,
      conversationToBooking: 2 / 3,
      attendance: 0.8,
      opportunity: 0.5,
      win: 0.25,
      customer: 0.002,
    });
    expect(result?.economics).toEqual({
      costPerHeldMeeting: 375,
      costPerQualifiedOpportunity: 750,
      customerAcquisitionCost: 3000,
      realizedGrossProfit: 10000,
      grossContributionAfterAcquisition: 4000,
      breakEvenCustomers: 2,
    });
  });

  it("preserves an unavailable ratio when its denominator is zero", () => {
    const result = calculateOutboundFunnel({
      entries: 50,
      accepted: 40,
      positiveEngagements: 0,
      qualifiedConversations: 0,
      meetingsBooked: 0,
      meetingsHeld: 0,
      qualifiedOpportunities: 0,
      customers: 0,
      acquisitionCost: 500,
      grossProfitPerCustomer: 2500,
    });

    expect(result?.rates.conversationToBooking).toBeNull();
    expect(result?.economics.customerAcquisitionCost).toBeNull();
    expect(result?.economics.breakEvenCustomers).toBe(1);
  });

  it("rejects fractional, negative, or out-of-order cohort counts", () => {
    const valid = {
      entries: 100,
      accepted: 90,
      positiveEngagements: 10,
      qualifiedConversations: 8,
      meetingsBooked: 6,
      meetingsHeld: 5,
      qualifiedOpportunities: 3,
      customers: 1,
      acquisitionCost: 1000,
      grossProfitPerCustomer: 4000,
    };

    expect(calculateOutboundFunnel({ ...valid, entries: 99.5 })).toBeNull();
    expect(calculateOutboundFunnel({ ...valid, acquisitionCost: -1 })).toBeNull();
    expect(calculateOutboundFunnel({ ...valid, meetingsHeld: 7 })).toBeNull();
  });
});
