import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("appointment-setting funnel presentation", () => {
  it("locks the outcome-led offer framing and one booking label", () => {
    const page = source("src/app/appointment-setting/page.tsx");

    expect(page).toContain("Qualified B2B meetings. Pay the delivery fee after an agreed-fit buyer attends.");
    expect(page).toContain("No-shows and meetings outside the written rules earn no delivery fee.");
    expect(page.match(/Book a 30-minute fit review/g)).toHaveLength(2);
  });

  it("keeps standard and M&A pricing separate and labels market material as examples", () => {
    const page = source("src/app/appointment-setting/page.tsx");

    expect(page).toContain("Standard B2B · EUR");
    expect(page).toContain("€500–900 per month");
    expect(page).toContain("M&amp;A lane · USD");
    expect(page).toContain("$900 per month");
    expect(page).toContain("Worked qualification examples");
    expect(page).toContain("They are not client work, client proof, or performance claims.");
  });

  it("places a sticky filter bar directly after the pricing introduction", () => {
    const page = source("src/app/appointment-setting-pricing/page.tsx");
    const index = source("src/components/appointment-setting-pricing-index.tsx");

    expect(page.indexOf("<AppointmentSettingPricingIndex")).toBeLessThan(page.indexOf("Before you compare"));
    expect(index).toContain("sticky top-20");
    expect(index).toContain("min-h-12");
    expect(index).toContain("<details");
  });

  it("keeps calculator examples local and focuses a valid result", () => {
    const calculator = source("src/components/appointment-setting-calculator.tsx");

    expect(calculator).toContain("Load example");
    expect(calculator).toContain("focus({ preventScroll: true })");
    expect(calculator).toContain("Copy calculation");
    expect(calculator).toContain("Download .txt");
    expect(calculator).not.toContain("fetch(");
  });

  it("keeps the long mobile offer navigable and evidence collapsed", () => {
    const page = source("src/app/appointment-setting/page.tsx");

    expect(page).toContain('aria-label="Appointment-setting page sections"');
    expect(page).toContain('["Eligibility", "#eligibility"]');
    expect(page).toContain('["Process evidence", "#process-evidence"]');
    expect(page.match(/<details key=\{item\.title\}/g)).toHaveLength(1);
  });
});
