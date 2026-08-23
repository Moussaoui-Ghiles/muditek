export type AppointmentSettingQuoteInputs = {
  setupCost: string;
  monthlyFee: string;
  perQualifiedHeldMeetingFee: string;
  bookedMeetings: string;
  showRate: string;
  qualificationRate: string;
  closeRate: string;
  dealValue: string;
  grossMargin: string;
};

export type AppointmentSettingQuoteResults = {
  totalProviderCost: number;
  qualifiedHeldMeetings: number;
  expectedClients: number;
  costPerQualifiedHeldMeeting: number;
  expectedCac: number;
  breakEvenCloseRate: number;
  expectedGrossProfit: number;
};

function asNumber(value: string) {
  return Number(value.replace(/,/g, ""));
}

export function calculateAppointmentSettingQuote(inputs: AppointmentSettingQuoteInputs): AppointmentSettingQuoteResults | null {
  const setupCost = asNumber(inputs.setupCost);
  const monthlyFee = asNumber(inputs.monthlyFee);
  const perQualifiedHeldMeetingFee = asNumber(inputs.perQualifiedHeldMeetingFee);
  const bookedMeetings = asNumber(inputs.bookedMeetings);
  const showRate = asNumber(inputs.showRate) / 100;
  const qualificationRate = asNumber(inputs.qualificationRate) / 100;
  const closeRate = asNumber(inputs.closeRate) / 100;
  const dealValue = asNumber(inputs.dealValue);
  const grossMargin = asNumber(inputs.grossMargin) / 100;

  const values = [setupCost, monthlyFee, perQualifiedHeldMeetingFee, bookedMeetings, showRate, qualificationRate, closeRate, dealValue, grossMargin];
  if (values.some((value) => !Number.isFinite(value)) || setupCost < 0 || monthlyFee < 0 || perQualifiedHeldMeetingFee < 0 || bookedMeetings <= 0 || dealValue <= 0) return null;
  if (showRate <= 0 || qualificationRate <= 0 || grossMargin <= 0 || closeRate <= 0) return null;
  if ([showRate, qualificationRate, closeRate, grossMargin].some((rate) => rate > 1)) return null;

  const qualifiedHeldMeetings = bookedMeetings * showRate * qualificationRate;
  const expectedClients = qualifiedHeldMeetings * closeRate;
  if (qualifiedHeldMeetings <= 0 || expectedClients <= 0) return null;
  const totalProviderCost = setupCost + monthlyFee + perQualifiedHeldMeetingFee * qualifiedHeldMeetings;

  return {
    totalProviderCost,
    qualifiedHeldMeetings,
    expectedClients,
    costPerQualifiedHeldMeeting: totalProviderCost / qualifiedHeldMeetings,
    expectedCac: totalProviderCost / expectedClients,
    breakEvenCloseRate: totalProviderCost / (qualifiedHeldMeetings * dealValue * grossMargin),
    expectedGrossProfit: expectedClients * dealValue * grossMargin - totalProviderCost,
  };
}
