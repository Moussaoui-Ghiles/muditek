import { describe, expect, it } from "vitest";
import { countSpfDnsMechanisms, extractSpfDependencies, makeDmarcRecord, makeSpfRecord, normalizeDomain, normalizeSelector } from "./dns";

describe("DNS tool helpers", () => {
  it("normalizes safe hostnames and rejects unsafe input", () => {
    expect(normalizeDomain("https://Mail.Example.com/path")).toBe("mail.example.com");
    expect(normalizeDomain("localhost")).toBeNull();
    expect(normalizeDomain("bad domain.example")).toBeNull();
    expect(normalizeSelector("selector_1")).toBe("selector_1");
    expect(normalizeSelector("selector.example")).toBeNull();
  });

  it("counts DNS-querying SPF mechanisms and extracts recursion", () => {
    const record = "v=spf1 a mx include:_spf.example.com exists:%{i}.spf.example redirect=other.example -all";
    expect(countSpfDnsMechanisms(record)).toBe(5);
    expect(extractSpfDependencies(record)).toEqual(["_spf.example.com", "other.example"]);
  });

  it("generates explicit SPF and DMARC records without defaults disguised as facts", () => {
    expect(makeSpfRecord(["_spf.example.com"], ["192.0.2.0/24"], [], "-all")).toBe("v=spf1 include:_spf.example.com ip4:192.0.2.0/24 -all");
    expect(makeSpfRecord(["not a domain"], [], [], "-all")).toBeNull();
    expect(makeSpfRecord([], ["999.0.0.1"], [], "-all")).toBeNull();
    expect(makeSpfRecord([], [], ["2001:db8::/129"], "-all")).toBeNull();
    expect(makeSpfRecord([], [], [], "")).toBeNull();
    expect(makeDmarcRecord({ policy: "quarantine", percentage: 25, aggregateEmail: "reports@example.com" })).toBe("v=DMARC1; p=quarantine; pct=25; rua=mailto:reports@example.com;");
  });
});
