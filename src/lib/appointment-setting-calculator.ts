export type AppointmentSettingQuoteInputs = {
  setupCost: string;
  monthlyFee: string;
  bookedMeetings: string;
  showRate: string;
  qualificationRate: string;
  closeRate: string;
  dealValue: string;
  grossMargin: string;
};

export type AppointmentSettingQuoteResults = {
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
  const bookedMeetings = asNumber(inputs.bookedMeetings);
  const showRate = asNumber(inputs.showRate) / 100;
  const qualificationRate = asNumber(inputs.qualificationRate) / 100;
  const closeRate = asNumber(inputs.closeRate) / 100;
  const dealValue = asNumber(inputs.dealValue);
  const grossMargin = asNumber(inputs.grossMargin) / 100;

  const values = [setupCost, monthlyFee, bookedMeetings, showRate, qualificationRate, closeRate, dealValue, grossMargin];
  if (values.some((value) => !Number.isFinite(value)) || setupCost < 0 || monthlyFee < 0 || bookedMeetings <= 0 || dealValue <= 0) return null;
  if (showRate <= 0 || qualificationRate <= 0 || grossMargin <= 0 || closeRate <= 0) return null;
  if ([showRate, qualificationRate, closeRate, grossMargin].some((rate) => rate > 1)) return null;

  const periodCost = setupCost + monthlyFee;
  const qualifiedHeldMeetings = bookedMeetings * showRate * qualificationRate;
  const expectedClients = qualifiedHeldMeetings * closeRate;
  if (qualifiedHeldMeetings <= 0 || expectedClients <= 0) return null;

  return {
    qualifiedHeldMeetings,
    expectedClients,
    costPerQualifiedHeldMeeting: periodCost / qualifiedHeldMeetings,
    expectedCac: periodCost / expectedClients,
    breakEvenCloseRate: periodCost / (qualifiedHeldMeetings * dealValue * grossMargin),
    expectedGrossProfit: expectedClients * dealValue * grossMargin - periodCost,
  };
}

