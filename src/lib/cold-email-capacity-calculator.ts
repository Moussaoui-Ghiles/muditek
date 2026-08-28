export interface ColdEmailCapacityInputs {
  dailySends: number;
  sendingDays: number;
  sendsPerMailbox: number;
  mailboxesPerDomain: number;
  dailySequenceStarts: number;
  averageMessagesPerContact: number;
  positiveReplyRate: number;
  bookingRate: number;
  showRate: number;
  qualificationRate: number;
  closeRate: number;
  mailboxMonthlyCost: number;
  domainAnnualCost: number;
  sequencerMonthlyCost: number;
  dataMonthlyCost: number;
  otherMonthlyCost: number;
}

export interface ColdEmailCapacityResult {
  monthlySends: number;
  monthlyNewContacts: number;
  requiredMailboxes: number;
  requiredDomains: number;
  projectedPositiveReplies: number;
  projectedMeetingsBooked: number;
  projectedMeetingsHeld: number;
  projectedQualifiedMeetings: number;
  projectedDeals: number;
  mailboxMonthlyCost: number;
  domainMonthlyCost: number;
  totalMonthlyCost: number;
  costPerQualifiedMeeting: number | null;
  costPerProjectedDeal: number | null;
  maxDailySequenceStarts: number;
  plannedSequenceDailySends: number;
  sequenceCapacityUtilization: number;
}

function isPositiveInteger(value: number): boolean {
  return Number.isFinite(value) && Number.isInteger(value) && value > 0;
}

function isNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function isRate(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

function ratio(numerator: number, denominator: number): number | null {
  return denominator > 0 ? numerator / denominator : null;
}

export function calculateColdEmailCapacity(
  inputs: ColdEmailCapacityInputs,
): ColdEmailCapacityResult | null {
  if (!isPositiveInteger(inputs.dailySends)) return null;
  if (!isPositiveInteger(inputs.sendingDays) || inputs.sendingDays > 31) return null;
  if (!isPositiveInteger(inputs.sendsPerMailbox)) return null;
  if (!isPositiveInteger(inputs.mailboxesPerDomain)) return null;
  if (!Number.isInteger(inputs.dailySequenceStarts) || inputs.dailySequenceStarts < 0) return null;
  if (inputs.dailySequenceStarts > inputs.dailySends) return null;
  if (!Number.isFinite(inputs.averageMessagesPerContact) || inputs.averageMessagesPerContact < 1) return null;

  const plannedSequenceDailySends = inputs.dailySequenceStarts * inputs.averageMessagesPerContact;
  if (plannedSequenceDailySends > inputs.dailySends) return null;

  const rates = [
    inputs.positiveReplyRate,
    inputs.bookingRate,
    inputs.showRate,
    inputs.qualificationRate,
    inputs.closeRate,
  ];
  if (!rates.every(isRate)) return null;

  const costs = [
    inputs.mailboxMonthlyCost,
    inputs.domainAnnualCost,
    inputs.sequencerMonthlyCost,
    inputs.dataMonthlyCost,
    inputs.otherMonthlyCost,
  ];
  if (!costs.every(isNonNegative)) return null;

  const monthlySends = inputs.dailySends * inputs.sendingDays;
  const monthlyNewContacts = inputs.dailySequenceStarts * inputs.sendingDays;
  const requiredMailboxes = Math.ceil(inputs.dailySends / inputs.sendsPerMailbox);
  const requiredDomains = Math.ceil(requiredMailboxes / inputs.mailboxesPerDomain);

  const projectedPositiveReplies = monthlySends * inputs.positiveReplyRate;
  const projectedMeetingsBooked = projectedPositiveReplies * inputs.bookingRate;
  const projectedMeetingsHeld = projectedMeetingsBooked * inputs.showRate;
  const projectedQualifiedMeetings = projectedMeetingsHeld * inputs.qualificationRate;
  const projectedDeals = projectedQualifiedMeetings * inputs.closeRate;

  const mailboxMonthlyCost = requiredMailboxes * inputs.mailboxMonthlyCost;
  const domainMonthlyCost = (requiredDomains * inputs.domainAnnualCost) / 12;
  const totalMonthlyCost = mailboxMonthlyCost
    + domainMonthlyCost
    + inputs.sequencerMonthlyCost
    + inputs.dataMonthlyCost
    + inputs.otherMonthlyCost;

  return {
    monthlySends,
    monthlyNewContacts,
    requiredMailboxes,
    requiredDomains,
    projectedPositiveReplies,
    projectedMeetingsBooked,
    projectedMeetingsHeld,
    projectedQualifiedMeetings,
    projectedDeals,
    mailboxMonthlyCost,
    domainMonthlyCost,
    totalMonthlyCost,
    costPerQualifiedMeeting: ratio(totalMonthlyCost, projectedQualifiedMeetings),
    costPerProjectedDeal: ratio(totalMonthlyCost, projectedDeals),
    maxDailySequenceStarts: Math.floor(inputs.dailySends / inputs.averageMessagesPerContact),
    plannedSequenceDailySends,
    sequenceCapacityUtilization: plannedSequenceDailySends / inputs.dailySends,
  };
}
