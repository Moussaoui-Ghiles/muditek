import { describe, expect, it } from "vitest";
import { calculateAppointmentSettingQuote, type AppointmentSettingQuoteInputs } from "./appointment-setting-calculator";

const VALID_INPUTS: AppointmentSettingQuoteInputs = {
  setupCost: "1000",
  monthlyFee: "4000",
  perQualifiedHeldMeetingFee: "300",
  bookedMeetings: "20",
  showRate: "80",
  qualificationRate: "75",
  closeRate: "25",
  dealValue: "10000",
  grossMargin: "60",
};

describe("calculateAppointmentSettingQuote", () => {
  it("calculates held-meeting economics from buyer inputs", () => {
    const result = calculateAppointmentSettingQuote(VALID_INPUTS);

    expect(result).not.toBeNull();
    expect(result?.qualifiedHeldMeetings).toBe(12);
    expect(result?.expectedClients).toBe(3);
    expect(result?.totalProviderCost).toBe(8600);
    expect(result?.costPerQualifiedHeldMeeting).toBeCloseTo(716.67, 2);
    expect(result?.expectedCac).toBeCloseTo(2866.67, 2);
    expect(result?.breakEvenCloseRate).toBeCloseTo(0.11944, 4);
    expect(result?.expectedGrossProfit).toBe(9400);
  });

  it("accepts a zero setup fee", () => {
    expect(calculateAppointmentSettingQuote({ ...VALID_INPUTS, setupCost: "0" })).not.toBeNull();
  });

  it("accepts a zero held-meeting fee", () => {
    expect(calculateAppointmentSettingQuote({ ...VALID_INPUTS, perQualifiedHeldMeetingFee: "0" })).not.toBeNull();
  });

  it("rejects missing, negative, or impossible inputs", () => {
    expect(calculateAppointmentSettingQuote({ ...VALID_INPUTS, bookedMeetings: "" })).toBeNull();
    expect(calculateAppointmentSettingQuote({ ...VALID_INPUTS, monthlyFee: "-1" })).toBeNull();
    expect(calculateAppointmentSettingQuote({ ...VALID_INPUTS, perQualifiedHeldMeetingFee: "-1" })).toBeNull();
    expect(calculateAppointmentSettingQuote({ ...VALID_INPUTS, showRate: "101" })).toBeNull();
    expect(calculateAppointmentSettingQuote({ ...VALID_INPUTS, closeRate: "0" })).toBeNull();
  });
});
