export interface OutboundFunnelInputs {
  entries: number;
  accepted: number;
  positiveEngagements: number;
  qualifiedConversations: number;
  meetingsBooked: number;
  meetingsHeld: number;
  qualifiedOpportunities: number;
  customers: number;
  acquisitionCost: number;
  grossProfitPerCustomer: number;
}

export interface OutboundFunnelResult {
  rates: {
    acceptedMessage: number | null;
    positiveReply: number | null;
    qualifiedConversation: number | null;
    conversationToBooking: number | null;
    attendance: number | null;
    opportunity: number | null;
    win: number | null;
    customer: number | null;
  };
  economics: {
    costPerHeldMeeting: number | null;
    costPerQualifiedOpportunity: number | null;
    customerAcquisitionCost: number | null;
    realizedGrossProfit: number;
    grossContributionAfterAcquisition: number;
    breakEvenCustomers: number;
  };
}

function ratio(numerator: number, denominator: number): number | null {
  return denominator === 0 ? null : numerator / denominator;
}

function isValidCount(value: number): boolean {
  return Number.isFinite(value) && Number.isInteger(value) && value >= 0;
}

export function calculateOutboundFunnel(inputs: OutboundFunnelInputs): OutboundFunnelResult | null {
  const stages = [
    inputs.entries,
    inputs.accepted,
    inputs.positiveEngagements,
    inputs.qualifiedConversations,
    inputs.meetingsBooked,
    inputs.meetingsHeld,
    inputs.qualifiedOpportunities,
    inputs.customers,
  ];

  if (!stages.every(isValidCount)) return null;
  if (stages.some((value, index) => index > 0 && value > stages[index - 1])) return null;
  if (!Number.isFinite(inputs.acquisitionCost) || inputs.acquisitionCost < 0) return null;
  if (!Number.isFinite(inputs.grossProfitPerCustomer) || inputs.grossProfitPerCustomer <= 0) return null;

  const realizedGrossProfit = inputs.customers * inputs.grossProfitPerCustomer;

  return {
    rates: {
      acceptedMessage: ratio(inputs.accepted, inputs.entries),
      positiveReply: ratio(inputs.positiveEngagements, inputs.accepted),
      qualifiedConversation: ratio(inputs.qualifiedConversations, inputs.accepted),
      conversationToBooking: ratio(inputs.meetingsBooked, inputs.qualifiedConversations),
      attendance: ratio(inputs.meetingsHeld, inputs.meetingsBooked),
      opportunity: ratio(inputs.qualifiedOpportunities, inputs.meetingsHeld),
      win: ratio(inputs.customers, inputs.qualifiedOpportunities),
      customer: ratio(inputs.customers, inputs.entries),
    },
    economics: {
      costPerHeldMeeting: ratio(inputs.acquisitionCost, inputs.meetingsHeld),
      costPerQualifiedOpportunity: ratio(inputs.acquisitionCost, inputs.qualifiedOpportunities),
      customerAcquisitionCost: ratio(inputs.acquisitionCost, inputs.customers),
      realizedGrossProfit,
      grossContributionAfterAcquisition: realizedGrossProfit - inputs.acquisitionCost,
      breakEvenCustomers: Math.ceil(inputs.acquisitionCost / inputs.grossProfitPerCustomer),
    },
  };
}
