export type CmsFacility = {
  ccn: string;
  name: string;
  city: string;
  state: string;
  beds: number | null;
  ownership: string;
  overallRating: number | null;
  staffingRating: number | null;
  nurseTurnover: number | null;
};

export function numberOrNull(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  if (typeof value === "string" && !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function mapCmsFacility(row: Record<string, unknown>): CmsFacility | null {
  const ccn = String(row.cms_certification_number_ccn ?? "").trim();
  const name = String(row.provider_name ?? "").trim();
  if (!ccn || !name) return null;
  return {
    ccn,
    name,
    city: String(row.citytown ?? "").trim(),
    state: String(row.state ?? "").trim(),
    beds: numberOrNull(row.number_of_certified_beds),
    ownership: String(row.ownership_type ?? "").trim(),
    overallRating: numberOrNull(row.overall_rating),
    staffingRating: numberOrNull(row.staffing_rating),
    nurseTurnover: numberOrNull(row.total_nursing_staff_turnover),
  };
}
