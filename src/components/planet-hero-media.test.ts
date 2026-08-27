import { describe, expect, it } from "vitest";
import { shouldLoadPlanetVideo } from "./planet-hero-media";

describe("shouldLoadPlanetVideo", () => {
  it("allows video only without reduced motion or data saving", () => {
    expect(shouldLoadPlanetVideo(false, false)).toBe(true);
    expect(shouldLoadPlanetVideo(true, false)).toBe(false);
    expect(shouldLoadPlanetVideo(false, true)).toBe(false);
    expect(shouldLoadPlanetVideo(true, true)).toBe(false);
  });
});
