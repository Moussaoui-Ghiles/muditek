import { describe, expect, it } from "vitest";
import { mapCmsFacility } from "./cms";

describe("CMS facility mapping", () => {
  it("keeps missing official values missing", () => {
    expect(mapCmsFacility({ cms_certification_number_ccn: "123", provider_name: "Example Home", state: "CA", number_of_certified_beds: "50", overall_rating: "" })).toEqual({ ccn: "123", name: "Example Home", city: "", state: "CA", beds: 50, ownership: "", overallRating: null, staffingRating: null, nurseTurnover: null });
  });

  it("rejects rows without a provider identifier and name", () => {
    expect(mapCmsFacility({ provider_name: "Missing CCN" })).toBeNull();
  });
});
