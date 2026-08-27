import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("homepage recovery contract", () => {
  it("uses the locked outbound-first hero without an offer-view event", () => {
    const source = readFileSync(join(root, "src/app/page.tsx"), "utf8");

    expect(source).toContain("Appointment setting for sales-led B2B teams");
    expect(source).toContain("Done-for-you outbound. Built around qualified meetings held.");
    expect(source).toContain("Review the offer");
    expect(source).toContain("Use the public library");
    expect(source).not.toContain("commercial_offer_viewed");
    expect(source).not.toContain("AcquisitionPageView");
    expect(source).not.toContain("documents-desk.png");
  });

  it("ships bounded planet media and a dedicated poster", () => {
    const desktop = statSync(join(root, "public/media/planet-hero-desktop.mp4"));
    const mobile = statSync(join(root, "public/media/planet-hero-mobile.mp4"));
    const poster = statSync(join(root, "public/media/planet-hero-poster.jpg"));

    expect(desktop.size).toBeLessThanOrEqual(8 * 1024 * 1024);
    expect(mobile.size).toBeLessThanOrEqual(4 * 1024 * 1024);
    expect(poster.size).toBeGreaterThan(10_000);
  });

  it("keeps the poster when motion or data-saving preferences block video", () => {
    const source = readFileSync(join(root, "src/components/planet-hero-media.tsx"), "utf8");

    expect(source).toContain("prefers-reduced-motion: reduce");
    expect(source).toContain("saveData");
    expect(source).toContain("IntersectionObserver");
    expect(source).toContain("visibilitychange");
    expect(source).toContain("/media/planet-hero-poster.jpg");
  });
});
