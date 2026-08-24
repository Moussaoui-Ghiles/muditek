export type InfrastructureInputs = {
  dailyNewProspects: number;
  sequenceSteps: number;
  sendingDaysPerMonth: number;
  safeEmailsPerMailboxPerDay: number;
  spareCapacityPercent: number;
  inboxesPerDomain: number;
  mailboxMonthlyPrice: number;
  domainAnnualPrice: number;
};

export type InfrastructurePlan = {
  monthlyEmails: number;
  averageDailyEmails: number;
  requiredDailyCapacity: number;
  mailboxes: number;
  domains: number;
  estimatedMonthlyCost: number;
};

export function planColdEmailInfrastructure(input: InfrastructureInputs): InfrastructurePlan | null {
  const values = Object.values(input);
  if (values.some((value) => !Number.isFinite(value) || value < 0)) return null;
  if (input.dailyNewProspects <= 0 || input.sequenceSteps <= 0 || input.sendingDaysPerMonth <= 0 || input.safeEmailsPerMailboxPerDay <= 0 || input.inboxesPerDomain <= 0 || input.spareCapacityPercent >= 100) return null;
  const monthlyEmails = input.dailyNewProspects * input.sequenceSteps * input.sendingDaysPerMonth;
  const averageDailyEmails = monthlyEmails / input.sendingDaysPerMonth;
  const requiredDailyCapacity = averageDailyEmails / (1 - input.spareCapacityPercent / 100);
  const mailboxes = Math.ceil(requiredDailyCapacity / input.safeEmailsPerMailboxPerDay);
  const domains = Math.ceil(mailboxes / input.inboxesPerDomain);
  const estimatedMonthlyCost = mailboxes * input.mailboxMonthlyPrice + domains * input.domainAnnualPrice / 12;
  return { monthlyEmails, averageDailyEmails, requiredDailyCapacity, mailboxes, domains, estimatedMonthlyCost };
}

export type MarketRunwayInputs = {
  totalEligibleAccounts: number;
  excludedAccounts: number;
  accountsAlreadyActivated: number;
  newAccountsActivatedPerPeriod: number;
};

export function calculateMarketRunway(input: MarketRunwayInputs) {
  const values = Object.values(input);
  if (values.some((value) => !Number.isFinite(value) || value < 0) || input.newAccountsActivatedPerPeriod <= 0) return null;
  const reachableAccounts = input.totalEligibleAccounts - input.excludedAccounts - input.accountsAlreadyActivated;
  if (reachableAccounts < 0) return null;
  return {
    reachableAccounts,
    fullPeriods: Math.floor(reachableAccounts / input.newAccountsActivatedPerPeriod),
    exactPeriods: reachableAccounts / input.newAccountsActivatedPerPeriod,
    finalPeriodAccounts: reachableAccounts % input.newAccountsActivatedPerPeriod,
  };
}
