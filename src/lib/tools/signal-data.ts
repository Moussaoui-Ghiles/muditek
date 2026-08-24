export type SignalIndustry = "general-b2b" | "ma" | "healthcare-staffing" | "freight";

export type PublicSignal = {
  label: string;
  observation: string;
  use: string;
  industries: SignalIndustry[];
  sourceName: string;
  sourceUrl: string;
};

export const PUBLIC_SIGNALS: PublicSignal[] = [
  { label: "Recent financing", observation: "A company announced a financing event.", use: "Prioritize an account when the financing changes the resources or timing relevant to your offer.", industries: ["general-b2b"], sourceName: "SEC EDGAR", sourceUrl: "https://www.sec.gov/search-filings" },
  { label: "Relevant hiring", observation: "A company publishes a role connected to the problem your service solves.", use: "Use the role as context. Do not claim the company intends to buy your service.", industries: ["general-b2b", "ma", "healthcare-staffing", "freight"], sourceName: "LinkedIn Jobs", sourceUrl: "https://www.linkedin.com/jobs/" },
  { label: "Ownership or control change", observation: "A public filing records a change in ownership or control.", use: "Prioritize only when the change creates work related to your offer.", industries: ["ma", "healthcare-staffing"], sourceName: "SEC EDGAR", sourceUrl: "https://www.sec.gov/search-filings" },
  { label: "Active acquisition filing", observation: "A company files or announces a merger or acquisition process.", use: "Research the named parties and transaction stage before contact.", industries: ["ma"], sourceName: "SEC mergers and acquisitions", sourceUrl: "https://www.sec.gov/edgar/searchedgar/mergersacquisitions.html" },
  { label: "Nursing staffing or turnover data", observation: "CMS publishes facility staffing, ratings, or turnover fields.", use: "Use the official facility record to prioritize research. It is not proof that the facility wants an agency.", industries: ["healthcare-staffing"], sourceName: "CMS Provider Information", sourceUrl: "https://data.cms.gov/provider-data/dataset/4pq5-n9py" },
  { label: "Carrier operating-status change", observation: "FMCSA publishes current carrier registration and operating information.", use: "Verify the carrier and investigate the operational context before outreach.", industries: ["freight"], sourceName: "FMCSA Company Snapshot", sourceUrl: "https://safer.fmcsa.dot.gov/CompanySnapshot.aspx" },
  { label: "Public contract award", observation: "A public buyer publishes an award or spending record.", use: "Use the award to identify vendors, agencies, and changed delivery obligations.", industries: ["general-b2b", "healthcare-staffing", "freight"], sourceName: "USAspending", sourceUrl: "https://www.usaspending.gov/" },
];

export function findPublicSignals(industry: SignalIndustry): PublicSignal[] {
  return PUBLIC_SIGNALS.filter((signal) => signal.industries.includes(industry));
}
